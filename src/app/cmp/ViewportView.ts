import {NavbarSimpleView} from "./NavbarSimpleView";
import {ViewportTab} from "./ViewportTab";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


export class ViewportView {

  id:Nullable<string> = null;
  label:string = "label";
  icon:string = "file";
  iconColor:string = "#ccc";
  labelColor:string = "#ccc";
  ctn:string = "";

  tab: Nullable<ViewportTab> = null;
  nav: Nullable<NavbarSimpleView> = null;
  subnav: Nullable<NavbarSimpleView> = null;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }


  getNavID():string {
    if(this.nav != null){
      return this.nav.getID(this.id);
    }else{
      return "";
    }
  }

  getSubnavID():string {
    if(this.subnav != null){
      return this.subnav.getID(this.id);
    }else{
      return "";
    }
  }

  getCtnID():string {
    return this.id+'Ctn';
  }

  getNavElement():Nullable<HTMLElement> {
    return document.getElementById(this.getNavID());
  }
}
