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

/**
 * A superclass for activity/receiver/provider/service
 */

import {AndroidIntentable} from "./Intent";
import ModelClass from "../ModelClass";
import {AndroidAttributeSet} from "./AndroidAttribute";
import {NodeInternalType} from "../NodeInternalType";
import {Nullable} from "../../base/Nullable";


const ANDROID_PREFIX = "android:";
const ANDROID_PREFIX_LEN = 8;

export default class AndroidComponent extends AndroidIntentable
{
    __:NodeInternalType;
    androidPrefixed:string[] = [];
    attr:AndroidAttributeSet  = {};

    label:Nullable<string> = null;
    name:Nullable<string> = null;

    metadata:any = null;

    __id:Nullable<string> = null;
    __impl:any = null;
    __tag:any = [];
    __ppts:any = {};

    tags:number[] = [];

    constructor() {
        super();
    }


    getUID():Nullable<string>{
        return this.__id;
    }

    setImplementedBy(cls:ModelClass){
        this.__impl = cls;
    }

    getImplementedBy():ModelClass{
        return this.__impl;
    }


    getAttributes():any{
        return this.attr;
    }

    getAttribute(name:string):any{
        return this.attr[name];
    }

    getLabel():Nullable<string>{
        return this.label
    }

    getName():Nullable<string>{
        return this.name;
    }

    addTag(tag:any){
        if(this.__tag.indexOf(tag)==-1)
            this.__tag.push(tag);
    }

    getTags():any{
        return this.__tag;
    }

    addNodeProperty(name:string, value:any):void{
        this.__ppts[name] = value
    }

    getNodeProperty(name:string):any{
        return this.__ppts[name];
    }

    isExported():boolean{

        return ((this.attr as any).exported != null) && ((this.attr as any).exported === "true");
    }


    setAttributes(attr:any){
        let n:string="";
        for(let i in attr){
            if(i.startsWith(ANDROID_PREFIX)){
                n = i.substr(ANDROID_PREFIX_LEN);
                if(this.androidPrefixed.indexOf(n)==-1)
                    this.androidPrefixed.push(n);
                this.attr[n] = attr[i];
            }else{
                this.attr[i] = attr[i];
            }
        }
    }


    /**
     * To serialize to JSON
     * @returns {String} The activity data seriualized
     * @function
     */
    toJsonObject():any{
        let o:any = new Object();

        o.__id = this.__id;
        o.label = this.label;
        o.name = this.name;
        o.attr = this.attr;
        o.intentFilters = [];

        this.intentFilters.map(x => o.intentFilters.push(x.toJsonObject()));

        if(this.__impl!=null){
            o.__impl = this.__impl.signature();
        }

        if((this.__tag instanceof Array) && this.__tag.length>0){
            o.__tag = this.__tag;
        }

        o.__ppts = this.__ppts;

        return o;
    }


    /**
     * To serialize to XML
     * @returns {String} The activity data ready to be writen into an XML file
     * @function
     */
    toXmlObject():any {
        let o: any = {}
        o.$ = {};
        for (let i in this.attr) {
            if (this.androidPrefixed.indexOf(i) > -1)
                o.$[ANDROID_PREFIX + i] = this.attr[i];
            else
                o.$[i] = this.attr[i];
        }

        o["intent-filter"] = [];
        for (let i = 0; i < this.intentFilters.length; i++) {
            o["intent-filter"].push(this.intentFilters[i].toXml());
        }

        return o;
    }

}
