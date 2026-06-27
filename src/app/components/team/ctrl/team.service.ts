
/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

// @ts-ignore
import {DxcApiService} from "../../../base/DxcApiService";
import {Subject} from "rxjs";
import {AppMenuService} from "../../../base/appmenu/app-menu.service";
import {OutputService} from "../../output/ctrl/output.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "../../auth/ctrl/auth.service";
import {DxcApiToken} from "../../../base/DxcApiToken";
import {UIException} from "../../../base/error/UIException";

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

  constructor( private appmenuSvc:AppMenuService, private outputSvc:OutputService, private authSvc:AuthService, protected override _http:HttpClient) {

    super({

    }, _http, outputSvc);


    this.appmenuSvc.addMenu( {
      id:'team',
      label: 'Team',
      enabled:true,
      submenu:[{
        label: 'Login ...',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.authSvc.askAuthentication();
        }
      },{
        label: 'Logout ...',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          if(DxcApiToken.count()==1){
            const t = DxcApiToken.getInstance(null);

            if(t==null){
              throw UIException.AUTH_ERROR("Cannot logout, token is missing");
            }

            this.authSvc.logout(t.getName())
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
