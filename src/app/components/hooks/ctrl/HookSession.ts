import {Observable, Subject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {WebsocketChannel} from "../../../base/WebsocketClient";
import {IconModel} from "../../../base/icon/IconModel";
import {INFO_TYPE, InfoMessage} from "../../../cmp/InfoMessage";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import DexcaliburProject from "../../../models/DexcaliburProject";
import HookMessage from "../../../models/HookMessage";
import {RuntimeEvent} from "../../../models/hook/RuntimeEvent";

export interface HookErrorMessage {
  msg:any,
  session:HookSession
}

export enum HOOK_SESSION_CMD {
  INIT='init',
  NEW='new',
  START='start',
  MSG='msg',
  EXIT='exit'
}


/**
 * @class
 */
export class HookSession {

  uid:string = null;
  icon:IconModel = null;
  label:string = 'Session';
  active: boolean = false;
  exited:boolean = false;
  closable:boolean = true;
  iconColor:string = 'dxc-text-clear100';
  color:string = 'dxc-text-clear100';
  prj:DexcaliburProject = null;

  channel:WebsocketChannel = null;

  messages:RuntimeEvent<any>[] = [];

  info: Subject<any> = new Subject<any>();
  msg: Subject<any> = new Subject<any>();

  hookError$:Subject<any> = null;

//  oob:Subject<any> = new Subject<any>();

  /**
   *
   * @param {string} pLabel The local name of the session, default is "Session"
   * @param {IconModel} pIcon The icon of this tab panel in the UI
   * @param {string} pUid
   * @param {DexcaliburProject} pProject The active project instrumented
   * @constructor
   */
  constructor(pLabel:string, pIcon:IconModel, pUid:string, pProject:DexcaliburProject) {
    this.label = pLabel;
    this.uid = pUid;
    this.icon = pIcon;
    this.prj = pProject;

    const self = this;
    this.channel = new class extends WebsocketChannel {

      onClose(pEvent: any): void {
        self.info.next('Connection lost');
      }

      onError(pEvent: any): void {
        let s:string = "";

        console.log(pEvent);
        if(typeof pEvent=='string'){
          s = pEvent.toString().replace(/\n/g, "\r\n");
        }else if(pEvent.closed){
          s = pEvent.msg;
        }

        if(self.active)
          self.info.next(s);
      }

      onMessage(pEvent: any): void {

        if(self.active)
          self.info.next(pEvent.toString());
      }

      private _searchFragLocation(pHook:any, pFragUID:string):number {
        for(let i=0; i<pHook._before.length; i++){ if(pHook._before[i]._uid==pFragUID){ return -1 }  }
        for(let i=0; i<pHook._after.length; i++){ if(pHook._after[i]._uid==pFragUID){ return 1 }  }
        for(let i=0; i<pHook._replace.length; i++){ if(pHook._replace[i]._uid==pFragUID){ return 0}  }

        return 2;
      }

      processMessage(pMsg: any):void {

        switch(pMsg.action){
          case HOOK_SESSION_CMD.INIT:
            console.log(pMsg);
            self.channel.sessid = pMsg.data.sessid;
            self.channel.send({ action:HOOK_SESSION_CMD.NEW, svc:"hookm", prj:self.prj.uid, data: {} });
            break;

          case HOOK_SESSION_CMD.MSG:
            console.log(pMsg);
            // create RuntimeMessage+
            const m = new RuntimeEvent(pMsg.data.msg);
            //  get hook, fragment and method
            console.log(m);
            if(m.data.hasOwnProperty('frag') && m.data.frag != null){
              m.data.when = this._searchFragLocation( m.data.hook, m.data.frag._uid );
            }

            self.messages.push(m

              //pMsg.data.msg
            );
            break;

          case HOOK_SESSION_CMD.START:
            console.log(pMsg);
            if(!pMsg.success){
              self.hookError$.next({
                msg: pMsg,
                session: self
              });
            }else{
              self.messages.push(pMsg.data.msg);
            }
            break;

          default:
            console.log(pMsg);
            self.info.next( new InfoMessage({
              type: INFO_TYPE.WARNING,
              msg:'[HookSession] Unhandled message '
            }));
            break;
        }

      }
    };

    this.channel.localid = this.uid;

    /*this.stdin.subscribe( (pObs:any) => {
      this.channel.send({ action:'cmd', svc:'xterm', data: { stdin: pObs }});
    });*/
  }

  /**
   * To set an observable where error messages will be pushed
   *
   * @param {Subject<any>} pObservable
   * @method
   * @since 1.0.0
   */
  setHookErrorObservable( pObserv:Subject<HookErrorMessage>):void{
    this.hookError$ = pObserv;
  }


  /**
   * To get the remote UID associated to this session
   *
   * @return {string} Remote UID of the hook session
   * @method
   */
  getUID():string{
    return this.channel.sessid;
  }

  /**
   * To send the "new hook session" signal to the server,
   *
   * The server should return the remote session ID associated to this channel
   *
   * @param {any} pType
   * @method
   * @since 1.0.0
   */
  start( pType =''){
    this.channel.sendRaw({ action:HOOK_SESSION_CMD.NEW, svc:'hookm', prj:this.prj, data: {}});
  }
  /**
   * To send the "stop this hook session" signal to the server
   *
   * It will stop the hook session associated to this channel
   *
   * @method
   * @since 1.0.0
   */
  exit():void{
    this.channel.send({ action:HOOK_SESSION_CMD.EXIT, svc:'hookm', prj:this.prj, data: { }});
  }
}
