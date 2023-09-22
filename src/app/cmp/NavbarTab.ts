import {NavbarSimpleView} from "./NavbarSimpleView";
import {IconView} from "./IconView";
import {IconModel} from "../base/icon/IconModel";


export class NavbarTab {

  uid:string = null;
  offset:number = -1;
  label:string = "";
  icon:IconModel = null;
  iconColor:string = '';
  color:string = '';
  closable: boolean = true;
  selected:boolean = false;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig)
        if(this.hasOwnProperty(i))
          this[i] = pConfig[i];
    }
  }


}
