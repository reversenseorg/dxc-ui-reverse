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