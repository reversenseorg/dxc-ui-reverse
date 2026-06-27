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

import {ExplorerView} from "../../cmp/ExplorerView";
import {ExplorerTab} from "../../cmp/ExplorerTab";
import {Observable, Subject} from "rxjs";
import {IController} from "../controllers/IController.interface";
import {AppComponent} from "../../app.component";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {Nullable} from "../Nullable";
import {IconModelCollection} from "../icon/IconModel";
import {DisplayEvent} from "../common/DisplayEvent";



export abstract class SubExplorerComponent<T> {



  id: string;

  app: Nullable<AppComponent>;

  parent: any;

  offset: number;

  controller: T;

  /**
   *
   */
  view: ExplorerView;

  /**
   *
   */
  tab: ExplorerTab;

  gIcons: IconModelCollection = GLOBAL_ICONS;

  icons: IconModelCollection = {};

  resize$: Subject<any>;

  onDisplay$: Subject<DisplayEvent> = new Subject<DisplayEvent>();

  getTab(): ExplorerTab {
    return this.tab;
  }

  //abstract onPanelResize(pEvent: any): void;

  initPanelResize(pResizeObs: Subject<any>):void{

    this.resize$ = pResizeObs;
    /*
    pObservable.subscribe( (pEvent) => {
      this.onPanelResize(pEvent);
    });*/
  }

  getID():string {
      return this.id;
  }

  getNavID():string {
    return this.id+'Nav';
  }

  beforeHide():void {
    return ;
  }

  afterHide():void {
    return ;
  }
}
