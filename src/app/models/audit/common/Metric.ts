import {IStringIndex} from "../../../base/IStringIndex";

/**
 * Represent a metric in a dashboard
 * @class
 */
export class Metric {


    name = "";

    description = "";

    unit:any = "";

    constructor(pConfig:any) {
        for(const i in pConfig){
            (this as IStringIndex<any>)[i] = pConfig[i];
        }
    }

}