import {Savable, STUB_TYPE} from "./ModelSavable";
import {NodeInternalType} from "./NodeInternalType";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


export default class ModelStringValue extends Savable
{
  override __:NodeInternalType = NodeInternalType.STRING;

  // SRC_NODE_TYPE : SRC_UUID : STR_TYPE : UID
  override _uid:string;

  src:any = null;
  instr:any = null;
  value:Nullable<string> = null;
  override tags:number[] = [];

  constructor(pConfig:any=null) {
    super(STUB_TYPE.STRING_VALUE);

    if(pConfig !== null)
      for(const i in pConfig)
        (this as IStringIndex<any>)[i] = pConfig[i];
  }


  toJsonObject():any{
    const o:any = {};
    o.__ = this.__;
    o.value = this.value;
    o.instr = this.instr.toJsonObject();
    o.tags = this.tags;
    return o;
  }

}
