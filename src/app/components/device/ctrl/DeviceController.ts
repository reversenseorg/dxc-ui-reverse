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
import {Device} from "../../../models/Device";
import {UiController} from "../../../base/controllers/UiController";
import {DEVICE_PANEL} from "../viewport-device/viewport-device.component";
import {Nullable} from "../../../base/Nullable";
import {DeviceManagerService} from "./device-manager.service";


export class DeviceController extends UiController  implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'device';
  id:Nullable<string> = null;
  app:StageComponent; // Nullable<StageComponent> = null;
  service: DeviceManagerService;

  constructor(pConfig:IControllerOptions) {
    super();
    this.configure(pConfig);
  }

  close(pItem: any, pSrc:any): any {

  }

  open(pItem: any, pSrc:any): any{
    console.log("Open device : ", pItem);

    this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:pItem.uid });



    /*this.service.getD(pItem.name).subscribe( (pObs:any)=>{
      pObs.data._t = 'c';
      pObs.data._icon = pItem._icon;
      this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pObs.data, uid:vid });
    });*/

  }

  configureFrida(pItem: any): any{
    console.log(pItem);

    pItem.$ = DEVICE_PANEL.FRIDA;
    this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:pItem.uid, action:'fr' });
  }

  showDevProcess(subject: any) {

  }

  showDevFs(subject: any) {

  }

  configureBridge(subject: any) {

  }

  setAsDefaultBridge(subject: any) {

  }

  pullApp(subject: any) {
    console.log(" Pull app : ",subject);
  }

  attachToProject(subject: any) {
    console.log(" Attach to project : ",subject);
  }


  showNewDevice() {
    console.log(this.modalCmp.new_dev);
    this.modalCmp.new_dev.show();
  }

  removeDev(subject: any) :void {
    console.log("remove dev");

    prompt(`Are you sure to remove the device [${subject.model}:${subject.product}] ?
      This action cannot be undone (!)
      `);
  }


  processKill(subject: any) {

  }

  openFocus(pItem:Device, pTab:string, pExpl: string) {

    this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, focus:pTab, uid:pItem.uid });
  }

  doDeviceAction(pItem: any, pAction: string) {
    switch (pAction){
      case "spoof":
        // require project opened
        break;
      case "propw":
        // require project opened
        break;
      case "propr":
        // require project opened
        break;
      case "hide":
        // require project opened
        console.log('hide',pItem);
        this.service.onNewHookOfDeviceFS.next(pItem);
        break;
      case "mountrw":
        this.service.remount( pItem.dev, pItem.o, 'rw').subscribe(()=>{
          // to do
        });
        break;
      case "mountro":
        this.service.remount( pItem.dev, pItem.o, 'ro').subscribe(()=>{
          // to do
        });
        break;
    }
  }
}
