import {IController, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Subject} from "rxjs";
import {ViewportView} from "../../../cmp/ViewportView";
import {ComponentFactoryResolver} from "@angular/core";
import {ExplorerCodeComponent} from "../../code/explorer-code/explorer-code.component";
import {TerminalInfo, TerminalSession, TerminalSessionType} from "./TerminalSession";
import {WorkspaceService} from "./workspace.service";
import {IconModel} from "../../../base/icon/IconModel";
import {WebsocketChannel} from "../../../base/WebsocketClient";
import {StageComponent} from "../../stage/stage.component";
import {WebsocketEventType} from "../../../base/websocket/WebsocketEvent";


export class WorkspaceController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'ws';

  id:string = null;
  app: StageComponent = null;

  service: WorkspaceService = null;

  explorerCmp: any = null;
  viewCmp: ViewCmpMap = {};
  terminalCmp: any = null;
  modalCmp: any = null;

  componentFactoryResolver:ComponentFactoryResolver = null;

  views:ViewportView[] = [];
  explorer:ExplorerCodeComponent = null;
  rendered:any = [];


  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();
  //viewComp: ViewportCodeComponent = null;

  sessions: TerminalSession[] = [];

  constructor(pConfig:any=null) {
    this.configure(pConfig);
  }

  configure( pConfig:any=null):void {
    if(pConfig==null) return;

    for(let i in pConfig){
      if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }

  getExplorerCmp():any {
    return this.explorerCmp.main;
  }

  getViews():ViewportView[]{
    return this.views;
  }

  close(pItem: any, pSrc:any): any {

    this.rendered = this.rendered.filter( vItem => {
      return (vItem.__signature__ !== pItem.__signature__);
    });


    this.closeView.next(pItem);
  }

  isAlreadyRendered(pItem:any):any {
    let f:any=null;

    this.rendered.map( pView => {
      console.log(pView);
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
  // newTermSession( pLabel:any, pIcon:IconModel, pUid:string, pType:TerminalSessionType = TerminalSessionType.BASH):TerminalSession{
    let sess:TerminalSession = new TerminalSession(pInfo.label,pInfo.icon,pInfo.uid);

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

    this.app.wsServer$.subscribe((eEvt)=>{
      if(eEvt.type===WebsocketEventType.CONN_READY){
        eEvt.getClient().registerChannel(channel);
        channel.send({ action:"init", svc:"xterm", data: {} });
      }
    });

    //this.app.ws.registerChannel(channel);
    //channel.send({ action:"init", svc:"xterm", data: {} });
  }
}
