
// @ts-ignore
import {DxcApiService} from "../../../base/DxcApiService";
import {Subject} from "rxjs";
import {AppMenuService} from "../../../core/components/appmenu/appmenu.service";
import {OutputService} from "../../output/ctrl/output.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "../../auth/ctrl/auth.service";
import {DxcApiToken} from "../../../base/DxcApiToken";

@Injectable({
  providedIn: 'root'
})
export class TeamService extends DxcApiService{


  /**
   * Event stream.
   *
   * Event are emitted when a menu entry is clicked into application menu
   *
   * @type {Subject<any>}
   * @field
   */
  onMenuClick:Subject<any> = new Subject<any>();

  //onAuthentication:Subject<AuthenticationEvent> = new Subject<AuthenticationEvent>();

  constructor( private appmenuSvc:AppMenuService, private outputSvc:OutputService, private authSvc:AuthService, protected _http:HttpClient) {

    super({

    }, _http, outputSvc);


    this.appmenuSvc.addMenu( {
      id:'team',
      label: 'Team',
      enabled:true,
      submenu:[{
        label: 'Login ...',
        click: (pMenuItem, pBrowserWindow, pEvent) => {
          this.authSvc.askAuthentication();
        }
      },{
        label: 'Logout ...',
        click: (pMenuItem, pBrowserWindow, pEvent) => {
          if(DxcApiToken.count()==1){
            this.authSvc.logout(DxcApiToken.getInstance(null).getName())
              .subscribe(function(vSuccess){
                console.log(vSuccess);
              })
          }else{
            this.authSvc.askLogout();
          }
        }
      }]
    },8);

  }

}
