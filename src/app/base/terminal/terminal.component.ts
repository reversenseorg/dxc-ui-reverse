import {
  AfterViewInit,
  Component,
  ComponentFactory, ComponentFactoryResolver, ComponentRef,
  ElementRef,
  Input, OnChanges,
  OnInit, SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import {AppComponent} from "../../app.component";
import {ITerminalContainer} from "./ITerminalContainer";
import {UI} from "../../cmp/ui.const";
import {TerminalDirective} from "./terminal.directive";
import {TerminalItem} from "../../cmp/TerminalItem";
import {ExplorerItem} from "../../cmp/ExplorerItem";
import {StageComponent} from "../../components/stage/stage.component";
import {Subject} from "rxjs";
import {Nullable} from "../Nullable";
import {TerminalTab} from "../../cmp/TerminalTab";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, OnChanges {


  @Input() public parent:StageComponent;
  @Input() public terminals:TerminalItem[] = [];
  @Input() statebarHeight:number = 0;


  @Input() resizeSrc:Subject<any>;

  // layout height & bottom
  //height:number = 20;
  //width:number = 100;

  @ViewChild('termEl',{ static:true, read:ElementRef}) termEl:ElementRef;
  @ViewChild('termNav',{ static:true, read:ElementRef}) termNav:ElementRef;
  @ViewChild('termCtn',{ static:true, read:ElementRef}) termCtn:ElementRef;

  @ViewChild(TerminalDirective, {static: true}) terminalHost: TerminalDirective;

  size:any = {
    nav_width: UI.NAV_WIDTH,
    nav_height: UI.NAV_HEIGHT
  };

  viewSize: any = null;

  views: ITerminalContainer[] = [];
  activeCtn: Nullable<ITerminalContainer> = null;
  idCTR:number = -1;
  ctnHeight:number = -1;

  public focus:boolean = false;

  elements: any;

  /**
   * Menu entries for 'option menu' (cog icon)
   */
  opts: any[] = []

  /**
   * Enable/disable collapse
   * @type {boolean}
   * @field
   */
  collapsible: boolean = true;

  /**
   * Hold size before collapse.
   *
   * It is use to restore panel at original height when it is expanded
   *
   * @type {number}
   * @field
   * @private
   */
  private oHeight: number;

  /**
   * Flag. If TRUE menu is collapsed, else it is FALSE.
   * @type {boolean}
   * @field
   * @readonly
   */
  get collapsed():boolean {
    return this._c;
  }

  /**
   * Private var holding collapse status;
   */
  private _c: boolean = false;

  constructor( private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    const el = this.termEl.nativeElement;

    // console.log("Terminal > ngOnInit > ", this.parent, el);

    this.parent.terminalSize$.subscribe((pEvent)=>{
        // console.log("Terminal > Rendering > ", pEvent);
        el.style.bottom = pEvent.bottom+'px';
        el.style.maxHeight =  el.style.minHeight = el.style.height = pEvent.height + 'px';

        this.resizeContent( pEvent);
    });

    this.loadComponents();
  }

  ngOnChanges( pChange:SimpleChanges):void {

  }

  resizeContent( pSize:any = {}):void{
    let nav = this.termNav.nativeElement;
    let ctn = this.termCtn.nativeElement
    let el = this.termEl.nativeElement;

    let h = parseFloat(el.offsetHeight);

    this.ctnHeight = (el.offsetHeight - nav.offsetHeight);  // +10
    if(this.ctnHeight < 0) this.ctnHeight = 0;

    ctn.style.height = this.ctnHeight+'px';
    ctn.style.maxHeight = this.ctnHeight+'px';
    ctn.style.minHeight = this.ctnHeight+'px';

    this.viewSize = { height: this.ctnHeight, width:el.offsetWidth };
    this.views.map( (vView:ITerminalContainer) => {
      vView.resize({ height: this.ctnHeight, width:el.offsetWidth });
    });
  }

  /**
   * To highlight terminal when it is focused
   *
   * @since v1.0.0
   * @method
   */
  onClick():void{
    this.parent.setFocus('terminal');
  }

  /**
   * To select a sub-component by click on tab
   *
   * @param {ITerminalContainer} pView The component selected
   * @since v1.0.0
   * @method
   */
  selectTab( pView:ITerminalContainer):void {
    this.activeCtn = pView;
    this.activeCtn.resize(this.viewSize);
  }

  /**
   * To select a sub-component (Tab) by tab label
   *
   * @param {string} pLabel The component selected
   * @since v1.0.0
   * @method
   */
  selectTabByLabel( pLabel:string):void {
    for(let i=0; i<this.views.length; i++){
      if((this.views[i].tab!=null) && ((this.views[i].tab as TerminalTab).label===pLabel)){
        this.selectTab(this.views[i]);
        break;
      }
    }
  }

  /**
   * To check if the given component is the active (selected) component
   *
   * @param {ITerminalContainer} pView The component to detect
   * @return {boolean} TRUE if the given component is active, else FALSE
   * @since v1.0.0
   * @method
   */
  isTabActive( pView:ITerminalContainer):boolean {
    return (this.activeCtn!=null) && (pView.id === this.activeCtn.id);
  }



  expanding = false;

  onDragToResize(pEvent: any): void {

    if(pEvent.buttons!=1) return;

    if(pEvent.target.classList.value.indexOf("tabnav")==-1){
      // prevent default
      pEvent.preventDefault();
    }

    let e:any = {};
    this.expanding = true;

    const dr = (vEvent:any)=>{
      vEvent.preventDefault();
      if (!this.expanding) {
        return;
      }

      if (vEvent.clientX) {
        e.x = vEvent.clientX;
        e.y = vEvent.clientY;
      } else {
        e.x = vEvent.touches[0].clientX;
        e.y = vEvent.touches[0].clientY;
      }

      e.delta = 0;

      this.parent.startDrag('terminal', e);
    }

    document.onmousemove = dr;
    document.ontouchmove = dr;

    const stopDrag = ()=>{
      this.expanding = false;
      document.onmousemove = null;
      document.ontouchmove = null;
      document.onmouseup = null;
      document.ontouchend = null;
    }

    document.onmouseup = stopDrag;
    document.ontouchend = stopDrag;
  }


  /**
   * To load sub component and inject it into view
   *
   * @since v1.0.0
   * @method
   */
  loadComponents():void {

    let termItem:TerminalItem, componentFactory:ComponentFactory<any>,
      viewContainerRef:ViewContainerRef, componentRef:ComponentRef<any>;

    this.views = [];

    for(let i:number=0; i<this.terminals.length; i++) {
      termItem = this.terminals[i];

      componentFactory = this.componentFactoryResolver.resolveComponentFactory(termItem.component);
      viewContainerRef = this.terminalHost.viewContainerRef;

      componentRef = viewContainerRef.createComponent<any>(componentFactory);
      componentRef.instance.parent = this;
      componentRef.instance.app = this.parent;
      componentRef.instance.controller = termItem.controller;
      componentRef.instance.id = ++this.idCTR;

      this.views.push(componentRef.instance);
    }

    if(this.views.length>0){
      this.activeCtn = this.views[0];
      this.resizeContent();
    }
  }

  preventDrag(pEvent: MouseEvent) {
    pEvent.preventDefault();
  }

  /**
   * To expand/collapse terminal
   *
   * @param {boolean} pForce Optional. Default FALSE. If TRUE the terminal will be collapsed, else it will be expanded/collapsed if it is collapsed/expanded
   *
   */
  collapse(pForce:boolean = false):void {
    if(pForce){
      this._c = true;
    }else{
      this._c = !this._c;
      if(this._c){
        this.oHeight = this.viewSize.height;
        this.termCtn.nativeElement.style.display = 'none';
        this.parent.collapseArea(this );
      }else{
        this.expand();
      }
    }
  }

  expand():void {
    this.parent.expandArea(this );
    this.termCtn.nativeElement.style.display = 'block';
  }

  getOriginalHeight():number {
    return this.oHeight;
  }
}
