import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


/**
 * This class is an abstraction of application package
 *
 * 
 * @class
 */
export default class AppPackage {

    packageIdentifier:Nullable<string> = null;
    packagePath:Nullable<string> =  null;
    patched:boolean = false;
    workspaceExists:boolean = false;
    currentWd:boolean = false;
    removed:boolean = false;
    tag:string = "";


    /**
     * 
     * @param {*} pConfig 
     * @constructor
     */
    constructor(pConfig:any=null){

        this.patched = false;
        this.workspaceExists = false;
        this.currentWd = false;

        if(pConfig !== null)
            for(let i in pConfig)
            {
                (this as IStringIndex<any>)[i] = pConfig[i];
            }
    }


    /**
     * To serialize the Device to JSON string
     * @returns {String} JSON-serialized object
     * @method 
     */
    toJsonObject():any{
        let json:any = {};
        for(let i in this){
            json[i] = this[i];
        }
        return json;
    }

}