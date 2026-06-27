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
      for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
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
