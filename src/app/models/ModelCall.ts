/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

// TDB
import {Savable, STUB_TYPE} from "./ModelSavable";
import ModelInstruction from "./ModelInstruction";
import ModelMethod from "./ModelMethod";
import ModelClass from "./ModelClass";
import {INodeRef, NodeInternalType} from "./NodeInternalType";
import {IStringIndex} from "../base/IStringIndex";
import {Nullable} from "../base/Nullable";
import {RenderedModelNode, RenderingOptions} from "../base/RenderedModelNode";

const EOL = '\n';


/**
 * Represents a call to a method, a field or a class
 * @param {Object} cfg Optional, an object wich can be used in order to initialize the instance
 * @constructor
 */
export default class ModelCall extends RenderedModelNode
{
    __ = NodeInternalType.CALL;

    instr:Nullable<ModelInstruction> = null;
    caller:Nullable<ModelMethod> = null;
    calleed:Nullable<ModelMethod> = null;

    _caller:Nullable<INodeRef> = null;
    _called:Nullable<INodeRef> = null;

    line:number = -1;
    type:any = null;
    object:any = null;
    subject:any = null;

    tags:number[] = [];

    constructor(pConfig:any=null){
        super();

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


    addTag(tag:number){
        this.tags.push(tag);
    }

    hasTag(tagName:number):boolean{
        return this.tags.indexOf(tagName)>-1;
    }

    getTags():number[]{
        return this.tags;
    }

}
