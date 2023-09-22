import {NavbarSimpleView} from "./NavbarSimpleView";
import {IconView} from "./IconView";
import {IconModel} from "../base/icon/IconModel";


export class ViewportTab {

  uid:string = null;
  offset:number = -1;
  label:string = "";
  tip:string = "";
  icon:IconView|IconModel = null;
  color:string = '';

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) this[i] = pConfig[i];
    }
  }


}
