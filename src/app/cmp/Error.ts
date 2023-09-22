

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
  src: string = null;
  msg: string = '';

  constructor(pConfig:any={}) {
    for(let i in pConfig) if(this.hasOwnProperty(i)) this[i] = pConfig[i];
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
