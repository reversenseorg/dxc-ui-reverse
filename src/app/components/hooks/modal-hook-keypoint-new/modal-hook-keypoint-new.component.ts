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
import {HOOK_TARGET_TYPE, HookService} from "../ctrl/hook.service";
import {HOOK_ICONS} from "../icons";
import {OutputMessage} from "../../../cmp/OutputMessage";
import Hook from "../../../models/Hook";
import {NodeInternalType} from "../../../models/NodeInternalType";
import KeyPoint from '../../../models/KeyPoint';
import {IconModel} from "../../../base/icon/IconModel";
import {AbstractHook} from "../../../models/AbstractHook";
import {Nullable} from "../../../base/Nullable";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}


export type TargetNode = { alias:Nullable<string>; [key:string]: any; } | any;


@Component({
  selector: 'dxc-modal-hook-keypoint-new',
  templateUrl: './modal-hook-keypoint-new.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalHookKeypointNewComponent extends AbstractKeyboardNavigable implements OnInit {

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

  createKp: boolean = true;

  gIcons:any = GLOBAL_ICONS;
  icons:any = HOOK_ICONS;
  NODE_TYPE:any = NodeInternalType;

  item: any = null;

  private onStart:any = null;

  parentKP:Nullable<KeyPoint> = null;
  type:number = -1;
  targetName:string;
  htype:string = HOOK_TARGET_TYPE.METHOD;
  target:TargetNode = null;
  observed:Nullable<string> = null;
  ktype = 'java';
  weight = -1;
  name:string;
  descr:string;
  token:string;
  condition:string;
  code:string;
  targetIcon: IconModel = GLOBAL_ICONS['TARGET'];

  constructor( private changeDetectorRef: ChangeDetectorRef,
               private outputSvc:OutputService,
               private kbSvc:KeyboardNavigationService,
               private hookSvc:HookService) {
    super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);
    this.hookSvc.onCreateKeyPoint.subscribe( (vEvent)=>{
        this.show( vEvent.opts, vEvent.subject);
    });
  }


  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }

  prepareTemplate(pTarget:any, pOptions:any){

    switch(pTarget.__){
      case NodeInternalType.PACKAGE:
      case NodeInternalType.METHOD:
      case NodeInternalType.FIELD:
      case NodeInternalType.CLASS:
        this.targetName = (pTarget.alias ? "@"+pTarget.alias : pTarget.name);
        break;
      case NodeInternalType.FILE:
      case NodeInternalType.FUNC:
      default:
        this.targetName = pTarget.name;
        break;
    }
  }

  show( pOptions:any, pTarget:any){
    console.log("Prepare tpl kp : ",pTarget,pOptions);

    this.targetIcon = pTarget._icon!=null?pTarget._icon : GLOBAL_ICONS['TARGET'];
    this.htype = pTarget._t;
    this.type = pTarget.__; //pOptions.type;

    this.target = pTarget;
    this.prepareTemplate(pTarget, pOptions);

    this.modal.show();

    this.hookSvc.getKeyPointsOn(pTarget).subscribe( (pRes)=>{
      this.createKp = (pRes.length === 0);
    });
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

  /*
  getKeypointConfig():any {
    return {
      loadcp: this.loadCP,
      unloadcp: this.unloadCP,
      weight: this.weight,
      loc: this.location
    }
  }*/

  /**
   * To create a key point, and optionally jump to a next step
   *
   * @param pNextStep {string} Default: null. Name of the next step after key point creation
   * @method
   */
  create(pNextStep = ""):void {
    const opts:any = {
      condition:this.condition,
      weight:this.weight,
      name:this.name,
      token:this.token,
      parent:this.parentKP,
      code:this.code
    };

    console.log(this.target, opts);

    this.hookSvc.updateKeyPointsOn(this.target, opts, this.createKp).subscribe( (pRes:AbstractHook)=>{
      console.log(pRes);
      this.outputSvc.print(OutputMessage.newSuccess({ src:'Hook Manager', msg:'Hook Key point has been created successfully.'}));
      this.controller.app.getController('ctrl:hook-main').open(pRes);
      this.close();
    });

  }

  refreshToken() {
    //if(this.token.length == 0){
      this.token = `@@__KP:${this.name}__@@`;
    //}
  }

  targetHasAlias():boolean {
    return (this.target!=null && (this.target as any).alias!=null);
  }

  getTargetAlias():string {
    return (this.target as any).alias;
  }
}
