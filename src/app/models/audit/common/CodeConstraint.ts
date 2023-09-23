
// CIA
// TAMPER


import Constraint, {ConstraintOptions, ConstraintType} from "./Constraint.js";
import {NodeInternalType} from "../../NodeInternalType.js";
import {IStringIndex} from "../../../base/IStringIndex";
import {Nullable} from "../../../base/Nullable";


export interface CodeConstraintOptions extends ConstraintOptions {
    impl?:any;

    node?:NodeInternalType;

    pattern?:string;
}

export default class CodeConstraint extends Constraint {


    impl:any;

    node:NodeInternalType;

    pattern:string;

    constructor( pNode:NodeInternalType, pConfig:Nullable<CodeConstraintOptions> = null) {
        super(ConstraintType.CODE, pConfig);

        this.node = pNode;
        if(pConfig!=null) for(const i in pConfig) (this as IStringIndex<any>)[i]=pConfig[i];
    }

    verify( pNode:any):void {
        // todo
        if(this.impl!=null){

        }
    }
}