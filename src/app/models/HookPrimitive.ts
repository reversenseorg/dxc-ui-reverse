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

import ModelMethod from "./ModelMethod";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


/**
 * @class
 */
export class HookPrimitive
{
    when:number = 0;
    method_signature:Nullable<string> = null;
    isIntercept:boolean = false;
    isCustom:boolean = false;
    interceptBefore:any = null;
    interceptAfter:any = null;
    interceptReplace:any = null;
    onMatch:any = null;
    custom:boolean = false;
    variables:any = null;
    raw:any = null;
    color:any;
    customCode:Nullable<string> = null;


    /**
     * To represent a hook primitive.
     * A hook primitive is like a hook template, it allows a developer or a user
     * to define hooks in different files and combine it in order to be injected
     * by using a single script.
     * @constructor
     */
    constructor(pConfig:any=null){
        if(pConfig!=null) {
            for (let i in pConfig) {
                if (i != "multiple_method" && i != "method")
                    (this as IStringIndex<any>)[i] = pConfig[i];
            }
        }
        if(pConfig.method!=null)
            this.method_signature = pConfig.method;
    }



    /**
     * Get the shared object from this hookset
     * @returns {Object} Shared object
     * @function
     */
    getVariables():any{
        return this.variables;
    }


    setMethod(method:string){
        this.method_signature = method;
    }

    // TODO : cleanup
    buildRawMethod(raw:ModelMethod){
        raw.__signature__ = raw.signature();
        return raw;
    }
}


