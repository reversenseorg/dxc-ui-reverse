import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {Subject} from "rxjs";
import {StageComponent} from "../../stage/stage.component";
import {TopologyController} from "../ctrl/TopologyController";
import {TOPO_ICONS} from "../icons";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import AndroidComponent from "../../../models/android/AndroidComponent";
import {IntentFilter} from "../../../models/android/IntentFilter";
import {IntentDataCriteria} from "../../../models/android/Intent";
import {ModalSendIntentComponent} from "../modal-intent/modal-send-intent.component";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {Nullable} from "../../../base/Nullable";

@Component({
  selector: 'app-viewport-topo',
  templateUrl: './viewport-topo.component.html',
  styleUrls: ['./viewport-topo.component.scss']
})
export class ViewportTopoComponent implements OnInit, AfterViewInit, IViewportContainer {


  @Input() controller: TopologyController;
  @Input() parent: ViewportComponent;
  @ViewChild(ModalSendIntentComponent) sendIntentModal: ModalSendIntentComponent;

  NODE_TYPES = NodeInternalType;

  id: number = -1;
  uid: string = '';
  size:any = {
    height: '150px'
  };

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Topology',
      icon: GLOBAL_ICONS['GLOBE'],
      color: 'dxc-text-clear100'
    })
  });


  resize$: Subject<any> = new Subject<any>();


  data: any;

  constructor() { }

  ngOnInit(): void {

  }

  configure( pData:any):void {
    this.data = pData;
    this.view.tab.icon = pData._icon;

    switch(pData.__){

      case NodeInternalType.ANDROID_ACTIVITY:
      case NodeInternalType.ANDROID_PROVIDER:
      case NodeInternalType.ANDROID_RECEIVER:
      case NodeInternalType.ANDROID_SERVICE:
      case NodeInternalType.ANDROID_PERM:
        this.view.tab.label = pData.name;
        this.view.tab.color = 'dxc-text-clear100';
        break;
    }

    if(pData.alias != null){
      this.view.tab.label = '@'+pData.alias;
      this.view.tab.color = 'text-warning';
    }

  }

  ngAfterViewInit() {


  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
  }


  prepareIntent(pComponent: AndroidComponent, pIntentFilter: IntentFilter, pCriteria: Nullable<IntentDataCriteria>):void {
    //if(pIntentFilter)
    this.sendIntentModal.comp = pComponent;
    this.sendIntentModal.filter = pIntentFilter;
    this.sendIntentModal.criteria = pCriteria;
    this.sendIntentModal.show();
  }

}
