
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

import {ViewportView} from "../../cmp/ViewportView";
import {ViewportComponent} from "./viewport.component";
import {Nullable} from "../Nullable";
import {IStringIndex} from "../IStringIndex";
import {IControllerOptions} from "../controllers/IController.interface";


export interface ViewportControllerOptions extends IStringIndex<any> {
  parent?:any;
  id?:string;
  vp?: ViewportComponent;
}
export class ViewportController {

  // @ts-ignore
  parent: any;
  id:Nullable<string> = null;

  //tabTpl:
  views: ViewportView[] = [];
  vp: ViewportComponent;

  constructor(pConfig:ViewportControllerOptions) {
    this.configure(pConfig);
  }

  configure( pConfig:ViewportControllerOptions):void {
    for(let i in pConfig){
      (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }

  injectVP( pComp:any):void {
    this.vp = pComp;
  }

  getViews():ViewportView[]{
    return this.views;
  }

  createView( pView: any):void {
    this.vp.addTab(pView);
  }

  selectView( pViewUID: string):void {
    console.log("[VP CONRTOLLER] Select view UID="+pViewUID);
    this.vp.selectTabByUID2( pViewUID);
  }


  closeView( pView: any):void {
    //console.log('vp> close>',pView);
  }
}
