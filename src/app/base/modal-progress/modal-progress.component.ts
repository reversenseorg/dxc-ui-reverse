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
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ModalBaseComponent} from "../modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {NgbProgressbar, NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {StageComponent} from "../../components/stage/stage.component";
import {Nullable} from "../Nullable";
import {IStringIndex} from "../IStringIndex";
import {NgIf} from "@angular/common";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}


export enum ModalProgressStatus {
  NONE,
  ERROR,
  SUCCESS,
  NEW
}

export class ModalProgressEvent {

  status:ModalProgressStatus = ModalProgressStatus.NONE;

  title:string = "";

  progress:number = 0;

  msg:string = "";

  constructor( pConfig:any = {}) {
    for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
  }
}



@Component({
  selector: 'app-modal-progress',
  template: `
    <app-modal-base [name]="'pgbar'" [closable]="closable" [width]="width" [height]="130"
                    [mainController]="mainController" (open)="onOpen($event)">
      <div head *ngIf="title!=null" class="dxc-modal-header">
        {{ title }}
      </div>
      <div body class="dxc-modal-body">
        <ngb-progressbar type="info" [animated]="true" [value]="100" [max]="100" height="10px"></ngb-progressbar>
        <ng-container *ngIf="message">
          <i class="dxc-text-clear100">{{ message }}</i>
        </ng-container>
      </div>

      <div *ngIf="cancelable" footer class="row">
        <div class="col-lg-6">&nbsp;</div>
        <div class="col-lg-5 text-right pr-1 ml-0 mr-0">
          <button class="dxc-frm-btn" (click)="onCancel()">Cancel</button>
        </div>
      </div>
    </app-modal-base>
  `,
  styleUrls: ['./modal-progress.component.scss', '../../forms.scss'],
  providers: [NgbProgressbarConfig],
  imports: [
    NgbProgressbar,
    NgIf,
    ModalBaseComponent
  ],
  standalone: true
})
export class ModalProgressComponent implements OnInit {

  @Input() mainController: StageComponent;
  @Input() controller:any;
  @Input() closable:boolean = false;
  @Input() progress$:Observable<ModalProgressEvent> ;
  @Input() progressSrc:any = null;
  @Input() progress:number = 100;
  @Input() width:number = 200;
  @Input() animated:boolean = false;
  @Input() cancelable: boolean = false;
  @Input() style: string = "info";

  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:Nullable<string> = null;

  @Input() message:Nullable<string> = null;

  @Input() cancel:any;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  gIcons:any = GLOBAL_ICONS;

  item: any = null;


  constructor(private changeDetectorRef: ChangeDetectorRef,
              private config: NgbProgressbarConfig) {
    // customize default values of progress bars used by this component tree
    this.config.max = 100;
    this.config.striped = true;
    this.config.animated = true;
    //config.type = 'success';
    //config.height = '20px';
  }

  ngOnInit(): void {

    if(this.animated){
      this.config.animated = this.animated;
    }

    if(this.progress$ != null){
      this.progress$.subscribe( (pEvent:ModalProgressEvent)=>{
        //console.log(pEvent.progress=);
        if(pEvent.progress!=100){

          this.progress = 100;
        }
        this.progress = pEvent.progress;
        this.message = pEvent.msg;
      });

    }

    if(this.mainController==null){
      this.mainController = this.controller.app;
    }
  }

  show(){
    this.modal.show();
  }

  close(){
    this.modal.hide('close');
  }

  isVisible():boolean {
    return this.modal.isDisplayed();
  }

  /**
   *
   */
  resetError(pEvent:any):void{
    // if differs from enter (avoid conflict with submit on enter)
    if(pEvent.keyCode != 13){
      //this.error = null;
    }
  }

  /**
   * To initialize alias input when the modal is loaded
   *
   * TODO : param should be {ModelPackage|ModelClass|ModelField|ModelMethod} instead of event
   *
   * @param {any} pSubject
   * @method
   */
  onOpen(pSubject:any):void {

  }

  onCancel() {
    if( (this.cancel === null)
      || ((this.cancel != null) && ((this.cancel)(this)==true)) ){
        this.close()
    }
  }
}
