import { Metric } from "./Metric.js";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";


export interface IndicatorOptions extends IStringIndex<any>{
    name?:string;
    description?:string;
    metric?:Metric;
    events?:any[];
    view?:any;
    enable?:boolean;
}
/**
 * Represent a metric + data in a dashboard
 */
export class Indicator {


    name:string = "";

    description:string = "";

    metric: Nullable<Metric> = null;

    events: any[] = [];

    view: string = "";

    enable = false;

    constructor(pConfig:IndicatorOptions) {
        for(const i in pConfig){
            (this as IStringIndex<any>)[i] = pConfig[i];
        }
    }


    toJsonObject(pConfig:any = {}):any {
        const o:any = {};

        o.name = this.name;
        o.description = this.description;
        o.events = [];
        o.metric = null;
        o.enable = this.enable;
        if(this.metric!=null) o.metric = this.metric.name;

        return o;
    }
}