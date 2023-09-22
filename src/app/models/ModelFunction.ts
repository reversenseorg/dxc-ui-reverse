import {NodeType} from "./NodeType";
import {ModelBasicType, ModelObjectType} from "./ModelType";
import ModelFile from "./ModelFile";
import ModelCpuInstruction from "./ModelCpuInstruction";
import {ModelVariable} from "./ModelVariable";
import {ModelNativeRef} from "./ModelNativeRef";
import {NodeInternalType} from "./NodeInternalType";
import {Savable, STUB_TYPE} from "./ModelSavable";

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

  __:NodeInternalType = NodeInternalType.FUNC;
  _t:NodeType = NodeType.FUNC;

  sz:number = -1;

  /**
   * Count of basic blocks
   */
  bbs:number = -1;

  addr:number = -1;

  name: string = null;
  symbol: string = null;

  args:(ModelObjectType|ModelBasicType)[] = [];
  ret:(ModelObjectType|ModelBasicType) = null;

  src:ModelFile = null;

  regvars:ModelVariable[] = [];
  spvars:ModelVariable[] = [];
  bpvars:ModelVariable[] = [];

  xcref:ModelNativeRef[] = [];
  xdref:ModelNativeRef[] = [];
  cref:ModelNativeRef[] = [];
  dref:ModelNativeRef[] = [];

  stack?:number = -1;
  ctype:string = null;

  nbbs:number = -1;
  edges:number = -1;
  _r2_s:string = null;

  instr:ModelCpuInstruction[];

  // signature
  __s:string = null;

  _s:any = {};

  constructor(pConfig:any = null){
    super(STUB_TYPE.CALL)
    if(pConfig!==undefined)
      for(let i in pConfig)
        this[i]=pConfig[i];

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

    return this.__s;
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

  getUID():string {
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


  getSignature():string {
    return this.__s;
  }

  toJsonObjectWithCmd(pCommand:string[],fields:string[]=[],exclude:string[]=[]){
    let obj:any = this.toJsonObject(fields,exclude);

    for(let i=0; i<pCommand.length; i++){
      if( CMD_ATTR_MAPPING[pCommand[i]] != null){
        CMD_ATTR_MAPPING[pCommand[i]].map( vAttr => {
          if(typeof this[vAttr] === 'object'){
            if(this[vAttr].hasOwnProperty('toJsonObject')){
              obj[vAttr] = this[vAttr].toJsonObject();
            }else{
              obj[vAttr] = this[vAttr];
            }
          }else{
            obj[vAttr] = this[vAttr];
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
        if(this[fields[i]] != null && this[fields[i]].toJsonObject != null){
          obj[fields[i]] = this[fields[i]].toJsonObject();
        }else{
          obj[fields[i]] = this[fields[i]];
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
            obj.ret = this.src.getUID();
            break;
          case "ret":
            obj.ret = this.ret.toJsonObject();
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
