import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {AppMenuService} from "../../../base/appmenu/app-menu.service";
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
import {Nullable} from "../../../base/Nullable";


@Injectable({
  providedIn: 'root'
})
export class AuthService extends DxcApiService{

  static IGNORE_PUID = '-';
  override token: Nullable<DxcApiToken> = null;
  account: Nullable<UserAccount> = null;

  /**
   * Event stream.
   *
   * Event are emitted when a menu entry is clicked into application menu
   *
   * @type {Subject<any>}
   * @field
   */
  onMenuClick:Subject<any> = new Subject<any>();

  onLogin$:Subject<any> = new Subject<any>();

  onLogout:Subject<AuthenticationEvent> = new Subject<AuthenticationEvent>();
  onAuthentication:Subject<AuthenticationEvent> = new Subject<AuthenticationEvent>();

  constructor( private appmenuSvc:AppMenuService, private outputSvc:OutputService, protected override _http:HttpClient) {

      super({
        auth: {
          passwd: { method: 'POST', url:'/remote/auth', format:'json'},
          check: { method: 'GET', url:'/remote/check', format:'json'},
          logout: { method: 'GET', url:'/remote/logout', format:'json', auth:false /* removed */},
        },
        ws: {
          ticket: { method: 'POST', url:'/user/account/wsticket', format:'json'},
        },
        connections: {
          list: { method: 'GET', url:'/remote/connections', format:'json', auth:false}
        },
        account: {
          info: { method: 'GET', url:'/user/account', format:'json', auth:false /* removed */ },
          change_pwd: { method: 'POST', url:'/user/account/passwd', format:'json', auth:false /* removed */ }
        }
      }, _http, outputSvc);


    this.appmenuSvc.addMenu( {
      id:'plug',
      label: 'Team',
      enabled:false,
      submenu:[{
        label: 'Logout',
        click: (pMenuItem:any, pBrowserWindow:any) => {
          this.ssoLogout();
        }
      }]
    },8);


    this.onLogin$.subscribe((vEvent:any)=>{

      // a specifi project is requested
      if(vEvent.project!=null && vEvent.project!=AuthService.IGNORE_PUID){
          console.log("[AUTH SERVICE] ProjectUID found, retrieve authentication token. ");
          const tok = DxcApiToken.getInstance("puid");
          if(tok!=null){
            tok.updateToken(vEvent.project);
          }else{
            DxcApiToken.create('puid', vEvent.project);
          }
      }else{
        console.log("[AUTH SERVICE] ProjectUID not found, retrieving from user info ... ");
        // if no projects are requested, else check authentication an pull projects from workspace

      }

      this.getUserInfo().subscribe((pInfo:Nullable<UserAccount>)=>{
        if(pInfo!=null){
          // authentication is ok
          console.log("[AUTH SERVICE] Authentication done.");
          this.onAuthentication.next(AuthenticationEvent.newSuccess(new DxcApiToken("local",""), pInfo));
        }else{
          location.href = "https://www.reversense.com";
        }
      })
    });
  }


  ssoLogout():void {
    location.href = location.protocol+'://'+location.host+'/logout';
  }

  askAuthentication():void {
    this.onAuthentication.next(AuthenticationEvent.requestNewAuth());
  }


  askLogout():void {
    this.onAuthentication.next(AuthenticationEvent.requestLogout());
  }

  restore():Observable<any> {
    return this._process(
      this.endpoints['account']['info']
    ).pipe(map((pEl:any)=>{
      const info: any = {
        restored: false
      };
      if(pEl.success){
        const data = pEl.data;
        info.user = new UserAccount({
          _username:data.username,
          _uid:data.uid
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

  getUserInfo():Observable<Nullable<UserAccount>> {
    return this._process(
      this.endpoints['account']['info']
    ).pipe(map((pEl:any)=>{
      if(pEl.success){
        const data = pEl.data;
        const u:UserAccount = new UserAccount({
          _username:data.username,
          _uid:data.uid
        });
        //u.setUserRole( new UserRole(data.role.uid, data.role.name));
        return u;
      }else{
        this.outputSvc.alert(OutputMessage.newError({
          src: "Authentication",
          msg: `Account information cannot be retrieved : ${pEl.msg}`
        }));
        return null;
      }
    }));
  }

  logout(pConnName:Nullable<string> = null):Observable<boolean> {
    return this._process(
      this.endpoints['auth']['logout']
    ).pipe(map( (pEl:any) => {

      if(pEl.success){
        if(pConnName!=null){
          DxcApiToken.remove(pConnName);
        }

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
        if(pInfo.restored && this.token!=null && this.account!=null){
          this.account = pInfo.user;
          this.onAuthentication.next(AuthenticationEvent.newSuccess( this.token, this.account as UserAccount));
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
      this.endpoints['auth']['passwd'],
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

          this.getUserInfo().subscribe( (pUA:Nullable<UserAccount>)=>{
            if(pUA!=null && this.token!=null && this.account!=null){
              this.account = pUA;
              this.onAuthentication.next(AuthenticationEvent.newSuccess( this.token, this.account));
            }
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
      this.endpoints['connections']['list'],
      {}
    ).pipe(
      map((pEl:any)=>{
        this.outputSvc.print(new OutputMessage({
          src: "Device Manager",
          msg: `There are ${pEl.data.conn.all.length} connections configured`
        }));

        const data:DexcaliburConnectionParams[] = [];
        if(pEl.data.conn.all != null){
          pEl.data.conn.all.map( (o:any) => {
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
      this.endpoints['connections']['list'],
      pOptions
    );
  }

  changePassword( pCurrrentPwd:string, pNewPwd:string ):Observable<any>{
    return this._process(
      this.endpoints['account']['change_pwd'],
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

  /**
   * To generate a new ws
   */
  getWsAuthTicket():Observable<Nullable<string>> {
    return this._process(
        this.endpoints['ws']['ticket']
    ).pipe( map((pEl:any)=>{
      if(pEl.success){
        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Authentication",
          msg: "Generate WS authentication ticket"
        }));
        return pEl.data;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Authentication",
          msg: "Cannot etablish websocket connection"
        }));
        return null;
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
          url.searchParams.get("auth") as string
        )
      )
    );
  }
}
