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

import {IController, IControllerOptions} from "../../../base/controllers/IController.interface";
import {StageComponent} from "../../stage/stage.component";
import {UiController} from "../../../base/controllers/UiController";
import {Nullable} from "../../../base/Nullable";
import {FuzzerService} from "./fuzzer.service";
import FuzzSession from "../../../models/fuzz/FuzzSession";


export class FuzzerController extends UiController  implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'fuzz';
  id:Nullable<string> = null;
  app:StageComponent; // Nullable<StageComponent> = null;
  service: FuzzerService;

  constructor(pConfig:IControllerOptions) {
    super();
    this.configure(pConfig);

    this.service.show$.subscribe((vSess)=>{
        this.open(vSess,null);
    })
  }


  close(pItem: any, pSrc:any): any {

  }

  open(pItem: FuzzSession, pSrc:any): any{
    this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:pItem.getUID() });
  }
}
