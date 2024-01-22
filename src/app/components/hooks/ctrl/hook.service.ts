// ts-ignore
import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {from, Observable, Subject} from "rxjs";
import Hook from "../../../models/Hook";
import {map} from "rxjs/operators";
import {Utils} from "../../../cmp/Utils";
import {DxcApiService} from "../../../base/DxcApiService";
import {AppMenuService} from "../../../base/appmenu/app-menu.service";
import ModelMethod from "../../../models/ModelMethod";
import {WebsocketClient} from "../../../base/WebsocketClient";
import {HookErrorMessage, HookSession} from "./HookSession";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {OutputService} from "../../output/ctrl/output.service";
import {ModelFunction} from "../../../models/ModelFunction";
import {ProjectService} from "../../project/ctrl/project.service";
import KeyPoint from "../../../models/KeyPoint";
import JavaMethodHook from "../../../models/JavaMethodHook";
import NativeFunctionHook from "../../../models/NativeFunctionHook";
import {AbstractHook} from "../../../models/AbstractHook";
import {NodeInternalType, NodeTypeHelper} from "../../../models/NodeInternalType";
import HookTemplateFragment from "../../../models/hook/HookTemplateFragment";
import HookSet from "../../../models/HookSet";
import HookMessage from "../../../models/HookMessage";
import {WebApiWindowing} from "../../../base/WebApiWindowing";
import {RuntimeEvent} from "../../../models/hook/RuntimeEvent";
import {AppMenu} from "../../../base/menu/AppMenu";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {UIException} from "../../../base/error/UIException";

export interface HookTree {
  [parent:string] :Hook[]
}

export interface HookMap {
  [hookID:string] :any //Hook
}


export interface HookMethMap {
  [signature:string] :string[]
}


export enum HookFragmentPresetType {
  NONE='none',
  TRACK='track',
  TRACK_PARAM='trackpar',
  TRACK_RET='trackret',
  TAMPER='tamper',
  TAMPER_PARAM='tpar',
  TAMPER_RET='tret',
  TRACK_JAVA_NEW_INST='jnewobj',
  TRACK_FDS='tfds',
  TRACK_KEYSTORE_OPE='tksop'
}

export interface HookFragmentPresetOptions{
  // before:boolean,
  type:HookFragmentPresetType,
  target?:any,
  tplOpts?:any
}


export enum HOOK_TARGET_TYPE {
  METHOD='method',
  SETTER='setter',
  GETTER='getter',
  CONSTRUCTOR='constructor',
  STATIC='static block',
  FUNC='native function',
  INSN='instruction',
  SYSCALL='instruction',
  INT='interrupt',
  KP='keypoint'
}

export enum HOOK_VISIBILITY {
  PRIVATE='private',
  SHARED='shared'
}


export enum HOOKSESSION_CACHE_POLICY {
  NONE,
  FLUSH_SESSIONS,
  STORE_SESSIONS
}



// ts-ignore
@Injectable({
  providedIn: 'root'
})
export class HookService extends DxcApiService {

  HKOP:any = {
    REMOVED: 'r',
    EDITED: 'e',
    CREATED: 'c'
  };

  options: any = {
    ft: 0,
    ff: 0,
    mode: "spawn-self"
  };

  socket:any = null;

  onCreateHook:Subject<any> = new Subject<any>();
  onHookEdit:Subject<any> = new Subject<any>();
  onKpEdit:Subject<any> = new Subject<any>();
  onEditFragment:Subject<any> = new Subject<any>();
  onFragmentUpdate:Subject<any> = new Subject<any>();
  onShowAsked:Subject<any> = new Subject<any>();
  onDeviceConfigure:Subject<any> = new Subject<any>();
  onHookError:Subject<HookErrorMessage> = new Subject<HookErrorMessage>();

  onMenuClick:Subject<any> = new Subject<any>();

  /**
   * Event emitted when a new key point is created, to help to refresh UI
   * @type {Subject<any>}
   * @field
   */
  onNewKp:Subject<any> = new Subject<any>();

  onNewSession: EventEmitter<any> = new EventEmitter<any>();
  onNewMessage: EventEmitter<any> = new EventEmitter<any>();
  onCreateKeyPoint: EventEmitter<any> = new EventEmitter<any>();

  refresh$: Subject<any> = new Subject<any>();
  onNewCustomHook: Subject<any> = new Subject<any>();
  serverRunning = false;

  onKeyPointListChange: Subject<KeyPoint[]> = new Subject<KeyPoint[]>();

  _sessions:HookSession[] = [];
  _hooks:HookMap = {};
  _hook_kp:KeyPoint[] = [];
  _hook_map:HookMethMap = {};


  mode = "spawn-self";

