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
import {HookService} from "../../hooks/ctrl/hook.service";


// ts-ignore
@Injectable({
  providedIn: 'root'
})
export class MemoryService extends DxcApiService {



  socket:any = null;

  onMenuClick:Subject<any> = new Subject<any>();



  constructor( private appmenuSvc:AppMenuService,
               public outputSvc:OutputService,
               private hookSvc:HookService,
               protected override _http:HttpClient) {
    super(
      {
          mem: {
            list_regions: { method: 'GET', url:'/mem/regions', format:'json', auth:false /* removed */, puid:true},
          },
        },_http, outputSvc
      );


    this.initEventHandler();
  }


  initEventHandler():void {
    this.hookSvc.onMenuClick.subscribe( (pEvent: any) => {
      switch(pEvent.item){
        case "mem-mapping-self":
          // to show memory regions of the proces
          break;
        case "mem-mapping-pid":
          // to show memory regions from a pid
          break;
      }
    });
  }


  // Context Menu events

  displayCtxMenu$: Subject<ContextMenuEvent> = new Subject<ContextMenuEvent>();

  displayContextMenu(pEvent:any, pType:string, pObject:any):void {
    this.displayCtxMenu$.next({event: pEvent, type: pType, obj: pObject});
  }

  // services

  listEvents(pType: RuntimeEventType):Observable<RuntimeEvent<any>> {
    return this._process(
        this.endpoints['events']['list'],{
          type:pType
        }
    ).pipe(
        map((pEl:any)=>{
          console.log(pEl);
          if(pEl.success){
            return pEl.data; //DeviceProfile.fromJsonObject(pEl.data);
          }else{
            this.outputSvc.print( OutputMessage.newError({
              src: "Runtime Events",
              msg: pEl.msg
            }));
          }
        })
    );
  }
}
