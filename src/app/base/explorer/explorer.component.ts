import {
  AfterContentInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver, ComponentRef, ElementRef,
  Input, OnChanges, OnDestroy,
  OnInit, SimpleChanges,
  ViewChild, ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {ExplorerItem} from "../../cmp/ExplorerItem";
import {ExplorerDirective} from "./explorer.directive";
import {SubExplorerComponent} from "./subexplorer.component";
import {Observable, Subject} from "rxjs";
import {Nullable} from "../Nullable";
import {IStringIndex} from "../IStringIndex";


interface ExplorerElement {
  id: number,
  view: any,
  icon: string,
  label: string
};

const cls = ["wrap-outer", "wrap-inner", "nav-item", "nav-link"];

const BORDER_WIDTH = 5;
/**
 * This class represents the Explorer Area (left panel)
 *
 * @class
 * @since 1.0.0
 */
@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit, OnChanges, AfterContentInit {

  @Input() public parent: any;
  @Input() public explorers: ExplorerItem[];
  @Input() public enabledExpl: any;

  /**
   * The collection of explorer components
   *
   * @type {SubExplorerComponent[]}
   * @field
   * @since 1.0.0
   */
  elements: SubExplorerComponent<any>[] = [];

  /**
   * The active explorer component
   * By default, its the first
   *
   * @type {number}
   * @field
   * @since 1.0.0
   */
  active = 0;
  activeExpl:Nullable<SubExplorerComponent<any>> = null;
  prevExpl:Nullable<SubExplorerComponent<any>> = null;

  expanding  = false;

  @ViewChild('explorerCtn', {read:ElementRef, static:true}) ctnEl:ElementRef;
  @ViewChild('explorerNav', {read:ElementRef, static:true}) explorerNav:ElementRef;
  @ViewChild('explorerView', {read:ElementRef, static:true}) vpEl:ElementRef;
  @ViewChild('explorerBorder', {read:ElementRef, static:true}) borderEl:ElementRef;
  @ViewChild('outterExpl', {read:ElementRef, static:true}) outterEl:ElementRef;

  @ViewChild(ExplorerDirective, {static: true}) explorerHost: ExplorerDirective;
  //interval: any;

  resizeSrc: Subject<any> = new Subject<any>(); //Observable<any>;

  resize$: Subject<any> = new Subject<any>();


  constructor(private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnInit(): void {

  }

  initLayout(): void {

    const resizeArea = document.getElementById('explorerResize') as HTMLElement;
    const viewCtn = document.getElementById('explorerVP') as HTMLElement;
    const explorerCtn = document.getElementById('explorerContainer') as HTMLElement;
    const explorerCtn2 = document.getElementById('explorerContainer2') as HTMLElement;
    const nav = document.getElementById('explorerNav') as HTMLElement;

    const navW = parseFloat(window.getComputedStyle(nav).width);
    const resizeAW = parseFloat(window.getComputedStyle(resizeArea).width);

    const borderWidth = this.borderEl.nativeElement.offsetWidth;
    const navWidth = this.explorerNav.nativeElement.offsetWidth;


    this.parent.drag.explorer.el = resizeArea;

    this.initExplorers();

    /*
    this.parent.userResize$.subscribe( (pEvent)=>{

      // width
      let subexplW:number = parseFloat(pEvent.size.left) - navWidth - borderWidth;

      if(pEvent.type === 'h'){

        // height
//        this.vpEl.nativeElement.offsetHeight = pEvent.size
        viewCtn.style.height = pEvent.size.top+'px';
        viewCtn.style.maxHeight = pEvent.size.top+'px';
        viewCtn.style.minHeight = pEvent.size.top+'px';

        explorerCtn.style.height = pEvent.size.top+'px';
        explorerCtn.style.maxHeight = pEvent.size.top+'px';
        explorerCtn.style.minHeight = pEvent.size.top+'px';

      }else{

        viewCtn.style.width = subexplW+'px';
        viewCtn.style.maxWidth = subexplW+'px';
        viewCtn.style.minWidth = subexplW+'px';

        [explorerCtn,explorerCtn2].map((pEl) => {
          pEl.style.width = pEvent.size.left+'px';
          pEl.style.maxWidth = pEvent.size.left+'px';
          pEl.style.minWidth = pEvent.size.left+'px';
        });

        explorerCtn2.style.width = '100%';
      }

      const h = parseFloat(viewCtn.style.height);
      const w = subexplW;


      //pObserver.next({
      this.resizeSrc.next({
          type: 'resize',
          dim: {
            height: h,
            width: w
          }
        });
    });
  */

    this.borderEl.nativeElement.style.width = BORDER_WIDTH+'px';

    this.parent.leftPanelSize$.subscribe( (pEvent:any) => {

      //console.log("Explorer > rendeering > ", pEvent);

      this.vpEl.nativeElement.style.height = pEvent.height + 'px';
      this.outterEl.nativeElement.style.height = pEvent.height+'px';
      this.borderEl.nativeElement.style.height = pEvent.height+'px';


      this.vpEl.nativeElement.style.width = (pEvent.width-(navWidth*2)-borderWidth-1)+ 'px';
//      alert(pEvent.width+" "+navWidth+" "+borderWidth);
      // explorer view has a left border of 1px
      this.resize$.next({
        height: pEvent.height,
        width: pEvent.width-(navWidth*2)-borderWidth-1
      });
    });
  }

  /**
   * To initialize all declared explorers
   *
   * The main goal of this function is to initialize
   * size of each explorers by propagating size of explorer's view area.
   *
   * Event type is "render"
   *
   * @method
   * @since 1.0.0
   */
  initExplorers():void{
    this.elements.map( (pExp) => {
      //pExp.initPanelResize(this.resizeSrc);

      pExp.initPanelResize(this.resize$);
    })
  }

  /**
   * To load nested explorer on changes
   *
   * The active explorer is selected by its offset into explorer collection
   *
   * @param changes
   * @method@since 1.0.0
   */
  ngOnChanges(changes: SimpleChanges) {
    this.loadComponents();
    if(this.activeExpl!=null){
      this.activeExpl.beforeHide();
      this.prevExpl = this.activeExpl;
    }

    this.activeExpl = this.elements[this.active];
    this.selectTab(this.active, null);

  }

  ngAfterContentInit() {
    this.initLayout();
  }

  onClick(pTarget: string): void {

  }

  /**
   * Listener to call when the explorer area is resized by dragging the borders
   *
   * Drag events are processed locally, but drop is managed by Stage component because
   * drop affects other elements of the UI
   *
   * @param {any} pEvent The drag event (mouse down)
   * @method
   * @since 1.0.0
   */
  onDragToResize(pEvent: any): void {

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

      this.parent.startDrag('explorer', e);
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

  stopDrag(pEvent:any){
    if(this.expanding){
      this.expanding = false;
      document.onmousemove = null;
      document.ontouchmove = null;
    }
  }

  /**
   * To select the active tab by its offset into explorer collection
   *
   * @param {number} pId Explorer offset
   * @param {any} pEvent
   * @method
   * @sine 1.0.0
   */
  selectTab(pId: number, pEvent: any): void {

    if(this.activeExpl!=null){
      this.activeExpl.beforeHide();
      this.prevExpl = this.activeExpl;
    }

    this.active = pId;

    if(this.prevExpl!=null){
      this.prevExpl.afterHide();
    }
  }

  ngOnDestroy() {
    //clearInterval(this.interval);
  }

  hasExplorer( pLabel:string){

  }

  /**
   * To dynamically load explorer components.
   *
   * It creates instance for each explorer components and injects some dependancies such as:
   * - parent (self)
   * - controller of the explorer
   * - application instance
   *
   * @method
   * @since 1.0.0
   */
  loadComponents() {

    let explItem:ExplorerItem, componentFactory:ComponentFactory<any>,
        viewContainerRef:ViewContainerRef, componentRef:ComponentRef<any>;

    for(let i:number=0; i<this.explorers.length; i++) {
      explItem = this.explorers[i];

      for(let e in  explItem.component){
        componentFactory = this.componentFactoryResolver.resolveComponentFactory((explItem.component as IStringIndex<any>)[e]);
        viewContainerRef = this.explorerHost.viewContainerRef;

        componentRef = viewContainerRef.createComponent<ExplorerItem>(componentFactory);
        componentRef.instance.parent = this;
        componentRef.instance.app = this.parent;
        componentRef.instance.controller = explItem.controller;

        this.elements.push(componentRef.instance);
      }

    }
  }



}
