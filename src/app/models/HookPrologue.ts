import DexcaliburProject from "./DexcaliburProject";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";

export default class HookPrologue
{
    parentID:Nullable<string> = null;
    script:Nullable<string> = null;
    builtScript:Nullable<string> = null;
    context:Nullable<DexcaliburProject> = null;

    /**
     * To configure and manage a static part of the hook code
     * shared by all hooks and where class are searched.
     * Each hook set can define one custom prologue and several dependencies.
     *
     *
     * @param {*} config
     */
    constructor(pConfig:any = null){
        if(pConfig != null){
            for(let i in pConfig)
                (this as IStringIndex<any>)[i]=pConfig[i];
        }
    }
}
