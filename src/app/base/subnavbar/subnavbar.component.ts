import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import {NavbarSimpleView} from "../../cmp/NavbarSimpleView";
import {NavbarTabView} from "../../cmp/NavbarTabView";
import {IconView} from "../../cmp/IconView";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {NgbDropdown} from "@ng-bootstrap/ng-bootstrap";
import {IconModel} from "../icon/IconModel";
import {Subject} from "rxjs";
import {ElectronService} from "../../core/services";


//  class="btn-label"
@Component({
  selector: 'app-subnavbar-input',
  template: `
    <input  (keydown.control.a)="onSelectAll()" (keydown.meta.a)="onSelectAll()"  (keydown.control.v)="onPaste()" (keydown.meta.v)="onPaste()"  (keydown.enter)="onEnter($event)" [(ngModel)]="value" type="text" class="dxc-nav-input dxc-text-clear100" [placeholder]="placeholder" [style]="{ width:width }" #navInput/>
  `,
  styleUrls: ['./subnavbar.component.scss'],
})
export class SubnavbarInputComponent implements AfterViewInit {

  @Input() color: string;
  @Input() icon: IconModel = null;
  @Input() width: string = '50px';
  @Input() placeholder:string = "";
  @Input() value:string = "";



  @Output() enter: EventEmitter<any>  = new EventEmitter<any>();

  @ViewChild('navInput', {read:ElementRef, static:false}) inputEl:ElementRef;

  iconView: IconView = null;


  constructor( private electronSvc:ElectronService) {

  }

  ngAfterViewInit():void {
    /*if(this.height > -1 && this.btnEl != null){
      this.btnEl.nativeElement.style.height = this.height+'px';
    }*/
  }

  onEnter(pEvent:any=null):void {
    this.enter.emit(this.value);
  }

  /**
   * To past clipboard content into input as text
   *
   * @method
   * @since 1.0.0
   */
  onPaste():void {
    this.value = this.electronSvc.readFromClipboard({ format:'txt' });
  }

  focus(){
    console.log(this.inputEl);
    this.inputEl.nativeElement.focus();
  }

  /**
   * To prevent drag an drop of parent elements
   * @param event
   */
  @HostListener("mousedown", ["$event"])
  public onClick(event: any): void
  {
    event.stopPropagation();
  }

  onSelectAll(pEvent:any=null): void
  {
    this.inputEl.nativeElement.select();
    if(pEvent!=null)
      pEvent.stopPropagation();
  }
}

//  class="btn-label"
@Component({
  selector: 'app-subnavbar-btn',
  template: `
      <button [class.active]="active" [class.vertical]="vert" [class.disable]="disable" [class.separator]="separator" [ngClass]="color" class="btn dxc-text-clear100 nav-btn" #btn>
        <dxc-icon *ngIf="trail" [model]="_trailIcon" [color1]="'trail-arrow-neg'"></dxc-icon>
        <dxc-icon *ngIf="icon" [model]="icon" [fw]="fwicon" ></dxc-icon>
        <!--<fa-icon *ngIf="icon" class="dxc-icon" [icon]="[iconView.type, iconView.name]" [ngClass]="iconView.color1"></fa-icon>-->
        <ng-content></ng-content>
        <dxc-icon *ngIf="trail" [model]="_trailIcon" [color1]="'trail-arrow'"></dxc-icon>
      </button>

  `,
  styleUrls: ['./subnavbar.component.scss'],
  styles: [`
    dxc-icon {
      margin-right:5px;
    }

    button {
      margin-left:15px;
    }
  `]
})
export class SubnavbarButtonComponent implements AfterViewInit {

  _styles: string[] = [];
  _trailIcon: IconModel = GLOBAL_ICONS['TRAIL'];
  @Input() color: string;
  @Input() vert: boolean = false;
  @Input() active: boolean = false;
  @Input() icon: IconModel = null;
  @Input() position: string = 'left';
  @Input() separator: boolean = false;
  @Input() disable: boolean = false;
  @Input() height: number = -1;
  @Input() trail: any = null;
  @Input() fwicon: boolean = false;

  @ViewChild('btn', {read:ElementRef, static:true}) btnEl:ElementRef;

  iconView: IconView = null;


  constructor() {

  }

  ngAfterViewInit():void {
    if(this.height > -1 && this.btnEl != null){
      this.btnEl.nativeElement.style.height = this.height+'px';
    }

  }
}



@Component({
  selector: 'app-subnavbar-tab',
  template: `
    <li class="nav-item" [class.active]="active" (click)="onSelectTab()">
      <a class="nav-link" [class.active]="active">
        <!--&nbsp;<fa-icon *ngIf="icon" [icon]="[iconView.type,iconView.name]" [ngClass]="iconView.color1"  class="pl-1 pr-1"></fa-icon>-->
        <dxc-icon *ngIf="icon" [model]="icon"></dxc-icon>
        <span *ngIf="label" [ngClass]="color">&nbsp;{{ label}}</span>
        &nbsp;<fa-icon *ngIf="closable" [icon]="['fas','xmark']" (click)="onCloseTab()" class="ml-2 pl-1 pr-1 btn-close"></fa-icon>
      </a>
    </li>
  `,
  styleUrls: ['./subnavbar.component.scss']
})
export class SubnavbarTabComponent  {

  @Input() id: string = '';
  @Input() item: any = null;
  @Input() label:Nullable<string> = null;
  @Input() color: string;
  @Input() icon: IconModel = null;
  @Input() closable: boolean = true;
  @Input() offset: number = null;
  @Input() active:boolean = null;

  @Output() focusTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeTab: EventEmitter<any> = new EventEmitter<any>();

  iconView: IconView = null;


