import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TOPO_ICONS} from "../icons";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {TopologyController} from "../ctrl/TopologyController";
import ModelClass from "../../../models/ModelClass";
import ModelMethod from "../../../models/ModelMethod";
import {CODE_ICONS} from "../../code/icons";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import AndroidComponent from "../../../models/android/AndroidComponent";
import {IntentFilter} from "../../../models/android/IntentFilter";
import {IntentDataCriteria} from "../../../models/android/Intent";
import {NodeInternalType} from "../../../models/NodeInternalType";
import AndroidActivity from "../../../models/android/AndroidActivity";
import {TopologyService} from "../ctrl/topology.service";
import {ExpandableProvider} from "../../../base/expandable-list/expandable-provider";
import {from, Observable, Subject} from "rxjs";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {ViewportView} from "../../../cmp/ViewportView";
import {ViewportTab} from "../../../cmp/ViewportTab";


@Component({
  selector: 'app-viewport-topo-activity',
  templateUrl: './viewport-topo-activity.component.html',
  styleUrls: ['./viewport-topo.component.scss']
})
export class ViewportTopoActivityComponent implements OnChanges, AfterViewInit, IViewportContainer, ExpandableProvider {

  @Input() item: any;
  @Input() data: any; // ModelMethod
  @Input() controller: TopologyController;
  @Input() parent: ViewportComponent;

  @Input() height: number;
  @Input() width: number;

  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;
  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;

  NODE_TYPES = NodeInternalType;

  gIcons: any = GLOBAL_ICONS;
  cIcons: any = CODE_ICONS;
  icons: any = TOPO_ICONS;

