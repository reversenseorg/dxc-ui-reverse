import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import {OutputMessage} from "../../../cmp/OutputMessage";
import {OutputService} from "../../output/ctrl/output.service";
import {HttpClient} from "@angular/common/http";
import {DxcApiService} from "../../../base/DxcApiService";
import Platform from "../../../models/Platform";
import {map} from "rxjs/operators";


// @ts-ignore
/**
 * Use this service to interact with platform manager
 *
 * @class
 * @since 1.0.0
 * @author Georges-Bastien MICHEL
 */
@Injectable({
  providedIn: 'root'
})
export class PlatformService extends DxcApiService{

  private _cache:Platform[] = [];

  constructor( private outputSvc:OutputService, _http:HttpClient) {
    super(
      {
        main: {
          list: { method: 'GET', url:'/platform/list', format:'json'},
          install: { method: 'POST', url:'/platform/install', format:'json'}
        }
      },_http, outputSvc
    );
  }

  list():Observable<Platform[]> {

    return this._process(
      this.endpoints.main.list
    ).pipe(map((pRes:any) => {
      if(!pRes.success){
        this.outputSvc.print( OutputMessage.newError({ msg:pRes.msg, src:"Platform Manager" }));
      }else{
        this._cache = []
        for(const i in pRes.data.platforms){
          this._cache.push(new Platform( pRes.data.platforms[i]));
        }
        return this._cache;
      }
    }))
  }


  install(pUID:string):Observable<boolean> {
    return this._process(
      this.endpoints.main.install,
      { uid:pUID }
    ).pipe(map((pRes:any) => {
      if(!pRes.success){
        this.outputSvc.print( OutputMessage.newError({ msg:pRes.msg, src:"Platform Manager" }));
        return false;
      }else{
        return true;
      }
    }))
  }
}

