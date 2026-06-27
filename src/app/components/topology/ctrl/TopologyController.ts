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

    // listen for 'open modal'
    this.service.onMenuClick$.subscribe((pEvt )=>{
        if(pEvt.action==='modal-open' && (pEvt.type)){
          this.app?.showModal(pEvt.type);
        }
    });
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

    console.log("TOPO > Controller > open ",pItem,vid);

    switch(pItem.__){
        case NodeInternalType.ANDROID_RECEIVER:
        case NodeInternalType.ANDROID_PROVIDER:
        case NodeInternalType.ANDROID_ACTIVITY:
          case NodeInternalType.ANDROID_SERVICE:

            for(let i=0; i<pItem.intentFilters.length; i++){
              pItem.intentFilters[i] = IntentFilter.from(pItem.intentFilters[i]);
            }

            this.openView.next( { cmp: this.viewCmp['cmp'],  ctrl:this, data:pItem, uid:vid });
            break;
        /*
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
        break;*/
    }
  }

  showDetails(pObject: any):void {
    this.open( pObject, 'ctxm');
  }

  sendIntentTo(pOptions:any = null):void{
    this.app?.showModal('send-intent', pOptions);
  }


    sendTo(pItem:any, pEvt:string = "") {
      console.log("sendTo > ",pItem,pEvt);
        this.service.trigger(pItem.__, pItem.name, pEvt).subscribe( (pEvent:any)=>{
            console.log("sendTo > ",pItem,pEvt,pEvent);
        })
    }
}
