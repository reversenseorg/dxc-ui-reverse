/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {MenuItem, MenuView} from "./MenuView";
import {UI} from "./ui.const";
import {NavbarOption} from "./NavbarOption";
import {IconModel} from "../base/icon/IconModel";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";



export interface NavbarSimpleViewOptions extends IStringIndex<any> {
  id?:string;
  label?:string;
  color?:string;
  icon?:IconModel;
  menu?:MenuView;
  listeners?:any;
  selected?:any;
  entries?:MenuItem<any>[];
  options?:NavbarOption[];
  size?:any;
  opt?:any;
  style?:string;
}


export class NavbarSimpleView {

  id:Nullable<string> = null;
  label:Nullable<string> = null;
  color:Nullable<string> = null;
  icon:Nullable<IconModel> = null;
  menu:MenuView;
  listeners:any = {};
  selected:any = null;

  /**
   * CSS class name
   */
  style = '';

  /**
   * deprecated ?
   */
  entries: MenuItem<any>[] = [];
  options: NavbarOption[] = [];

  size:any = {
    width: UI.NAV_WIDTH,
    height: UI.NAV_HEIGHT
  };

  opt:any = null;

  constructor(pConfig:NavbarSimpleViewOptions) {
    if(pConfig != null){
      for(const i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
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
      //throw new Error(("UIException : NavbarSimpleView : menu is not defined"));
    }


  }

  selectItemByID( pName:string):any {

    if(this.menu==null){
      //throw new Error(("UIException : NavbarSimpleView : selectItemByID : menu is not defined"));
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
