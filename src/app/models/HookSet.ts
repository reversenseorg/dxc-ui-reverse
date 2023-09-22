import HookPrologue from "./HookPrologue";
import DexcaliburProject from "./DexcaliburProject";
import Hook from "./Hook";
import { NodeInternalType } from "./NodeInternalType";
import HookStrategy from "./hook/HookStrategy";


/**
 * @class
 */
export default class HookSet
{
    __:NodeInternalType = NodeInternalType.HOOK_SET;
    id:string = null;
    name:string = null;
    description:string = null;
    prologue:HookPrologue = null;
    category:string = null;

    builtin = false;
    dynamic = false;
    native = false;

    // TODO : Merge probes and intercepts
    intercepts:any = []; // HookPrimitive
    probes:any = [];

    hooks:Hook[] = [];

    context:DexcaliburProject = null;
    enable = false;
    requires:string[] = [];
    color:any = null;
    share:any = null;
    strats:HookStrategy[] = [];

    /**
     * Group of hook
     *
     * @param {*} config
     */
    constructor(pConfig:any=null){

        // this.requiresNode = [];
        if(pConfig!=null){
          for(const i in pConfig) {
            switch(i){
              case 'hooks':
                pConfig.hooks.map(( pHook:Hook)=>{
                   this.hooks.push(new Hook(pHook));
                });
                break;
              default:
                this[i] = pConfig[i];
                break;
            }
          }
        }
    }

    isEnable():boolean{
        return this.enable;
    }

    getID():string{
        return this.id;
    }

    addPrologue(code:string):HookSet{
        //this.prologue = code;
        this.prologue = new HookPrologue({
            parentID: this.id,
            script: code
        });

        return this;
    }

    require(module:string){
        this.requires.push(module);
    }
    /*
    requireNodeModule(module){
        this.requiresNode.push(module);
    }*/
    /**
     * Create a object shared with others hook callback
     * @param {Object} config Shared object config
     */
    addHookShare(config:any):HookSet{
        this.share = config;
        return this;
    }



    /**
     * Get the shared object from this hookset
     * @returns {Object} Shared object
     * @function
     */
    getHookShare():any{
        return this.share;
    }

    addProbe(probeConfig:any):any{
        return null;
    }

    /**
     * To disable all hooks of this set
     *
     * @method
     */
    disable(){
        //
    }

    deploy(){
        //
    }

}
