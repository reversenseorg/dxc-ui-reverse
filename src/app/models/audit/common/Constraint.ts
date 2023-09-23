import {IStringIndex} from "../../../base/IStringIndex";
import {Nullable} from "../../../base/Nullable";

export enum ConstraintType {
    CODE,
    FLOW,
    UI,
    ANY,
    PHYSICAL
}

export interface ConstraintOptions extends IStringIndex<any>{
    type?:ConstraintType;
    name?:string;

    el?:any;
}

/**
 * Represent a constraint
 */
export default class Constraint  {

    type:ConstraintType;

    name:string;

    el:any = null;

    constructor( pType:ConstraintType, pConfig:Nullable<ConstraintOptions> = null) {
        if(pConfig!=null) for(const i in pConfig) (this as IStringIndex<any>)[i]=pConfig[i];
    }
}