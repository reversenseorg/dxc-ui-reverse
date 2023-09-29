import {IStringIndex} from "./IStringIndex";

export class DxcComponent {

  configure(pConfig:any=null) :void {
    if(pConfig != null){
      for(let i in pConfig)(this as IStringIndex<any>)[i] = pConfig[i];
    }
  }
}
