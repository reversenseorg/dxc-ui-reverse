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
import {ProductRelease} from "./ProductRelease";


export interface ProductAuthor{
    name:string;
    contact:string;
    official:boolean;
}

export interface ReversenseProductOptions extends Record<string, any> {
    type?:NodeInternalType;
    code?:string;
    name?:string;
    description?:string;
    author?:ProductAuthor;
    releases?:ProductRelease[];
    price?:number;
    tags?:number[];
}


export type ReversenseProductUUID = string;

/**
 *
 */
export class ReversenseProduct
{

    __ = NodeInternalType.REVERSENSE_PRODUCT;

    type?:NodeInternalType;

    code:ReversenseProductUUID;

    name:string;

    version:string;

    description:string = "";

    author:ProductAuthor;

    releases:ProductRelease[] = [];

    price:number = -1;

    tags:number[] = [];

    owned:boolean = false;


    /**
     *
     * @param pOpts
     */
    constructor(pOpts:ReversenseProductOptions) {
        for(const i in pOpts){
            (this as any)[i]=pOpts[i];
        }
    }

    getUID():string {
        return  this.code;
    }

    is(pCode:string):boolean{
        return this.code===pCode;
    }

    /**
     * To add a new release
     *
     * Release with same version string is removed.
     *
     * @param {ProductRelease} pRelease Release to add
     * @returns {ProductRelease[]} Releases removed
     * @method
     */
    addRelease(pRelease:ProductRelease):ProductRelease[] {
        // first, remove release with same version
        const rels:ProductRelease[] = [];
        const removed:ProductRelease[] = [];

        this.releases.map(x => {
            if(pRelease.version!=x.version){
                rels.push(x);
            }else{
                removed.push(x);
            }
        });

        rels.push(pRelease);
        this.releases = rels;

        return removed;
    }

    /**
     *
     */
    toJsonObject():any {
        const o = {
            code:this.code,
            name:this.name,
            description:this.description,
            author:this.author,
            releases:this.releases,
            price:this.price,
            tags:this.tags,
            type:this.type
        };

        o.releases = [];
        this.releases.map(x => {
            o.releases.push(x.toJsonObject());
        });

        return o;
    }

    setUID(pCode: string) {
        this.code = pCode;
    }

    static fromJsonObject(pObj:any):ReversenseProduct {
        const rp = new ReversenseProduct(pObj);

        rp.releases = [];
        if(Array.isArray(pObj.releases)){
            pObj.releases.map((vRelease:any)=>{
                rp.addRelease(ProductRelease.fromJsonObject(vRelease));
            })
        }

        return rp;
    }
}