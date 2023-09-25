import {IController, IControllerOptions} from "../../../base/controllers/IController.interface";
import {Subject} from "rxjs";
import {ViewportView} from "../../../cmp/ViewportView";
import {ComponentFactoryResolver} from "@angular/core";
import {AppComponent} from "../../../app.component";
import {StageComponent} from "../../stage/stage.component";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {Device} from "../../../models/Device";
import {WorkspaceController} from "../../workspace/ctrl/WorkspaceController";
import {IconModel} from "../../../base/icon/IconModel";
import {UiController} from "../../../base/controllers/UiController";
import {DEVICE_PANEL, ViewportDeviceComponent} from "../viewport-device/viewport-device.component";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {DeviceManagerService} from "./device-manager.service";


export class DeviceController extends UiController  implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'device';
  id:Nullable<string> = null;
  app: Nullable<StageComponent> = null;
  service: DeviceManagerService;

  constructor(pConfig:IControllerOptions) {
    super();
    this.configure(pConfig);
  }

  close(pItem: any, pSrc:any): any {

  }

  open(pItem: any, pSrc:any): any{
    console.log(pItem);

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
