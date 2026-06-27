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

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Message} from "../../../cmp/Error";
import {FormControl} from "@angular/forms";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {DeviceController} from "../ctrl/DeviceController";
import {IconModel} from "../../../base/icon/IconModel";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {DEV_ICONS} from "../icons";
import {Device} from "../../../models/Device";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";


const BINDING:IStringIndex<any> = {
  'c':{type:'class',id:'name'},
  'm':{type:'method',id:'__signature__'},
  'f':{type:'field',id:'__signature__'},
  'p':{type:'package',id:'name'}
};

export interface BridgeOption{
  value:string;
  label:string;
  disabled:boolean;
}

const BridgeOptions:IStringIndex<BridgeOption[]> = {
  android: [
    {value:"adb+usb", label:"adb+usb", disabled:false},
    {value:"adb+tcp", label:"adb+tcp", disabled:false},
    {value:"vadb", label:"Virtual", disabled:false},
    {value:"acorellium", label:"Corellium", disabled:true}
  ],
  tizen: [
    {value:"sdb+usb", label:"sdb+usb", disabled:true},
    {value:"sdb+tcp", label:"sdb+tcp", disabled:true},
    {value:"vsdb", label:"Virtual", disabled:true},
  ],
  ios: [
    {value:"vios", label:"Virtual", disabled:false},
    {value:"usb+usb", label:"usb+ssh", disabled:true},
    {value:"icorellium", label:"Corellium", disabled:true}
  ],
  linux: [
    {value:"ssh", label:"ssh", disabled:true},
    {value:"local", label:"local", disabled:false},
    {value:"virt", label:"Virtual", disabled:false},
  ],
  macos: [],
  fw: []
};
BridgeOptions['macos'] = BridgeOptions['linux'];
BridgeOptions['fw'] = BridgeOptions['linux'];

@Component({
  selector: 'app-modal-dm',
  templateUrl: './modal-dm.component.html',
  styleUrls: ['../device.component.scss','../../../forms.scss']
})
export class ModalDmComponent implements OnInit {

  @Input() controller:DeviceController;

  aliasControl = new FormControl('');
  error:Nullable<Message> = null;

  @ViewChild('msgBox', {read:ElementRef, static:false}) msgEl:ElementRef;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  icons:any = DEV_ICONS;
  gIcons:any = GLOBAL_ICONS;

  message:Nullable<Message> = null;
  item: any = null;

  targetOs = "";
  targetBridge = "";

  virtualDev = false;

  mode = "";

  bridge:Nullable<string> = null;

  bridges:BridgeOption[] = [];

  portNb = 2222;
  opts:any =  null;
  devices:Device[] = [];
  ip: any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {

  }




  show(){
//    console.log(this.msgEl);
    this.modal.show();
  }
  connect(){

  }

  createDevice(){

  }


  /**
   *
   */
  resetError(pEvent:any):void{
    // if differs from enter (avoid conflict with submit on enter)
    if(pEvent.keyCode != 13){
      this.error = null;
    }
  }

  /**
   * To initialize when the modal is loaded
   *
   * @param {any} pSubject
   * @method
   */
  onOpen(pSubject:any):void {
    return ;
  }

  selectDevice(dev: Device) {

  }

  /**
   * To detect if bridge is ready to be use to scan for device
   *
   * @method
   * @return {boolean}
   * @since 1.0.0
   */
  isBridgeReady():boolean {
    if((this.bridge!=null) && ["adb+usb","sdb+usb","jtag","serial"].indexOf(this.bridge)>-1){
      return true;
    }else if(this.opts != null){
      return true;
    }else
      return false;
  }

  hasOptions() {
    return ((this.bridge!=null) && (["adb+tcp","sdb+tcp","usb+ssh","ssh"].indexOf(this.bridge)>-1));
  }

  restartADB() {
//    this.controller.restartADB();
  }

  /**
   * To update bridges list according to selected target OS
   *
   * @param pEvent
   */
  updateBridgeList(pEvent: string) {
    this.targetOs = pEvent;
    this.bridges = BridgeOptions[pEvent];
  }

  onTargetBridgeChange(pEvent: string) {
    this.bridge = pEvent;
    switch(pEvent){
      case "adb+usb":
      case "sdb+usb":
        this.mode = "usb";
        this.virtualDev = false;
        break;
      case "adb+tcp":
      case "usb+ssh":
      case "sdb+tcp":
      case "ssh":
        this.mode = "net";
        this.virtualDev = false;
        break;
      case "vadb":
      case "vsdb":
      case "vios":
      case "virt":
        this.virtualDev = true;
        break;
    }
  }

  submit() {

  }

  close() {
    this.modal.hide();
  }
}
