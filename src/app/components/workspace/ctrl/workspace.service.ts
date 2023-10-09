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
