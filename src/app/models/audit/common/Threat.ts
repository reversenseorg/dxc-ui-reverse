
import Constraint, {ConstraintType} from "./Constraint";
import Asset from "./Asset";

export interface ThreatOptions {
    id?:string;
    uid?:string ;
    name?:string;
    description?:string;
    refs?:string[];
    property?:any;
    signature?:Constraint[];
}
/**
 *
 */
export default class Threat extends Asset{

    id:string;
    uid:string ;
    name:string;
    description:string;
    property:any;
    signature:Constraint[] = [];

    refs:string[] = [];

    _codeBased = false;

    constructor( pConfig:any = null) {
        super(pConfig);

        if(pConfig!=null) for(const i in pConfig) this[i]=pConfig[i];
    }

    appendSignature(pConstraint:Constraint):void{
        if(pConstraint.type===ConstraintType.CODE){
            this._codeBased = true;
        }

        this.signature.push(pConstraint);
    }

    isCodeCheckable():boolean {
        return this._codeBased;
    }

    toJsonObject(pExclude:string[] = []):any{
        const o:any = {};
        for(let i in this){
            if(pExclude.indexOf(i)>-1) continue;

            switch (i){
                case "signature":
                    o.signature = [];
                    this.signature.map(x => {
                        o.signature.push(x); //.toJsonObject());
                    })
                    break;
                case "id":
                case "uid":
                case "name":
                case "description":
                case "refs":
                case "_codeBased":
                    o[i] = this[i];
                    break;
            }
        }
        return o;
    }
}
