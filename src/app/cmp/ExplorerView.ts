import {NavbarSimpleView} from "./NavbarSimpleView";
import {MenuItem} from "./MenuView";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


export class ExplorerView {
/*
  id:number = 0;
  label:string = "label";
  icon:string = "file";
  color:string = "";
  ctn:string = "";
*/
  id:Nullable<string> = null;

  nav:Nullable<NavbarSimpleView> = null;

  subnav:Nullable<NavbarSimpleView> = null;


  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }


  /*
  set id(pValue:string) {
      this.id = pValue;
      if(this.nav !== null){
        this.nav.setParentID()
      }
  }*/

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
/*
  getNavItemByName( pName:string):MenuItem {
    if(this.nav == null) throw new Error('Explorer navbar is undefined');

    return this.nav.getItem(pName);
  }*/
}
