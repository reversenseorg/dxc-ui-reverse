import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {AppMenuService} from "../../../core/components/appmenu/appmenu.service";
import {DxcApiService} from "../../../base/DxcApiService";
import {map} from "rxjs/operators";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {AuthenticationEvent} from "../AuthenticationEvent";
import {AuthToken} from "../AuthToken";
import {UserAccount} from "../../../models/user/UserAccount";
import {UserRole} from "../../../models/user/acl/rbac/UserRole";
import {DxcApiToken} from "../../../base/DxcApiToken";
import { DexcaliburConnectionParams } from "../../../models/remote/DexcaliburConnectionParams";


@Injectable({
  providedIn: 'root'
})
export class AuthService extends DxcApiService{

  token: DxcApiToken = null;
  account: UserAccount = null;

  /**
   * Event stream.
   *
   * Event are emitted when a menu entry is clicked into application menu
   *
   * @type {Subject<any>}
   * @field
   */
  onMenuClick:Subject<any> = new Subject<any>();

  onLogout:Subject<AuthenticationEvent> = new Subject<AuthenticationEvent>();
  onAuthentication:Subject<AuthenticationEvent> = new Subject<AuthenticationEvent>();

  constructor( private appmenuSvc:AppMenuService, private outputSvc:OutputService, protected _http:HttpClient) {

      super({
        auth: {
          passwd: { method: 'POST', url:'/remote/auth', format:'json'},
          logout: { method: 'GET', url:'/remote/logout', format:'json', auth:true},
        },
        connections: {
          list: { method: 'GET', url:'/remote/connections', format:'json', auth:false}
        },
        account: {
          info: { method: 'GET', url:'/user/account', format:'json', auth:true },
          change_pwd: { method: 'POST', url:'/user/account/passwd', format:'json', auth:true }
        }
      }, _http, outputSvc);


    this.appmenuSvc.addMenu( {
      id:'plug',
      label: 'Team',
      enabled:false,
      submenu:[{
        label: 'Login',
        click: (pMenuItem, pBrowserWindow, pEvent) => {
          //this.onMenuClick.next({ item:'login', win:pBrowserWindow });
        }
      },{
        label: 'Logout',
        click: (pMenuItem, pBrowserWindow, pEvent) => {
          console.log(DxcApiToken.count());
          if(DxcApiToken.count()==1){
            this.logout(DxcApiToken.getInstance(null).getName()).subscribe();
          }else{
            this.onMenuClick.next({ item:'logout', win:pBrowserWindow });
          }
        }
      }]
    },8);


  }

  askAuthentication():void {
    this.onAuthentication.next(AuthenticationEvent.requestNewAuth());
  }


  askLogout():void {
    this.onAuthentication.next(AuthenticationEvent.requestLogout());
  }

  restore():Observable<any> {
    return this._process(
      this.endpoints.account.info
    ).pipe(map((pEl:any)=>{
      const info: any = {
        restored: false
      };
      if(pEl.success){
        const data = pEl.data;
        info.user = new UserAccount({
          username:data.username,
          uid:data.uid
        });
        info.user.setUserRole( new UserRole(data.role.uid, data.role.name));
        info.restored = true;
      }else{
        DxcApiToken.remove('local');
        DxcApiToken.remove('puid');
        this.outputSvc.alert(OutputMessage.newError({
          src: 'Authentication',
          msg: `Previous sessions cannot be restored : session is expired`
        }));
      }
      return info;
    }));
  }

  getUserInfo():Observable<UserAccount> {
    return this._process(
      this.endpoints.account.info
    ).pipe(map((pEl:any)=>{
      if(pEl.success){
        const data = pEl.data;
        const u:UserAccount = new UserAccount({
          username:data.username,
          uid:data.uid
        });
        u.setUserRole( new UserRole(data.role.uid, data.role.name));
        return u;
      }else{
        this.outputSvc.alert(OutputMessage.newError({
          src: "Authentication",
          msg: `Account information cannot be retrieved : ${pEl.msg}`
        }));
      }
    }));
  }

