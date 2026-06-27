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

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {DxcApiService} from "../../../base/DxcApiService";
import {TerminalInfo, TerminalSessionType} from "./TerminalSession";
import {AppMenuService} from "../../../base/appmenu/app-menu.service";
import {Device} from "../../../models/Device";
import {IconModel} from "../../../base/icon/IconModel";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";


// @ts-ignore
/**
 * Use this service to interact with workspace and
 * remote sockets
 *
 * @class
 * @since 1.0.0
 * @author Georges-Bastien MICHEL
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspaceService extends DxcApiService {

  private _cache: any = [];
  private needRefresh: boolean = true;

  onCreateSession:Subject<TerminalInfo> = new Subject<TerminalInfo>();

  constructor( private appmenuSvc:AppMenuService,
               protected http:HttpClient) {
    super({
      read: {
        list: { method:'GET', url:'/inspector', format:'json'}
      }
    },http);
  }

  /**
   *
   * @param pDev
   * @param pIcon
   */
  createDevShellSession(pDev:Device, pIcon:IconModel, pPrivileged=false):void {

    if(pDev.id==null){
      throw  UIException.DEVICE_IS_NOT_SELECTED("workspace","createDevShellSession");
    }

    this.onCreateSession.next({
      type:TerminalSessionType.DEV,
      label:pDev.model+':'+pDev.id,
      icon: pIcon,
      uid: pDev.id,
      target: pDev.uid,
      priv: pPrivileged
    });
  }
}
