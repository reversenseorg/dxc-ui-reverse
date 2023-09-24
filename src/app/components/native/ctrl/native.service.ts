


// @ts-ignore
import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {DxcApiService} from "../../../base/DxcApiService";
import {AppMenuService} from "../../../core/components/appmenu/appmenu.service";
import {OutputService} from "../../output/ctrl/output.service";
import ModelFile from "../../../models/ModelFile";
import {ModelFunction} from "../../../models/ModelFunction";
import {OutputMessage} from "../../../cmp/OutputMessage";


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class NativeService extends DxcApiService {

  private commands:any = {
    discover_lib: "sections:f_list"
  }

  onNewXrefSearch: EventEmitter<any> = new EventEmitter<any>();

  constructor( private appmenuSvc:AppMenuService,
               private outputSvc:OutputService,
               protected _http:HttpClient) {
    super(
      {
          list: {
            sections: { method: 'POST', url:'/probe/server/start', format:'json', auth:true, puid:true },
            funcs: { method: 'GET', url:'/native/func', format:'json', auth:true, puid:true },
            imports: { method: 'GET', url:'/probe/server/status', format:'json', auth:true, puid:true },
          },
          get: {
            sections: { method: 'POST', url:'/native/sections', format:'json', auth:true, puid:true },
            func: {method: 'GET', url:'/native/func', format:'json', auth:true, puid:true  },
            disass_func: {method: 'GET', url:'/native/disass/func', format:'json', auth:true, puid:true  },
            analyze: { method: 'GET', url:'/native/analysis', format:'json', auth:true, puid:true },
            imports: { method: 'GET', url:'/native/imports', format:'json', auth:true, puid:true },
          },
          do: {
            file_anal: { method:'POST', url:'/native/analyze/file', format:'json', auth:true, puid:true }
          }
        },_http, outputSvc
      );



  }

  getFunction(pId:string):Observable<ModelFunction>{
    return this._process(
      this.endpoints['get']['func'],
      {
        uid: pId
      }
    ).pipe(
      map((pEl:any)=>{

        console.log("Native imports : ",pEl);
        return pEl;
      })
    );
  }

  disass(pFn:string):Observable<ModelFunction>{
    return this._process(
      this.endpoints['get']['disass_func'],
      {
        uid: pFn
      }
    ).pipe(
      map((pEl:any)=>{

        if(pEl.success){
          return pEl.data;
        }else{
          // Output message
          this.outputSvc.print(OutputMessage.newError(pEl.msg));
          return null;
        }
      })
    );
  }

  listImports(pFile:ModelFile):Observable<any>{
    return this._process(
      this.endpoints['list']['imports'],
      {
        uid: pFile.getUID()
      }
    ).pipe(
      map((pEl:any)=>{

        console.log("Native imports : ",pEl);
        return pEl;
      })
    );
  }

  /**
   * To trigger native analysis of a file
   *
   * @param pFile
   */
  startFileAnalysis(pFile:ModelFile, pCommands:string=null):Observable<any> {

    const cmd = pCommands==null? this.commands.discover_lib : pCommands;

    return this._process(
      this.endpoints['do']['file_anal'],
      {
        uid: pFile._uid,
        cmd: cmd
      }
    ).pipe(
      map((pEl:any)=>{

        if(pEl.success){
          return pEl.data;
        }else{
          this.outputSvc.print(OutputMessage.newError({
            src:'Native Analyzer',
            msg: 'Analysis of file "'+pFile.name+"' failed. "+pEl.msg
          }))
        }

      })
    );
  }

}
