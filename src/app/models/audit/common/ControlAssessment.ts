import {MerlinPrimitive, MerlinType} from "../../search/Merlin";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";

export enum TestType {
    VT, // check if implemented
    PT // bypass
}

export enum AnalysisType {
    SAST,
    DAST,
    IAST
}


export interface ControlAssessmentOpts extends IStringIndex<any>{
    id?:string;

    name?:string;

    description?:string;

    links?:string;

    testType?:TestType;

    analType?:AnalysisType;

    rules?:MerlinPrimitive[];

}

/**
 * Represent a
 */
export default class ControlAssessment {

    id:string;

    name:string;

    description = "";

    links = "";

    testType:TestType = TestType.VT;

    analType:AnalysisType = AnalysisType.SAST;

    rules:MerlinPrimitive[] = [];

    matches:any[] = [];

    constructor( pConfig:Nullable<ControlAssessmentOpts> = null) {
        if(pConfig!=null) for(const i in pConfig) (this as IStringIndex<any>)[i]=pConfig[i];
    }

    getRules():MerlinPrimitive[] {
        return this.rules;
    }

    addMatches(pMatch:any):void {
        this.matches.push(pMatch);
    }

    toJsonObject():any{
        const o:any = {};

        for(const i in this){
            switch (i){
                case "matches":
                    o.matches = [];
                    this.matches.map((x:any) => {                       o.matches.push( x.toJsonObject());
                    });
                    break;
                case "rules":
                    o.rules = [];
                    this.rules.map((x:any) => {                      o.rules.push( x.toJsonObject());
                    });
                    break;
                default:
                    o[i] = this[i];
                    break;
            }
        }
        return o;
    }

    static fromJsonObject(pOpts:any):ControlAssessment {
      const a = new ControlAssessment(pOpts);

      return a;
    }
}
