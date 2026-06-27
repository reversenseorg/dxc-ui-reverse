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

import {NodeType} from "./NodeType";
import {ModelBasicType, ModelObjectType} from "./ModelType";
import ModelFile from "./ModelFile";
import ModelCpuInstruction from "./ModelCpuInstruction";
import {ModelVariable} from "./ModelVariable";
import {ModelNativeRef} from "./ModelNativeRef";
import {NodeInternalType} from "./NodeInternalType";
import {Savable, STUB_TYPE} from "./ModelSavable";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";
import NativeFunctionHook from "./NativeFunctionHook";

export interface ModelFunctionList {
  [pAddress:string] :ModelFunction
}


const CMD_ATTR_MAPPING = {
  f_disass: ['instr']
}

/**
 * Represents a function
 *
 * TODO : the ModelMethod class should extends ModelFunction class,
 * TODO : because a POO method is like a function specialization
 */
export class ModelFunction extends Savable {

  __p?:any = {};

  override __:NodeInternalType = NodeInternalType.FUNC;
  _t:NodeType = NodeType.FUNC;

  sz:number = -1;

  /**
   * Count of basic blocks
   */
  bbs:number = -1;

  addr:number = -1;

  name: Nullable<string> = null;
  symbol: Nullable<string> = null;

  args:(ModelObjectType|ModelBasicType)[] = [];
  ret:Nullable<(ModelObjectType|ModelBasicType)> = null;

  src:Nullable<ModelFile> = null;

  regvars:ModelVariable[] = [];
  spvars:ModelVariable[] = [];
  bpvars:ModelVariable[] = [];

  xcref:ModelNativeRef[] = [];
  xdref:ModelNativeRef[] = [];
  cref:ModelNativeRef[] = [];
  dref:ModelNativeRef[] = [];

  stack?:number = -1;
  ctype:Nullable<string> = null;

  nbbs:number = -1;
  edges:number = -1;
  _r2_s:Nullable<string> = null;

  instr:ModelCpuInstruction[];

  // signature
  __s:Nullable<string> = null;

  _s:any = {};

  alias:Nullable<string> = null;
  hook:Nullable<NativeFunctionHook> = null;

  constructor(pConfig:any = null){
    super(STUB_TYPE.CALL)
    if(pConfig!==undefined)
      for(let i in pConfig)
        (this as IStringIndex<any>)[i]=pConfig[i];

  }

  /**
   * To get signature of the function
   *
   * @return {string} Signature of the method
   * @method
   * @since 1.0.0
   */
  signature():string{
    if(this.__s==null){
      if(this.src != null){
        this.__s = this.src.getName()
      }else{
        this.__s = '<unknow>';
      }

      this.__s += ':'+this.name+':0x'+this.addr.toString(16);
    }

    return this.__s as string;
  }

  addDisass(pInstrs:ModelCpuInstruction[]):void {
    this.instr = pInstrs;
  }

  getDisass():ModelCpuInstruction[] {
    return this.instr;
  }

  getAddr():number {
    return this.addr;
  }

  override getUID():string {
    return this.signature();
  }

  setDeclaringFile(pFile:ModelFile):void{
    this._s.df = pFile;
  }

  getDeclaringFile():ModelFile{
    return this._s.df;
  }

  appendStat( pName:string, pValue:any):void {
    this._s[pName] = pValue;
  }

  getStat(pName:string):any {
    return this._s[pName];
  }


  getSignature():Nullable<string> {
    return this.__s;
  }

  toJsonObjectWithCmd(pCommand:string[],fields:string[]=[],exclude:string[]=[]){
    let obj:any = this.toJsonObject(fields,exclude);

    for(let i=0; i<pCommand.length; i++){
      if( (CMD_ATTR_MAPPING as IStringIndex<any>)[pCommand[i]] != null){
        (CMD_ATTR_MAPPING as IStringIndex<any>)[pCommand[i]].map( (vAttr:any) => {
          if(typeof (this as IStringIndex<any>)[vAttr] === 'object'){
            if((this as IStringIndex<any>)[vAttr].hasOwnProperty('toJsonObject')){
              obj[vAttr] = (this as IStringIndex<any>)[vAttr].toJsonObject();
            }else{
              obj[vAttr] = (this as IStringIndex<any>)[vAttr];
            }
          }else{
            obj[vAttr] = (this as IStringIndex<any>)[vAttr];
          }
        })
      }
    }

    return obj;
  }

  toJsonObject(fields:string[]=[],exclude:string[]=[]){
    let obj:any = {};
    if(fields != null && fields.length>0){
      for(let i:number=0; i<fields.length; i++){
        if((this as IStringIndex<any>)[fields[i]] != null && (this as IStringIndex<any>)[fields[i]].toJsonObject != null){
          obj[fields[i]] = (this as IStringIndex<any>)[fields[i]].toJsonObject();
        }else{
          obj[fields[i]] = (this as IStringIndex<any>)[fields[i]];
        }
      }
    }else{
      for(let i in this){

        if(exclude.indexOf(i)>-1) continue;
        // if(fields != null && fields.indexOf(i)==-1) continue;

        switch(i){
          case "args":
            obj.args = [];
            for(let j in this.args){
              obj.args.push(this.args[j].toJsonObject());
            }
            break;
          case "src":
            obj.src = (this.src !=null ? this.src.getUID() : null);
            break;
          case "ret":
            obj.ret = (this.ret != null ? this.ret.toJsonObject() : null);
            break;
          default:
            obj[i] = this[i];
            break;
        }
      }
    }
    return obj;
  }
}
