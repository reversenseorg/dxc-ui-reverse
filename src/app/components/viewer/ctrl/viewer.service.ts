import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {DxcApiService} from "../../../base/DxcApiService";
import {AppMenuService} from "../../../core/components/appmenu/appmenu.service";



// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class ViewerService extends DxcApiService {

  //activeProject:DexcaliburProject[] = [];

  //onSearchReady:Subject<DexcaliburProject> = new Subject<DexcaliburProject>();
  //onProjectOpening:Subject<DexcaliburProject> = new Subject<DexcaliburProject>();

  constructor( private appmenuSvc:AppMenuService, protected _http:HttpClient) {
    super(
      {
        file: {
          open: { method:'GET', url:'/android/activities', format: 'json' },
          save: { method:'GET', url:'/android/services', format: 'json' }
        }
      },_http
    );
  }


  openFile():Observable<any> {
    return this._process(
      this.endpoints.file.open
    ).pipe(map((pObs)=>{
      return pObs.data;
    }));
  }


  saveFile():Observable<any> {
    return this._process(
      this.endpoints.file.save
    ).pipe(map((pObs)=>{
      return pObs.data;
    }));
  }
}

