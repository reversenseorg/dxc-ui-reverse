import ModelMethod from "./ModelMethod";


/**
 * @class
 */
export class HookPrimitive
{
    when:number = null;
    method_signature:string = null;
    isIntercept:boolean = false;
    isCustom:boolean = false;
    interceptBefore:any = null;
    interceptAfter:any = null;
    interceptReplace:any = null;
    onMatch:any = null;
    custom:boolean = false;
    variables:any = null;
    raw:any = null;
    color:any;
    customCode:string = null;


    /**
     * To represent a hook primitive.
     * A hook primitive is like a hook template, it allows a developer or a user
     * to define hooks in different files and combine it in order to be injected
     * by using a single script.
     * @constructor
     */
    constructor(pConfig:any=null){
        if(pConfig!=null) {
            for (let i in pConfig) {
                if (i != "multiple_method" && i != "method")
                    this[i] = pConfig[i];
            }
        }
        if(pConfig.method!=null)
            this.method_signature = pConfig.method;
    }



    /**
     * Get the shared object from this hookset
     * @returns {Object} Shared object
     * @function
     */
    getVariables():any{
        return this.variables;
    }


    setMethod(method:string){
        this.method_signature = method;
    }

    // TODO : cleanup
    buildRawMethod(raw:ModelMethod){
        raw.__signature__ = raw.signature();
        return raw;
    }
}


