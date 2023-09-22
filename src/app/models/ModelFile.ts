import ModelFileSection from "./ModelFileSection";
import ModelExecutableSection from "./ModelExecutableSection";
import {ModelFunction, ModelFunctionList} from "./ModelFunction";
import {IconModel} from "../base/icon/IconModel";
import DataScope from "./DataScope";
import {NodeInternalType} from "./NodeInternalType";


/**
 * Represent a file which exists into Application data,
 * at rest or at runtime
 *
 * @class
 */
export default class ModelFile
{
  __:NodeInternalType = NodeInternalType.FILE;
  _uid:string = null;
  _d:string = 'f';
  _icon?:IconModel = null;

  name:string = null;
  type:string = null;
  size:number = -1;
  path:string = null;
  location:string = null;
  //trueFile:boolean = false;

  scope:any = null;
  // scope (app package, app data, device file, ...)


  sections:ModelExecutableSection[] = [];
  fn_list:ModelFunctionList = {};

  /**
   * Additional properties/link for this node
   */
  __p:any = {};
  __t:any[] = [];


  /**
   *
   * @param {Object} pConfig
   * @constructor
   */
  constructor(pConfig:any=null){

    //this.trueFile = false;

    if(pConfig != null){
      for(let i in pConfig){

        this[i] = pConfig[i];
        /*
        if(i!=="type")
            this[i] = pConfig[i];
        else{
            if(pConfig.type instanceof EncodedDataType)
                this.type = pConfig.type;
            else
                this.type = new EncodedDataType(pConfig.type);
        }*/
      }
    }
  }

  getUID():string {
    return this._uid;
  }

  setScope(pScope:any):void {
    this.scope = pScope;
  }


  getSize():number{
    return this.size;
  }

  getPath():string{
    return this.path;
  }

  getName():string{
    return this.name;
  }

  getType():string{
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
    return this.__p.m;
  }

  static unserialize(o):ModelFile {
    return new ModelFile(o);
  }

  isExecutable():boolean {
    return (['ELF'].indexOf(this.type)>-1);
  }



  setProgramSection(pSection:ModelExecutableSection[]):void{
    this.__p.sections = pSection;
  }

  getFuncAt(pAddress:number|string):ModelFunction {
    if(!this.__p.f_list.hasOwnProperty(pAddress)){
      throw new Error("Function not found at ["+pAddress+"]");
    }

    return this.__p.f_list[pAddress];
  }

  hasScope(pScope: DataScope) {
    return (pScope.equals(this.scope));
  }
}
