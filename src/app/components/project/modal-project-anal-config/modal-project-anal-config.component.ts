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
  Component, ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Message} from "../../../cmp/Error";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {NewProjectRequest, ProjectAnalyzerConfiguration, ProjectService} from "../ctrl/project.service";
import {DeviceManagerService} from "../../device/ctrl/device-manager.service";
import {PlatformService} from "../../platform/ctrl/platform.service";
import {OutputService} from "../../output/ctrl/output.service";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {Nullable} from "../../../base/Nullable";
import {DeviceBindedData} from "../../device/common";
import AppPackage from "../../../models/AppPackage";
import {Device} from "../../../models/Device";



@Component({
  selector: 'dxc-modal-project-anal-config',
  templateUrl: './modal-project-anal-config.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalProjectAnalConfigComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() controller:any;
  @Input() closable:boolean = true;
  @Input() progress$:Observable<any> ;
  @Input() progressSrc:any = null;
  @Input() progress:number = 20;

  @Input() platform:string = 'android';

  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:Nullable<string> = null;

  @Input() message:Nullable<Message> = null;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;
  //@ViewChild("selectABI", {read: ElementRef}) selectABIref: ElementRef;

  gIcons:any = GLOBAL_ICONS;

  device:Nullable<Device>  = null;

  item: any = null;

  private onStart:Nullable<((vOpts:ProjectAnalyzerConfiguration)=>any)> = null;
  // model


  /**
   * File Analysis mode
   * @type {string}
   * @field
   */
  fa_mode = "deep";

  /**
   * Value of Merge Splitted APK option
   * @type {boolean}
   * @field
   */
  msa_auto = true;

  /**
   * Value of Search Splitted APK option
   * @type {boolean}
   * @field
   */
  ssa_auto = true;

  @Input() na_force = false;



  /**
   * Auto-analysis of embedded Native Libraries
   * @type {boolean} If TRUE, native libraries will be analysed automatically
   * @field
   */
  na_auto = false;

  /**
   * ABI to use during first analysis
   * @type {string} ABI name
   * @field
   */
  abi = "arm64-v8a";



  /**
   * List of supported ABI
   * @type {any[]}
   * @field
   */
  supportedAbi:any[] = [];

  /**
   * Device to use to perform dynamic analysis target
   */
  da_target: string = "another";

  constructor( private changeDetectorRef: ChangeDetectorRef,
               private devSvc:DeviceManagerService,
               private platformSvc:PlatformService,
               private outputSvc:OutputService,
               private kbSvc:KeyboardNavigationService,
               private projSvc:ProjectService) {
    super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);
    this.projSvc.listSupportedAbi().subscribe((ABIs)=>{
      this.supportedAbi = ABIs;
    });
    //console.log("selectABIref",this.selectABIref);
    //this.selectABIref.nativeElement.onMouseDown(()=>{});
  }


  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }


  show( pForceNative:boolean, pStartCallback:any = null){
    this.na_force = pForceNative;
    this.onStart = pStartCallback;
    this.modal.show();
  }

  /**
   * To display configuration modal when an app package is
   * picked from a connected device.
   *
   * Origin : 'device:app'
   *
   *
   * @param pRequest
   */
  showFromApp( pRequest:NewProjectRequest<DeviceBindedData<AppPackage>>){
    this.na_force = pRequest.force_native;
    this.onStart = pRequest.onStart;

    if(pRequest.data!=null){
      if(pRequest.data.dev!=null){
        this.device = pRequest.data.dev;
        // IMPORTANT : Do not change, `this.platform` must be null, if the device platformù is unknow
        this.platform = pRequest.data.dev.platform;

        this.da_target = "same";
      }
    }

    this.modal.show();
  }

  close(){
    this.modal.hide('close');
  }


  /**
   * Callback for 'beforeClose' modal component input
   */
  beforeModalClose(){
    console.log("Prevent escape closing ...");
    return false;
  }

  /**
   * To start app analysis
   * @method
   */
  startAnalysis(){
    if(this.onStart != null){
      this.close();
      (this.onStart)({
        na_auto: this.na_auto,
        fa_mode: this.fa_mode,
        msa_auto: this.msa_auto,
        ssa_auto: this.ssa_auto,
        da_target: this.da_target,
        abi: this.abi
      });
    }
  }

  /**
   * To check if the new project  is an Android app
   *
   * Depending on available data, various checks can be done :
   * - platform
   * - bridge name
   *
   * @method
   */
  isAndroid() {
    return (this.platform === 'android')
        ||(this.device?.bridge?.startsWith("adb+"));
  }

  /**
   * To check if the new project  is an Android app
   *
   * Depending on available data, various checks can be done :
   * - platform
   * - bridge name
   *
   * @method
   */
  isTizen() {
    return (this.platform === 'tizen')
        ||(this.device!=null && this.device.bridge.startsWith("sdb+"));
  }

  /**
   *
   * @method
   */
  isIOS() {
    return (this.platform === 'ios');
  }
}
