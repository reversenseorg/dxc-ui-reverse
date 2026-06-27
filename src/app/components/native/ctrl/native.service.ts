


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


// @ts-ignore
import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {DxcApiService} from "../../../base/DxcApiService";
import {AppMenuService} from "../../../base/appmenu/app-menu.service";
import {OutputService} from "../../output/ctrl/output.service";
import ModelFile from "../../../models/ModelFile";
import {ModelFunction} from "../../../models/ModelFunction";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {Nullable} from "../../../base/Nullable";
import {NodeInternalType} from "../../../models/NodeInternalType";
import ModelCpuInstruction from "../../../models/ModelCpuInstruction";


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class NativeService extends DxcApiService {

  private commands:any = {
    discover_lib: "sections:f_list"
  }

  private _ctxMenu:Record<string, any> = {};

  onNewXrefSearch: EventEmitter<any> = new EventEmitter<any>();

  constructor( private appmenuSvc:AppMenuService,
               private outputSvc:OutputService,
               protected override _http:HttpClient) {
    super(
      {
          list: {
            sections: { method: 'POST', url:'/probe/server/start', format:'json', auth:false /* removed */, puid:true },
            funcs: { method: 'GET', url:'/native/func', format:'json', auth:false /* removed */, puid:true },
            syscalls: { method: 'GET', url:'/native/search/s_svc', format:'json', auth:false /* removed */, puid:true },
            imports: { method: 'GET', url:'/probe/server/status', format:'json', auth:false /* removed */, puid:true },
          },
          get: {
            sections: { method: 'POST', url:'/native/sections', format:'json', auth:false /* removed */, puid:true },
            func: {method: 'GET', url:'/native/func', format:'json', auth:false /* removed */, puid:true  },
            disass_func: {method: 'GET', url:'/native/disass/func', format:'json', auth:false /* removed */, puid:true  },
            analyze: { method: 'GET', url:'/native/analysis', format:'json', auth:false /* removed */, puid:true },
            imports: { method: 'GET', url:'/native/imports', format:'json', auth:false /* removed */, puid:true },
          },
          func: {
              decomp:  { method: 'POST', url:'/native/funcs/decompile', format:'json', auth:false /* removed */, puid:true },
              xref:  { method: 'POST', url:'/native/funcs/xref', format:'json', auth:false /* removed */, puid:true },
              emu:  { method: 'POST', url:'/native/emulate/create', format:'json', auth:false /* removed */, puid:true },
          },
          do: {
            file_anal: { method:'POST', url:'/native/analyze/file', format:'json', auth:false /* removed */, puid:true }
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

  disass(pFn:string):Observable<ModelCpuInstruction[]>{
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
          this.outputSvc.print(OutputMessage.newError({ msg: pEl.msg }));
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
  startFileAnalysis(pFile:ModelFile, pCommands:Nullable<string>=null):Observable<any> {

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

    listSyscalls(pFileUid:string):Observable<any> {
        return this._process(
            this.endpoints['list']['syscalls'],
            {
                uid: pFileUid
            }
        ).pipe(
            map((pEl:any)=>{

                if(pEl.success){
                    return pEl.data;
                }else{
                    this.outputSvc.print(OutputMessage.newError({
                        src:'Native Analyzer',
                        msg: 'Cannot extract syscalls from file "'+pFileUid+'" Cause : "'+pEl.msg
                    }))
                }

            })
        );
    }

    decompile(pFuncID:string, pOptions:any = {engine:"default"}):Observable<any> {
        return this._process(
            this.endpoints['func']['decomp'],
            {
                uid: pFuncID,
                options: pOptions
            }
        ).pipe(
            map((pEl:any)=>{

                if(pEl.success){
                    return pEl.data.dec;
                }else{
                    this.outputSvc.print(OutputMessage.newError({
                        src:'Native Analyzer',
                        msg: 'Cannot decompile function "'+pFuncID+'" Cause : "'+pEl.msg
                    }))
                }

            })
        );
    }

    listXref(pFuncID:string):Observable<any> {
        return this._process(
            this.endpoints['func']['xref'],
            {
                uid: pFuncID
            }
        ).pipe(
            map((pEl:any)=>{

                if(pEl.success){
                    return pEl.data;
                }else{
                    this.outputSvc.print(OutputMessage.newError({
                        src:'Native Analyzer',
                        msg: 'Cannot extract xref from func "'+pFuncID+'" Cause : "'+pEl.msg
                    }))
                }

            })
        );
    }

    emulate(pFuncID: string) {
        return this._process(
            this.endpoints['func']['emu'],
            {
                uid: pFuncID,
                type: NodeInternalType.FUNC
            }
        ).pipe(
            map((pEl:any)=>{

                if(pEl.success){
                    return pEl.data;
                }else{
                    this.outputSvc.print(OutputMessage.newError({
                        src:'Native Analyzer',
                        msg: 'Cannot emulate func "'+pFuncID+'" Cause : "'+pEl.msg
                    }))
                }

            })
        );
    }
}