  logout(pConnName:string = null):Observable<boolean> {
    return this._process(
      this.endpoints.auth.logout
    ).pipe(map( (pEl:any) => {

      if(pEl.success){
        DxcApiToken.remove(pConnName);
        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Authentication",
          msg: `Logout successfully from ${pConnName!=null ? pConnName : "<null>"}`
        }));
        this.onAuthentication.next(AuthenticationEvent.newLogoutSuccess());
        return true;
      }else{
        this.onAuthentication.next(AuthenticationEvent.newLogoutFailure());
        return false;
      }
    }));
  }

  refresh(pConnName = "local"):void {
    if(!DxcApiToken.ready){
      DxcApiToken.importLocalStorage();
    }

    if(DxcApiToken.exists(pConnName)){

      /*this.outputSvc.print(OutputMessage.newSuccess({
        src: "Authentication",
        msg: `Login successful (from cache)`
      }));*/

      if ( this.token == null) {
        this.token = DxcApiToken.getInstance(pConnName);
      }


      this.restore().subscribe( (pInfo:any)=>{
        if(pInfo.restored){
          this.account = pInfo.user;
          this.onAuthentication.next(AuthenticationEvent.newSuccess( this.token, this.account));
        }else{
          DxcApiToken.remove(pConnName);
          this.token = null;
          this.askAuthentication();
        }
      });
    }else{
      this.onAuthentication.next(AuthenticationEvent.requestNewAuth());
    }
  }

  doPasswordAuthentication( pConnName:string, pLogin:string, pPassword:string):Observable<any> {
    return this._process(
      this.endpoints.auth.passwd,
      {
        conn: pConnName,
        login: pLogin,
        pwd: pPassword
      }
    ).pipe(
      map( (pEl:any)=>{

        console.log(pEl);

        if(pEl.success){
          this.outputSvc.print(OutputMessage.newSuccess({
            src: "Authentication",
            msg: `Login successful`
          }));

          DxcApiToken.remove("local");
          this.token = DxcApiToken.create("local", pEl.data.token);

          this.getUserInfo().subscribe( (pUA:UserAccount)=>{
            this.account = pUA;
            this.onAuthentication.next(AuthenticationEvent.newSuccess( this.token, this.account));
          });


        }else{
          const m = OutputMessage.newError({
            src: "Authentication",
            msg: `Failed to login : ${pEl.msg}`
          });
          this.outputSvc.alert(m);
          this.outputSvc.print(m);

          this.onAuthentication.next(AuthenticationEvent.newAuthFailed( pLogin ));
        }


      })
    );
  }

  isAuthenticated(pConnName:string):boolean {
    return DxcApiToken.exists(pConnName);
  }


  listConnectionsSettings():Observable<DexcaliburConnectionParams[]> {
    return this._process(
      this.endpoints.connections.list,
      {}
    ).pipe(
      map((pEl:any)=>{
        this.outputSvc.print(new OutputMessage({
          src: "Device Manager",
          msg: `There are ${pEl.data.conn.all.length} connections configured`
        }));

        const data:DexcaliburConnectionParams[] = [];
        if(pEl.data.conn.all != null){
          pEl.data.conn.all.map( o => {
            data.push(DexcaliburConnectionParams.fromPoorObject(o));
          })
        }


        //this._cache.app[pDevice.uid] = pEl.app;
        return data; //pEl.data.conn.all;
      })
    );
  }

  getConnectionParams( pOptions:any):Observable<DexcaliburConnectionParams> {
    return this._process(
      this.endpoints.connections.list,
      pOptions
    );
  }

  changePassword( pCurrrentPwd:string, pNewPwd:string ):Observable<any>{
    return this._process(
      this.endpoints.account.change_pwd,
      {
        pwd:pCurrrentPwd,
        new: pNewPwd
      }
    ).pipe( map((pEl:any)=>{
      if(pEl.success){
        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Authentication",
          msg: "Password has been changed successfully"
        }));
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Authentication",
          msg: pEl.msg
        }));
      }
    }));
  }

  getConnectionStringFromURI():DexcaliburConnectionParams|null {
    const url = new URL(location.href);
    if(!url.searchParams.has("auth")){
      const m = OutputMessage.newError({
        src: "Authentication",
        msg: `Connection params not found. See docs.`
      });
      this.outputSvc.print(m);
      return null;
    }

    return DexcaliburConnectionParams.fromPoorObject(
      JSON.parse(
        atob(
          url.searchParams.get("auth")
        )
      )
    );
  }
}
