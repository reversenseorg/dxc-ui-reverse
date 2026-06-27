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
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Observable} from "rxjs";
import {Nullable} from "../Nullable";
import {StageComponent} from "../../components/stage/stage.component";
import {NgIf, NgStyle} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}

@Component({
  selector: 'app-modal-base',
  template: `
    <div [class.dxc-hidden]="isActive()" [class.dxc-ztop]="isOnZTop()" class="dxc-modal draggable"
         [ngStyle]="{'display':'none'}" #modalComp (mousedown)="onMouseDown($event)">
      <div *ngIf="!headless" class="container-fluid row head" #head>
        <!--<div *ngIf="closable" class="col-lg-8 title"><ng-content select="[title]"></ng-content></div>-->
        <div class="col-lg-12 title">
          <ng-content select="[head]"></ng-content>
          <div *ngIf="closable" class="head-opts" style="position: absolute; right:0px; top:0px;">
            <ng-content select="[options]"></ng-content>
            <span class="btn-close" (click)="hide('close')"><fa-icon [icon]="['fas','xmark']"></fa-icon></span>
          </div>
        </div>
      </div>
      <div class="container-fluid body" #body>
        <ng-content select="[body]"></ng-content>
      </div>
      <div class="container-fluid footer" #footer>
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./modal-base.component.scss', '../../modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FontAwesomeModule,
    NgStyle
  ]
})
export class ModalBaseComponent implements OnInit, AfterContentInit {

  @Input() headless = false;

  /**
   * The component which hold the reference to this modal
   * It should be "stage" (top level element)
   * @field
   */
  @Input() mainController:StageComponent;

  @Input() name:any;
  @Input() options:any;
  @Input() delegateConfigure:any = null;
  @Input() preventEscClose = false;
  @Input() ztop = false;
  @Input() _time = null;


  @Input() width = 800;
  @Input() height = 400;

  @Input() x:number;
  @Input() y:number;

  @Input() beforeShow:any = null;
  @Input() keyCode:string[] = []; // not used

  @Output() open: EventEmitter<any> = new EventEmitter<any>();
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  @Input() draggable = true;
  @Input() closeOnFocusout = false;
  @Input() closable = false;
  display = false;
  rPos:any = null;
  sources:Nullable<EventSources> = null;

  @ViewChild("modalComp", {read: ElementRef}) modalEl:ElementRef;


  @ViewChild("head", {read: ElementRef, static:false}) head:ElementRef;
  @ViewChild("body", {read: ElementRef, static:false}) body:ElementRef;
  @ViewChild("footer", {read: ElementRef, static:false}) footer:ElementRef;

  private _dragging = false;

  constructor( private changeDetector:ChangeDetectorRef) { }

  ngOnInit(): void {
    // register the global into stage
    this.mainController.registerModal(this.name,this);
  }

  ngAfterContentInit() {
    this.mainController.drag$.subscribe( (pEvent:any)=>{
      if(this._dragging){
        this.modalEl.nativeElement.style.top = (pEvent.top-this.rPos.y)+'px';
        this.modalEl.nativeElement.style.left = (pEvent.left-this.rPos.x)+'px';
      }
    });

    this.mainController.drop$.subscribe( (pEvent:any)=>{
      if(this._dragging){
        this._dragging = false;
      }
    });


  }


  /**
   * To show the modal
   *
   * Emit an event on (open)
   *
   * @method
   */
  show( pOptions:any = null):void{
    if(this.beforeShow != null && (typeof (this.beforeShow) === 'function')){
      (this.beforeShow)(pOptions);
    }

    //this._time = (new Date()).getTime();
    //console.log("[modal-base] show ",pOptions,this.display, this.delegateConfigure, this.modalEl);
    if(this.display){
      if((pOptions==null) || (pOptions!=null && this.options==pOptions)){
        //this._time = (new Date()).getTime();
      }
    }

    // TODO : re-emit open() if modal is already displayed but options changed
    this.options = pOptions;

    if(this.delegateConfigure != null){
      this.delegateConfigure(pOptions);
    }

    this.display = true;

    this.x = (window.innerWidth-this.width)/2;
    this.y = (window.innerHeight-this.height)/3;

    this.modalEl.nativeElement.style.top = this.y+'px';
    this.modalEl.nativeElement.style.left = this.x+'px';

    this.modalEl.nativeElement.style.display = 'block';
    this.modalEl.nativeElement.style.width = this.width+'px';
    this.modalEl.nativeElement.style.minWidth = this.width+'px';
    this.modalEl.nativeElement.style.height = this.height+'px';
    this.modalEl.nativeElement.style.minHeight = this.height+'px';

    this.changeDetector.detectChanges();
    this.open.emit({ target: this });
  }

  /**
   * To hide a modal
   *
   * Emit an event on (close)
   *
   * @param {string} pType Type of event : escape | close
   * @return {boolean} Return TRUE if the modal has been close, else FALSE (prevented)
   * @method
   */
  hide(pType = 'close'):boolean {

    if(pType=='escape' && this.preventEscClose){
      console.log("[modal-base] Closing on ",pType," blocked");
      return false;
    }

    this.modalEl.nativeElement.style.display = 'none';
    this.close.emit({ target: this, type: pType });
    this.display = false;
    console.log("[modal-base] Closing on ",pType," done ",this.preventEscClose);
    return true;
  }

  /**
   * To check if the modal is displaed at top level
   *
   * @return {boolean} TRUE if displayed, else FALSE
   * @method
   * @since 1.0.0
   */
  isActive():boolean{
    return this.mainController.isModalRendered(this.name);
  }


  /**
   * To check if the modal is displayed
   *
   * @return {boolean} TRUE if displayed, else FALSE
   * @method
   * @since 1.0.0
   */
  isDisplayed():boolean {
    return this.display;
  }

  onMouseDown( pEvent:any):void{

    if(!this.draggable) return;
    if(pEvent.buttons!=1) return;

    // mouse down = click -> must focus active element
    // console.log('mouse down');
    if(this.mainController.focus != null){
      this.mainController.focus(this);
    }

    // dimm of dialog box
    this.width = parseFloat(window.getComputedStyle(this.modalEl.nativeElement).width);
    this.height = parseFloat(window.getComputedStyle(this.modalEl.nativeElement).height);
    // x:y of top left corner
    this.y = parseFloat(window.getComputedStyle(this.modalEl.nativeElement).top);
    this.x = parseFloat(window.getComputedStyle(this.modalEl.nativeElement).left);

    const target = this.modalEl.nativeElement;

    // position of mouse relatively to dialog top left corner
    this.rPos = {
      x: pEvent.clientX-this.x,
      y: pEvent.clientY-this.y
    };

    target.moving = true;

    const dr = (vEvent:any)=>{
      vEvent.preventDefault();

      if (!target.moving) {
        return;
      }

      if (vEvent.clientX) {
        target.distX = vEvent.clientX - this.rPos.x;
        target.distY = vEvent.clientY - this.rPos.y;
      } else {
        target.distX = vEvent.touches[0].clientX - this.rPos.x;
        target.distY = vEvent.touches[0].clientY - this.rPos.y;
      }
      //NOTICE THIS 👆

      target.style.left = target.distX + "px";
      target.style.top = target.distY + "px";
    }

    const endDrag = ()=>{
      target.moving = false;
    }

    document.onmousemove = dr;
    document.ontouchmove = dr;

    pEvent.target.onmouseup = endDrag;
    pEvent.target.ontouchend = endDrag;
  }


  /**
   * To get body height
   *
   * @return {number} Body height (pixel)
   * @method
   * @since 1.0.0
   */
  getBodyHeight():number {
    return this.height - this.head.nativeElement.offsetHeight - this.footer.nativeElement.offsetHeight;
  }


  isOnZTop() {
    return this.ztop;
  }
}
