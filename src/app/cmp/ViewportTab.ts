import {NavbarSimpleView} from "./NavbarSimpleView";
import {IconView} from "./IconView";
import {IconModel} from "../base/icon/IconModel";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


export class ViewportTab {

  uid:Nullable<string> = null;
  offset:number = -1;
  label:string = "";
  tip:string = "";
  icon:Nullable<IconView|IconModel> = null;
  color:string = '';

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }


}
