import {IStringIndex} from "../base/IStringIndex";
import {Nullable} from "../base/Nullable";

export enum OutputMessageType {
  INFO,
  ERROR,
  SUCCESS,
  WARNING,
  CONFIRM
}

export interface IOutputMessage {
  _t:OutputMessageType;
  src:any;
  msg:string;
  data:any;
  cb:Function;
}

export class OutputMessage implements IOutputMessage{

  _t:OutputMessageType = OutputMessageType.INFO;
  /**
   * Select flag
   */
  _s = false;
  src:any = null;
  msg:string = "";
  data:any = {};
  cb:Function = (()=>{});

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig)  (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }

  static newError( pConfig:any):OutputMessage
  {
    pConfig._t = OutputMessageType.ERROR;
    return new OutputMessage(pConfig);
  }

  static newWarning( pConfig:any):OutputMessage
  {
    pConfig._t = OutputMessageType.WARNING;
    return new OutputMessage(pConfig);
  }

  static newConfirm( pConfig:any, pCallback:Function):OutputMessage
  {
    pConfig._t = OutputMessageType.CONFIRM;
    pConfig.cb = pCallback;
    return new OutputMessage(pConfig);
  }

  static newSuccess( pConfig:any):OutputMessage
  {
    pConfig._t = OutputMessageType.SUCCESS;
    return new OutputMessage(pConfig);
  }

  isError():boolean {
    return this._t == OutputMessageType.ERROR;
  }

  isSuccess():boolean {
    return this._t == OutputMessageType.SUCCESS;
  }

  isWarning():boolean {
    return this._t == OutputMessageType.WARNING;
  }

  isConfirm():boolean {
    return this._t == OutputMessageType.CONFIRM;
  }

  isNotInfo():boolean {
    return this._t !== OutputMessageType.INFO;
  }

  getCallback():Function {
    return this.cb;
  }

  getDataName():string[]{
    return Object.keys(this.data);
  }

  getValue(pName:string):string[]{
    return this.data[pName];
  }

  getType():OutputMessageType {
    return this._t;
  }
}
