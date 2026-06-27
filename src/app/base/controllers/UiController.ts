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

import {IControllerOptions, ViewCmpMap} from "./IController.interface";
import {Subject} from "rxjs";
import {ViewportView} from "../../cmp/ViewportView";
import {IStringIndex} from "../IStringIndex";
import {ComponentFactoryResolver} from "@angular/core";
import {Nullable} from "../Nullable";


export class UiController {


  explorerCmp: any = null;
  viewCmp: ViewCmpMap = {};
  terminalCmp: any = null;
  modalCmp: any = null;


  componentFactoryResolver:Nullable<ComponentFactoryResolver> = null;

  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();


  views:ViewportView[] = [];

  configure( pConfig:IControllerOptions):void {
    if(pConfig==null) return;

    for(let i in pConfig){
      (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }


  getExplorerCmp():any {
    return this.explorerCmp.main;
  }

  // Contextual menu shared between sub component
  protected _ctxMenu:any = {};

  registerCtxMenu( pName:string, pCmp:any):void {
    this._ctxMenu[pName] = pCmp;
  }

  displayCtxMenu(pEvent:any, pType:string, pObject:any):void{
    if(this._ctxMenu.hasOwnProperty(pType)){
      this._ctxMenu[pType].displayCtxMenu(pEvent, pType, pObject);
    }
  }

  getViews():ViewportView[]{
    return this.views;
  }
}
