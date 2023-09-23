import Constraint from "./Constraint.js";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";


export interface AssetOptions extends IStringIndex<any>{

    signature?:Constraint[];
}

export default class Asset  {

    constructor( pConfig:Nullable<AssetOptions> = null) {
        if(pConfig!=null){
            for(const i in pConfig) 
                (this as IStringIndex<any>)[i]=pConfig[i];
        }
    }
}