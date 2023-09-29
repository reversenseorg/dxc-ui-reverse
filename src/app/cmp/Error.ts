import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


export enum MessageType {
  ERROR = 'err',
  WARNING = 'warn',
  SUCCESS = 'ok',
  INFO = '-'
}

/**
 * @class
 */
export class Message {
  type: MessageType = MessageType.INFO;
  src: Nullable<string> = null;
  msg: string = '';

  constructor(pConfig:any={}) {
    for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
  }

  // shortcut
  isError():boolean{
    return this.type==MessageType.ERROR;
  }

  isWarning():boolean{
    return this.type==MessageType.WARNING;
  }

  isSuccess():boolean{
    return this.type==MessageType.SUCCESS;
  }

  getMessage():string {
    return this.msg;
  }
}
