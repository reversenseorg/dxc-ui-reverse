import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {from, Observable, Subject, throwError} from 'rxjs';
import {catchError, map, retry, take} from 'rxjs/operators';
import {CODE_SUBVIEW} from "../../code/explorer-code/explorer-code.const";
import {CodeItem} from "../../code/explorer-code/CodeItem";
import {DxcApiService} from "../../../base/DxcApiService";
import {Inspector} from "../../../models/Inspector";
import {OutputService} from "../../output/ctrl/output.service";
import ModelMethod from "../../../models/ModelMethod";
import {Utils} from "../../../cmp/Utils";
import {OutputMessage} from "../../../cmp/OutputMessage";


// @ts-ignore
/**
 * Use this service to interact with inspectors
 *
 * @class
 * @since 1.0.0
 * @author Georges-Bastien MICHEL
 */
@Injectable({
  providedIn: 'root'
})
export class DeobfuscationService extends DxcApiService {


  constructor(protected http:HttpClient, private outputSvc:OutputService) {
    super({
      action: {
        nop_count: { method:'GET', url:'/plugin/BytecodeCleaner/nop_count', format:'json', auth:true, puid:true },
        nop_clean: { method:'GET', url:'/plugin/BytecodeCleaner/nop_clean', format:'json', auth:true, puid:true },
        wrap_clean: { method:'GET', url:'/plugin/BytecodeCleaner/wrap_clean', format:'json', auth:true, puid:true },
      }
    },http, outputSvc)
  }



  doNOPCount( pMethod:ModelMethod|string = null):Observable<any> {
    let opts:any = {};

    // iff mot null or undefined
    if(pMethod!=null){
      if(typeof pMethod==='string')
        opts.meth = Utils.dxc_encodeURIparam(pMethod);
      else
        opts.meth = Utils.dxc_encodeURIparam(pMethod.__signature__);
    }


      return this._process(
        this.endpoints.action.nop_count, opts
      ).pipe(map((pRes:any)=>{
        if(pRes.success===false){
          this.outputSvc.print(OutputMessage.newError({ msg:"[NOP Count] An error occured. See server logs for more details.", src:"Deobfuscation Svc" }))
        }else{
          return pRes.data;
        }
      }));
  }

  doNOPClean( pMethod:ModelMethod|string = null):Observable<any> {
    let opts:any = {};

    // iff mot null or undefined
    if(pMethod!=null){
      if(typeof pMethod==='string')
        opts.meth = Utils.dxc_encodeURIparam(pMethod);
      else
        opts.meth = pMethod.__signature__;
    }

    return this._process(
      this.endpoints.action.nop_clean, opts
    ).pipe(map((pRes:any)=>{
      if(pRes.success===false){
        this.outputSvc.print(OutputMessage.newError({ msg:"[NOP Cleaner] An error occured. See server logs for more details.", src:"Deobfuscation Svc" }))
      }else{
        return pRes.data;
      }
    }));
  }


  doAutoRename( pMethod:ModelMethod|string = null):Observable<any> {
    let opts:any = {};

    // iff mot null or undefined
    if(pMethod!=null){
      if(typeof pMethod==='string')
        opts.meth = Utils.dxc_encodeURIparam(pMethod);
      else
        opts.meth = pMethod.__signature__;
    }

    return this._process(
      this.endpoints.action.wrap_clean,
      opts
    ).pipe(map((pRes:any)=>{
      if(pRes.success===false){
        this.outputSvc.print(OutputMessage.newError({ msg:"[Auto rename] An error occured. See server logs for more details.", src:"Deobfuscation Svc" }))
      }else{
        return pRes.data;
      }
    }));
  }
}
