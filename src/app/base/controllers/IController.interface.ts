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

import {Observable, Subject} from "rxjs";
import {ComponentFactoryResolver} from "@angular/core";
import {ViewportComponent} from "../viewport/viewport.component";
import {AppComponent} from "../../app.component";
import {StageComponent} from "../../components/stage/stage.component";
import {Nullable} from "../Nullable";
import {DxcApiService} from "../DxcApiService";
import {IStringIndex} from "../IStringIndex";


export interface ViewCmpMap {
  main?:any,
  [name :string] :any;
}

export interface ExplorerCmpMap {
  [name :string] :any;
}

export interface TerminalCmpMap {
  [name :string] :any;
}

export interface IControllerOptions extends IStringIndex<any>{
  service: DxcApiService|any;
  explorerCmp?: ExplorerCmpMap;
  viewCmp?: ViewCmpMap;
  terminalCmp?:any;
  modalCmp?:any;
}

export interface IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:Nullable<string>;

  id: Nullable<string>;
  app: Nullable<StageComponent>; /* AppComponent */

  service: any;
  componentFactoryResolver: Nullable<ComponentFactoryResolver>;

  explorerCmp: any;
  viewCmp: ViewCmpMap;
  terminalCmp: any;
  modalCmp: any;

  openView: Observable<any>;
  closeView: Observable<any>;
  focusView: Observable<any>;

  //constructor( pOptions:IControllerOptions):void;

  open(pItem: any, pSrc:any): any;
  close(pItem: any, pSrc:any): any;
}
