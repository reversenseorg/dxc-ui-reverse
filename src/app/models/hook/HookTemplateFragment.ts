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

import { NodeInternalType } from "../NodeInternalType";
import HookStrategy from "./HookStrategy";
import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";
import {Metadata} from "../audit/common/Metadata";


export default class HookTemplateFragment {

    __:NodeInternalType = NodeInternalType.HOOK_FRAGMENT;

     _uid:Nullable<string> = null;

     name:Nullable<string> = null;

     descr:Nullable<string> = null;

     _strategy: any = null;

     _descr:Nullable<string> = null;

     _tpl: Nullable<string> = null;

     _w = -1;

     _cache:Nullable<string> = null;

     _preproc = true;

     _keypoint:Nullable<string> = null;





    public autoEmit = false;

    public emitEvent:Nullable<string> = null;

    public removed = false;

    public deprecated = false;

    metadata:Metadata[] = [];

    tags:number[] = [];

    /**
     * Group of hook
     *
     * @param {*} config
     */
    constructor(pConfig:any=null){

        // this.requiresNode = [];
        if(pConfig!=null)
            for(let i in pConfig)
                (this as IStringIndex<any>)[i] = pConfig[i];


    }


    setUID(pUID:string){
      this._uid = pUID;
    }

    getUID():Nullable<string> {
      return this._uid;
    }

    set description(pDescr:string) {
        this._descr = pDescr;
    }

    get description():Nullable<string> {
        return this._descr
    }


    set weight(pWeight:number) {
      if(pWeight===null){
        this._w = -1;
      }else
        this._w = pWeight;
    }

    get weight():number {
        return this._w
    }


    set template(pTpl:string) {
        this._tpl = pTpl;
    }

    get template():Nullable<string> {
        return this._tpl
    }

    get strategy():any {
        return this._strategy
    }

    setStrategy(pStrategy:HookStrategy){
      this._strategy = pStrategy;
    }


    isPreProcessed():boolean {
        return this._preproc;
    }

    enablePreproc( pBool = true){
        this._preproc = pBool;
    }

    getStrategy():any {
        return this._strategy;
    }

    setCodeTemplate(pTpl:string):void {
        this._tpl = pTpl;
    }

    getCodeTemplate():Nullable<string> {
        return this._tpl;
    }


    getGeneratedCode():Nullable<string> {
      return this._cache;
    }

    static fromJsonObject(pObject:any){
      const o:HookTemplateFragment = new HookTemplateFragment();

      if(pObject._uid != null){
        o._uid = pObject._uid;
      }
      o.name = pObject.name;
      o.description = pObject.descr;
      o._w = pObject.weight;
      if(o._w==null) o._w = -1;

      o.template = pObject.tpl;
      o._cache = pObject._cache;
      o._preproc = pObject._preproc;

      return o;
    }
}
