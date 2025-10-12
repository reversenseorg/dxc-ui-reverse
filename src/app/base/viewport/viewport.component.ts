import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ViewportController} from "./ViewportController";
import {ViewportDirective} from "./viewport.directive";
import {IViewportContainer} from "./IViewportContainer";
import {UI} from "../../cmp/ui.const";
import {StageComponent} from "../../components/stage/stage.component";
import {Subject} from "rxjs";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {Nullable} from "../Nullable";
import {UIException} from "../error/UIException";
import {ControllerService} from "../../controller.service";


@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
  providers: [NgbTooltipConfig],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit {

  @Input() public parent:StageComponent;
  @Input() public controller:ViewportController;

  @ViewChild('outterVp',{ read:ElementRef, static:true}) outterEl:ElementRef;
  @ViewChild('viewportCtn',{ read:ElementRef}) viewportCtn:ElementRef;
  @ViewChild('viewportTabnav',{ read:ElementRef}) viewportTabnav:ElementRef;
  @ViewChild(ViewportDirective, {static: true}) viewportHost: ViewportDirective;


  views:IViewportContainer[] = [];
  cmps:ComponentRef<any>[] = [];

  idCTR = -1;

  size:any = {
    nav_width: UI.NAV_WIDTH,
    nav_height: UI.NAV_HEIGHT
  };

  ctnHeight: number = 0;
  ctnWidth: number = 0;
  activeCtn:Nullable<IViewportContainer> = null;
  activeCmp: Nullable<ComponentRef<any>> = null;

  resize$: Subject<any> = new Subject<any>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private _ctrlSvc:ControllerService,
    tooltipConfig: NgbTooltipConfig
  ) {
    tooltipConfig.tooltipClass = "dxc-tooltip-vp";
    this._ctrlSvc.setViewport(this);
  }

  ngOnInit(): void {

    if(this.controller != null)
      this.controller.injectVP(this);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("[VIEWPORT CHANGES] ",changes);
    /*if(this.activeCtn != null){
      //this.selectTab(this.activeCtn, null);
    }
    else if(this.views.length>0){
      //this.selectTab(this.views[0], null);
    }*/
  }

  ngAfterViewInit() {

  }

  ngAfterContentInit():void {

    this.parent.viewportSize$.subscribe( (pEvent) => {

      const ctnH = (pEvent.height-this.size.nav_height);


      this.outterEl.nativeElement.style.height = pEvent.height+'px';
      this.outterEl.nativeElement.style.width = pEvent.width+'px';

      this.viewportTabnav.nativeElement.style.height = this.size.nav_height+'px';
      this.viewportTabnav.nativeElement.style.width = pEvent.width+'px';

      this.viewportCtn.nativeElement.style.height = (ctnH-this.size.nav_height)+'px';
/*
      tabNav.style.height = this.size.nav_height+'px';
      tabNav.style.maxHeight = this.size.nav_height+'px';
      tabNav.style.minHeight = this.size.nav_height+'px';*/

      this.ctnHeight = pEvent.height - this.size.nav_height;


      this.cmps.map( (vRef:ComponentRef<any>) => {
        vRef.instance.resize({
          height: ctnH,
          width:pEvent.width });
      });
    })
  }

  resizeContent():void{
    let ctn = this.viewportCtn.nativeElement;
    let tabNav = this.viewportTabnav.nativeElement
    let viewPortEl = document.getElementById('appViewport');

    if(viewPortEl==null){
      throw UIException.APP_NOT_INITIALIZED("viewport","Viewport host element is missing");
    }

    let h = parseFloat(viewPortEl.style.height);

    console.log(h, tabNav.clientHeight);
    this.ctnHeight = (h - tabNav.clientHeight);
    ctn.style.height = this.ctnHeight+'px';
    ctn.style.maxHeight = this.ctnHeight+'px';
    ctn.style.minHeight = this.ctnHeight+'px';


    this.cmps.map( (vRef:ComponentRef<any>) => {
      vRef.instance.resize({ height: this.ctnHeight });
    });
  }


  onClick():void {
    this.parent.setFocus('viewport');
  }


  /**
   * To close the panel of the current viewport
   *
   * A child viewport can implement the method onClose() to intercept closing
   * and prevent it conditionnally or perform some actions.
   *
   * @param {MouseEvent} event
   * @param {IViewportContainer} pView The viewport to close
   * @method
   *
   */
  close(event: MouseEvent, pView: IViewportContainer) {
    //let views = []

    let v:ComponentRef<any>[]=[], i:number=-1, k:number=1;

    if(pView.onClose()) {

      /*this.views.map((vView:any) => {       i+=k;
        if(vView.id !== pView.id){
          v.push(vView);
        }else{
          k=0;
        }
      });*/


      this.cmps.map( (vRef:ComponentRef<any>) => {
        i+=k;
        if(vRef.instance.id !== pView.id){
          v.push(vRef);
        }else{
          k=0;
          // destroy component
          vRef.destroy();
        }
        vRef.instance.resize({ height: this.ctnHeight });
      });



      if(this.activeCtn!=null && this.activeCtn.id === pView.id){
        if(v.length>0) {
          if(i==0) {
            this.activeCmp = v[0]
            this.activeCtn = this.activeCmp.instance;
          }else
            this.activeCmp = v[i - 1];
          this.activeCtn = this.activeCmp.instance;
        }else
          this.activeCtn = null;
          this.activeCmp = null;
        }

      this.cmps = v;

    }

    if(event != null){
      event.preventDefault();
      event.stopImmediatePropagation();
    }

  }

  /*
   * To select a view by UID of the ViewContainer (i.e. item)
   *
   * @param {string} pUID Item uid
   * @return {void}
   * @method
   * @since 1.0.0
   */
  /*
  selectTabByUID(pUID: string): void {

    let v:IViewportContainer = null;
    for(let i=0; i<this.views.length; i++){
      v = this.views[i];
      if(v==null) continue;

      if(v.uid === pUID){
        this.activeCtn = v;
      }
    }
    this.resizeContent();
  }

  selectTabByID(pId: number, pEvent: any): void {
    let v:IViewportContainer = null;
    for(let i=0; i<this.views.length; i++){
      v = this.views[i];
      if(v==null) continue;

      if(v.id === pId){

        if((this.activeCtn as any)._viewRef != null){
          (this.activeCtn as any)._viewRef.markForCheck();
          (this.activeCtn as any)._viewRef.detectChanges();
        }

        this.activeCtn = v;
        // mark for check

        if((this.activeCtn as any)._viewRef != null){
          (this.activeCtn as any)._viewRef.markForCheck();
          (this.activeCtn as any)._viewRef.detectChanges();
        }

      }
    }
  }

  selectTab(pView: IViewportContainer, pEvent: any): void {
    if(this.activeCtn != null){
      if((this.activeCtn as any)._viewRef != null){
        (this.activeCtn as any)._viewRef.markForCheck();
        (this.activeCtn as any)._viewRef.detectChanges();
      }
    }

    this.activeCtn = pView;

    if((this.activeCtn as any)._viewRef != null){
      (this.activeCtn as any)._viewRef.markForCheck();
      (this.activeCtn as any)._viewRef.detectChanges();
    }
  }
*/
  /**
   * To select a view by UID of the ViewContainer (i.e. item)
   *
   * @param {string} pUID Item uid
   * @return {void}
   * @method
   * @since 1.0.0
   */
  selectTabByUID2(pUID: string): void {

    console.log("selectTabByUID2 > ",pUID);

    let v:Nullable<ComponentRef<any>> = null;
    for(let i=0; i<this.cmps.length; i++){
      v = this.cmps[i];
      if(v==null) continue;

      if(v.instance.uid === pUID){

        this.selectTab2(v, null);
      }
    }
    this.resizeContent();
  }

  /**
   *
   * Note: ChangeDetectionStrategy.OnPush ready
   *
   * @param pId
   * @param pEvent
   */
  selectTabByID2(pId: number, pEvent: any): void {
    let v:Nullable<ComponentRef<any>> = null;
    for(let i=0; i<this.cmps.length; i++){
      v = this.cmps[i];
      if(v==null) continue;

      if(v.instance.id === pId){
        console.log("selectTabByID2 > ",v.instance.id,pId)
        this.selectTab2(v, pEvent);
      }
    }
  }

  /**
   *
   *
   * @param pCmp
   * @param pEvent
   */
  selectTab2(pCmp: ComponentRef<any>, pEvent: any): void {

    const oldCmp = this.activeCmp;

      /*this.cmps.map( (x:ComponentRef<any>)=>{
        (x as any).setInput('activeViewID',pCmp.instance.id);
      });*/



    /*if(this.activeCmp != null){
      console.log("[old]",this.activeCmp.instance.id);
      this.activeCmp.hostView.markForCheck();
      this.activeCmp.hostView.detectChanges();
      //this.activeCmp.hostView.detectChanges();
    }*/

    this.activeCtn = pCmp.instance;
    this.activeCmp = pCmp;

    this._ctrlSvc.setActiveTab(this.activeCtn);

    if(oldCmp!=null) oldCmp.hostView.detectChanges();
    //pCmp.hostView.detectChanges();

    console.log("SelectTab2 > ",oldCmp,pCmp)
    /*
    if(this.activeCmp != null  && pCmp.instance._viewRef!=null){
      console.log("[new]",this.activeCmp.instance.id);
      pCmp.instance._viewRef.markForCheck();
      pCmp.instance._viewRef.detectChanges();
    }
    if(oldCmp != null && oldCmp.instance._viewRef!=null){
      oldCmp.instance._viewRef.markForCheck();
      oldCmp.instance._viewRef.detectChanges();

     // oldCmp.hostView.markForCheck();
      //oldCmp.hostView.detectChanges();
    }*/

  }

  /**
   * To create a new tab into viewport from an item
   * @param pView
   */
  addTab( pView: any):void{

    const cmpFact:any = this.componentFactoryResolver.resolveComponentFactory<any>(pView.cmp);
    const cmpRef = this.viewportHost.viewContainerRef.createComponent<any>(cmpFact);

    cmpRef.instance.parent = this;
    cmpRef.instance.controller = pView.ctrl;
    cmpRef.instance.configure(pView.data, pView.focus);
    this.idCTR++;
    cmpRef.instance.id = this.idCTR; // todo replace by noderef
    cmpRef.instance.uid = pView.uid;
    if(pView.opts!=null){
      cmpRef.instance.opts = pView.opts;
    }

    //cmpRef.instance.height = this.ctnHeight;

    this.cmps.push(cmpRef);
    //this.views.push(cmpRef.instance);

    console.log("VP > addTab > ",cmpRef.instance.uid);

    //this.selectTab( cmpRef.instance, null);
    this.selectTab2( cmpRef, null);

    //this.views.push(cmpRef.instance);
    //if(this.views.length>0) {
    this.resizeContent();
    //}
  }

  closeAllTabs():void {
    console.log("[VIEWPORT][CLOSE ALL] closeAllTabs() : ",this.views);

  }

}
