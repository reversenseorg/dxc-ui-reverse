import {NavbarSimpleView} from "./NavbarSimpleView";
import {IconView} from "./IconView";
import {IconModel} from "../base/icon/IconModel";


export class ExplorerTab {

  offset:number = -1;
  label:string = "";
  icon:IconModel = null;
  color:string = '';


  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) this[i] = pConfig[i];
    }
  }


}
