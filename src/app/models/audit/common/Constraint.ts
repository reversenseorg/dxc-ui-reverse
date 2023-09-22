export enum ConstraintType {
    CODE,
    FLOW,
    UI,
    ANY,
    PHYSICAL
}

export interface ConstraintOptions {
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

    constructor( pType:ConstraintType, pConfig:ConstraintOptions = null) {
        if(pConfig!=null) for(const i in pConfig) this[i]=pConfig[i];
    }
}