import {MenuItem, MenuView} from "./MenuView";
import {UI} from "./ui.const";
import {NavbarTab} from "./NavbarTab";
import {IconModel} from "../base/icon/IconModel";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";

export interface NavbarTabViewOptions extends IStringIndex<any> {
  tab: NavbarTab;
  id?:Nullable<string>;
  label?:Nullable<string>;
  color?:Nullable<string>;
  icon?:Nullable<IconModel>;
  menu?:Nullable<MenuView>;
  listeners?:any;
  selected?:any;
  size?:any;
  opt?:any;
}

export class NavbarTabView {

  id:Nullable<string> = null;
  label:Nullable<string> = null;
  color:Nullable<string> = null;
  icon:Nullable<IconModel> = null;
  menu:Nullable<MenuView> = null;
  listeners:any = {};
  selected:any = null;

  tab: NavbarTab;

  /* @deprecated */

  leftTab: Nullable<NavbarTab> = null;

  /* @deprecated */
  rightTab: Nullable<NavbarTab> = null;

  size:any = {
    width: UI.NAV_WIDTH,
    height: UI.NAV_HEIGHT
  };

  opt:any = null;

  constructor(pConfig:NavbarTabViewOptions) {
    if(pConfig != null){
      for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
    }

    /*
    if(this.selected != null){
      let el = this.menu.getItemByID(this.selected);
      if(el != null){
        this.label =  el.label;
        this.icon = el.icon;
      }
    }*/

  }
/*
  selectItemByID( pName:string):any {


    if(this.menu==null){
      throw new Error(("UIException : NavbarTabView : selectItemByID : menu is not defined"));
    }


    let el = this.menu.getItemByID(this.selected);
    if(el != null){
      this.label =  el.label;
      this.icon = el.icon;
      this.selected = el.id;
    }
  }*/

  selectItem( pItem:MenuItem<any>):any {
    this.label = pItem.label;
    this.icon = pItem.icon;
    this.id = pItem.id;
  }


  hasDropDown(): boolean {
    return (this.menu != null) && (this.menu instanceof MenuView);
  }


  hasOptions(): boolean{
    return (this.opt != null);
  }

  getDOMElement(): Nullable<HTMLElement> {
    if(this.id==null){
      return null;
    }else{
      return document.getElementById(this.id);
    }
  }

  getID(pParentID:string):string{
    if(this.id==null)
      this.id = pParentID+"Nav";

    return this.id;
  }

  getWidth():number {
    return this.size.width;
  }

  getHeight():number {
    return this.size.height;
  }
}
