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
