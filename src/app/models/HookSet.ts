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

import HookPrologue from "./HookPrologue";
import DexcaliburProject from "./DexcaliburProject";
import Hook from "./Hook";
import { NodeInternalType } from "./NodeInternalType";
import HookStrategy from "./hook/HookStrategy";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


/**
 * @class
 */
export default class HookSet
{
    __:NodeInternalType = NodeInternalType.HOOK_SET;
    id:Nullable<string> = null;
    name:Nullable<string> = null;
    description:Nullable<string> = null;
    prologue:Nullable<HookPrologue> = null;
    category:Nullable<string> = null;

    builtin = false;
    dynamic = false;
    native = false;

    // TODO : Merge probes and intercepts
    intercepts:any = []; // HookPrimitive
    probes:any = [];

    hooks:Hook[] = [];

    context:Nullable<DexcaliburProject> = null;
    enable = false;
    requires:string[] = [];
    color:any = null;
    share:any = null;
    strats:HookStrategy[] = [];

    /**
     * Group of hook
     *
     * @param {*} config
     */
    constructor(pConfig:any=null){

        // this.requiresNode = [];
        if(pConfig!=null){
          for(const i in pConfig) {
            switch(i){
              case 'hooks':
                pConfig.hooks.map(( pHook:Hook)=>{
                   this.hooks.push(new Hook(pHook));
                });
                break;
              default:
                (this as IStringIndex<any>)[i] = pConfig[i];
                break;
            }
          }
        }
    }

    isEnable():boolean{
        return this.enable;
    }

    getID():Nullable<string>{
        return this.id;
    }

    addPrologue(code:string):HookSet{
        //this.prologue = code;
        this.prologue = new HookPrologue({
            parentID: this.id,
            script: code
        });

        return this;
    }

    require(module:string){
        this.requires.push(module);
    }
    /*
    requireNodeModule(module){
        this.requiresNode.push(module);
    }*/
    /**
     * Create a object shared with others hook callback
     * @param {Object} config Shared object config
     */
    addHookShare(config:any):HookSet{
        this.share = config;
        return this;
    }



    /**
     * Get the shared object from this hookset
     * @returns {Object} Shared object
     * @function
     */
    getHookShare():any{
        return this.share;
    }

    addProbe(probeConfig:any):any{
        return null;
    }

    /**
     * To disable all hooks of this set
     *
     * @method
     */
    disable(){
        //
    }

    deploy(){
        //
    }

}
