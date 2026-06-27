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

import { CONST } from "./CoreConst";
import {NodeInternalType} from "./NodeInternalType";
import {Nullable} from "../base/Nullable";
import {RenderedModelNode} from "../base/RenderedModelNode";

interface PackedCaseList {
    [p: number]: ModelSwitchCase
}

interface AssociativeCaseList {
    [p: string]: ModelSwitchCase
}


/**
 * To represent a specific case into a switch statement
 */
export class ModelSwitchCase  extends RenderedModelNode
{
  __:NodeInternalType = NodeInternalType.SWITCH_CASE;
    value:Nullable<number|string> = null;
    target:any = null;
    type:any = null;

    constructor(value:number|string, target:any, type:any){
        super();
        this.value = value;
        this.target = target;
        this.type = type;
    }
}

/**
 * To represent a packed switch statement
 */
export class ModelPackedSwitchStatement
{
    start:Nullable<number> = null;
    cases:PackedCaseList = {};
    offset:Nullable<number> = null;
    length:number = 0;

    constructor(start:number){
        this.start = start;
        this.cases = {};
        this.offset = start;
        this.length = 0;
    }

    appendCase(tag:any){
        if(this.cases==null || this.offset==null){
            throw new Error("ModelPackedSwitchStatement :  cases/offset are null");
        }
        this.cases[this.offset+1] = new ModelSwitchCase(this.offset+1, tag, CONST.CASE_TYPE.PACKED);
        this.offset++;
        this.length++;
    }

    getStartValue():string{
        if(this.start==null){
            throw new Error("ModelPackedSwitchStatement :  start is null");
        }
        return this.start.toString();
    }

    forEach(fn:any){
        for(let i in this.cases) fn(i, this.cases[i]);
    }
}




/**
 * To represent a packed switch statement
 */
export class ModelSparseSwitchStatement
{
    cases:AssociativeCaseList = {};
    length:number = 0;

    constructor(){
        this.cases = {};
        this.length = 0;
    }

    appendCase(key:string, val:ModelSwitchCase){
        this.cases[key] = new ModelSwitchCase(key, val, CONST.CASE_TYPE.SPARSE);
        this.length++;
    }

    getKeys():string[]{
        return Object.keys(this.cases);
    }
}


