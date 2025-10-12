import {MerlinPrimitive, MerlinType} from "../../search/Merlin";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {Metadata} from "./Metadata";
import {MatchOccurence} from "./AssuranceReport";

export enum TestType {
    VT, // check if implemented
    PT // bypass
}

export enum AnalysisType {
    /**
     * Rules perform search on graph
     *
     *
     * Evidence is composed of :
     * - Search Request / Rule and its matching results
     * - Commit ID of Hook Workspace
     */
    SAST, // support VT/PT

    /**
     * Rules create hook, if the hook is trigged, the rule is satisfied
     *
     *
     * Evidence is composed of :
     * - Search Request / Rule and its matching results
     * - Hooks
     * - Hook traces
     * - Commit ID of Hook Workspace
     */
    DAST, // support VT/PT

    /**
     * Rules create hook and optionnally action, if the hook and/or action is trigged, and if resulting
     * RuntimeEvent is trigged, the rule is satisfied.
     *
     * Evidence is composed of :
     * - Runtime Events, including hook message
     * - Search Request / Rule and its results used to generate hooks
     * - Hooks
     * - Hook traces
     * - Commit ID of Hook Workspace
     */
    IAST
}


export enum DataOperation {
    SOURCING,
    PROCESSING,
    STORING,
    SHARING,
    ENCRYPTING,
    DECRYPTING,
    HASHING
}


export interface ControlAssessmentOpts {
    id?:string;

    name?:string;

    description?:string;

    links?:string;

    testType?:TestType;

    analType?:AnalysisType;

    rules?:MerlinPrimitive[];
    matches?:any[];
    metadata?:Metadata[];

}

/**
 * Represent a
 */
export default class ControlAssessment {

    id:string;

    name:string;

    description = "";

    links = "";

    metadata:Metadata[] = [];

    testType:TestType = TestType.VT;

    analType:AnalysisType = AnalysisType.SAST;

    rules:MerlinPrimitive[] = [];

    matches:MatchOccurence<any>[] = [];

    constructor( pConfig:ControlAssessmentOpts = {}) {

        if(pConfig.id!=null) this.id = pConfig.id;
        if(pConfig.name!=null) this.name = pConfig.name;
        if(pConfig.description!=null) this.description = pConfig.description;
        if(pConfig.links!=null) this.links = pConfig.links;
        if(pConfig.testType!=null) this.testType = pConfig.testType;
        if(pConfig.analType!=null) this.analType = pConfig.analType;
        if(pConfig.rules!=null) this.rules = pConfig.rules;
        if(pConfig.matches!=null) this.matches = pConfig.matches;
        if(pConfig.metadata!=null) this.metadata = pConfig.metadata;
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
                    o.matches = this.matches;
                    break;
                case "rules":
                    o.rules = [];
                    this.rules.map( x => {


                        if(x.toJsonObject!=null){
                            o.rules.push(x.toJsonObject());
                        }else{
                            o.rules.push(x);
                        }
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


    isControl(): boolean {
        return false;
    }

    isControlAssessment(): boolean {
        return true;
    }
}
