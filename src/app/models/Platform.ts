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
import {IStringIndex} from "../base/IStringIndex";

const PLATFORM_RE:RegExp = new RegExp('(?<source>[^_.]+)_(?<name>[^_.]+)_(?<version>[^_.]+)_(?<vendor>[^_.]+)\.(?<format>[^.]+)');
const LOCAL_PLATFORM_RE:RegExp = new RegExp('(?<source>[^_.]+)_(?<name>[^_.]+)_(?<version>[^_.]+)_(?<vendor>[^_.]+)');


export default class Platform
{
    uid:Nullable<string> = null;
    name:Nullable<string> = null;
    version:Nullable<string> = null;
    source:Nullable<string> = null;
    vendor:Nullable<string> = null;
    model:Nullable<string> = null;
    format:Nullable<string> = null;
    path:Nullable<string> = null;
    hash:Nullable<string> = null;
    size:Nullable<string> = null;
    remoteURL:Nullable<string> = null;
    localPath:Nullable<string> = null;
    installed:boolean = false;

    apiVersion:Nullable<string> = null;
    binaryPath:Nullable<string> = null;

    _installing:boolean = false;

    constructor(pPlatformConfig:any ){

        for(let i in pPlatformConfig) (this as IStringIndex<any>)[i] = pPlatformConfig[i];

        return this;
    }

    static fromRemoteName( pName:string):Nullable<Platform>{
        let matches:any = PLATFORM_RE.exec(pName);

        if(matches[0] === pName){
            return new Platform({
                source: matches.groups.source,
                name: matches.groups.name,
                version: matches.groups.version,
                vendor: matches.groups.vendor,
                format: matches.groups.format
            });
        }else{
            return null;
        }

    }

    static fromLocalName( pName:string):Nullable<Platform>{
        let matches:any = LOCAL_PLATFORM_RE.exec(pName);

        if(matches[0] === pName){
            return new Platform({
                source: matches.groups.source,
                name: matches.groups.name,
                version: matches.groups.version,
                vendor: matches.groups.vendor
            });
        }else{
            return null;
        }
    }


    getRemotePath():Nullable<string>{
        return this.remoteURL;
    }

    getLocalPath():Nullable<string>{
        return this.localPath;
    }

    getUID():string{
        return this.uid = `${this.source}_${this.name}_${this.version}_${this.vendor}`;
    }

    /**
     * To return the name of the folder where the
     * Platform  is stored.
     */
    getInternalName():string{
        // TODO : add file path check in order to avoid traversal path
        return this.name+"_"+this.apiVersion;
    }

    isAndroid():boolean{
        if(this.name==null){
            throw new Error("Exception : cannot state if platform is Android based or not");
        }
        return this.name.indexOf("android")>-1;
    }

    isIOS():boolean{
        if(this.name==null){
            throw new Error("Exception : cannot state if platform is iOS based or not");
        }
        return this.name.indexOf('ios')>-1;
    }


    isVmSupported(){
        if(this.isAndroid())
            return true;
        else
            return false;
    }



    getPublicVersion():string{
        return this.name+":"+this.version;
    }

    getApiVersion():Nullable<string>{
        return this.apiVersion;
    }

    getBinPath():Nullable<string>{
        return this.binaryPath;
    }




    toJsonObject():any{
        let o:any = {};

        for(let i in this){
            if(typeof (this as IStringIndex<any>)[i] == 'function') continue;
            o[i] = this[i];
        }

        return o;
    }

}