  constructor( private appmenuSvc:AppMenuService,
               public outputSvc:OutputService,
               private projectSvc:ProjectService,
               protected override _http:HttpClient) {
    super(
      {
          hook: {
            list: { method: 'GET', url:'/hook/list', format:'json', auth:false /* removed */, puid:true},
            listByKp: { method: 'GET', url:'/hook/list/kp/:name', format:'json', auth:false /* removed */, puid:true},
            probe: { method: 'POST', url:'/hook/new/:id', format:'json', auth:false /* removed */, puid:true},
            start: { method: 'POST', url:'/hook/start', format:'json', auth:false /* removed */, puid:true},
            probeSwitch: { method: 'PUT', url:'/hook/new/:id', format:'json', auth:false /* removed */, puid:true},
            download: { method: 'GET', url:'/hook/download', format:'json', auth:false /* removed */, puid:true},
            logs: { method: 'GET', url:'/hook/msg', format:'json', auth:false /* removed */, puid:true},
            list_session: { method: 'GET', url:'/hook/sessions', format:'json', auth:false /* removed */, puid:true},
            get: { method: 'GET', url:'/hook/get/:uid', format:'json', auth:false /* removed */, puid:true},
            save: { method: 'PUT', url:'/hook/get/:uid', format:'json', auth:false /* removed */, puid:true},
            remove: { method: 'DELETE', url:'/hook/get/:hookid', format:'json', auth:false /* removed */, puid:true},
            enable: { method: 'PUT', url:'/hook/enable/:hookid', format:'json', auth:false /* removed */, puid:true},
            disable: { method: 'PUT', url:'/hook/disable/:hookid', format:'json', auth:false /* removed */, puid:true},
            detach: { method: 'POST', url:'/hook/app/detach', format:'json', auth:false /* removed */, puid:true},
            kill: { method: 'POST', url:'/hook/app/kill', format:'json', auth:false /* removed */, puid:true},
            exec: { method: 'POST', url:'/hook/frida/exec', format:'json', auth:false /* removed */, puid:true},
            buildScript: { method: 'GET', url:'/hook/frida/build', format:'json', auth:false /* removed */, puid:true},
            flushGeneratedCode: { method: 'GET', url:'/hook/flush/:type', format:'json', auth:false /* removed */, puid:true},
          },
          session: {
            show: { method: 'GET', url:'/hook/session/:id', format:'json', auth:false /* removed */, puid:true}
          },
          sessions: {
            list: { method: 'GET', url:'/hook/sessions', format:'json', auth:false /* removed */, puid:true},
            get_msg: { method: 'GET', url:'/hook/session/msg', format:'json', auth:false /* removed */, puid:true, window: new WebApiWindowing(0,100)},
          },
          global: {
            edit_config: { method: 'POST', url:'/hook/global/opts', format:'json', auth:false /* removed */, puid:true},
            update_libs: { method: 'GET', url:'/hook/libs/update', format:'json', auth:false /* removed */, puid:true},
          },
          frag: {
            new: { method: 'POST', url:'/hook_frag/hook_frag/:uid', format:'json', auth:false /* removed */, puid:true},
            edit: { method: 'PUT', url:'/hook_frag/hook_frag/:uid', format:'json', auth:false /* removed */, puid:true},
            del: { method: 'DELETE', url:'/hook_frag/hook_frag/:uid/:frag_uid', format:'json', auth:false /* removed */, puid:true}
          },
          server: {
            start: { method: 'POST', url:'/hookserver/start', format:'json', auth:false /* removed */, puid:true},
            stop: { method: 'POST', url:'/hookserver/stop', format:'json', auth:false /* removed */, puid:true},
            status: { method: 'GET', url:'/hookserver/status', format:'json', auth:false /* removed */, puid:true}
          },
          kp: {
            list: { method: 'GET', url:'/keypoint/list', format:'json', auth:false /* removed */, puid:true},
            search: { method: 'GET', url:'/keypoint/search', format:'json', auth:false /* removed */, puid:true},
            show: { method: 'GET', url:'/keypoint/edit/:uid', format:'json', auth:false /* removed */, puid:true},
            save: { method: 'POST', url:'/keypoint/edit/:uid', format:'json', auth:false /* removed */, puid:true},
            del: { method: 'DELETE', url:'/keypoint/edit/:uid', format:'json', auth:false /* removed */, puid:true},
            new: { method: 'POST', url:'/keypoint/new', format:'json', auth:false /* removed */, puid:true},
            removeByToken: { method: 'POST', url:'/keypoint/remove/token', format:'json', auth:false /* removed */, puid:true},
            attach: { method: 'POST', url:'/keypoint/attach/hook', format:'json', auth:false /* removed */, puid:true},
            enable: { method: 'POST', url:'/keypoint/enable', format:'json', auth:false /* removed */, puid:true},
          },
          inspector: {
            list: { method: 'GET', url:'/inspector', format:'json', auth:false /* removed */, puid:true},
            //dyn: { method: 'GET', url:'/inspectors/DynamicLoader', format:'json', auth:false /* removed */, puid:true}
            dyn: { method: 'GET', url:'/inspectors/DynamicLoader', format:'json', auth:false /* removed */, puid:true}
          }
        },_http, outputSvc
      );

    this.appmenuSvc.addMenu({
      id:'instr',
      label: 'Instrumentation',
      enabled:false,
      submenu:[{
        label: 'Custom hook',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({ item:'new-custom-hook', win:pBrowserWindow });
        }
      },{
        label: 'Hook scratchpad',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({ item:'new-scratch-hook', win:pBrowserWindow });
        }
      },{
        label: 'Script',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({ item:'new-script', win:pBrowserWindow });
        }
      }/*,{
        label: 'Custom hook',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onNewCustomHook.next(true)
        }
      },{
        label: 'New scratchpad hook',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onNewCustomHook.next(true)
        }
      }*/, {
        type: 'separator'
      }, {
        label: 'Global options',
        submenu: [
          {
            label: 'Follow thread',
            type: 'radio',
            checked: (this.options.followThread == true),
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              this.switchProperty("followThread");
            }
          },{
            label: 'Follow fork',
            type: 'radio',
            checked: (this.options.followFork == true),
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              this.switchProperty("followFork");
            }
          },{
            label: 'Record hook sessions',
            type: 'radio',
            checked: (this.options.cache_policy == HOOKSESSION_CACHE_POLICY.STORE_SESSIONS),
            click: (pMenuItem:any, pBrowserWindow:any ) => {

              this.switchProperty("cache_policy",
                (this.options.cache_policy == HOOKSESSION_CACHE_POLICY.STORE_SESSIONS)?
                  HOOKSESSION_CACHE_POLICY.FLUSH_SESSIONS : HOOKSESSION_CACHE_POLICY.STORE_SESSIONS
              );
            }
          }]
      },{
        type: 'separator'
      },{
        label: 'System calls',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onCreateHook.next({ type:HOOK_TARGET_TYPE.SYSCALL });
        }
      }/*,{
        label: 'Hypervisor calls',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onCreateHook.next({ type:HOOK_TARGET_TYPE.INT });
        }
      },{
        label: 'SecureMonitor calls',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onCreateHook.next({ type:HOOK_TARGET_TYPE.INT });
        }
      }*/,{
        type: 'separator'
      },{
        label: 'Show key points',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({ item:HOOK_TARGET_TYPE.KP });
        }
        /*
        submenu: [
          {
            label: 'List',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              //this.draw({ type:'hook_points' });
              //this.displayHookPointList()
              //this..next({ type:HOOK_TARGET_TYPE.INT });
              this.onMenuClick.next({ item:HOOK_TARGET_TYPE.KP });
            }
          },
          {
            label: 'New hook oriented',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              this.onCreateKeyPoint.next({ type:'hook_based' });
            }
          }
        ]*/
      }, {
        type: 'separator'
      },{
        label: 'File Descriptors',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onCreateHook.next({ type:HookFragmentPresetType.TRACK_FDS });
        }
      },{
        label: 'Keystores',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onCreateHook.next({ type:HookFragmentPresetType.TRACK_KEYSTORE_OPE });
        }
      }, {
        type: 'separator'
      },{
        label: 'Clear Dynamic DEX bytecode',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.clearDynamicDex().subscribe();
        }
      },{
        label: 'Flush script cache',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.flushCache("all").subscribe(()=> {
          });
        }
      }, {
        type: 'separator'
      },{
        label: 'Attach mode',
        submenu: [
          {
            label: 'Spawn target app',
            type: 'radio',
            checked: (this.mode=="spawn-self"),
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              this.switchToMode("spawn-self");
            }
          },{
            label: 'Spawn custom app',
            type: 'radio',
            checked: (this.mode=="spawn-app"),
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              this.switchToMode("spawn-app");
            }
          },{
            label: 'Attach to gadget',
            type: 'radio',
            checked: (this.mode=="attach-gadget"),
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              this.switchToMode("attach-gadget");
            }
          },{
            label: 'Attach to PID ...',
            type: 'radio',
            checked: (this.mode=="attach-pid"),
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              this.switchToMode("attach-pid");
            }
          },{
            label: 'Attach to target app',
            type: 'radio',
            checked: (this.mode=="attach-app-self"),
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              this.switchToMode("attach-app-self");
            }
          },{
            label: 'Attach to app ...',
            type: 'radio',
            checked: (this.mode=="attach-app"),
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              this.switchToMode("attach-app");
            }
          },{
            type: 'separator',
          },{
            label: 'Settings',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              this.openFridaSettings();
            }
          }
        ]
      },{
        type: 'separator'
      },{
        label: 'Kill target app',
        id:'hook-kill-target',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.killApp().subscribe( );
        }
      },{
        label: 'Start server',
        id:'hook-server-start',
        enabled:(this.getServerStatus()==false),
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.startServer().subscribe( (pRes:any)=>{
            pMenuItem.enabled = !this.serverRunning;
            const itm = AppMenu.getInstance().getMenuItemById('hook-server-stop');
            if(itm!=null){
              itm.setEnable(this.serverRunning);
            }
          });
        }
      },{
        label: 'Stop server',
        id:'hook-server-stop',
        enabled:(this.getServerStatus()),
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.stopServer().subscribe( (pRes:any)=>{
            pMenuItem.enabled = this.serverRunning;
            const itm = AppMenu.getInstance().getMenuItemById('hook-server-start');
            if(itm!=null){
              itm.setEnable(!this.serverRunning);
            }
          });
        }
      }]
    }, 3);


    this.appmenuSvc.addMenu({
      id:'mem',
      label: 'Memory',
      enabled:false,
      submenu:[{
        label: 'Search into process ...',
      },{
        label: 'Search on hook triggered',
      },{
        label: 'Memory mapping',
      },{
        type: 'separator'
      },{
        label: 'History',
      }]
    }, 4);

    this.appmenuSvc.addMenu({
      id:'comm',
      label: 'Communication',
      enabled:false,
      submenu: [{
        label: 'Monitor (pro only)',
      }, {
        type: 'separator'
      }, {
        label: 'HTTP(S) (pro only)',
      }, {
        label: 'NFC (pro only)',
      }, {
        label: 'Bluetooth (pro only)',
      }, {
        label: 'IPC / Binder (pro only)',
      }, {
        label: 'TEE (pro only)',
      }, {
        label: 'Android Intents (pro only)',
      }]
    }, 7);

    this.initEventHandler();
  }


  initEventHandler():void {
    this.projectSvc.onMenuClick.subscribe( (pEvent: any) => {
      switch(pEvent.item){
        case "hook-update-libs":
          this.updateHookLibs().subscribe();
          break;
        /*case "new-custom-hook":
          this.showModal("gsettings");
          break;
        case "new-scratch-hook":
          this.showModal("gsettings");
          break;*/
      }
    });

    // pop alert box on error
    this.onHookError.subscribe( (pEvent:HookErrorMessage)=>{
      console.log("onHookError > ",pEvent);
      if(!pEvent.msg.data.success){
        this.outputSvc.alert(
          // pop alert box
          OutputMessage.newError({ msg:pEvent.msg.data.msg}),
          {
            title: "Frida error"
          }
        );
      }
    })
  }

  openFridaSettings():void {
    // todo
  }

  /**
   *  To change locally the hook mode :
   *  spawn self, attach to gadget, attach to pid, ...
   *
   * @param {string} pMode The hooking mode
   * @method
   * @since 1.0.0
   */
  switchToMode( pMode:string):void {
    this.mode = pMode;
    this.outputSvc.print( OutputMessage.newWarning({ msg:"Hooking mode has changed ["+pMode+"].", src:"Hook Manager"}))
  }

  /**
   * To get the preferred hook mode
   *
   * @return {string} The hooking mode
   * @method
   * @since 1.0.0
   */
  getHookMode():string {
    return this.mode;
  }


  switchProperty( pProperty:string, pValue:any = null){
      if(pValue != null)
        this.options[pProperty] = pValue ;
      else
        this.options[pProperty] = !this.options[pProperty] ;
      this.updateHookConfiguration(pProperty, this.options[pProperty]).subscribe((pOpts:any)=>{
          this.options = pOpts;
      });
  }


  /**
   * To get all  sessions
   *
   *
   */
  getSessions():Observable<HookSession[]> {
    return this._process(
      this.endpoints['sessions']['list'],
      {}
    ).pipe(
      map((pEl:any)=>{
        if(!pEl.success){
          this.outputSvc.print(OutputMessage.newError({ msf:"Hook sessions cannot be lister : "+pEl.msg, src:"Hook Manager" }));
          return [];

        }

        const data:HookSession[] = []

        pEl.data.sess.map((x:any) => {         x.__ = NodeInternalType.HOOK_SESSION;
          x.date = new Date(x.time);
          data.push(x);
        })
        return data;
      }
    ));
  }

  /**
   * To get all message of the specified session
   */
  getMessageFromSession( pSessID:string):Observable<RuntimeEvent<any>[]> {
    return this._process(
      this.endpoints['sessions']['get_msg'],
      {
        sess: pSessID
      }
    ).pipe(
      map((pEl:any)=>{
          if(!pEl.success){
            this.outputSvc.print(OutputMessage.newError({ msf:"Content of the hook sessions cannot be retrieved : "+pEl.msg, src:"Hook Manager" }));
            return [] ;
          }

          const data:RuntimeEvent<any>[] = []

          return data;
        }
      ));
  }


  /**
   * To get all messages from all sessions, from hooks targeting a specified node
   *
   *
   * @param {ModelMethod|ModelFunction} pTarget
   * @return {Observable<HookMessage[]>} Observable list of hook message
   * @method
   * @since 1.0.0
   */
  getAllMessagesForNode( pTarget:ModelMethod|ModelFunction):Observable<HookMessage[]> {
    return this._process(
      this.endpoints['sessions']['get_msg'],
      {
        node: pTarget.getUID()
      }
    ).pipe(
      map((pEl:any)=>{
          if(!pEl.success){
            this.outputSvc.print(OutputMessage.newError({ msf:"Content of the hook sessions cannot be retrieved : "+pEl.msg, src:"Hook Manager" }));
            return [];
          }

          const data:HookMessage[] = []

          return data;
        }
      ));
  }

  getHooksByKeyPoint( pKP:KeyPoint):Observable<any> {
    return this._process(
      this.endpoints['hook']['listByKp'],
      {
        name: pKP.getUID()
      }
    ).pipe(
      map((pEl:any)=>{
        if( pEl.success){
          console.log(pEl);
          if(pEl.data != null){
            const o:any = {load:[], unload:[]};
            pEl.data.load.map((x:any) => {             console.log(x);
              if(x.hasOwnProperty('method')){
                o.load.push( this._hooks[x.id] = new JavaMethodHook(x));
              }else{
                o.load.push( this._hooks[x.id] = new NativeFunctionHook(x));
                this._hooks[x.id].symbol = this._hooks[x.id].func.substr(this._hooks[x.id].func.lastIndexOf(':')+1);
              }
            });
            pEl.data.unload.map((x:any) => {             if(x.hasOwnProperty('method')){
                o.unload.push( this._hooks[x.id] = new JavaMethodHook(x));
              }else{
                o.unload.push( this._hooks[x.id] = new NativeFunctionHook(x));
                this._hooks[x.id].symbol = this._hooks[x.id].func.substr(this._hooks[x.id].func.lastIndexOf(':')+1);
              }
              //vHookSet.children.push( this._hooks[vHook.id] = new Hook(vHook));
            });




            return o;
          }
        }else{
          this.outputSvc.print( OutputMessage.newError({src:"KeyPoint Manager", msg:pEl.msg }))
        }
        return pEl;
      })
    );
  }

  listInspectors():Observable<any>{
    return this._process(
      this.endpoints['inspector']['list']
    ).pipe(
      map((pEl:any)=>{
        if(!pEl.success){
          this.outputSvc.print( OutputMessage.newError({src:"Hook Manager", msg:pEl.msg }));
          return null;
        }else{
          console.log(pEl);
          return pEl;
        }
      })
    );
  }


  listHooks(pScope:Nullable<string> = null, pOptions:any={}):Observable<any>{
    return this._process(
      this.endpoints['hook']['list'],
      pOptions
    ).pipe(
      map((pEl:any)=>{

        if(!pEl.success){
          this.outputSvc.print(OutputMessage.newError({ type:"Hook Manager", msg:pEl.msg}));
          return null;
        }else{
          return pEl.data;
        }


      })
    );
  }

  /*
   * To show messages from a session, if a session is already running it 'reattach' the websocket
   *
   * @param pSession
   *
  showMessages( pSession:HookSession):Observable<HookMessage[]> {
    return this._process(
      this.endpoints['session']['open'],
      pOptions
    ).pipe(
      map((pEl:any)=>{

        if(!pEl.success){
          this.outputSvc.print(OutputMessage.newError({ type:"Hook Manager", msg:pEl.msg}));
        }else{
          return pEl.data;
        }


      })
    );
  }*/

  getServerStatus():boolean {
    return this.serverRunning;
  }

  /**
   * To start frida server on the default project device
   */
  startServer( pOptions:any = {}):Observable<any>{
    const opts = {
      privileged: 'true'
    };

    for(const i in pOptions) (opts as IStringIndex<any>)[i] = pOptions[i];

    return this._process(
      this.endpoints['server']['start'],opts
    ).pipe(
      map( pRes => {
        if(!pRes.success){
          //this.outputSvc.print(OutputMessage.newError({ msg:"ERROR : Frida server has not been  launched", src:"Hook Manager" }));
          const msg = OutputMessage.newError({ msg:pRes.msg != "" ? pRes.msg : "Frida server cannot be launched", src:"Hook Manager" })

          this.outputSvc.print(msg);
          this.outputSvc.alert(msg,
            {
              title:"Frida server error",
              controls: [{
                label: "Configure...",
                handler:  (()=>{
                  if(pOptions.dev != null){
                    this.onDeviceConfigure.next(pOptions.dev );
                    // is a specifc device has been selected ..
                  }else{
                    console.log(this.projectSvc.getSelectedProject());
                    // else open default device of the project
                    const proj = this.projectSvc.getSelectedProject();
                    if(proj != null){
                      this.onDeviceConfigure.next(proj.device );
                    }

                  }
                  return true;
                })
              },{
                label: "Attach to Gadget",
                handler:  (()=>{
                  this.switchToMode("attach-gadget");
                  return true;
                })
              }]
            }
          );
        }else{
          this.outputSvc.print(OutputMessage.newSuccess({ msg:"Frida server has been successfully launched", src:"Hook Manager" }));
        }

        this.serverRunning = pRes.success;
        return pRes;
      })
    )
  }


  stopServer():Observable<any>{
    return this._process(
      this.endpoints['server']['stop'],
      {
        privileged: 'true'
      }
    ).pipe(
      map( pRes => {

        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({ msg:"ERROR : Frida server has not been stopped", src:"Hook Manager" }));
        }else{
          this.outputSvc.print(OutputMessage.newSuccess({ msg:"Frida server has been successfully stopped", src:"Hook Manager" }));
        }


        this.serverRunning = pRes.success;
        return pRes;
      })
    )
  }


  /**
   * To update the libs/ folder inside the hook workspace of the active project
   *
   * @return {Observable<boolean>}
   * @method
   * @since 1.0.0
   */
  updateHookLibs():Observable<boolean> {
    return this._process(
      this.endpoints['global']['update_libs']
    ).pipe(
      map( pRes => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({ src:'Hook manager', msg: pRes.msg}));
        }else{
          this.outputSvc.print(OutputMessage.newSuccess({ src:'Hook manager', msg: "Third-part libraries usable by hooks have been updated."}));
        }
        return true;
      })
    )
  }

  /**
   * Ask to server to create the hook fragments
   *
   * @param pHook
   * @param pOptions
   * @method
   * @since 1.0.0
   */
  addHookFragment( pHook:AbstractHook, pOptions:any):Observable<AbstractHook>{
    return this._process(
      this.endpoints['frag']['new'],
      {
        'uid':pHook.getGUID(),
        'pos': pOptions.pos,
        'weight': pOptions.weight,
        'name': pOptions.name,
        'descr': pOptions.descr
      }
    ).pipe(
      map( (pRes:any) => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({ msg:pRes.msg, src:"Hook Manager" }));
        }else{
          this.outputSvc.print(OutputMessage.newSuccess({ msg:"Hook fragment has been created successfully", src:"Hook Manager" }));
          this.onFragmentUpdate.next({ hook:pHook, opts:pOptions })
        }

        return pHook;
      })
    );
  }

  editHookFragment( pHook:AbstractHook, pFragUID:string, pOpts:any = {}):Observable<AbstractHook>{
    const data = {
      'uid':pHook.getGUID(),
      'frag_uid': pFragUID
    };

    for(const i in pOpts) (data as IStringIndex<any>)[i] = pOpts[i];

    if(data.hasOwnProperty('code') != null){

    }

    return this._process( this.endpoints['frag']['edit'],data)
      .pipe(
        map( (pRes:any) => {
          if(!pRes.success){
            this.outputSvc.print(OutputMessage.newError({ msg:"Fragment cannot be edited : ", src:"Hook Manager" }));
          }else{
            this.outputSvc.print(OutputMessage.newSuccess({ msg:"Hook fragment has been edited successfully", src:"Hook Manager" }));
            this.onFragmentUpdate.next({ hook:pHook, frag:pFragUID, opts:pOpts });

          }

          return pHook;
        })
      );
  }

  deleteHookFragment( pHook:AbstractHook, pFrag:HookTemplateFragment, pPos:any = null):Observable<boolean>{
    return this._process(
      this.endpoints['frag']['del'],
      {
        'uid':pHook.getGUID(),
        'frag_uid': pFrag._uid
      }
    ).pipe(
      map( (pRes:any) => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({ msg:"Fragment cannot be deleted : ", src:"Hook Manager" }));
        }else{
          this.outputSvc.print(OutputMessage.newSuccess({ msg:"Hook fragment has been deleted successfully", src:"Hook Manager" }));

          // udpates fragments
          ['_before','_after','_replace'].map( (i:string) => {
            (pHook as IStringIndex<any>)[i] = (pHook as IStringIndex<any>)[i].filter(  (vFrag:HookTemplateFragment) => { return (vFrag._uid!==pFrag._uid); });
          });

          this.onFragmentUpdate.next({ hook:pHook, frag:pFrag, pos:pPos });
        }
/*
        this.getHook(pHook.getGUID()).subscribe((vHook:any)=>{
          pHook = vHook;
        });*/

        return pRes.success;
      })
    );
  }





  getHook( pId:string) :Observable<AbstractHook> {
    return this._process(
      this.endpoints['hook']['get'],
      { 'uid': pId }
    ).pipe(
      map((pEl:any)=>{

        if(pEl.success){
          const hid = pEl.data.hook.id;
          console.log(pEl.data,pEl.data.hook.id);
          const cached = this._hooks[hid];
          console.log(cached);
          if(cached!=null){
            for(const i in pEl.data.hook){
              if(i=='id') continue;
              // update
              if(pEl.data.hook[i] != cached[i]){
                cached[i] = pEl.data.hook[i];
              }
            }
          }else{
            this._hooks[hid] = new AbstractHook(pEl.data.hook);
            (this._hooks[hid] as any)._t ='h';
          }

          return this._hooks[hid]; //new Hook(pEl.hook);
        }else{
            this.outputSvc.print(OutputMessage.newError({ msg:pEl.msg, src:"Hook Manager" }));
        }
      })
    );
  }

  probe( pMethod:ModelMethod|ModelFunction, pOptions:any={}):Observable<Nullable<AbstractHook>> {

    let opts:any = pOptions;
    if(opts==null) opts={};

    opts['__'] = pMethod.__;

    if(pMethod.__===NodeInternalType.FUNC){
      opts['id'] = (pMethod as ModelFunction).__s;
    }else{
      opts['id'] = (pMethod as ModelMethod).__signature__;
    }


    return this._process(
      this.endpoints['hook']['probe'],
      opts
    ).pipe(
      map((pEl:any)=>{

        let h:AbstractHook;
        if(pEl.success){
          //console.log(opts[':id'])

          if(opts._t==='meth'){
            h = new JavaMethodHook(pEl.data.hook);
          }else{
            h = new NativeFunctionHook(pEl.data.hook);
          }

          // trigger Hook components refresh
          this.refresh$.next({ t:'probe.new', o:h});

          return h;
        }else{
          this.outputSvc.print(OutputMessage.newError({ src:'Hook manager', msg: pEl.msg}));
          return null;
        }
      })
    );
  }


  probeNativeFunc( pMethod:ModelFunction):Observable<NativeFunctionHook> {
    return this.probe( pMethod, { _t: 'func' }) as Observable<NativeFunctionHook>;
  }

  /**
   * To eanable/disable a hook
   * @param pHook
   * @param pStatus
   */
  /*
  saveHook( pHook:AbstractHook, pCode:string[]): Observable<any> {
    return this._process(
      this.endpoints['hook']['save'],
      {
        'uid':pHook.getGUID(),
        'code[]': pCode
      }
    ).pipe(
      map( (pRes:any) => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({ msg:"ERROR : Hook script cannot be saved", src:"Hook Manager" }));
        }else{
          this.outputSvc.print(OutputMessage.newSuccess({ msg:"Hook script has been saved successfully", src:"Hook Manager" }));
        }
        if(pRes.data.hasOwnProperty('enable'))
          pHook.enable = pRes.data.enable;
      })
    );
  }*/



  startHookSession( pOptions:any, pSocketChannel:any = null):Observable<any> {
    if(pSocketChannel!=null){
      // todo
      return from([]);
    }else{
      return this._process(
        this.endpoints['hook']['start'],
        pOptions
      ).pipe(
        map((pEl:any)=>{
          if(pEl.success){
            this.outputSvc.print( OutputMessage.newSuccess({
              src: "Hook Manager",
              msg: "Hooking sessions has started successfully"
            }));

            this.onNewSession.emit({ uid:'Session 1', sessid:pEl.data.sessid });

            return pEl.data;
          }else{
            this.outputSvc.print( OutputMessage.newError({
              src: "Hook Manager",
              msg: pEl.msg
            }));
            return null;
          }
        })
      );
    }

  }

  /**
   * To build Frida's agent script and get text
   *
   * @method
   */
  buildAgentScript():Observable<string> {
    return this._process(
      this.endpoints['hook']['buildScript']
    ).pipe(
      map((pEl:any)=>{
        if(pEl.success){
          this.outputSvc.print( OutputMessage.newSuccess({
            type: "Hook Manager",
            msg: "The agent script has been built successfully"
          }));
        }else{
          this.outputSvc.print( OutputMessage.newError({
            type: "Hook Manager",
            msg: pEl.msg
          }))
        }
        console.log(pEl.data);
        return pEl.data;
      })
    );
  }

  /**
   *
   * @param pOptName
   * @param pOptValue
   */
  updateHookConfiguration( pOptName:string, pOptValue:any):Observable<any> {

    const opt:IStringIndex<any> = {};
    opt[pOptName] = pOptValue;

    return this._process(
      this.endpoints['global']['edit_config'],
      { opts:opt }
    ).pipe(
      map((pEl:any)=>{
        if(!pEl.success){
          this.outputSvc.print( OutputMessage.newError({
            type: "Hook Manager",
            msg: pEl.msg
          }))
        }

        return pEl.data;
      })
    );
  }

  killApp():Observable<any>{
    return this._process(
      this.endpoints['hook']['kill']
    );
  }

  attachApp( pOptions:any):Observable<any> {
    return this._process(
      this.endpoints['hook']['start'],
      pOptions
    ).pipe(
      map((pEl:any)=>{
        if(pEl.success){
          this.outputSvc.print( OutputMessage.newSuccess({
            type: "Hook Manager",
            msg: "Hooking sessions has started successfully"
          }));
        }else{
          this.outputSvc.print( OutputMessage.newError({
            type: "Hook Manager",
            msg: pEl.msg
          }))
        }
        console.log('hook service > start > ',pEl);
        return pEl.data;
      })
    );
  }

  detachApp( pOptions:any):Observable<any> {
    return this._process(
      this.endpoints['hook']['start'],
      pOptions
    ).pipe(
      map((pEl:any)=>{
        if(pEl.success){
          this.outputSvc.print( OutputMessage.newSuccess({
            type: "Hook Manager",
            msg: "Hooking sessions has started successfully"
          }));
        }else{
          this.outputSvc.print( OutputMessage.newError({
            type: "Hook Manager",
            msg: pEl.msg
          }))
        }
        console.log('hook service > start > ',pEl);
        return pEl.data;
      })
    );
  }

  getInspector( pId:string) :Observable<any> {
    return this._process(
      this.endpoints['inspector']['get'],
      { 'name': pId }
    ).pipe(
      map((pEl:any)=>{
        console.log('hook service > getInspector > ',pEl);
      })
    );
  }


  generateSessID(pProject:DexcaliburProject, pOptions:any):string {
    switch(pOptions.type){
      case "spawn-self":
        return "Session_"+this._sessions.length;
        break;
      case "spawn":
        return pOptions.app+"_"+this._sessions.length;
        break;
      case "attach-gadget":
        return "Gadget_"+this._sessions.length;
        break;
      case "attach-app-self":
        return pOptions.pkg+"_"+this._sessions.length;
        break;
      case "attach-app":
        return "Attached["+pOptions.app+"]_"+this._sessions.length;
        break;
      case "attach-pid":
        return "Attached["+pOptions.pid+"]_"+this._sessions.length;
        break;
      default:
        throw new Error("Unsupported mode");
    }

  }


  /**
   *
   * @param pWebsocketClient
   * @param pProject
   * @param pOptions
   */
  startWebsocketHookSession( pWebsocketClient:WebsocketClient, pProject:DexcaliburProject, pOptions:any): HookSession {

    const opts:any = pOptions;

    opts.test = 'test';

    // use selected mode only if its not a replay an exiting session
    if(opts.hasOwnProperty('type')==false)
      opts.type = this.mode;


    const localID=this.generateSessID(pProject,opts);

    const sess: HookSession = new HookSession(localID, GLOBAL_ICONS['HOOKS'], localID, pProject);


    if(sess.channel==null){
      throw UIException.WEBSOCKET_CHANNEL_IS_NOT_READY("TerminalSession","getUID");
    }

    sess.setHookErrorObservable(this.onHookError);
    pWebsocketClient.registerChannel(sess.channel);

    this._sessions.push(sess);

    this.onNewSession.emit( sess);

    sess.channel.sendRaw({action: "start", svc: "hookm", prj: pProject.uid, data: opts}); //{type: pOptions.type}});

    return sess;
  }

  /**
   * To eanable/disable a hook
   * @param pHook
   * @param pStatus
   */
  enableHook( pHook:AbstractHook, pStatus:boolean): Observable<any> {

    return this._process(
      (pStatus==true? this.endpoints['hook']['enable'] : this.endpoints['hook']['disable']),
      {
        'hookid': pHook.getGUID()
      }
    ).pipe(
      map( (pRes:any) => {
        if(pRes.success){

          console.log(pRes);
          if(pRes.data.hasOwnProperty('enable')) {
            pHook._enabled = pRes.data.enable;
            return pHook._enabled; //(pRes.data.enable === pStatus);
          }else{
            return null;
          }
        }else{
          return null;
        }
      })
    );
  }


  /**
   * To eanable/disable a hook
   * @param pHook
   * @param pStatus
   */
  removeHook( pHook:AbstractHook): Observable<any> {

    console.log("[HOOK SERVICE][hook][remove] ",pHook);
    if(pHook.parentID != null){
      throw new Error("Built-in hook cannot be removed. You can disable it.");
    }

    return this._process(
      this.endpoints['hook']['remove'] ,
      {
        'hookid':pHook.getGUID()
      }
    ).pipe(
      map( (pRes:any) => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({ msg:pRes.msg, src:"Hook Manager" }))
          return false;
        }

        this.onHookEdit.next({ hook:pHook.getGUID(), ope:this.HKOP.REMOVED })
        return true;
      })
    );
  }

  /**
   * To list hooks of a given method
   */
  getHooksForMeth(pMeth: string|ModelMethod):Observable<any> {
    if(typeof pMeth==='string')
      return this.listHooks(null, { t:'meth', s:Utils.dxc_encodeURIparam(pMeth) });
    else
      return this.listHooks(null, { t:'meth', s:Utils.dxc_encodeURIparam(pMeth.signature()) });
  }

  getInspectors():Observable<HookSet[]> {
    return this.listHooks(
      null, {
        t: 'meth',
        f: 'inspector'
      }
    ).pipe(
      map( (pData:any) => {
        const hook:HookSet[] = [];

        pData.map( (vHookSet:any)=>{

          vHookSet._t = 'i';
          vHookSet.children = [];
          vHookSet.hooks.map((vHook:any) => {           vHookSet.children.push( this._hooks[vHook.id] = new Hook(vHook));
          });
          hook.push(vHookSet);
        });

        return hook;
      })
    );
  }

  /**
   * To get all hooks enabled and disabled
   *
   * @emthod
   */
  getAllHooks():Observable<AbstractHook[]> {
    return this.listHooks(
      null, {
        t: 'meth',
        f: '*'
      }
    ).pipe(
      map( (pData:any) => {
          const h:AbstractHook[] = [];
          pData.map( (vRaw:any)=>{
            const o:any = new AbstractHook(vRaw);

            o._t = "h";
            if(o.__==NodeInternalType.HOOK_NATIVE){
              o.symbol = o.func.substr(o.func.lastIndexOf(':')+1);
            }
            h.push( o as AbstractHook);
          });

          return h;
      })
    );
  }

  /**
   * To get hook msg and relative session for a specifc method
   * @param pMethod
   */
  getHooksMsgForMeth(pMethod: any):Observable<HookSession[]> {
    return this._process(
        this.endpoints['hook']['list_session'],
      {}
    ).pipe(
      map((pRes:any) => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({ msg:pRes.msg, src:"Hook Manager" }))
        }else{
          return pRes;
        }
      })
    );
  }

  /**
   * To clear cache d DEX files/buffers gathered at runtime
   */
  clearDynamicDex():Observable<any> {
    return this._process(
      this.endpoints['inspector']['dyn'],
      { action: 'cleanup' }
    ).pipe(
      map((pRes:any) => {
        console.log(pRes);
        return pRes.data;
      })
    );
  }

  /**
   * To create a key point remotely
   *
   * If pOptions is null, it opens a configuration windows to let the user pick right options,
   * Else the key point is created quietly
   *
   * @param {any} pSubject The target of the key point
   * @param {any} pOptions The options of key point
   */
  createKeyPoint(pSubject: any, pOptions: any) {
    console.log(pSubject,pOptions==null);
    if(pOptions==null){
      this.onCreateKeyPoint.next( { subject:pSubject, opts:pOptions});
    }else{
      this.updateKeyPointsOn(pSubject, pOptions, true).subscribe((pData:any)=>{
        this.outputSvc.print( OutputMessage.newSuccess({src:"KeyPoint Manager", msg:"A new key point has been created." }));
      })
    }

  }



  getKeyPointsFor( pNode:any, pKeyPoints:KeyPoint[]):KeyPoint[] {
      const kps:KeyPoint[] = [];
      pKeyPoints.map( (vKP:any) => {
        vKP.node.map((n:any) => {         if( (n.__ === pNode.__) &&  (n.uid === pNode.uid)) kps.push(vKP);
        });
      })
      return kps;
  }

  getKeyPointsOn( pSubject:any):Observable<KeyPoint[]> {
    if(this._hook_kp.length == 0){
      // TOIDO
      return this.listKeyPoints(true).pipe( map((x:KeyPoint[]) => {
        return this.getKeyPointsFor( pSubject, this._hook_kp);
      }));
    }else{
       return from([this.getKeyPointsFor( pSubject, this._hook_kp)]);
    }
  }

  /**
   * To list existing key points, and update cache if needed
   *
   * @param pUpdateCache {boolean} Optional. Default: TRUE. TRUE to update the cache, else FALSE
   * @return {Observable<KeyPoint[]>} Observable array of KeyPoints
   * @method
   */
  listKeyPoints(pUpdateCache= true):Observable<KeyPoint[]> {
    return this._process(
      this.endpoints['kp']['list']
    ).pipe(
      map((pEl:any)=>{
        if( pEl.success){
          if(pEl.data != null){
            const o:KeyPoint[] = [];
            pEl.data.map((x:any) => {             o.push(new KeyPoint(x));
            });

            // update cache
            if(pUpdateCache) {
              this._hook_kp = o;
              this.onKeyPointListChange.next(this._hook_kp);
            }

            return o;
          }
        }else{
          this.outputSvc.print( OutputMessage.newError({src:"KeyPoint Manager", msg:pEl.msg }))
        }
        return pEl;
      })
    );
  }

  /**
   *
   * @param pSubject
   * @param pCreate
   */
  updateKeyPointsOn( pSubject:any, pOptions:any, pCreate = false) {
    return this._process(
      this.endpoints['kp'][ pCreate? 'new' : 'save'],
      { target: { __:pSubject.__, uid:NodeTypeHelper.getUIDof(pSubject) }, opts:pOptions }
    ).pipe(
      map((pRes:any) => {

        if(!pRes.success){
          this.outputSvc.alert(OutputMessage.newError({
            msg : pRes.msg,
            src: "KeyPoint Manager"
          }),{
            title: "Internal Error"
          });
          return ;
        }else{
          this.onNewKp.next(pRes.data);
        }

        return pRes.data;
      })
    );
  }

  enableKeyPoint( pSubject:KeyPoint, pStatus:boolean) {

    return this._process(
      this.endpoints['kp']['enable'],
      { kp:NodeTypeHelper.getUIDof(pSubject), enable:(pStatus? 1 : 0) }
    ).pipe(
      map((pRes:any) => {
        if(!pRes.success){

        }

        this.onKpEdit.next({ item:pSubject, opts:{enabled: pStatus} });
        return pRes.data;
      })
    );
  }

  /**
   *
   * @param pSubject
   * @param pCreate
   console.log(pSubject);
   */
  deleteKeyPoint( pSubject:KeyPoint, pByToken = false) {
    return this._process(
      this.endpoints['kp'][ pByToken ? "removeByToken" : "del"],
      pByToken? { token:pSubject.token } : { uid: pSubject.name }
    ).pipe(
      map((pRes:any) => {
        this._hook_kp = [];
        return pRes;
      })
    );
  }
  /**
   *
   * @param pSubject
   * @param pCreate
   */
  updateKeyPoint( pKeyPoint:KeyPoint, pEdited:any) {
    return this._process(
      this.endpoints['kp']['save'],
      { uid:pKeyPoint.getUID(), opts:  pEdited }
    ).pipe(
      map((pRes:any) => {
        if(!pRes.success){
          this.outputSvc.alert(OutputMessage.newError({
            msg : pRes.msg,
            src: "KeyPoint Manager"
          }),{
            title: "Internal Error"
          });
          return ;
        }

        this.onKpEdit.next({ item:pKeyPoint, opts:pEdited });

        return pRes.data;
      })
    );
  }


  /**
   *
   * @param pSubject
   * @param pCreate
   console.log(pSubject);
   */
  attachHookTo( pTargetHook:Hook, pSubject:KeyPoint|string, pHookAction:string) {
    console.log(pTargetHook,pSubject,pHookAction);
    return this._process(
      this.endpoints['kp']['attach'],
      (typeof (pSubject)!='string')? { hook:pTargetHook, kp:NodeTypeHelper.getUIDof(pSubject), type:pHookAction  } : { hook:pTargetHook, kp:pSubject, type:pHookAction   }
    ).pipe(
      map((pRes:any) => {
        if(pRes.success){
          this.listKeyPoints(true).subscribe(()=>{ console.log("ok") });
          this.outputSvc.print( OutputMessage.newSuccess({src:"KeyPoint Manager", msg:"Hook has been re-attached." }));
          return pRes.data;
        }else{
          this.outputSvc.print( OutputMessage.newError({src:"KeyPoint Manager", msg:"Hook cannot re-attached to another key point : "+pRes.msg }))
        }
      })
    );
  }

  downloadAgentScript():Observable<any>{
    return this._process(
      this.endpoints['hook']['download']
    ).pipe(
      map((pEl:any)=>{
        console.log(pEl);
        return pEl;
      })
    );
  }

  flushCache(pType = "all") {
    return this._process(
        this.endpoints['hook']['flushGeneratedCode'],
        { type: pType }
    ).pipe(
        map((pEl:any)=>{
          return pEl.success;
        })
    );
  }
}
