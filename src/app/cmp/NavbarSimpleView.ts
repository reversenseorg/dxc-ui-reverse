import {MenuItem, MenuView} from "./MenuView";
import {IconView} from "./IconView";
import {UI} from "./ui.const";
import {NavbarOption} from "./NavbarOption";
import {IconModel} from "../base/icon/IconModel";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";




export class NavbarSimpleView {

  id:Nullable<string> = null;
  label:Nullable<string> = null;
  color:Nullable<string> = null;
  icon:Nullable<IconModel> = null;
  menu:Nullable<MenuView>  = null;
  listeners:any = {};
  selected:any = null;

  /**
   * CSS class name
   */
  style = '';

  entries: MenuItem<any>[] = [];
  options: NavbarOption[] = [];

  size:any = {
    width: UI.NAV_WIDTH,
    height: UI.NAV_HEIGHT
  };

  opt:any = null;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(const i in pConfig) if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
    }

    if(this.menu != null){
      if(this.selected != null){
        const el = this.menu.getItemByID(this.selected);
        if(el != null){
          this.label =  el.label;
          this.icon = el.icon;
        }
      }
    }else{
      throw new Error(("UIException : NavbarSimpleView : menu is not defined"));
    }


  }

  selectItemByID( pName:string):any {

    if(this.menu==null){
      throw new Error(("UIException : NavbarSimpleView : selectItemByID : menu is not defined"));
    }

    const el = this.menu.getItemByID(this.selected);
    if(el != null){
      this.label =  el.label;
      this.icon = el.icon;
      this.selected = el.id;
    }
  }

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

  getID(pParentID:Nullable<string>):string{
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
