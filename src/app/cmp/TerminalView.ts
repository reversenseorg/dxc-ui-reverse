import {NavbarSimpleView} from "./NavbarSimpleView";
import {TerminalTab} from "./TerminalTab";
import {NavbarTabView} from "./NavbarTabView";
import {IconView} from "./IconView";


export class TerminalView {

  id:string = null;
  label:string = "label";
  icon: IconView = null
  labelColor:string = "#ccc";
  ctn:string = "";

  tab: TerminalTab = null;
  nav:NavbarSimpleView = null;
  navtab:NavbarTabView = null;
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
