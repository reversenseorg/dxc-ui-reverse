import Constraint from "./Constraint.js";


export interface AssetOptions {

    signature?:Constraint[];
}

export default class Asset  {

    constructor( pConfig:AssetOptions = null) {
        if(pConfig!=null) for(const i in pConfig) this[i]=pConfig[i];
    }
}