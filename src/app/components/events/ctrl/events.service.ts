// ts-ignore
import { Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import Hook from "../../../models/Hook";
import {DxcApiService} from "../../../base/DxcApiService";
import {AppMenuService} from "../../../base/appmenu/app-menu.service";
import {OutputService} from "../../output/ctrl/output.service";
import {ProjectService} from "../../project/ctrl/project.service";
import {AbstractHook} from "../../../models/AbstractHook";
import {Nullable} from "../../../base/Nullable";
import {ContextMenuEvent} from "../../../base/context-menu/context-menu.component";
import {RuntimeEvent, RuntimeEventType} from "../../../models/hook/RuntimeEvent";
import {map} from "rxjs/operators";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {RuntimeSessionUUID} from "../../../models/RuntimeSession";
import {DxApiResponse} from "../../../base/common/common";

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


// ts-ignore
@Injectable({
  providedIn: 'root'
})
export class RuntimeEventsService extends DxcApiService {



  socket:any = null;

  onMenuClick:Subject<any> = new Subject<any>();



  constructor( private appmenuSvc:AppMenuService,
               public outputSvc:OutputService,
               private projectSvc:ProjectService,
               protected override _http:HttpClient) {
    super(
      {
          events: {
            list: { method: 'GET', url:'/hook/list', format:'json', auth:false /* removed */, puid:true},
          },
        },_http, outputSvc
      );


    this.initEventHandler();
  }


  initEventHandler():void {
    this.projectSvc.onMenuClick.subscribe( (pEvent: any) => {
      switch(pEvent.item){
        case "show-events":
          //this.updateHookLibs().subscribe();
          break;
        /*case "new-custom-hook":
          this.showModal("gsettings");
          break;
        case "new-scratch-hook":
          this.showModal("gsettings");
          break;*/
      }
    });

  }


  // Context Menu events

  displayCtxMenu$: Subject<ContextMenuEvent> = new Subject<ContextMenuEvent>();

  displayContextMenu(pEvent:any, pType:string, pObject:any):void {
    this.displayCtxMenu$.next({event: pEvent, type: pType, obj: pObject});
  }

  // services

  listEvents(pSess:RuntimeSessionUUID, pType: RuntimeEventType, pOffset:number, pSize:number)
      :Observable<DxApiResponse<RuntimeEvent<any>[]>> {
    return this._processApiRequest(
        this.endpoints['events']['list'],{
            type:pType,
            sess:pSess,
            offset: pOffset,
            size: pSize
        },(pEl:any)=>{
            if(pEl.success){
                return pEl.data.map((e:any) => new RuntimeEvent(e)); //DeviceProfile.fromJsonObject(pEl.data);
            }else{
                this.outputSvc.print( OutputMessage.newError({
                    src: "Runtime Events",
                    msg: pEl.msg
                }));
                return [];
            }
        }
    );
  }
}
