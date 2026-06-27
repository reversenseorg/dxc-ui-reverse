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

import {NodeType} from "./NodeType";
import {NodeInternalType} from "./NodeInternalType";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";
import {RenderedModelNode} from "../base/RenderedModelNode";

/**
 * Represents a section into an executable file
 * @class
 */
export default class ModelExecutableSection extends RenderedModelNode
{

    __:NodeInternalType = NodeInternalType.EXEC_SECTION;
    __p?:any = null;
    _t:NodeType = NodeType.EXEC_SECTION;

    paddr:number = -1;
    vaddr:number = -1;
    sz:number = -1;
    memsz:number = -1;
    perm:string = "----";
    name:Nullable<string> = null;

    data:any= null;

    constructor(pConfig:any = null){
        super();
        if(pConfig!==undefined)
            for(let i in pConfig)
                (this as IStringIndex<any>)[i]=pConfig[i];
    }

    getVirtualAddr():number {
        return this.vaddr;
    }
    getPhysAddr():number {
        return this.vaddr;
    }
    getPermissions():string {
        return this.perm;
    }
    getName():Nullable<string> {
        return this.name;
    }
    getMemSize():number {
        return this.memsz;
    }
    getSize():number {
        return this.sz;
    }

    toJsonObject():any{
        return this;
    }
}
