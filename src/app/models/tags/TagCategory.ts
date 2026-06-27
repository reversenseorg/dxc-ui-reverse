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

import {NodeInternalType} from "../NodeInternalType";
import {Tag} from "./Tag";
import {INode} from "../INode";
import {IStringIndex} from "../../base/IStringIndex";
import {Nullable} from "../../base/Nullable";

/**
 * Tag categories are conceptuals, and are only used to help to manage tags
 *
 * Tags are grouped by thema
 *
 * @class
 */
export default class TagCategory implements INode
{
    __:NodeInternalType = NodeInternalType.TAG_CATEGORY;

    _uid:Nullable<string> = null;
    /**
     * Category name
     */
    name:string;
    descr:Nullable<string> = null;
    tags:number[] = [];

    _tags:Tag[] = [];

    /**
     *
     * @param pConfig
     * @constructor
     */
    constructor(pConfig:any) {
        for(const i in pConfig){
            (this as IStringIndex<any>)[i] = pConfig[i];
        }
    }

    /*
    constructor(name:string, taglist:string[]){
        this.name = name;
        this.taglist = taglist;
    }

    addTag(tag:string){
        if(this.taglist.indexOf(tag)==-1)
            this.taglist.push(tag);
    }
    */

    /**
     * Add a tag to the category
     * @param pTag
     */
    addTag(pTag:Tag){
        if(this._tags.indexOf(pTag)==-1){
            pTag.setFQN(this.getUID()+'.'+pTag.name);
            pTag.category = this;
            this._tags.push(pTag);
        }
    }

    getTags():Tag[]{
        return this._tags;
    }

    toJsonObject():any{
        const o:any = new Object();
        o.name = this.name;
        o.descr = this.descr;
        o._tags = [];
        this._tags.map( (vTag:Tag) => {
            o._tags.push(vTag.toJsonObject());
        })
        return o;
    }

    /**
     *
     */
    getUID(): string {
        return this._uid as string;
    }
}
