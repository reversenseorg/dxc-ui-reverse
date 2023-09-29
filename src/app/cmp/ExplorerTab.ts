
import {IconModel} from "../base/icon/IconModel";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


export class ExplorerTab {

  offset:number = -1;
  label:string = "";
  icon:Nullable<IconModel> = null;
  color:string = '';


  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }


}
