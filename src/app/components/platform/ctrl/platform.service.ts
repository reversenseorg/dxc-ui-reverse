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

