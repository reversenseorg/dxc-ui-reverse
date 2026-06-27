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

import { Metric } from "./Metric.js";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {Metadata} from "./Metadata";
import {NodeInternalType} from "../../NodeInternalType";


export interface KpiRule {
    on:string;//"control"|"match";
    data: string,
    filter? :any[]
}


export interface IndicatorOptions extends Record<string, any>{
    uuid?:IndicatorUUID;
    title?:string;
    name?:string;
    description?:string;
    metadata?:any;
    rules?:KpiRule[];
    version?:any[];
    view?:any;
    enable?:boolean;
}

export type IndicatorUUID = string;

/**
 * Represent a metric + data in a dashboard
 *
 * @class
 */
export class Indicator  {

    __ = NodeInternalType.INDICATOR;

    uuid:IndicatorUUID = "";
    name:string = "";
    title:string = "";
    description:string = "";
    metadata:Metadata[] = [];
    rules:KpiRule[] = [];
    view:string = "";
    enable = true;
    version:any[] = []
    data:any/*DataSegment*/[] = [];
    tags:number[] = [];
    // metric: Metric = null;
    // events: any[] = [];

    constructor(pConfig:IndicatorOptions) {
        for(const i in pConfig){
            (this as any)[i] = pConfig[i];
        }
    }

    setUID(pUID:string):void {
        this.uuid = pUID;
    }

    getUID():IndicatorUUID {
        return this.uuid;
    }

    toJsonObject(pConfig:any = {}):any {
        const o:any = {
            uuid: this.uuid,
            name: this.name,
            title: this.title,
            description: this.description,
            metadata: this.metadata,
            rules: this.rules,
            view: this.view,
            enable: this.enable,
            version: this.version
        };

        return o;
    }



    static fromJsonObject(pObj:any):Indicator {
        const i:any = new Indicator(pObj);

        return i;
    }
}