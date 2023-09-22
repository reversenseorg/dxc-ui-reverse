import {MenuItem, MenuView} from "./MenuView";
import {UI} from "./ui.const";
import {NavbarTab} from "./NavbarTab";
import {IconModel} from "../base/icon/IconModel";


export class NavbarTabView {

  id:string = null;
  label:string = null;
  color:string = null;
  icon:IconModel = null;
  menu:MenuView = null;
  listeners:any = {};
  selected:any = null;

  tab: NavbarTab = null;

  leftTab: NavbarTab = null;
  rightTab: NavbarTab = null;

  size:any = {
    width: UI.NAV_WIDTH,
    height: UI.NAV_HEIGHT
  };

  opt:any = null;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) this[i] = pConfig[i];
    }

    if(this.selected != null){
      let el = this.menu.getItemByID(this.selected);
      if(el != null){
        this.label =  el.label;
        this.icon = el.icon;
      }
    }
  }

  selectItemByID( pName:string):any {
    let el = this.menu.getItemByID(this.selected);
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

  getDOMElement(): HTMLElement {
    return document.getElementById(this.id);
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
