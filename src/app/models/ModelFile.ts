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

import ModelFileSection from "./ModelFileSection";
import ModelExecutableSection from "./ModelExecutableSection";
import {ModelFunction, ModelFunctionList} from "./ModelFunction";
import {IconModel} from "../base/icon/IconModel";
import DataScope from "./DataScope";
import {NodeInternalType} from "./NodeInternalType";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";
import {RenderedModelNode, RenderingOptions} from "../base/RenderedModelNode";

const def:RenderingOptions = { view:"txt" };

export type FunctionSymbol = string;
export interface AdressableMapping<T>  extends IStringIndex<T>{
  [hexa:string|number] :T
}
export interface ExtraAnalyzedPpt extends IStringIndex<any>{
  fn?: AdressableMapping<FunctionSymbol>,
  imp?: AdressableMapping<ModelFunction>, // imported
  f_list?: AdressableMapping<ModelFunction>, // local
  fn_list?: AdressableMapping<ModelFunction>, // exported
  m?:ModelFileSection[],
  sections?:ModelExecutableSection[],
  [extra:string]:any
}

/**
 * Represent a file which exists into Application data,
 * at rest or at runtime
 *
 * @class
 */
export default class ModelFile extends RenderedModelNode
{
  __:NodeInternalType = NodeInternalType.FILE;
  _uid:Nullable<string> = null;
  _d:string = 'f';
  _icon?:Nullable<IconModel> = null;

  name:Nullable<string> = null;
  type:Nullable<string> = null;
  size:number = -1;
  path:Nullable<string> = null;
  location:Nullable<string> = null;
  //trueFile:boolean = false;

  scope:any = null;
  // scope (app package, app data, device file, ...)


  sections:ModelExecutableSection[] = [];
  fn_list:ModelFunctionList = {};

  /**
   * Additional properties/link for this node
   */
  __p:ExtraAnalyzedPpt = {};
  __t:any[] = [];


  /**
   *
   * @param {Object} pConfig
   * @constructor
   */
  constructor(pConfig:any=null){
      super(def);
    //this.trueFile = false;

    if(pConfig != null){
      for(let i in pConfig){

        (this as IStringIndex<any>)[i] = pConfig[i];
        /*
        if(i!=="type")
            (this as IStringIndex<any>)[i] = pConfig[i];
        else{
            if(pConfig.type instanceof EncodedDataType)
                this.type = pConfig.type;
            else
                this.type = new EncodedDataType(pConfig.type);
        }*/
      }
    }
  }

  getUID():Nullable<string> {
    return this._uid;
  }

  setScope(pScope:any):void {
    this.scope = pScope;
  }


  getSize():number{
    return this.size;
  }

  getPath():Nullable<string>{
    return this.path;
  }

  getName():Nullable<string>{
    return this.name;
  }

  getType():Nullable<string>{
    return this.type;
  }


  /**
   * To get all sections
   *
   * @return {ModelFileSection[]} data fragment contained into the file
   * @method
   * @since 1.0.0
   */
  getSections():ModelFileSection[] {
    return (this.__p.m!=null ? this.__p.m : []);
  }

  static unserialize(o:any):ModelFile {
    return new ModelFile(o);
  }

  isExecutable():boolean {
    return (this.type!=null) && (['ELF'].indexOf(this.type)>-1);
  }



  setProgramSection(pSection:ModelExecutableSection[]):void{
    this.__p.sections = pSection;
  }

  getFuncAt(pAddress:number|string):ModelFunction {
    if(this.__p.f_list ==null || this.__p.f_list[pAddress]==null){
      throw new Error("Function not found at ["+pAddress+"]");
    }

    return this.__p.f_list[pAddress];
  }

  hasScope(pScope: DataScope) {
    return (pScope.equals(this.scope));
  }
}
