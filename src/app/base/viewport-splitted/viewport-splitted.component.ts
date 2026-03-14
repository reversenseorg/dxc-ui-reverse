import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import ModelClass from "../../models/ModelClass";
import {IController} from "../controllers/IController.interface";
import {NgClass, NgIf, NgStyle} from "@angular/common";


@Component({
  selector: 'app-viewport-splitted',
  template: `
    <ng-container *ngIf="type=='1:2'">
      <div class="container-fluid row dxc-no-gutters viewport-splitted" [ngStyle]="{ height: heightPct+'%' }" #2colLayout>
        <div class="ctn-code-left p-0" [ngClass]="getCssClass('left-ctn')" #leftCtn>
          <ng-content select="[nav-left]"></ng-content>
          <div class="host-left" [ngClass]="getCssClass('left-body')"  #leftVH leftViewHost>
            <ng-content select="[body-left]"></ng-content>
          </div>
        </div>
        <div class="ctn-code-right p-0" [ngClass]="getCssClass('right-ctn')"  #rightCtn>
          <ng-content select="[nav-right]"></ng-content>
          <div class="host-right" [ngClass]="getCssClass('right-body')"  #rightVH rightViewHost>
            <ng-content select="[body-right]"></ng-content>
          </div>
        </div>
      </div>
    </ng-container>
    <ng-container *ngIf="type=='2:1'">
      <div class="container-fluid viewport-splitted" [ngStyle]="{ height: heightPct+'%' }" #2rowLayout>
        <div class="ctn-code-top p-0" [ngClass]="getCssClass('top-ctn')"  #topCtn>
          <ng-content select="[nav-top]"></ng-content>
          <div class="host-top p-0" [ngClass]="getCssClass('top-body')"  topViewHost>
            <ng-content select="[body-top]"></ng-content>
          </div>
        </div>
        <div class="ctn-code-bottom p-0" [ngClass]="getCssClass('bottom-ctn')"  #bottomCtn>
          <ng-content select="[nav-bottom]"></ng-content>
          <div class="host-bottom p-0" [ngClass]="getCssClass('bottom-body')"  bottomViewHost>
            <ng-content select="[body-bottom]"></ng-content>
          </div>
        </div>
      </div>
    </ng-container>

  `,
  styleUrls: ['./viewport-splitted.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle
  ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportSplittedComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() type: string = "1:2"; // 1 row 2 column
  @Input() item: any;
  @Input() data: ModelClass;
  @Input() controller: IController;
  @Input() parent: any; //ViewportComponent;
  @Input() css: Record<string, string> = {};

  @Output() onLayoutResize: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('2colLayout', {read:ElementRef, static:false}) layout: ElementRef;
  @ViewChild('2rowLayout', {read:ElementRef, static:false}) layout2rows: ElementRef;
  @ViewChild('leftCtn', {read:ElementRef, static:false}) leftEl: ElementRef;
  @ViewChild('rightCtn', {read:ElementRef, static:false}) rightEl: ElementRef;
  @ViewChild('topCtn', {read:ElementRef, static:false}) topEl: ElementRef;
  @ViewChild('bottomCtn', {read:ElementRef, static:false}) bottomEl: ElementRef;


  /**
   * If TRUE, right panel is collapsed by default, and cit is
   * expanded when a 'openR' event is trigged.
   *
   * @type {boolean}
   */
  @Input() flex = false;
  @Input() leftWidth = 50;
  @Input() topHeight = 50;
  @Input() heightPct = 100;

  id = -1;
  rendered = false;


  constructor() { }

  ngOnInit(): void {

  }

  resizeColumns(){
    if(this.type=="1:2"){
      this.rightEl.nativeElement.style.width = (100-this.leftWidth)+'%';
      this.rightEl.nativeElement.style.maxWidth = (100-this.leftWidth)+'%';
      this.leftEl.nativeElement.style.width = this.leftWidth+'%';
      this.leftEl.nativeElement.style.minWidth = this.leftWidth+'%';
    }
  }

  resizeRows(){
    if(this.type=="2:1"){
      this.bottomEl.nativeElement.style.height = (100-this.topHeight)+'%';
      this.bottomEl.nativeElement.style.maxHeight = (100-this.topHeight)+'%';
      this.topEl.nativeElement.style.height = this.topHeight+'%';
      this.topEl.nativeElement.style.maxHeight = this.topHeight+'%';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.hasOwnProperty('leftWidth') && this.rendered){
      this.resizeColumns();
    }
    if(changes.hasOwnProperty('topHeight') && this.rendered){
      this.resizeRows();
    }
  }

  ngAfterViewInit() {
    this.rendered = true;
    this.resizeColumns();
    this.resizeRows();
  }

// (pSize.height-this.layout.nativeElement.offsetTop)

  resize( pSize:any){
    // global layout resize

    let layoutSz:any = { };

    let o:number;


    if(this.type=="1:2"){
      o = (pSize.height-this.layout.nativeElement.offsetTop);

      this.layout.nativeElement.style.height = o+'px';
      this.layout.nativeElement.style.maxHeight = o+'px';

      layoutSz.left = {};
      layoutSz.right = {};
    }else{
      o = (pSize.height-this.layout2rows.nativeElement.offsetTop);

      this.layout2rows.nativeElement.style.height = o+'px';
      this.layout2rows.nativeElement.style.maxHeight = o+'px';

      layoutSz.top = {};
      layoutSz.bottom = {};
    }


    //console.log(pSize,this.type, this.layout.nativeElement.offsetTop);

    //console.log("Resize splitted view :",pSize);
    if(pSize.hasOwnProperty('width')){
      // 2 cols resize
      if(this.type=="1:2") {
        //this.leftWidth = pSize.width;
        this.layout.nativeElement.style.width = pSize.width + 'px';
        this.layout.nativeElement.style.maxWidth = pSize.width + 'px';

        const lw = (this.leftWidth * pSize.width) / 100;

        //console.log("Resize splitted view (col left) :",lw);
        this.leftEl.nativeElement.style.width = lw + 'px';
        this.rightEl.nativeElement.style.width = (pSize.width - lw) + 'px';

        layoutSz.left.width = lw;
        layoutSz.right.width = (pSize.width - lw);
      }
      // 2 rows layout
      else if(this.type=="2:1"){

        //this.leftWidth = pSize.width;
        this.layout2rows.nativeElement.style.width = pSize.width+'px';
        this.layout2rows.nativeElement.style.maxWidth = pSize.width+'px';
        this.topEl.nativeElement.style.width = pSize.width+'px';
        this.bottomEl.nativeElement.style.width = pSize.width+'px';


        layoutSz.top.width = pSize.width;
        layoutSz.bottom.width = pSize.width;
      }

    }

    if(pSize.hasOwnProperty('height')){
      // 2 cols resize
      if(this.type=="1:2"){
        //this.leftWidth = pSize.width;
        this.layout.nativeElement.style.height = pSize.height+'px';
        this.layout.nativeElement.style.maxHeight = pSize.height+'px';


        //console.log("Resize splitted view (col left) :",lw);
        this.leftEl.nativeElement.style.height = pSize.height+'px';
        this.rightEl.nativeElement.style.height = pSize.height+'px';


        layoutSz.left.height = pSize.height; // - navbar
        layoutSz.right.height = pSize.height;
      }
      // 2 rows layout
      else if(this.type=="2:1"){

        //this.leftWidth = pSize.width;
        this.layout2rows.nativeElement.style.height = pSize.height+'px';
        this.layout2rows.nativeElement.style.maxHeight = pSize.height+'px';

        const lh = (this.topHeight*pSize.height)/100;

        this.topEl.nativeElement.style.height = lh+'px';
        this.bottomEl.nativeElement.style.height = (pSize.height-lh)+'px';

        layoutSz.top.height = lh;
        layoutSz.bottom.height = (pSize.height-lh);
      }

    }

    this.onLayoutResize.emit( layoutSz);
  }

  configure( pData:any):void {
    this.data = pData;

  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  getCssClass(pType:string):string{
    if(this.css[pType]!=null){
      return this.css[pType];
    }else{
      return "";
    }
  }
}
