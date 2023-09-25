import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {AppMenuService} from "../../../core/components/appmenu/appmenu.service";
import {DxcApiService} from "../../../base/DxcApiService";
import {map} from "rxjs/operators";
import ModelFile from "../../../models/ModelFile";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {ContextMenuEvent} from "../../code/ctrl/code-controller.service";
import {Nullable} from "../../../base/Nullable";


/**
 * Represent web service to request server FS and device FS
 */
@Injectable({
  providedIn: 'root'
})
export class FilesystemService extends DxcApiService{


  displayCtxMenu$:Subject<ContextMenuEvent> = new Subject<ContextMenuEvent>();

  constructor( private outputSvc:OutputService, protected override _http:HttpClient) {

      super({
        list: {
          dev: { method: 'GET', url:'/device/fs/list', format:'json',  puid:false, auth:false },
          devData: { method: 'GET', url:'/device/fs/list', format:'json',  puid:true, auth:true },
          //app: { method: 'GET', url:'/device/fs/list', format:'json', puid:true, auth:true},
          pkg: { method: 'GET', url:'/application/package/content', format:'json', puid:true, auth:true },
          ws: { method: 'POST', url:'/project/ws', format:'json', puid:true, auth:true },
        },
        view: {
          file: {method:'GET', url:'/file/view', format:'json', puid:true, auth:true },
        }
      }, _http, outputSvc);
  }

  /**
   * To create a list of ModelFile instance from raw data
   * @param pData
   * @private
   */
  private _createFileList(pData:any):ModelFile[] {
    const list:ModelFile[] = [];

    pData.map( (vData:any)=>{
      list.push(new ModelFile(vData));
    });

    return list;
  }


  /**
   * To display a contextual menu defined by FS components
   *
   * It is mainly used as a callback for `FilesystemService.displayCtxMenu$` event pipe
   *
   * @param {MouseEvent} pEvent Mouse event fired
   * @param {string} pType Contextual menu name
   * @param {any} pObject Options
   * @method
   */
  displayContextMenu(pEvent:any, pType:string, pObject:any):void {
    this.displayCtxMenu$.next({event: pEvent, type: pType, obj: pObject});
  }

  listDevicePath( pOptions:any = {}):Observable<any[]> {
    return this._process(
      (pOptions.app!=null ? this.endpoints['list']['devData'] : this.endpoints['list']['dev']),
      pOptions
    ).pipe(
      map((pObs)=>{
        if(pObs.success){
          return this._createFileList(pObs.data);
        }else{
          this.outputSvc.print( OutputMessage.newError({msg:pObs.msg}))
          return [];
        }
      })
    );
  }

  /*
  listAppPath( pOptions = null):Observable<any[]> {
    return this._process(
      this.endpoints['list']['app'],
      pOptions
    ).pipe(
      map((pObs)=>{
        if(pObs.success){
          return this._createFileList(pObs.data);
        }else{
          this.outputSvc.print( OutputMessage.newError({msg:pObs.msg}))
          return null;
        }
      })
    );
  }
  */

  listWorkspace( pPath:string = "", pOptions = null):Observable<any[]> {
    return this._process(
      this.endpoints['list']['ws'],
      {
        path: pPath
      }
    ).pipe(
      map((pObs)=>{
        if(pObs.success){
          return pObs.data;
        }else{
          this.outputSvc.print( OutputMessage.newError({msg:pObs.msg}))
          return null;
        }
      })
    );
  }

  listPackageContent( pPath:string = "", pOptions = null):Observable<any[]> {
    return this._process(
      this.endpoints['list']['pkg'],
      {
        path: pPath
      }
    ).pipe(
      map((pObs)=>{
        if(pObs.success){
          return pObs.data;
        }else{
          this.outputSvc.print( OutputMessage.newError({msg:pObs.msg}))
          return null;
        }
      })
    );
  }


  viewNativeFileContent( pRpath:string, pScope:string):Observable<Nullable<ModelFile>> {
    return this._process(
      this.endpoints['view']['file'],
      {
        path: pRpath,
        scope: pScope,
        uid: -1
      }
    ).pipe(
      map((pObs)=>{
        if(pObs.success){
          return new ModelFile(pObs.data); //pObs.data;
        }else{
          this.outputSvc.print( OutputMessage.newError({msg:pObs.msg}))
          return null;
        }
      })
    );
  }

  viewFileContent( pUID:string, pOptions = null):Observable<Nullable<ModelFile>> {
    return this._process(
      this.endpoints['view']['file'],
      {
        uid: pUID
      }
    ).pipe(
      map((pObs)=>{
        if(pObs.success){
          return new ModelFile(pObs.data); //pObs.data;
        }else{
          this.outputSvc.print( OutputMessage.newError({msg:pObs.msg}))
          return null;
        }
      })
    );
  }
}
