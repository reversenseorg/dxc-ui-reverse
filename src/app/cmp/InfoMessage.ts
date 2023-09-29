import {IStringIndex} from "../base/IStringIndex";


export enum INFO_TYPE {
  NOTICE,
  WARNING,
  ERROR,
  FATAL
}
export class InfoMessage {

  type:INFO_TYPE = INFO_TYPE.NOTICE;
  msg:string = "";

  constructor( pConfig:any={}) {
    for(let i in pConfig)
      (this as IStringIndex<any>)[i] = pConfig[i];
  }
}
