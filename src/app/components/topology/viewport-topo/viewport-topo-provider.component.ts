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
import {NodeInternalType} from "../../../models/NodeInternalType";




@Component({
  selector: 'app-viewport-topo-provider',
  templateUrl: './viewport-topo-provider.component.html',
  styleUrls: ['./viewport-topo.component.scss']
})
export class ViewportTopoProviderComponent implements OnInit, OnChanges, AfterViewInit {

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

  id: number = -1;


  ctr: number = 0;
  activeTop: string;
  activeTopLeft: string = 'if';

  constructor(private codeService:CodeControllerService) {
  }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {

    let c:any = null;
    if(changes.hasOwnProperty('data')){
      const data = changes.data.currentValue.__ppts.internals;

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
      this.layout.resize(pSize);
    });
  }

  configure( pData:any):void {
    this.data = pData;

  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
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
}
