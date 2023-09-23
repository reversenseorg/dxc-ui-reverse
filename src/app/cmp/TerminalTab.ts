import {IconView} from "./IconView";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


export class TerminalTab {

  uid:Nullable<string> = null;
  offset:number = -1;
  label:string = "";
  icon:Nullable<IconView> = null;
  color:string = '';
  closable:boolean = false;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }
}
