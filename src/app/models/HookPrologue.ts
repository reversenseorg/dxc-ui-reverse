import DexcaliburProject from "./DexcaliburProject";

export default class HookPrologue
{
    parentID:string = null;
    script:string = null;
    builtScript:string = null;
    context:DexcaliburProject = null;

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
                this[i]=pConfig[i];
        }
    }
}
