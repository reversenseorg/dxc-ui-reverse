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

import {IController, IControllerOptions, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Subject} from "rxjs";
import {ViewportView} from "../../../cmp/ViewportView";
import {ComponentFactoryResolver} from "@angular/core";
import {ExplorerCodeComponent} from "../../code/explorer-code/explorer-code.component";
import {TerminalInfo, TerminalSession, TerminalSessionType} from "./TerminalSession";
import {WorkspaceService} from "./workspace.service";
import {IconModel} from "../../../base/icon/IconModel";
import {WebsocketChannel, WebsocketClient} from "../../../base/WebsocketClient";
import {StageComponent} from "../../stage/stage.component";
import {WebsocketEventType} from "../../../base/websocket/WebsocketEvent";
import {IStringIndex} from "../../../base/IStringIndex";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";


export class WorkspaceController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'ws';

  id:Nullable<string> = null;
  app: Nullable<StageComponent> = null;

  service: WorkspaceService;

  explorerCmp: any = null;
  viewCmp: ViewCmpMap = {};
  terminalCmp: any = null;
  modalCmp: any = null;

  componentFactoryResolver:Nullable<ComponentFactoryResolver> = null;

  views:ViewportView[] = [];
  explorer:Nullable<ExplorerCodeComponent> = null;
  rendered:any = [];


  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();
  //viewComp: ViewportCodeComponent = null;

  sessions: TerminalSession[] = [];

  constructor(pConfig:IControllerOptions) {
    this.configure(pConfig);
  }

  configure( pConfig:any=null):void {
    if(pConfig==null) return;

    for(let i in pConfig){
       (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }

  getExplorerCmp():any {
    return this.explorerCmp.main;
  }

  getViews():ViewportView[]{
    return this.views;
  }

  close(pItem: any, pSrc:any): any {

    this.rendered = this.rendered.filter((vItem:any) => {
      return (vItem.__signature__ !== pItem.__signature__);
    });


    this.closeView.next(pItem);
  }

  isAlreadyRendered(pItem:any):any {
    let f:any=null;

    this.rendered.map((pView:any) => {     console.log(pView);
      if(pView.__signature__ === pItem.__signature__){
        f = pView;
      }
    });

    return f;
  }

  /**
   * To create locally and remotely a new term session
   *
   * @param pLabel
   * @param pIcon
   * @param pUid
   */
  newTermSession( pInfo:TerminalInfo):TerminalSession{

    if(this.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

  // newTermSession( pLabel:any, pIcon:IconModel, pUid:string, pType:TerminalSessionType = TerminalSessionType.BASH):TerminalSession{
    let sess:TerminalSession = new TerminalSession(pInfo.label,pInfo.icon==null ? GLOBAL_ICONS['TERMINAL']:pInfo.icon,pInfo.uid);

    if(sess.channel==null){
      throw new UIException("workspace-controller : cannot open a new terminal, session is null");
    }
    this.app.ws.registerChannel(sess.channel);
    this.sessions.push(sess)

    sess.start(pInfo.type, pInfo);
    return sess;
  }

  open(pItem: any, pSrc:any): void{

  }

  initSessions(): void {
    let channel:WebsocketChannel = new class extends WebsocketChannel {
        onClose(pEvent: any): void {}
        onError(pEvent: any): void {}
        onMessage(pEvent: any): void {}

        processMessage(pMsg: any):void {

        }
      };

    if(this.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    this.app.wsServer$.subscribe((eEvt)=>{
      if(eEvt.type===WebsocketEventType.CONN_READY){
        if(eEvt.getClient()==null) return;

        (eEvt.getClient() as WebsocketClient).registerChannel(channel);
        channel.send({ action:"init", svc:"xterm", data: {} });
      }
    });

    //this.app.ws.registerChannel(channel);
    //channel.send({ action:"init", svc:"xterm", data: {} });
  }
}
