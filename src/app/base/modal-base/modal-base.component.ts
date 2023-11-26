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


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}

@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html',
  styleUrls: ['./modal-base.component.scss','../../modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalBaseComponent implements OnInit, AfterContentInit {

  @Input() headless = false;
  @Input() mainController:any
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

  draggable = true;
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

    // mouse down = click -> must focus active element
    // console.log('mouse down');
    this.mainController.focus(this);

    this.width = parseFloat(window.getComputedStyle(this.modalEl.nativeElement).width);
    this.height = parseFloat(window.getComputedStyle(this.modalEl.nativeElement).height);
    this.y = parseFloat(window.getComputedStyle(this.modalEl.nativeElement).top);
    this.x = parseFloat(window.getComputedStyle(this.modalEl.nativeElement).left);

    this.rPos = {
      x: pEvent.clientX-this.x,
      y: pEvent.clientY-this.y
    };

    this._dragging = true;

    // this.changeDetector.detectChanges();
    this.mainController.startDrag('ataw', this);
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
