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
  AfterContentInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Message} from "../../../cmp/Error";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {OutputService} from "../../output/ctrl/output.service";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {HOOK_TARGET_TYPE, HOOK_VISIBILITY, HookFragmentPresetType, HookService} from "../ctrl/hook.service";
import {HOOK_ICONS} from "../icons";
import {OutputMessage} from "../../../cmp/OutputMessage";
import Hook from "../../../models/Hook";
import KeyPoint from "../../../models/KeyPoint";
import {AbstractHook} from "../../../models/AbstractHook";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {Nullable} from "../../../base/Nullable";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}


let gInstance:Nullable<ModalHookJavaNewComponent> = null;


@Component({
  selector: 'dxc-modal-hook-java-new',
  templateUrl: './modal-hook-java-new.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalHookJavaNewComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() controller:any;
  @Input() closable:boolean = true;
  @Input() progress$:Observable<any> ;
  @Input() progressSrc:any = null;
  @Input() progress:number = 20;

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

  gIcons:any = GLOBAL_ICONS;
  icons:any = HOOK_ICONS;

  item: any = null;

  private onStart:any = null;

  name:string;
  htype:string = HOOK_TARGET_TYPE.METHOD;
  loadKP:string = "";
  unloadKP:Nullable<string> = null;
  keypoints:KeyPoint[] = [];
  weight:number = 0;
  //location:string = "replace";
  location:any = {
    before:null,
    after:null,
    replace:null
  };

  target:any = null;
  visibility: string = HOOK_VISIBILITY.PRIVATE;
  unloadKP_descr: string = "";
  loadKP_descr: string = "";
  behavior: any = null;

  constructor( private changeDetectorRef: ChangeDetectorRef,
               private outputSvc:OutputService,
               private kbSvc:KeyboardNavigationService,
               private hookSvc:HookService) {
    super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);
    gInstance = this;
    this.hookSvc.onKeyPointListChange.subscribe( (kp:KeyPoint[])=>{
      if(kp !== null && Array.isArray(kp)){
        (gInstance as any).keypoints = kp;
      }else{
        (gInstance as any).keypoints = [];
      }
    });

  }




  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }


  show( pType:string, pTarget:any, pBehavior:any = null){

    // TODO : set preset name
    this.htype = pType;

    this.target = pTarget;
    this.behavior = pBehavior;
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

  getHookConfig():any {
    return {
      loadkp: this.loadKP,
      unloadkp: this.unloadKP,
      weight: this.weight,
      loc: this.location,
      behavior: this.behavior
    }
  }

  generateHook() {
    switch(this.target.__){
      case NodeInternalType.METHOD:
      case NodeInternalType.CLASS:
      case NodeInternalType.FUNC:
        console.log(this.target, this.getHookConfig());
        this.hookSvc.probe(this.target, this.getHookConfig()).subscribe( (pRes:Nullable<AbstractHook>)=>{
          if(pRes==null) return;
          console.log(pRes);
          this.outputSvc.print(OutputMessage.newSuccess({ src:'Hook Manager', msg:'Method hook has been generated successfully.'}));
          this.controller.app.getController('ctrl:hook-main').open(pRes);
          this.close();
        });
        break;
    }
  }

  /**
   * To load key point description
   * @param $event
   * @param pType
   */
  refreshKPDescr($event: Event, pType: string):void {

    const uid = (pType==='loadKP'? this.loadKP : this.unloadKP);
    for(let i=0; i<this.keypoints.length; i++){
      if(this.keypoints[i].name === uid){
        if(pType==='loadKP'){
          this.loadKP_descr = this.keypoints[i].description;
        }else{
          this.unloadKP_descr = this.keypoints[i].description;
        }
        return ;
      }
    }

    if(pType==='loadKP'){
      this.loadKP_descr = "";
    }else{
      this.unloadKP_descr = "";
    }
    return;
  }

}
