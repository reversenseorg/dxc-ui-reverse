

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

export interface ProductReleaseOptions extends Record<string,any>
{
    version?:string;
    description?:string;
    changelog?:string;
    resource?:any;
    release?:any;
}

/**
 * Represents a product release.
 *
 * @class
 */
export class ProductRelease
{
    /**
     * Version of the realeasein semver format
     * @type {string}
     */
    version:string;

    description:string;
    changelog?:string;
    resource?:any;
    release?:any;

    constructor(pOptions?:ProductReleaseOptions) {
        if(pOptions!=null){
            for(let i in pOptions){
                (this as any)[i] = pOptions[i];
            }
        }
    }

    toJsonObject():any{
        const o = {
            version:this.version,
            description:this.description,
            changelog:this.changelog,
            resource:null,
            release:null
        };

        if(this.release!= null){
            if(this.release.hasOwnProperty("toJsonObject")){
                o.release = this.release.toJsonObject();
            }else{
                o.release  = this.release;
            }
        }

        if(this.resource!= null){
            if(this.resource.hasOwnProperty("toJsonObject")){
                o.resource = this.resource.toJsonObject();
            }else{
                o.resource  = this.resource;
            }
        }

        return o;
    }


    static fromJsonObject(pObj:any):ProductRelease {
        const p = new ProductRelease(pObj);
        if(pObj.resource!=null){
            p.resource = null;
        }
        return p;
    }

}