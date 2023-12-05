import {IStringIndex} from "../base/IStringIndex";
import {Nullable} from "../base/Nullable";



export default class BusEvent
{
  type:Nullable<string> = null;
  data:any = {};
  __i:string[] = [];

  constructor(pConfig:any=null) {
    if(pConfig!=null)
      for(let i in pConfig)
        (this as IStringIndex<any>)[i] = pConfig[i];
  }

  getType():Nullable<string>{
    return this.type;
  }

  getData():any{
    return this.data;
  }
}
