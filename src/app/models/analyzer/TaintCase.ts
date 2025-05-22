import {DexcaliburProjectUUID} from "../DexcaliburProject";
import ModelInstruction from "../ModelInstruction";
import {ModelFunction} from "../ModelFunction";
import ModelMethod from "../ModelMethod";
import ModelField from "../ModelField";
import ModelClass from "../ModelClass";
import {Nullable} from "../../base/Nullable";
import {UserAccountUUID} from "../user/UserAccount";


export interface TaintStep {
    location: ModelInstruction;
    source: ModelFunction|ModelMethod|ModelField|ModelClass;
}


export interface TaintSink extends TaintStep {
}

export interface TaintSource extends TaintStep {
}

export interface  TaintCaseOpts {
    ctx: DexcaliburProjectUUID,
    source: TaintSource,
    name: string,
    description?: Nullable<string>,
    sinks?: Nullable<TaintSink[]>,
    propagators?: Nullable<TaintStep[]>,
    conds?: Nullable<TaintStep[]>,
    author?:Nullable<UserAccountUUID>,
}

export class TaintCase {

    ctx:DexcaliburProjectUUID;

    name: string;
    description: string;
    author: UserAccountUUID;

    source: TaintSource;
    sinks: TaintSink[] = [];
    propagators: TaintStep[] = [];
    conds: TaintStep[] = [];

    constructor(pOptions:TaintCaseOpts) {
        this.ctx = pOptions.ctx;
        this.source = pOptions.source;
        if(pOptions.sinks!=null) this.sinks = pOptions.sinks;
        if(pOptions.propagators!=null)  this.propagators = pOptions.propagators;
        if(pOptions.conds!=null)  this.conds = pOptions.conds;
    }

}