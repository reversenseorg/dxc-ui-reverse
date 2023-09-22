import {Savable, STUB_TYPE} from "./ModelSavable";
import {NodeInternalType} from "./NodeInternalType";


export default class ModelStringValue extends Savable
{
  __:NodeInternalType = NodeInternalType.STRING;

  // SRC_NODE_TYPE : SRC_UUID : STR_TYPE : UID
  _uid:string;

  src:any = null;
  instr:any = null;
  value:string = null;
  tags:number[] = [];

  constructor(pConfig:any=null) {
    super(STUB_TYPE.STRING_VALUE);

    if(pConfig !== null)
      for(const i in pConfig)
        this[i] = pConfig[i];
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
