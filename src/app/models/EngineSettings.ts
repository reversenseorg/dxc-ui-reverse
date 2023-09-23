import {IStringIndex} from "../base/IStringIndex";

export class EngineSettings {

  heapSize:number ;

  constructor(pConfig:any) {
    for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
  }

}
