import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {from, Observable, Subject, throwError} from 'rxjs';
import {catchError, map, retry, take} from 'rxjs/operators';
import {CODE_SUBVIEW} from "../../code/explorer-code/explorer-code.const";
import {CodeItem} from "../../code/explorer-code/CodeItem";
import {DxcApiService} from "../../../base/DxcApiService";
import {Inspector} from "../../../models/Inspector";
import {AbstractHook} from "../../../models/AbstractHook";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {OutputService} from "../../output/ctrl/output.service";
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
export class InspectorService extends DxcApiService {

  private _cache: Inspector[] = [];
  private needRefresh = true;

  constructor( protected http:HttpClient, protected outputSvc:OutputService) {
    super({
      inspector: {
        list: { method:'GET', url:'/plugin/inspector/list', format:'json', auth:false /* removed */, puid:true},
        show: { method:'GET', url:'/plugin/inspectors/:uid', format:'json'}
      },
      hook: {
        byInspector: { method:'GET', url:'/hook/getBy/inspector', format:'json', auth:false /* removed */, puid:true},
      }
    },http,outputSvc)
  }

  /**
   * To get all inspectors
   *
   * @returns {Observable<Inspector[]>}
   * @method
   * @since v1.0.0
   */
  getAll():Observable<Inspector[]>{;
    if(this.needRefresh){
      this._cache = [];
      return this
        ._process(this.endpoints['inspector']['list'])
        .pipe(
          map((vObs)=>{
            console.log(vObs);
            vObs.data.map((vInsp:any) => {             this._cache.push(new Inspector(vInsp));
            });
            this.needRefresh = false;
            return this._cache;
          })
        );
    }else {
      let o: Observable<Inspector[]> = from([this._cache]);
      return o;
    }
  }

  getInspectorByID( pId:string):Observable<Nullable<Inspector>>{
    return this.getAll().pipe(
      map( vInsp => {
        console.log(vInsp);
        let o: Nullable<Inspector> = null;
        vInsp.map(x => {
          if(x.id == pId) o=x;
        });
        return o;
      })
    );
  }

  getInspector( pInsp:Inspector):Observable<Nullable<Inspector>>{
    return this.getAll().pipe(
      map( vInsp => {
        let o: Nullable<Inspector> = null;
        vInsp.map(x => {
          if(x.id == pInsp.id) o=x;
        });
        return o;
      })
    );
  }

  getHooksFrom( pInsp:Inspector):Observable<AbstractHook[]>{
    return this._process(this.endpoints['hook']['byInspector'],{
        uid: pInsp.id
    }).pipe(
        map((vObs)=>{

          if(!vObs.success){
            this.outputSvc.print(OutputMessage.newError({ type:"Hook Manager", msg:vObs.msg}));
            return [];
          }else{
            return vObs.data;
          }
        })
      );
  }
}
