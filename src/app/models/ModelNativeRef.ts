import {UNKNOWN_ERROR_CODE} from "@angular/compiler-cli";
import {IStringIndex} from "../base/IStringIndex";


export enum ModelNativeRefType {
  CALL,
  CODE,
  UNKNOWN
}

export class ModelNativeRef {
  addr:number = -1;
  at:number = -1;
  __t:ModelNativeRefType = ModelNativeRefType.UNKNOWN;

  constructor(pConfig:any = null){

    if(pConfig!==undefined)
      for(let i in pConfig)
        (this as IStringIndex<any>)[i]=pConfig[i];

  }
}
