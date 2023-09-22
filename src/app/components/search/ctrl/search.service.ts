import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {DxcApiService} from "../../../base/DxcApiService";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {AppMenuService} from "../../../core/components/appmenu/appmenu.service";


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class SearchService extends DxcApiService {

  //activeProject:DexcaliburProject[] = [];

  //onSearchReady:Subject<DexcaliburProject> = new Subject<DexcaliburProject>();
  //onProjectOpening:Subject<DexcaliburProject> = new Subject<DexcaliburProject>();

  constructor( private appmenuSvc:AppMenuService, protected _http:HttpClient) {
    super(
      {
        find: {
          raw: {
            method:'GET', url:'/code/finder', format: 'json', auth:true, puid:true
          }
        }
      },_http
    );
  }

  executeRaw( pRequest:string, pResultType:string='' ):Observable<any> {
    console.log("[SEARCH] Request : "+pRequest);
    return this._process(

      this.endpoints.find.raw,{
        search: encodeURIComponent(btoa(encodeURIComponent(pRequest))),
        type: (pResultType!==null ? pResultType : '')
      }
    );
  }
}

