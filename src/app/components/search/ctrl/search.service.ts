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

import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {DxcApiService} from "../../../base/DxcApiService";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {AppMenuService} from "../../../base/appmenu/app-menu.service";
import ModelFile from "../../../models/ModelFile";


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class SearchService extends DxcApiService {

  //activeProject:DexcaliburProject[] = [];

  //onSearchReady:Subject<DexcaliburProject> = new Subject<DexcaliburProject>();
  //onProjectOpening:Subject<DexcaliburProject> = new Subject<DexcaliburProject>();

  constructor( private appmenuSvc:AppMenuService, protected override _http:HttpClient) {
    super(
      {
        find: {
          raw: {
            method:'GET', url:'/code/finder', format: 'json', auth:false /* removed */, puid:true
          }
        }
      },_http
    );
  }


  executeRaw( pRequest:string, pResultType:string='' ):Observable<any> {
    console.log("[SEARCH] Request : "+pRequest);
    return this._process(

      this.endpoints['find']['raw'],{
        search: encodeURIComponent(btoa(encodeURIComponent(pRequest))),
        type: (pResultType!==null ? pResultType : '')
      }
    );
  }
}

