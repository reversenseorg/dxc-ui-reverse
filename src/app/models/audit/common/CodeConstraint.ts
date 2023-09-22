
// CIA
// TAMPER


import Constraint, {ConstraintOptions, ConstraintType} from "./Constraint.js";
import {NodeInternalType} from "../../NodeInternalType.js";


export interface CodeConstraintOptions extends ConstraintOptions {
    impl?:any;

    node?:NodeInternalType;

    pattern?:string;
}

export default class CodeConstraint extends Constraint {

    name:string;

    impl:any;

    node:NodeInternalType;

    pattern:string;

    constructor( pNode:NodeInternalType, pConfig:CodeConstraintOptions = null) {
        super(ConstraintType.CODE, pConfig);

        this.node = pNode;
        if(pConfig!=null) for(const i in pConfig) this[i]=pConfig[i];
    }

    verify( pNode:any):void {
        // todo
        if(this.impl!=null){

        }
    }
}