
import ModelMethod from "./ModelMethod";
import {CONST} from "./CoreConst";
import {IconModel} from "../base/icon/IconModel";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";



function getLetterFromType(typename:string):Nullable<string>{
    for(let i in CONST.WORDS){
        if((CONST.WORDS as IStringIndex<any>)[i]==typename) return i;
    }
    return null;
}



interface HookCode {
    varID:any,
    before: null,
    after: null,
    replace: null,
    custom: null
}



export default class Hook
{
    _t:string = 'h';
    _icon:Nullable<IconModel> = null;

    id:Nullable<string> = null;

    // ! important
    // It is used in order to link in-hook method call with method declared outside of the hook
    parentID:Nullable<string> = null;
    customName:boolean = false;
    name:Nullable<string> = null; //name;
    description:Nullable<string> = null;
    script:Nullable<string> = null;//src;
    enabled:boolean = true;
    native:boolean = false;
    isIntercept:boolean = false;
    onMatch:Function = (()=>{});

    edited:boolean = false;

    method:Nullable<ModelMethod> = null;

    when:number = 0;

    after:boolean = false;
    before:boolean = false;

    color:any = null;
    code:any = null;
    variables:IStringIndex<any> = {};




    /**
     * Represente un hook (actif ou non)
     * @param {string} name The hook name
     * @param {string} src The hook script source code
     * @constructor
     */
    constructor( pConfig:any = null){
        this.code = {
            varID: null,
            before: null,
            after: null,
            replace: null,
            custom: null
        };

        if(pConfig!==null) {
          for (let i in pConfig)
            if (this.hasOwnProperty(i))
              (this as IStringIndex<any>)[i] = pConfig[i];

          if(pConfig.enable!==undefined)
            this.enabled = pConfig.enable;
        }

    }


    isEnable():boolean{
        console.log(this);
        return this.enabled;
    }

    modifyScript(script:string):void{
        this.script = script;
        this.edited = true;
    }

    hasVariables():boolean{
        return (this.variables!=null);
    }

    setupVariables():string{
        let code="\t\tvar "+this.code.varID+` = {
            `;
        for(let i in this.variables){
            code += "\t\t"+i+":";
            code += this.variables[i].write();
        }
        return code+`
            };`;
    }

    getVariable(pName:string){
        return this.variables[pName];
    }

    isModified():boolean{
        return this.edited;
    }

    isCustomHook():boolean{
        return this.code.custom != null;
    }

    getCustomCode():string{
        return this.code.custom;
    }

    setCustomCode(script:string):void{
        this.code.custom = script;
    }


    /**
     * To check if the hook is called before the hooked function
     * @returns {boolean} Returns TRUE if the hook is called before the function, else FALSE
     * @deprecated
     * @function
     */
    isBefore():boolean{
        return (this.when <= 0);
    }

    /**
     * To check if the hook is called after the hooked function
     * @returns {boolean} Returns TRUE if the hook is called after the function, else FALSE
     * @deprecated
     * @function
     */
    isAfter():boolean{
        return (this.when>0);
    }

    /**
     * To check if the hook perform an intercept (it modifiy value or execution path)
     * @returns {boolean} Returns TRUE if the hook is an intercept, else FALSE
     * @function
     *//*
    isIntercept(){
        return this.isIntercept;
    }*/

    /**
     * To set the Unique ID of the hook
     * @param {string} id The Unique ID of the hook
     * @returns {Hook} The instance of this hook
     * @function
     */
    setID(id:string):Hook{
        this.id = id;
        return this;
    }

    /**
     * To get the Unique ID of the hook
     * @returns {string} id The Unique ID of this hook
     * @function
     */
    getID():Nullable<string>{
        return this.id;
    }

    /**
     * To set the parent ID if available, like an HookSet ID.
     * @param {string} id The parent ID
     * @returns {Hook} The instance of this hook
     * @function
     */
    setParentID(id:string):Hook{
        this.parentID = id;
        return this;
    }

    /**
     * To get the parent ID if available, like an HookSet ID.
     * @returns {String} The parent ID
     * @function
     */
    getParentID():Nullable<string>{
        return this.parentID;
    }

    /**
     * To set the name of the hook.
     * By default, it's the signature of the hooked method
     * @param {string} name The parent ID
     * @returns {Hook} The instance of this hook
     * @function
     */
    setName(name:string):Hook{
        this.name = name;
        this.customName = true;
        return this;
    }

    /**
     * To set the built hook code to exec BEFORE the hooked function.
     * @param {string} code The built source code of the hook
     * @returns {Hook} The instance of this hook
     * @function
     */
    setInterceptBefore(code:string):Hook{
        this.code.before = code;
        return this;
    }

    /**
     * To set the built hook code to exec AFTER the hooked function.
     * @param {string} code The built source code of the hook
     * @returns {Hook} The instance of this hook
     * @function
     */
    setInterceptAfter(code:string):Hook{
        this.code.after = code;
        return this;
    }

    /**
     * To set the built hook code to exec in place of the hooked function.
     * @param {string} code The builnt source code of the hook
     * @returns {Hook} The instance of this hook
     * @function
     */
    setInterceptReplace(code:string):Hook{
        this.code.replace = code;
        return this;
    }

    /**
     * To make an instance of Object which not contain circular reference
     * and which are ready to be serialized.
     * @returns {Object} - Returns an Object instance representing the type
     */
    toJsonObject(){
        let o:any = {};
        o.id = this.id;
        o.parentID = this.parentID;
        o.color = this.color;
        o.customName = this.customName;
        o.name = this.name;
        o.enable = this.enabled;
        o.method = (this.method!=null ? this.method.signature() : null);
        o.script = (this.script!=null ? btoa(encodeURIComponent(this.script)) : null);
        o.edited = this.edited;
        o.isIntercept = this.isIntercept;
        if(this.variables != null){
            o.variables = {
                id: this.code.varID,
                data: {}
            };
            //console.log(this.variables);
            for(let i in this.variables){
                o.variables.data[i] = this.variables[i].write();
            }
        }
        o.code = {
            //variable: (this.code.variable!=null)? UT.b64_decode(this.code.dynamic) : null,
            before: (this.code.before!=null)? btoa(this.code.before) : null,
            after: (this.code.after!=null)? btoa(this.code.after) : null,
            replace: (this.code.replace!=null)?btoa(this.code.replace) : null,
        };
        return o;
    }

    equals( pObj:any):boolean {
      return (this.id === pObj.id);
    }
}
