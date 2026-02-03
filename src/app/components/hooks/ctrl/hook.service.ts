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
import {HookErrorMessage, HookSession, HookSessionUUID, PollingType} from "./HookSession";
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
import {RuntimeEvent} from "../../../models/hook/RuntimeEvent";
import {AppMenu} from "../../../base/menu/AppMenu";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {UIException} from "../../../base/error/UIException";
import {ContextMenuEvent} from "../../../base/context-menu/context-menu.component";
import {DxApiResponse, INodeRef} from "../../../base/common/common";
import {DeviceUUID} from "../../../models/Device";

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

export interface HookEditEvent {
  ope: any,
  hook?: Nullable<AbstractHook>,
  hookID: string,
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


interface RuntimeEventFilter {
  fragUID?:string;
  hookUID?:string;
  tagUUIDs?:number[];
  tagNames?:string[];
}

// ts-ignore
@Injectable({
  providedIn: 'root'
})
export class HookService extends DxcApiService {

  HKOP:any = {
    REMOVED: 'r',
    EDITED: 'e',
    CREATED: 'c',
    ENABLED: 'se',
    DISABLED: 'sd',
  };

  options: any = {
    ft: 0,
    ff: 0,

    followThread: false,
    followFork: false,
    cache_policy: HOOKSESSION_CACHE_POLICY.STORE_SESSIONS,
    mode: "spawn-self"
  };

  socket:any = null;

  onCreateHook:Subject<any> = new Subject<any>();
  onHookEdit:Subject<HookEditEvent> = new Subject<HookEditEvent>();
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
  serverRunning = false;

  onKeyPointListChange: Subject<KeyPoint[]> = new Subject<KeyPoint[]>();

  _sessions:HookSession[] = [];
  _hooks:HookMap = {};
  _hook_kp:KeyPoint[] = [];
  _frags:Record<string, HookTemplateFragment> = {};
  _hook_map:HookMethMap = {};


  mode = "spawn-self";

