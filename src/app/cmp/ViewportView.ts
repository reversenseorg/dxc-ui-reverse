import {NavbarSimpleView} from "./NavbarSimpleView";
import {ViewportTab} from "./ViewportTab";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";
import {UIException} from "../base/error/UIException";

export interface ViewportViewOptions extends IStringIndex<any>{
  id?:Nullable<string>;
  label?:string;
  icon?:string;
  iconColor?:string;
  labelColor?:string;
  ctn?:string;
  tab: ViewportTab;
  nav?: Nullable<NavbarSimpleView>;
  subnav?: Nullable<NavbarSimpleView>;
}

export class ViewportView {

  id:Nullable<string> = null;
  label:string = "label";
  icon:string = "file";
  iconColor:string = "#ccc";
  labelColor:string = "#ccc";
  ctn:string = "";

  tab: ViewportTab;
  nav: Nullable<NavbarSimpleView> = null;
  subnav: Nullable<NavbarSimpleView> = null;

  constructor(pConfig:ViewportViewOptions) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
    }

    if(pConfig.tab==null){
      //throw UIException.
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