  constructor( public parent: SubnavbarComponent) {
  }

  onSelectTab(){
    this.focusTab.next({ tab:this });
  }

  onCloseTab(){
    this.closeTab.next({ tab:this });
  }
}



@Component({
  selector: 'app-subnavbar-menu',
  template: `
    <div ngbDropdown [ngStyle]="_style" [ngClass]="_class">
      <button class="btn dxc-text-clear100" [id]="'dropdownBasic'+id" ngbDropdownToggle (click)="openMenu()">

        <dxc-icon *ngIf="trail" [model]="_trailIconNeg" [color1]="'trail-arrow-neg'"></dxc-icon>
        <dxc-icon *ngIf="icon" [model]="icon"></dxc-icon>
        {{ label  }}
      </button>
      <div ngbDropdownMenu aria-labelledby="id" class="dxc-dropdown" #ddEl>
        <!-- <button *ngFor="let item of navbar.menu.items" [ngClass]="item.color" (click)="onMenuItemSelect(item)"  ngbDropdownItem>
          <fa-icon class="dxc-icon" [icon]="[item.icon.type,item.icon.name]" [ngClass]="item.icon.color1"></fa-icon>
          {{ item.label }}
        </button>-->
        <ng-content select="[entries]"></ng-content>
      </div>
    </div>
    <!-- <dxc-icon *ngIf="trail" [model]="_trailIcon" [color1]="'trail-arrow'"></dxc-icon> -->
  `,
  styleUrls: ['./subnavbar.component.scss']
})
export class SubnavbarMenuComponent implements OnInit, AfterViewInit{

  _style:string[] = [];
  _class:string[] = [];
  _trailIcon:IconModel = GLOBAL_ICONS['TRAIL'];
  _trailIconNeg:IconModel = GLOBAL_ICONS['TRAIL_NEG'];

  id:string = '';

  @Input() color: string;
  @Input() icon: IconModel = null;
  @Input() labelIcon: string;
  @Input() label: string;

  @Input() closeWhen$: Subject<boolean>;

  @Input() trail: any = null;
  /*@Input() dxcStyle: any = null;
  @Input() dxcClass: any = null;*/

  iconView: IconView = null;

  @ViewChild('ddEl',{read:ElementRef, static:false}) ddEl:ElementRef;
  @ViewChild(NgbDropdown) menuDD:NgbDropdown;
  @ContentChildren(SubnavbarButtonComponent) entries: QueryList<SubnavbarButtonComponent>;

  constructor() {

  }

  ngOnInit() {

    if(this.trail!=null){
      if(this.trail.hasOwnProperty('css'))
        this._class.push(this.trail.css);

      if(this.trail.hasOwnProperty('style')){
        let c:any = this.trail.styles;
        for(let k in c) this._style[k] = c[k];
      }
    }

    if(this.closeWhen$!=null){
      this.closeWhen$.subscribe((pClose:boolean)=>{
        this.menuDD.close();
//       this.ddEl.nativeElement.style.display = "none";
      })
    }
  }

  ngAfterViewInit() {
    this.menuDD.autoClose = "outside";
  }

  openMenu() {
//    this.menuDD
//   this.ddEl.nativeElement.style.display = "inline-block";
  }
}

@Component({
  selector: 'app-subnavbar',
  templateUrl: './subnavbar.component.html',
  styleUrls: ['./subnavbar.component.scss']
})
export class SubnavbarComponent implements OnInit, AfterContentInit {

  @Input() parent:any = null;

  //id:Nullable<string> = null;

  @Input() type: string = 'navbar';
  @Input() direction: string = 'row';
  @Input() style: string = '';
  @Input() height: number = -1;

  @Input() navbar: NavbarSimpleView = null;
  @Input() navtab: NavbarTabView = null;

  @Input() opts: boolean = false;


  @Input() icon: IconModel = null
  @Input() label:string = "label";
  @Input() labelColor:string = "#ccc";

  @Input() items:any = []; // TODO : define Tab type

  @Output() selectTab:EventEmitter<any> = new EventEmitter<any>();
  @Output() closeTab:EventEmitter<any> = new EventEmitter<any>();
  @Output() menuItemSelect:EventEmitter<any> = new EventEmitter<any>();
  @Output() optionClick:EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(SubnavbarButtonComponent) entries: QueryList<SubnavbarButtonComponent>;
  @ContentChildren('ng-content') options: any;

  @ViewChild('mainNav', {read:ElementRef, static:true}) navEl:ElementRef;

  computedHeight:number = -1;

  constructor() {

  }

  configure(pConfig:any = null):void {
    if(pConfig != null){
      for(let i in pConfig)
        if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }

  ngOnInit(): void {
  }

  ngAfterContentInit() :void{
    if(this.height>-1 && this.navEl != null){
      this.navEl.nativeElement.style.height = this.height+'px';
    }else{
      this.computedHeight = this.navEl.nativeElement.offsetHeight;
    }

   // console.log(this.options,this.navEl);
  }

  onSelectTab( pItem:any):void{
    this.selectTab.next(pItem);
    this.computedHeight = this.navEl.nativeElement.offsetHeight;
  }

  onCloseTab( pItem:any):void{
    this.closeTab.next(pItem);
  }


  onMenuItemSelect( pMenuItem:any):void {
    this.menuItemSelect.next( pMenuItem);
  }

  onOptionClick( pOpt:any):void {
    this.optionClick.next( pOpt);
  }

  isSelected( pTab:SubnavbarTabComponent):boolean {
    return false;
  }

  isTabActive( pItem:any):boolean {
    return false;
  }

  hasOptions(){
    return this.opts;
  }

  getHeight():number {
    return this.navEl.nativeElement.offsetHeight;
  }
}
