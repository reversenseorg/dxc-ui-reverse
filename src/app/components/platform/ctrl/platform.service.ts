import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import {OutputMessage} from "../../../cmp/OutputMessage";
import {OutputService} from "../../output/ctrl/output.service";
import {HttpClient} from "@angular/common/http";
import {DxcApiService} from "../../../base/DxcApiService";
import Platform from "../../../models/Platform";
import {map} from "rxjs/operators";

export interface PlatformSet {
  installed: Platform[],
  remote: Platform[]
}

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

  list():Observable<PlatformSet> {

    return this._process(
      this.endpoints['main']['list']
    ).pipe(map((pRes:any) => {
      const all:PlatformSet = {
        installed: [],
        remote: []
      };

      if(!pRes.success){
        this.outputSvc.print( OutputMessage.newError({ msg:pRes.msg, src:"Platform Manager" }));
        return all;
      }else{
        this._cache = [];
        let plt:Platform;

        for(const i in pRes.data.platforms.installed){
          if(pRes.data.platforms.installed[i].stub === true){ continue; }
          plt = new Platform( pRes.data.platforms.installed[i]);
          all.installed.push(plt);
          this._cache.push(plt);
        }
        for(const i in pRes.data.platforms.remote){
          if(pRes.data.platforms.remote[i].stub === true){ continue; }
          plt = new Platform( pRes.data.platforms.remote[i]);
          all.remote.push(plt);
          this._cache.push(plt);
        }

        return all;
      }
    }))
  }


  install(pUID:string):Observable<boolean> {
    return this._process(
      this.endpoints['main']['install'],
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

