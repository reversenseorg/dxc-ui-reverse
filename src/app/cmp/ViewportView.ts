import {NavbarSimpleView} from "./NavbarSimpleView";
import {ViewportTab} from "./ViewportTab";


export class ViewportView {

  id:string = null;
  label:string = "label";
  icon:string = "file";
  iconColor:string = "#ccc";
  labelColor:string = "#ccc";
  ctn:string = "";

  tab: ViewportTab = null;
  nav:NavbarSimpleView = null;
  subnav:NavbarSimpleView = null;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) this[i] = pConfig[i];
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

  getNavElement():HTMLElement {
    return document.getElementById(this.getNavID());
  }
}
