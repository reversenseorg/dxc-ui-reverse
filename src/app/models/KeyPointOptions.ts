import {IStringIndex} from "../base/IStringIndex";

export default class KeyPointOptions {
  parent:string;
  token:string;
  weight:number;
  descr:string;
  condition = "";
  name: string;

  constructor(pConfig:any = null) {
    if(pConfig != null){
      for(const i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }
}
