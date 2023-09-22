
export enum OutputMessageType {
  INFO,
  ERROR,
  SUCCESS,
  WARNING,
  CONFIRM
}

export class OutputMessage {

  _t:OutputMessageType = OutputMessageType.INFO;
  src:any = null;
  msg:string = "";
  data:any = {};
  cb:Function = null;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) this[i] = pConfig[i];
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
