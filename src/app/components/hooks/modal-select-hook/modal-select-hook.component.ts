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
import KeyPoint from "../../../models/KeyPoint";
import {Nullable} from "../../../base/Nullable";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}




@Component({
  selector: 'dxc-modal-select-hook',
  templateUrl: './modal-select-hook.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalSelectHookComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() controller:any;
  @Input() closable:boolean = true;

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
  target:any = null;
  observed:Nullable<string> = null;
  currentHK:Nullable<KeyPoint> = null;
  selectedHK:Nullable<KeyPoint> = null;
  hkList:Hook[] = [];

  constructor( private changeDetectorRef: ChangeDetectorRef,
               private outputSvc:OutputService,
               private kbSvc:KeyboardNavigationService,
               private hookSvc:HookService) {
    super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);
    this.hookSvc.listHooks().subscribe( (kp:any) => {
      console.log("SELECT HOOK : List hooks : ",kp);
      //this.hkList = kp;
    });
  }


  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }


  show( pType:string, pTarget:any){
    console.log('SELECT HK MODAL !',pType,pTarget);
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

  validateHK() {
    console.log(this.selectedHK);
  }
}
