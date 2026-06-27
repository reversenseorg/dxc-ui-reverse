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
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, DoCheck,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TOPO_ICONS} from "../icons";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {TopologyController} from "../ctrl/TopologyController";
import ModelClass from "../../../models/ModelClass";
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
import AndroidReceiver from "../../../models/android/AndroidReceiver";
import AndroidProvider from "../../../models/android/AndroidProvider";
import AndroidService from "../../../models/android/AndroidService";
import {GraphSelection} from "../../../base/viewer/graph-viewer.component";
import {CodeGraphViewerComponent} from "../../code/graph/graph-viewer.component";


@Component({
  selector: 'app-viewport-topo-cmp',
  templateUrl: './viewport-topo-cmp.component.html',
  styleUrls: ['./viewport-topo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportTopoCmpComponent implements DoCheck, OnInit, OnChanges, AfterViewInit, IViewportContainer, ExpandableProvider {

  @Input() item: any;
  @Input() data: AndroidComponent|AndroidActivity|AndroidReceiver|AndroidProvider|AndroidService; // ModelMethod
  @Input() controller: TopologyController;
  @Input() parent: ViewportComponent;

  @Input() height: number;
  @Input() width: number;

  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;
  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;
  @ViewChild(CodeGraphViewerComponent) graph:CodeGraphViewerComponent;

  NODE_TYPES = NodeInternalType;

  gIcons: any = GLOBAL_ICONS;
  cIcons: any = CODE_ICONS;
  icons: any = TOPO_ICONS;

  id = -1;
  uid = "";

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'App Component',
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

    graphData: any[] = [];
    hidden:boolean = true;

  constructor(public codeService:CodeControllerService,
              private _chref:ChangeDetectorRef,
              private topoSvc:TopologyService) {
  }

  // ----- BEGIN of IViewportContainer  -------

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
  }

  onClose(): boolean {
    this.controller.close(this,'vp:appcmp');
    return true;
  }

  // ----- END of IViewportContainer  -------

  ngOnInit() {
    const l =  (this.data as AndroidComponent).getLabel();
    if(l!=null) this.view.tab.label = l;

      if(this.data.__impl!=null){
          this.data.__impl = { __: NodeInternalType.CLASS, _uid: this.data.__impl };
      }
      this.graphData.push(this.data);
  }

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

      this.hidden = (this.parent.activeCtn!=null) && !(this.parent.activeCtn.id == this.id);
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
    this.activeTopRight = 'int';
  }

  sendIntent(pComponent: AndroidComponent, pIntentFilter:IntentFilter, pCriteria: Nullable<IntentDataCriteria> = null, pEvent:any = null) {
    // prepare generic intent
    if(pIntentFilter.hasMultipleActions() || pIntentFilter.hasMultipleCategories()) {
      this.topoSvc.prepareIntent(pComponent, pIntentFilter, pCriteria);
    }
    // if pCriteria not null, generate payload
  }

  showImplementation(pView: string) {
    console.log(this.data);


    this.codeService.getClass(this.data.__impl==null ? this.data.name : this.data.__impl._uid).subscribe((pData:any)=>{

      if( pData != null){
        this.cmp_impl = new ModelClass(pData.data);
          const c = this.graphData.find((x:any)=>{
              return (x.__==this.cmp_impl.__) && (x.name==this.cmp_impl._uid) && (x.pkg==null);
          });
          console.log(c);
          if(c==null){
              this.graphData.push(this.cmp_impl);
              this.graph.action$.next({
                  type: "rebuild",
                  nodes: this.graphData
              });
          }
      }else{
        this.cmp_impl = null;
      }
      this.activeTopRight = pView;
      this._chref.detectChanges();



    });
  }

  showAndroidAPI(pTabName: string) {
    this.topoSvc.scanComponent( this.data).subscribe((x)=>{
        (this.data as any).internals = x;
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
      console.log((this.data as any).internals,x);
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
        //console.log(pItem.xrefs);
          if(this.activeTopRight=='xr'){
            console.log(pItem.xrefs);
            ret = from([pItem.xrefs])
          }else{
            ret = this.codeService.getMethodXref( (this.data as any).__signature__, 'to');
          }
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
    switch (pItem.__){
      case NodeInternalType.CLASS:
        return pItem.methods;
        break;
      case NodeInternalType.METHOD:
        //console.log(pItem.xrefs);
        if(this.activeTopRight=='xr'){
          return pItem.xrefs;
        }else{
         // ret = this.codeService.getMethodXref( this.data.__signature__, 'to');
        }
        break;
      default:
        pItem.children;
        break;
    }
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


    onNodeClick(pNode:any) {
        console.log("Node click", pNode);
        this.codeService.displayNode$.next({
            node: pNode
        });
    }

    onNodeSelectionChange($event: GraphSelection) {

    }

    ngDoCheck() {
        // to hide currently displayed view,
        const c = this.hidden;
        this.hidden = (this.parent.activeCtn!=null) && !(this.parent.activeCtn.id == this.id);
        if(c!=this.hidden){
            this._chref.detectChanges();
        }
        //this._viewRef.detectChanges();
    }
}