  private _pollType: PollingType = PollingType.HTTP;

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
            show: { method: 'GET', url:'/hook/session/:id', format:'json', auth:false /* removed */, puid:true},
            msg: { method: 'GET', url:'/hook/events/:sid/msg', format:'json', auth:false /* removed */, puid:true},
          },
          sessions: {
            list: { method: 'GET', url:'/hook/sessions', format:'json', auth:false /* removed */, puid:true},
            //get_msg: { method: 'GET', url:'/hook/msg', format:'json', auth:false /* removed */, puid:true, window: new WebApiWindowing(0,100)},
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
        label: 'Global options',
        submenu: [
          {
            label: 'Follow thread',
            type: 'checkbox',
            name: "followThread",
            value: false,
            checked: false,
            onCheck: (vCurrVal:boolean, vItem:any)=>{

              const opt = this.getOption("followThread");
              if(vCurrVal==opt){

                // synchronized
                this.switchProperty("followThread", (vCurrVal!=true));
                vItem.value = vItem.checked = (vCurrVal!=true);
                return true;

              }else{

                // refresh first
                vItem.value = opt;
                vItem.checked = (opt==true);
                return false;
              }
            }
          },{
            label: 'Follow fork',
            type: 'checkbox',
            name: "followFork",
            value: false,
            checked: false,
            onCheck: (vCurrVal:boolean, vItem:any)=>{
              const opt = this.getOption("followFork");
              if(vCurrVal==opt){

                // synchronized
                this.switchProperty("followFork", (vCurrVal!=true));
                vItem.value = vItem.checked = (vCurrVal!=true);
                return true;

              }else{

                // refresh first
                vItem.value = opt;
                vItem.checked = (opt==true);
                return false;
              }
            }
          },{
            label: 'Record hook sessions',
            type: 'checkbox',
            name: "cache_policy",
            value: true,
            checked: true,
            onCheck: (vCurrVal:boolean, vItem:any)=>{
              if(vCurrVal==true){
                this.switchProperty("cache_policy",HOOKSESSION_CACHE_POLICY.FLUSH_SESSIONS);
                vItem.value = vItem.checked = false;
              }else{
                this.switchProperty("cache_policy",HOOKSESSION_CACHE_POLICY.STORE_SESSIONS);
                vItem.value = vItem.checked = true;
              }

              return true;
            }
          }]
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
      },{
        label: 'Attach mode',
        submenu: [
          {
            label: 'Spawn target app',
            type: 'radio',
            name: "attach_mode",
            value: "spawn-self",
            onCheck: (vVal:boolean)=>{
              this.switchToMode("spawn-self");
              return true;
            }
          },{
            label: 'Spawn custom app',
            type: 'radio',
            name: "attach_mode",
            value: "spawn-app",
            onCheck: (vVal:boolean)=>{
              this.switchToMode("spawn-app");
              return true;
            }
          },{
            label: 'Attach to gadget',
            type: 'radio',
            name: "attach_mode",
            value: "attach-gadget",
            onCheck: (vVal:boolean)=>{
              this.switchToMode("attach-gadget");
              return true;
            }
          },{
            label: 'Attach to PID ...',
            type: 'radio',
            value: "attach-pid",
            name: "attach_mode",
            onCheck: (vVal:boolean)=>{
              this.switchToMode("attach-pid");
              return true;
            }
          },{
            label: 'Attach to target app',
            type: 'radio',
            name: "attach_mode",
            value: "attach-app-self",
            onCheck: (vVal:boolean)=>{
              this.switchToMode("attach-app-self");
              return true;
            }
          },{
            label: 'Attach to app ...',
            type: 'radio',
            name: "attach_mode",
            value: "attach-app",
            onCheck: (vVal:boolean)=>{
              this.switchToMode("attach-app");
              return true;
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
        label: 'Show key points',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({item: HOOK_TARGET_TYPE.KP});
        }
      },{
        label: 'Enable/Disable all hooks',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({item: HOOK_TARGET_TYPE.KP});
        }
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
        enabled:true,
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
        enabled:true,
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
        click: ()=>{
          this.onMenuClick.next({ item:"mem-search-p"});
        }
      },{
        label: 'Search on hook triggered',
        click: ()=>{
          this.onMenuClick.next({ item:"mem-search-p"});
        }
      },{
        label: 'Memory mapping',
        click: ()=>{
          this.onMenuClick.next({ item:"mem-mapping"});
        }
      },{
        type: 'separator'
      },{
        label: 'History',
        enabled: false
      }]
    }, 4);

    this.appmenuSvc.addMenu({
      id:'comm',
      label: 'Communication',
      enabled:false,
      submenu: [{
        label: 'Monitor',
      }, {
        type: 'separator'
      }, {
        label: 'HTTP(S)',
        click: () => {
          //this.onMenuClick.next();
        }
      }, {
        label: 'NFC',
      }, {
        label: 'Bluetooth',
      }, {
        label: 'IPC / Binder',
      }, {
        label: 'TEE',
        click: ()=>{

        }
      }, {
        label: 'Android Intents',
      }]
    }, 7);

    this.initEventHandler();
  }

  getPollingType():PollingType {
      return this._pollType;
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
            title: "Frida error",
            rawText: pEvent.msg.data?.extra?.diags
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


  /**
   * To get the current value of an option
   *
   * @param pOptionName
   */
  getOption( pOptionName:string):any {
    return this.options[pOptionName];
  }


  switchProperty( pProperty:string, pValue:any = null){

      //alert("HookService switchProperty > "+pProperty+" > "+pValue);
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
          this.outputSvc.print(OutputMessage.newError({ msg:"Hook sessions cannot be lister : "+pEl.msg, src:"Hook Manager" }));
          return [];

        }

        const data:HookSession[] = []

        const project = this.projectSvc.getSelectedProject();
        pEl.data.sess.map((x:any) => {
          if(project!=null){
            const s:any = HookSession.from(project, x);
            s.__ = NodeInternalType.HOOK_SESSION;
            s.date = new Date(x.time);
            data.push(s);
          }

        })
        return data;
      }
    ));
  }

  /**
   * To get all message of the specified session
   */
  getMessageFromSession( pSessID:string, pFilter:RuntimeEventFilter = {}):Observable<RuntimeEvent<any>[]> {
    const f:Record<string, any> = {};
    let pval:any;
    for(let ppt in pFilter){
      pval = (pFilter as any)[ppt];
      if(pval!=null){
        if(Array.isArray(pval)){
          if(pval.length>0){
            f[ppt] = atob(JSON.stringify(pval));
          }
        }else if(pval!==null && pval!==undefined){
          f[ppt] = pval;
        }
      }
    }

    return this._process(
      this.endpoints['hook']['logs'],
      {
        sess: pSessID,
        ...f
      }
    ).pipe(
      map((pEl:any)=>{
          if(!pEl.success){
            this.outputSvc.print(OutputMessage.newError({ msg:"Content of the hook sessions cannot be retrieved : "+pEl.msg, src:"Hook Manager" }));
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
  getAllMessagesForNode( pTarget:ModelMethod|ModelFunction):Observable<Record<string, RuntimeEvent<any>>> {
    return this._process(
      this.endpoints['hook']['logs'],
      {
        node: (pTarget as any).__signature__,
        size:10000,
        startAt:0//pTarget.getUID()
      }
    ).pipe(
      map((pEl:any)=>{
          if(!pEl.success){
            this.outputSvc.print(OutputMessage.newError({ msg:"Content of the hook sessions cannot be retrieved : "+pEl.msg, src:"Hook Manager" }));
            return {};
          }

          const data:Record<string, RuntimeEvent<any>> = {};
          if(pEl.data!=null){
            for(let sess in pEl.data){
              data[sess] = pEl.data[sess];
            }
          }

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


  /**
   *
   *
   * deprecated ?
   * @param pScope
   * @param pOptions
   */
  listHooks(pScope:Nullable<string> = null, pOptions:any={}):Observable<any>{
    return this._process(
      this.endpoints['hook']['list'],
      pOptions
    ).pipe(
      map((pEl:any)=>{

        if(!pEl.success){
          this.outputSvc.print(OutputMessage.newError({ src: "Hook Manager", msg:pEl.msg}));
          return null;
        }else{

          // todo : return abstract hook
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
    const opts:Record<string, any> = {
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
          this.outputSvc.alert(OutputMessage.newSuccess({ msg:"Frida server has been successfully launched", src:"Hook Manager" }));
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


    /**
     *  Deprecated ?
      * @param pOptions
     * @param pSocketChannel
     */
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
            src: "Hook Manager",
            msg: "The agent script has been built successfully"
          }));
        }else{
          this.outputSvc.print( OutputMessage.newError({
            src: "Hook Manager",
            msg: pEl.msg
          }))
        }
        console.log(pEl.data);
        return pEl.data.bundle;
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
            src: "Hook Manager",
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
            src: "Hook Manager",
            msg: "Hooking sessions has started successfully"
          }));
        }else{
          this.outputSvc.print( OutputMessage.newError({
            src: "Hook Manager",
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
            src: "Hook Manager",
            msg: "Hooking sessions has started successfully"
          }));
        }else{
          this.outputSvc.print( OutputMessage.newError({
            src: "Hook Manager",
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


  private _generateSessID(pProject:DexcaliburProject, pOptions:any):string {
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


    const localID=this._generateSessID(pProject,opts);
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
     *
     * @param pSessionUID
     * @param pOffset
     * @param pSize
     */
  pollRuntimeEvent(pSessionUID:HookSessionUUID, pType:any, pOffset:number, pSize:number):Observable<DxApiResponse<RuntimeEvent<any>[]>>{
      return this._processApiRequest<RuntimeEvent<any>[]>(this.endpoints['session']['msg'] ,
          {
              startAt: pOffset, size: pSize, sid: pSessionUID
          },
          (pData:any):RuntimeEvent<any>[] =>{
              return pData.map((v:any) => {
                  return new RuntimeEvent<any>(v);
              })
          }
      );
  }


    /**
     * To start a new hook session
     * @param pProject
     * @param pOptions
     */
  startPollingHookSession(pProject:DexcaliburProject, pOptions:{ app?:string, dev?:DeviceUUID, mode?:string }):Observable<DxApiResponse<HookSession>>{

      const opts:any = {
          prj: pProject.uid,
          type: (pOptions.mode!=null ? pOptions.mode : this.mode),
          ...pOptions
      };

      // generate local session id
      const localID=this._generateSessID(pProject,opts);
      const sess: HookSession = new HookSession(
          localID, GLOBAL_ICONS['HOOKS'],
          localID, pProject,
          PollingType.HTTP /* don't init websocket channel */);

      // regisyter handler for errors
      sess.setHookErrorObservable(this.onHookError);
      // push to list of sessions
      this._sessions.push(sess);

      return this._processApiRequest<HookSession>(
          this.endpoints['hook']['start'],opts,
          (vData:any)=>{
              sess._uid = vData.sess;
              this.onNewSession.emit( sess);
              return sess;
          });
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
          if(pRes.data.hasOwnProperty('enable')) {
            pHook._enabled = pRes.data.enable;

            console.log("enableHook > ",pHook,pHook.getGUID());
            this.onHookEdit.next({
              hookID:pHook.getGUID() as string,
              hook:pHook,
              ope: (pHook._enabled? this.HKOP.ENABLED : this.HKOP.DISABLED)
            });

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

        this.onHookEdit.next({ hookID:pHook.getGUID() as string, hook:pHook, ope:this.HKOP.REMOVED })
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

  getHooksFor(pMeth: ModelMethod|ModelFunction):Observable<any> {
    if(pMeth.__==NodeInternalType.METHOD)
      return this.listHooks(null, { t:'meth', s:Utils.dxc_encodeURIparam(pMeth.signature()) });
    else
      return this.listHooks(null, { t:'func', s:Utils.dxc_encodeURIparam(pMeth.signature()) });
  }

    getHooksForRef(pRef: INodeRef):Observable<any> {
        return this.listHooks(null, {
            t: (pRef.__==NodeInternalType.METHOD ? 'meth' : 'func' ) ,
            s:Utils.dxc_encodeURIparam(pRef._uid) });
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
   * To create a template fragment instance from raw data and save it into
   * a hashmap
   *
   * @param {any} pData
   * @return {HookTemplateFragment}
   * @method
   */
  createFragment( pData:any):HookTemplateFragment {
    const o = HookTemplateFragment.fromJsonObject(pData);
    const uid = o.getUID();
    if(uid!=null) this._frags[uid] = o;
    return o;
  }

  /**
   * To create an abstract hook
   *
   * It creates also HookTemplateFragment object or pull it from
   * the cache
   *
   * @param {any} pRaw Raw data
   */
  createAbstractHook( pRaw:any):AbstractHook {
    const o:any = new AbstractHook(pRaw);
    let vFrag:any;

    ['_before','_replace','_after'].map((vPos) => {
      if(Array.isArray(o[vPos])){
        for(let i=0; i<o[vPos].length; i++){
          vFrag = o[vPos][i];
          if(this._frags[vFrag._uid]!=null){
            o[vPos][vFrag._uid] = this._frags[vFrag._uid];
          }else{
            o[vPos][vFrag._uid]  = this.createFragment(vFrag)
          }
        }
      }
    });

    o._t = "h";
    if(o.__==NodeInternalType.HOOK_NATIVE){
      o.symbol = o.func.substr(o.func.lastIndexOf(':')+1);
    }

    return o;
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
            const o:any = this.createAbstractHook(vRaw);

            console.log("Create AbstractHook > ",o);
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

  // Context Menu events

  displayCtxMenu$: Subject<ContextMenuEvent> = new Subject<ContextMenuEvent>();

  displayContextMenu(pEvent:any, pType:string, pObject:any):void {
    this.displayCtxMenu$.next({event: pEvent, type: pType, obj: pObject});
  }
}
