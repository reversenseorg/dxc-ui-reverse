import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";
import {IconModel} from "../base/icon/IconModel";


export class TerminalTab {

  uid:Nullable<string> = null;
  offset:number = -1;
  label:string = "";
  icon:Nullable<IconModel> = null;
  color:string = '';
  closable:boolean = false;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }
}
