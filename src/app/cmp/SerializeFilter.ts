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

import {Nullable} from "../base/Nullable";


export class SerializeSelector {
    field:string;
    cond:boolean = false;
    selectors:SerializeSelector[];
}



const TOKEN_RE = /^([a-zA-Z0-9_]+)(=>[a-zA-Z0-9_]+)*(<[a-zA-Z0-9_]+>)?(\[.*\])?$/;
const CLASS_RE = /^<([a-zA-Z0-9_]+)>$/;
const SUBF_RE = /^([a-zA-Z0-9_])=>([a-zA-Z0-9_]+)$/;

/**
 *  name,ret<TYPE>[field1:field2],..
 *
 *  name,absolute_size,size,children<ModelClass>[name:simpleName=>sname],children<ModelPackage>[name:sname],
 *
 */
export class SerializeFilter {

    query:any = {};
    fields:string[]


    constructor() {
    }

    prepare(pSelector:string): SerializeFilter {

        let rootFields:string[] = pSelector.split(',');

        rootFields.map( (pField) => {
            let m:Nullable<RegExpExecArray> = TOKEN_RE.exec(pField);
            if(m!=null){
                let t = null;
                if(m[1]==undefined) return;

                if(m[4]!=undefined){
                    t = m[4].substring(1,-1).split(':');
                }


                if(m[2]==undefined){
                    this.query[m[1]] = m[1];
                }else{
                    this.query[m[1]] = m[2].substr(2);
                }

                console.log(m);

            }
        });

        return this;
    }

    process( pObject:any):any {

    }

}
