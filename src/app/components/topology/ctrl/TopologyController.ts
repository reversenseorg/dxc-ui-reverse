import {ViewportView} from "../../../cmp/ViewportView";
import {ExplorerCodeComponent} from "../../code/explorer-code/explorer-code.component";
import {IController, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Observable, Subject} from "rxjs";
import {ComponentFactoryResolver} from "@angular/core";
import {TopologyService} from "./topology.service";
import {StageComponent} from "../../stage/stage.component";
import {UiController} from "../../../base/controllers/UiController";
import {NodeType} from "../../search/ctrl/ModelNode";
import {IntentFilter} from "../../../models/android/IntentFilter";
import AndroidComponent from "../../../models/android/AndroidComponent";
import {IntentDataCriteria} from "../../../models/android/Intent";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {Nullable} from "../../../base/Nullable";



export class TopologyController extends UiController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'topo';

  id:string = '';
  app: Nullable<StageComponent> = null;

  service: TopologyService;

  //explorer:ExplorerCodeComponent = null;
  rendered:any = [];


  constructor(pConfig:any=null) {
    super();
    this.configure(pConfig);
  }



  close(pItem: any, pSrc:any): any {

    this.rendered = this.rendered.filter( (vItem:any) => {
      return (vItem.__signature__ !== pItem.__signature__);
    });


    this.closeView.next(pItem);
  }

  isAlreadyRendered(pItem:any):any {
    let f:any=null;

    this.rendered.map((pView:any) => {     if((pView.item.__ === pItem.__) && (pView.item.name === pItem.name)){
        f = pView;
      }
    });

    return f;
  }

  open(pItem: any, pSrc:any): void{

    let existingRef = this.isAlreadyRendered(pItem);
    let vid: string = this.id+':v'+this.rendered.length;

    if(existingRef != null){
      //console.log('item is already rendered>', existingRef,pItem,existingRef.uid);
      this.focusView.next( existingRef.uid);
      return;
    }else{
      //console.log('rendering > ',pItem,vid);
      this.rendered.push({ item:pItem, uid:vid });
    }

    console.log(pItem);

    switch(pItem.__){
      case NodeInternalType.ANDROID_SERVICE:

        for(let i=0; i<pItem.intentFilters.length; i++){
          pItem.intentFilters[i] = IntentFilter.from(pItem.intentFilters[i]);
        }

        this.openView.next( { cmp: this.viewCmp['service'],  ctrl:this, data:pItem, uid:vid });
        break;
      case NodeInternalType.ANDROID_RECEIVER:

        for(let i=0; i<pItem.intentFilters.length; i++){
          pItem.intentFilters[i] = IntentFilter.from(pItem.intentFilters[i]);
        }

        this.openView.next( { cmp: this.viewCmp['receiver'],  ctrl:this, data:pItem, uid:vid });
        break;
      case NodeInternalType.ANDROID_PROVIDER:

        for(let i=0; i<pItem.intentFilters.length; i++){
          pItem.intentFilters[i] = IntentFilter.from(pItem.intentFilters[i]);
        }

        this.openView.next( { cmp: this.viewCmp['provider'],  ctrl:this, data:pItem, uid:vid });
        break;
      case NodeInternalType.ANDROID_ACTIVITY:

        for(let i=0; i<pItem.intentFilters.length; i++){
          pItem.intentFilters[i] = IntentFilter.from(pItem.intentFilters[i]);
        }

        this.openView.next( { cmp: this.viewCmp['activity'],  ctrl:this, data:pItem, uid:vid });
        break;
    }
  }

  showDetails(pObject: any):void {
    this.open( pObject, 'ctxm');
  }

  sendIntentTo(pOptions:any = null):void{

  }


}
