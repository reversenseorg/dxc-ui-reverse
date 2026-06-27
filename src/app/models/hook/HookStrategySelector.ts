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

import {NodeType} from "../NodeType";
import {NodeInternalType} from "../NodeInternalType";
import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";
import {Operation} from "../search/MerlinSearchRequest";


export interface HookStrategySelectorOptions extends Record<string, any>{
    type: string;
    uid?:Nullable<any>;
    req?:Nullable<string|Operation[]>;
    opts?:any;
}

export default class HookStrategySelector {

    /**
     * Search Engine request
     * @private
     */
    type:any = null;

    uid?:any = null;

    req?:Nullable<string|Operation[]> = null;

    opts?:any;


    /**
     * Group of hook
     *
     * @param {*} config
     */
    constructor(pConfig:Nullable<HookStrategySelectorOptions>=null){

        // this.requiresNode = [];
        if(pConfig!=null)
            for(let i in pConfig)
                (this as IStringIndex<any>)[i] = pConfig[i];

    }

    static from(pData:HookStrategySelectorOptions):HookStrategySelector {
        return new HookStrategySelector(pData);
    }

    isSearchRequest():boolean {
        return (this.req != null);
    }

    getUids():string[] {
        if(this.isUidList()){
            return this.uid;
        }else{
            return [this.uid];
        }
    }

    isUidList():boolean {
        return (this.uid != null && Array.isArray(this.uid));
    }

    isUidSelector():boolean {
        return (this.uid != null);
    }

    setRequest(pReq:string){
        this.req = pReq;
    }

    getRequest():Nullable<string|Operation[]>{
        return this.req;
    }

    isMethod(){
        return (this.type.getType() === NodeInternalType.METHOD);
    }

    isNativeFunc(){
        return (this.type.getType() === NodeInternalType.FUNC);
    }

    isSystemCall(){
        return (this.type.getType() === NodeInternalType.SYSCALL);
    }

    isRaw(){
        return (this.type.getType() === null);
    }

    static fromJsonObject(pObj:HookStrategySelectorOptions):HookStrategySelector {
        const o = new HookStrategySelector();
        if(pObj.req != null) o.req = pObj.req;
        if(pObj.uid != null) o.uid = pObj.uid;
        if(pObj.type != null) o.type = pObj.type; // NodeType.lookup(pObj.type);
        return o;
    }

    toJsonObject():any {
        const o:any = {};
        if(this.req != null) o.req = this.req;
        if(this.uid != null) o.uid = this.uid;

        o.type = this.type.getName();
        return o;
    }
}