  id = -1;
  uid = "";

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Activities',
      icon: GLOBAL_ICONS['GLOBE'],
      color: 'dxc-text-clear100'
    })
  });



  size:any = {
    height: '150px'
  };

  resize$: Subject<any> = new Subject<any>();

  ctr = 0;
  activeTop: string;
  activeTopLeft = 'if';
  activeTopRight = 'xr';
  activeItem: any = null;

  cmp_impl: any = null;

  constructor(private codeService:CodeControllerService,
              private topoSvc:TopologyService) {
  }

  // ----- BEGIN of IViewportContainer  -------

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
  }

  onClose(): boolean {
    this.controller.close(this,'vp:activity');
    return true;
  }

  // ----- END of IViewportContainer  -------

  ngOnChanges(changes: SimpleChanges) {

    if(changes.hasOwnProperty('data')){
      if(!(changes as any).data.currentValue.__ppts.hasOwnProperty('internals')){
        this.showAndroidAPI('xr');
      }
    }
  }

  ngAfterViewInit() {

    this.parent.resize$.subscribe( (pSize:any)=>{

      //console.log('Resize VP = ',pSize.height-this.metadataEl.nativeElement.offsetHeight,pSize.height,this.metadataEl.nativeElement.offsetHeight)
      this.layout.resize({
        height: pSize.height, //-this.metadataEl.nativeElement.offsetHeight,
        width: pSize.width
      });
    });

    //console.log('Resize VP = ',pSize.height-this.metadataEl.nativeElement.offsetHeight,pSize.height,this.metadataEl.nativeElement.offsetHeight)
    this.layout.resize({
      height: this.parent.size.height, // -this.metadataEl.nativeElement.offsetHeight,
      width: this.parent.size.width
    });

  }

  configure( pData:any):void {
    console.log(pData);
    this.data = pData;

  }


  isIntentFilterExpandable(pItem:any, pSrc:any):boolean{
    return (pItem.data!=null && pItem.data.length>0);
  }

  isExpandable(pItem:any, pSrc:any):boolean{
    return (pItem.__!=null) && ([NodeInternalType.CLASS,NodeInternalType.METHOD].indexOf(pItem.__)>-1);
  }

  onItemFocus( pEvent:any):void{

    if(this.activeItem != null){
      this.activeItem.el.style.backgroundColor = "#444";
    }

    this.activeItem = pEvent;
    pEvent.el.style.backgroundColor = "royalblue";
  }

  displayExtMenu($event: MouseEvent, pType: string, pObj:any) {
    this.codeService.displayCtxMenu$.next({ event:$event, type:pType, obj:pObj});
  }

  showIntents() {
    this.activeTopLeft = 'if';
  }

  selectRightTab(pView: string) {
    this.activeTopRight = pView;
  }


  sendIntent(pComponent: AndroidComponent, pIntentFilter:IntentFilter, pCriteria: Nullable<IntentDataCriteria> = null, pEvent:any = null) {
    // prepare generic intent
    if(pIntentFilter.hasMultipleActions() || pIntentFilter.hasMultipleCategories()) {
      this.topoSvc.prepareIntent(pComponent, pIntentFilter, pCriteria);
    }
    // if pCriteria not null, generate payload
  }

  /*openImplementation(pView: string) {
    this.parent.parent.parent
      .getController('ctrl:code-main')
      .open({ _t:'c', name:this.data.__impl },'act');
  }*/

  showImplementation(pView: string) {
    console.log(this.data);

    this.codeService.getClass(this.data.__impl==null ? this.data.name : this.data.__impl).subscribe((pData:any)=>{

      if( pData != null){
        this.cmp_impl = new ModelClass(pData.data);
      }else{
        this.cmp_impl = null;
      }
      this.activeTopRight = pView;
    });
  }

  showPlatformCalls(pItem:AndroidActivity){
      const data = pItem.__ppts.internals;
      let c;

      console.log(pItem);
      //this.data.impl = {};
      //this.data.internals = [];

      for(const clz in data){
        c = new ModelClass({  name:clz });
        c.children = [];

        for(const m in data[clz]){
          c.children.push(new ModelMethod({
            __callSignature__: m,
            __signature__: clz+'.'+m,
            children: data[clz][m]
          }));
        }
        this.data.internals.push(c);
      }



  }

  showAndroidAPI(pTabName: string) {
    this.topoSvc.scanComponent( this.data).subscribe((x)=>{
      this.data.internals = x;
      let clsX:any, methX:any;

      /*
      for(const cls in x.__ppts.internals){

        clsX = {
          __: NodeInternalType.CLASS,
          uid: cls,
          meths: []
        };

        for(const idx in x.__ppts.internals[cls]){
          methX = x.__ppts.internals[cls][idx]
          clsX.children.push({
            __: NodeInternalType.METHOD,
            uid: idx,
            xrefs: []
          })
        })

        this.data.internals.push({
          __: NodeInternalType.CLASS,
          name: cls,
          children: []
        });
      }*/
      console.log(this.data.internals,x);
      this.activeTopRight = pTabName;
    })
  }

  expand(pItem: any, pType: string): Observable<any> {
    console.log("expand: ",pItem,pType);
    let ret:Observable<any>
    switch (pItem.__){
      case NodeInternalType.CLASS:
        ret = from([pItem.methods])
        break;
      case NodeInternalType.METHOD:
        ret = from([pItem.xrefs])
        break;
      default:
        ret = from([]);
        break;
    }
    return ret;
  }

  itemHasChildren(pItem: any, pType: string): boolean {
    return (pItem.__!=null) && ([NodeInternalType.CLASS,NodeInternalType.METHOD].indexOf(pItem.__)>-1);
  }


  itemHasLazyChildren( pItem:any, pType ='p'): boolean {
    return (pItem.children.length==1 && pItem.children[0]._t=="wait");
  }

  itemGetChildren( pItem:any):any{
    return pItem.children;
  }

  getIntentFilters():IntentFilter[] {
    if(this.data==null){
      return [];
    }else
      return (this.data as AndroidActivity).intentFilters;
  }
  open(pItem: any): Observable<boolean> {

    if(this.controller.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }
    let success:boolean;
    switch (pItem.__){
      case NodeInternalType.CLASS:
      case NodeInternalType.METHOD:
        this.controller.app.getController('ctrl:code-main').openNode(pItem.uid, pItem.__);
        success = true;
        break;
      default:
        if(pItem.hasOwnProperty('parent')){
          this.controller.app.getController('ctrl:code-main').openNode(pItem.parent, NodeInternalType.METHOD);
          success = true;
        }else{
          success = false;
        }
        break;
    }

    return from([success]);
  }

}
