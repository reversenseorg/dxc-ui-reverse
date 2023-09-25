import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {TOPO_ICONS} from "../icons";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {TopologyController} from "../ctrl/TopologyController";
import {NodeType} from "../../search/ctrl/ModelNode";
import ModelClass from "../../../models/ModelClass";
import ModelMethod from "../../../models/ModelMethod";
import {CODE_ICONS} from "../../code/icons";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import AndroidComponent from "../../../models/android/AndroidComponent";
import {IntentFilter} from "../../../models/android/IntentFilter";
import {IntentDataCriteria} from "../../../models/android/Intent";
import {ViewportTopoComponent} from "./viewport-topo.component";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {Nullable} from "../../../base/Nullable";




@Component({
  selector: 'app-viewport-topo-service',
  templateUrl: './viewport-topo-service.component.html',
  styleUrls: ['./viewport-topo.component.scss']
})
export class ViewportTopoServiceComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() item: any;
  @Input() data: any; // ModelMethod
  @Input() controller: TopologyController;
  @Input() parent: ViewportTopoComponent;

  @Input() height: number;
  @Input() width: number;

  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;
  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;


  NODE_TYPES = NodeInternalType;

  gIcons: any = GLOBAL_ICONS;
  cIcons: any = CODE_ICONS;
  icons: any = TOPO_ICONS;

  id: number = -1;


  ctr: number = 0;
  activeTop: string;
  activeTopLeft: string = 'if';
  activeTopRight: string = 'xr';

  constructor(private codeService:CodeControllerService) {
  }

  ngOnInit(): void {
  }



  ngOnChanges(changes: SimpleChanges) {

    let c:any = null;
    if(changes.hasOwnProperty('data')){
      const data = (changes as any).data.currentValue.__ppts.internals;

      this.data.impl = {};
      this.data.internals = [];
      for(let clz in data){
        c = new ModelClass({  name:clz });
        c.children = [];

        for(let m in data[clz]){
          c.children.push(new ModelMethod({
            __callSignature__: m,
            children: data[clz][m]
          }));
        }

        this.data.internals.push(c);
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
    this.data = pData;

  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  isIntentFilterExpandable(pItem:any, pSrc:any):boolean{
    return (pItem.data!=null && pItem.data.length>0);
  }

  isExpandable(pItem:any, pSrc:any):boolean{
    return (pItem.children!=null && pItem.children.length>0);
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
    let payload:any = {};
    if(pIntentFilter.hasMultipleActions() || pIntentFilter.hasMultipleCategories()) {
      this.parent.prepareIntent(pComponent, pIntentFilter, pCriteria);
    }
    // if pCriteria not null, generate payload
  }

  openImplementation(pView: string) {
    (this.parent.parent as any).parent
      .getController('ctrl:code-main')
      .open({ _t:'c', name:this.data.__impl },'act');
  }

  showImplementation(pView: string) {
    this.codeService.getClass(this.data.__impl).subscribe((pData:any)=>{
      this.data.impl = pData.data;
      this.activeTopRight = pView;
    });
  }
}
