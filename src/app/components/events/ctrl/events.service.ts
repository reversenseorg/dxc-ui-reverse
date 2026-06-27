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
import {RuntimeSession, RuntimeSessionUUID} from "../../../models/RuntimeSession";
import {DxApiResponse} from "../../../base/common/common";
import {DexcaliburProjectUUID} from "../../../models/DexcaliburProject";

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
            list: { method: 'GET', url:'/runtime/events/list', format:'json', auth:false /* removed */, puid:true},
          },
          sessions: {
              list: { method: 'GET', url:'/runtime/sessions/list', format:'json', auth:false /* removed */, puid:true},
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

    listSessions(pPrj:Nullable<DexcaliburProjectUUID> = null)
        :Observable<DxApiResponse<RuntimeSession[]>> {

        const opts:any = {};
        if(pPrj != null) opts.prj = pPrj;

        return this._processApiRequest(this.endpoints['sessions']['list'],opts,(pData:any)=>{
            return pData.map((e:any) => new RuntimeSession(e));
        });
    }
}
