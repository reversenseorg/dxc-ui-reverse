
import Threat, {ThreatOptions} from "./Threat";
import CodeConstraint from "./CodeConstraint";
import Constraint from "./Constraint";
import {NodeInternalType} from "../../NodeInternalType";
import {IStringIndex} from "../../../base/IStringIndex";
import {Nullable} from "../../../base/Nullable";


export interface CodeConstraintMap {
    [nodeType:number] :CodeConstraint[]
}

export interface CodeThreatOptions extends ThreatOptions {
    signature?:CodeConstraint[];

}

export default class CodeThreat extends Threat {

    override signature:CodeConstraint[] = [];

    private _cmap:CodeConstraintMap = {};

    constructor( pConfig:Nullable<CodeThreatOptions> = null) {
        super(pConfig);

        if(pConfig!=null) for(const i in pConfig) (this as IStringIndex<any>)[i]=pConfig[i];
    }

    override appendSignature(pConstraint:CodeConstraint):void {
        super.appendSignature(pConstraint);

        // update mapping
        if(this._cmap[pConstraint.node]==null){
            this._cmap[pConstraint.node] = [];
        }

        this._cmap[pConstraint.node].push(pConstraint);
    }

    listPerNodeType():CodeConstraintMap {
        return this._cmap;
    }

    listByNodeType(pNodeType:NodeInternalType):CodeConstraint[] {
        return this._cmap[pNodeType];
    }
}
