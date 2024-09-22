// TDB
import {Savable, STUB_TYPE} from "./ModelSavable";
import ModelInstruction from "./ModelInstruction";
import ModelMethod from "./ModelMethod";
import ModelClass from "./ModelClass";
import {NodeInternalType} from "./NodeInternalType";
import {IStringIndex} from "../base/IStringIndex";
import {Nullable} from "../base/Nullable";

const EOL = '\n';
/**
 * Represents a call to a method, a field or a class
 * @param {Object} cfg Optional, an object wich can be used in order to initialize the instance
 * @constructor
 */
export default class ModelCall
{
    __ = NodeInternalType.CALL;

    instr:Nullable<ModelInstruction> = null;
    caller:Nullable<ModelMethod> = null;
    calleed:Nullable<ModelMethod> = null;

    line:number = -1;
    type:any = null;
    object:any = null;
    subject:any = null;

    tags:string[] = [];

    constructor(pConfig:any=null){
        //super(STUB_TYPE.CALL);

        if(pConfig !== undefined)
            for(let i in pConfig)
                (this as IStringIndex<any>)[i] = pConfig[i];
    }

    print(){
        let s = "\t";
        if(this.caller!=null){
            s += this.caller.hashCode();
        }
        if(this.instr!=null){
            s += " [:line "+this.instr.getLine()+"] > \n\t\t"+this.instr.opcode.instr+" ";
        }else{
            s += " [:line ?] > \n\t\t"
        }
        if(this.calleed!=null){
            s += " "+this.calleed.hashCode();
        }else{
            s+= " ???";
        }

        console.log(s);
    }

    help(){
        let t:string ="+-------------------- HELP --------------------+";
        t += EOL+"[-- Methods : ]";
        t += EOL+"\t.print()\tPrint the call data";
        t += EOL+"\t.help()\tThis help";
        t += EOL+"[-- Properties : ]";
        t += EOL+"\t.instr:<Instruction>\tGet the instruction";
        t += EOL+"\t.caller:<Method>\tGet the method performing the call";
        t += EOL+"\t.calleed:<*>\tGet the reference to the calleed";
        t += EOL;

        console.log(t);
    }


    toJsonObject():any{
        let obj:any = {};
        for(let i in this){
            if(["_","$"].indexOf(i[0])==-1
                && (Array.isArray(this[i]))
                && (typeof this[i] != 'object')){

                obj[i] = this[i];
            }
            else if(i == "tags"){
                obj.tags = this.tags;
            }
            else if(i == "caller"){
                obj.caller = (this.caller!= null ? this.caller.__signature__ : null);
            }
            else if(i == "calleed"){
                if(this.calleed instanceof ModelClass)
                    obj.callee = this.calleed.name;
                else
                    obj.callee = ( this.calleed != null ? this.calleed.__signature__ : null);
            }
            else if(i == "instr"){
                obj.instr = (this.instr != null ? this.instr.exportType() : null); //toJsonObject(["name"]);
            }
        }
        return obj;
    };


    addTag(tag:string){
        this.tags.push(tag);
    }

    hasTag(tagName:string):boolean{
        return this.tags.indexOf(tagName)>-1;
    }

    getTags():string[]{
        return this.tags;
    }

}
