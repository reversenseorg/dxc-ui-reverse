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
import {AbstractHook} from "../../../models/AbstractHook";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {OutputService} from "../../output/ctrl/output.service";
import {Nullable} from "../../../base/Nullable";
import {ContextMenuEvent} from "../../../base/context-menu/context-menu.component";
import InspectorFactory from "../../../models/InspectorFactory";


export interface InspectorInfo {
    state: Inspector,
    plugin: InspectorFactory
}

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
        showEnabled: { method:'GET', url:'/plugin/inspectors/:uid', format:'json', puid:true},
        show: { method:'GET', url:'/plugin/inspectors/:uid', format:'json'},
        state: { method:'GET', url:'/plugin/inspector/state', format:'json', puid:true},
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
  getAll(pForceRefresh=false):Observable<Inspector[]>{;
    if(this.needRefresh||pForceRefresh){
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

    /**
     *
     * @param pId
     */
  getInspectorByID( pId:string):Observable<Nullable<Inspector>>{

    return this._process(
            this.endpoints['inspector']['showEnabled'],
        { uid: pId }
        )
        .pipe(
      map( (vRes:any) => {
          if(vRes.success){
              return new Inspector(vRes.data);
          }else{
              return null;
          }
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

    getInspectorState( pId:string):Observable<Nullable<Inspector>>{

        return this._process(
            this.endpoints['inspector']['state'],
            { insp: pId }
        )
            .pipe(
                map( (vRes:any) => {
                    if(vRes.success){
                        let insp = new Inspector(vRes.data.state);
                        return insp;
                    }else{
                        return null;
                    }
                })
            );
    }



    getInspectorPlugin( pId:string):Observable<Nullable<InspectorInfo>>{

        return this._process(
            this.endpoints['inspector']['state'],
            { insp: pId }
        )
            .pipe(
                map( (vRes:any) => {
                    if(vRes.success){
                        return {
                            plugin: new InspectorFactory(vRes.data.plugin),
                            state: new Inspector(vRes.data.state)
                        };
                    }else{
                        return null;
                    }
                })
            );
    }

  getHooksFrom( pInsp:Inspector):Observable<AbstractHook[]>{
    return this._process(this.endpoints['hook']['byInspector'],{
        uid: pInsp.id
    }).pipe(
        map((vObs)=>{

          if(!vObs.success){
            this.outputSvc.print(OutputMessage.newError({/*type:"Hook Manager",*/ msg:vObs.msg}));
            return [];
          }else{
            return vObs.data;
          }
        })
      );
  }


    // Context Menu events

    displayCtxMenu$: Subject<ContextMenuEvent> = new Subject<ContextMenuEvent>();

    displayContextMenu(pEvent:any, pType:string, pObject:any):void {
        this.displayCtxMenu$.next({event: pEvent, type: pType, obj: pObject});
    }
}
