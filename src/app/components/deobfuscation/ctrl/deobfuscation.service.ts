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
import {Nullable} from "../../../base/Nullable";


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
        nop_count: { method:'GET', url:'/plugin/BytecodeCleaner/nop_count', format:'json', auth:false /* removed */, puid:true },
        nop_clean: { method:'GET', url:'/plugin/BytecodeCleaner/nop_clean', format:'json', auth:false /* removed */, puid:true },
        wrap_clean: { method:'GET', url:'/plugin/BytecodeCleaner/wrap_clean', format:'json', auth:false /* removed */, puid:true },
      }
    },http, outputSvc)
  }



  doNOPCount( pMethod:Nullable<ModelMethod|string> = null):Observable<any> {
    let opts:any = {};

    // iff mot null or undefined
    if(pMethod!=null){
      if(typeof pMethod==='string')
        opts.meth = Utils.dxc_encodeURIparam(pMethod);
      else if(pMethod.__signature__!=null)
        opts.meth = Utils.dxc_encodeURIparam(pMethod.__signature__);
    }


      return this._process(
        this.endpoints['action']['nop_count'], opts
      ).pipe(map((pRes:any)=>{
        if(pRes.success===false){
          this.outputSvc.print(OutputMessage.newError({ msg:"[NOP Count] An error occured. See server logs for more details.", src:"Deobfuscation Svc" }))
        }else{
          return pRes.data;
        }
      }));
  }

  doNOPClean( pMethod:Nullable<ModelMethod|string> = null):Observable<any> {
    let opts:any = {};

    // iff mot null or undefined
    if(pMethod!=null){
      if(typeof pMethod==='string')
        opts.meth = Utils.dxc_encodeURIparam(pMethod);
      else
        opts.meth = pMethod.__signature__;
    }

    return this._process(
      this.endpoints['action']['nop_clean'], opts
    ).pipe(map((pRes:any)=>{
      if(pRes.success===false){
        this.outputSvc.print(OutputMessage.newError({ msg:"[NOP Cleaner] An error occured. See server logs for more details.", src:"Deobfuscation Svc" }))
      }else{
        return pRes.data;
      }
    }));
  }


  doAutoRename( pMethod:Nullable<ModelMethod|string> = null):Observable<any> {
    let opts:any = {};

    // iff mot null or undefined
    if(pMethod!=null){
      if(typeof pMethod==='string')
        opts.meth = Utils.dxc_encodeURIparam(pMethod);
      else
        opts.meth = pMethod.__signature__;
    }

    return this._process(
      this.endpoints['action']['wrap_clean'],
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
