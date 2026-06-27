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
  AfterContentInit, AfterViewInit, ChangeDetectorRef,
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
import {IKeyboardNavigable} from "../../../base/keyboard/IKeyboardNavigable";
import {TopologyService} from "../ctrl/topology.service";
import AndroidComponent from "../../../models/android/AndroidComponent";
import {IntentDataCriteria} from "../../../models/android/Intent";
import {IntentFilter} from "../../../models/android/IntentFilter";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {Nullable} from "../../../base/Nullable";
import {StageComponent} from "../../stage/stage.component";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}

@Component({
  selector: 'dxc-modal-send-intent',
  templateUrl: './modal-send-intent.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalSendIntentComponent  extends AbstractKeyboardNavigable implements OnInit,AfterViewInit {

  @Input() controller:any;
  @Input() closable:boolean = true;
  @Input() progress$:Observable<any> ;
  @Input() progressSrc:any = null;
  @Input() progress:number = 20;

  @Input() comp:AndroidComponent;
  @Input() filter:IntentFilter;
  @Input() criteria:Nullable<IntentDataCriteria>;

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
  item: any = null;
  focusEl: number = -1;


  onKeyboardEvent:Subject<any> = new Subject<any>();

  constructor(private topoSvc:TopologyService) {

    super();
    // customize default values of progress bars used by this component tree
    //config.max = 100;
    //config.striped = false;
    //config.animated = true;
    //config.type = 'success';
    //config.height = '20px';
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    //this.refresh();
    /*this.progress$.subscribe( (pProgress:any)=>{
      console.log(pProgress);
      this.progress = pProgress.value;
      this.message = pProgress.msg;
    });*/

    console.log("modal-send-intent : ", this.controller);
    console.log("model-send-intent modal > ",this.modal);

    if((this.controller.app as StageComponent).getModal(this.modal.name)==null){
      (this.controller.app as StageComponent).registerModal(this.modal.name, this.modal);
    }


    this.onKeyboardEvent.subscribe( pEvent => {

    })
  }


  show(){
    this.modal.show();
    //this.kbSvc.focus()
  }

  close(){
    this.modal.hide('close');
  }

  sendIntent(pConfig: any, pIndex:number = -1):void {
      this.focusEl = pIndex;
      throw new Error("sendIntent is not implemented")
      /*this.topoSvc.sendIntent().subscribe( (pEvent)=>{
        //this.selected = pEvent;
        //this.selected.icon = pEvent.icon==null ? new AppIcon({ localPath:"/assets/icons/dexcalibur_32.png" }) : pEvent.icon;
      });*/
  }


  // TODO : remove
  // @HostListener('document:keydown.escape')
  onEscape(){
    if(this.modal.isDisplayed()){
      this.close();
    }
  }

  onKeyPress(pEvent: any) {
    console.log("key press",pEvent);
  }

}
