import {Observable, Subject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {WebsocketChannel} from "../../../base/WebsocketClient";
import {IconModel} from "../../../base/icon/IconModel";
import {INFO_TYPE, InfoMessage} from "../../../cmp/InfoMessage";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import DexcaliburProject from "../../../models/DexcaliburProject";
import HookMessage from "../../../models/HookMessage";
import {RuntimeEvent, RuntimeEventType} from "../../../models/hook/RuntimeEvent";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";
import {Tag} from "../../../models/tags/Tag";
import {UserAccountUUID} from "../../../models/user/UserAccount";
import {HOOK_ICONS} from "../icons";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {HookService} from "./hook.service";

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

export enum PollingType {
    WEBSOCKET = 'ws',
    HTTP = 'http'
}
export interface HookWorkspaceState {
  commit:string
}

interface FridaBindings {
  session?:any,
  device?: any,
  script?: any,
  pid?: number
}

export interface HookSessionOptions {
  rawOutput:boolean
}

export type HookSessionUUID = string;

/**
 * Options to create a new instance
 */
export interface HookSessionOpts {
  _uid?:string;
  message?:RuntimeEvent<any>[];
  owner?:RuntimeEvent<any>[];
  hookManager?:any;
  sets_matches?:any;
  time?:number;
  frida?:any;
  active?:boolean;
  opts?:HookSessionOpts;
  offset?:number;
  evTags?:Record<string, Tag>;
  wsState?:Nullable<HookWorkspaceState>;
}


/**
 * @class
 */
export class HookSession {

  __ = NodeInternalType.HOOK_SESSION;

    /**
     * The remote UID of this session
     */
  _uid:Nullable<string> = null;

  /**
   * The owner of this session
   */
  owner:Nullable<UserAccountUUID> = null;

  /**
   * The stack containing the received message
   * @field
   */
  message:RuntimeEvent<any>[] = [];
  //message:HookMessageV2[] = [];


  /**
   * Follow hookset matches
   * @field
   */
  sets_matches:any = {};

  /**
   * The timestamp of the session
   * @field
   */
  time:number = -1;

  /**
   * To hold some references from frida-node
   * @field
   */
  frida:FridaBindings = {}


  active = false;

  opts:HookSessionOptions;

  /**
   * A cache of tags to avoid to research tag from tag uuid foreach hook message
   *
   * Volatile
   *
   * @field
   */
  evTags:Record<string, Tag> = {};

  tags = [];

  offset = 0;

  /**
   * Hook Workspace state
   */
  wsState:Nullable<HookWorkspaceState> = null;

  /**
   * Device UID
   */
  devUID:Nullable<string> = null;



  uid:Nullable<string> = null;
  icon:Nullable<IconModel> = null;
  label:string = 'Session';
  exited:boolean = false;
  closable:boolean = true;
  iconColor:string = 'dxc-text-clear100';
  color:string = 'dxc-text-clear100';
  prj:Nullable<DexcaliburProject> = null;

  channel:Nullable<WebsocketChannel> = null;

  messages:RuntimeEvent<any>[] = [];

  info: Subject<any> = new Subject<any>();
  msg: Subject<any> = new Subject<any>();

  hookError$:Subject<any> = new Subject<any>();

  httpPolling:Record<HookSessionUUID, NodeJS.Timeout> = {};

  private _restored = false;
//  oob:Subject<any> = new Subject<any>();

    private _polling:PollingType;
  /**
   *
   * @param {string} pLabel The local name of the session, default is "Session"
   * @param {IconModel} pIcon The icon of this tab panel in the UI
   * @param {string} pUid
   * @param {DexcaliburProject} pProject The active project instrumented
   * @constructor
   */
  constructor(pLabel:string, pIcon:IconModel, pUid:string, pProject:DexcaliburProject, pType = PollingType.WEBSOCKET) {
    this.label = pLabel;
    this.uid = pUid;
    this.icon = pIcon;
    this.prj = pProject;

    /*
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

            if(self.channel==null){
              throw UIException.WEBSOCKET_CHANNEL_IS_NOT_READY("HookSession","processMessage");
            }
            if(self.prj==null){
              throw UIException.PROJECT_IS_NOT_READY("HookSession","processMessage");
            }

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
     */
      this._polling = pType;

    if(this._polling==PollingType.WEBSOCKET){
       this.initChannel();
    }

    /*this.stdin.subscribe( (pObs:any) => {
      this.channel.send({ action:'cmd', svc:'xterm', data: { stdin: pObs }});
    });*/
  }

  initHttpPolling(pHookService:HookService):void {
      if(this._uid==null) throw new Error("HookSession UID is not set");

      const hid = this._uid as HookSessionUUID;
      let t = (new Date()).getTime();
      const started = (new Date()).getTime();
      let o = 0;
      const sz = 20;
      let lastSz = 1;
      let firstEmpty = -1;

      this.httpPolling[hid] = setInterval(()=>{
          if(lastSz==0 && (new Date()).getTime()-firstEmpty>60000){
              clearInterval(this.httpPolling[hid]);
          }

          pHookService
              .pollRuntimeEvent(hid, RuntimeEventType.HOOK, o, sz)
              .subscribe((vMsg)=>{
                  if(!vMsg.success || vMsg.data==null){
                      clearInterval(this.httpPolling[hid]);
                      lastSz = 0;
                      firstEmpty = (new Date()).getTime();
                      return;
                  }

                  if(vMsg.data.length==0 && lastSz>0){
                      firstEmpty = (new Date()).getTime();
                      lastSz = 0;
                      return;
                  }

                  lastSz = vMsg.data.length;
                  o += vMsg.data.length;

                  vMsg.data.map(e => {
                      //if(e.data.hasOwnProperty('frag') && e.data.frag != null){
                      //    e.data.when = this._searchFragLocation( e.data.hook, e.data.frag._uid );
                      //}

                      this.messages.push(e);
                  });
              });
      }, 500)


  }


  initChannel(){
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

            if(self.channel==null){
              throw UIException.WEBSOCKET_CHANNEL_IS_NOT_READY("HookSession","processMessage");
            }
            if(self.prj==null){
              throw UIException.PROJECT_IS_NOT_READY("HookSession","processMessage");
            }

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
   // this.channel.token =
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
    if(this._restored==false){
        if(this._polling==PollingType.WEBSOCKET){
            if(this.channel==null){
                throw UIException.WEBSOCKET_CHANNEL_IS_NOT_READY("HookSession","getUID");
            }
            return this.channel.getSessID();
        }else{
            return (this._uid!=null ? this._uid : "");
        }
    }else{
      return (this._uid!=null ? this._uid : "");
    }
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
      if(this._polling==PollingType.WEBSOCKET){
          if(this.channel==null){
              throw UIException.WEBSOCKET_CHANNEL_IS_NOT_READY("HookSession","start");
          }
          this.channel.sendRaw({ action:HOOK_SESSION_CMD.NEW, svc:'hookm', prj:this.prj, data: {}});
      }
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
    if(this._polling==PollingType.WEBSOCKET){
        if(this.channel==null){
            throw UIException.WEBSOCKET_CHANNEL_IS_NOT_READY("HookSession","exit");
        }

        this.channel.send({ action:HOOK_SESSION_CMD.EXIT, svc:'hookm', prj:this.prj, data: { }});
    }
  }


  static from(pProject:DexcaliburProject, pObj:HookSessionOpts):HookSession {
    const sess = new HookSession(
        "Session",
        HOOK_ICONS.BUILTIN_HS,
        pObj._uid!=null ? pObj._uid : "",
        pProject,
        PollingType.HTTP);

    for(let i in pObj){
      (sess as any)[i] = (pObj as any)[i];
    }

    sess._restored = true;

    return sess;
  }
}
