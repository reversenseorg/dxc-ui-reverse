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

import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {TOPO_ICONS} from "../icons";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {TopologyController} from "../ctrl/TopologyController";
import ModelClass from "../../../models/ModelClass";
import ModelMethod from "../../../models/ModelMethod";
import {CODE_ICONS} from "../../code/icons";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportView} from "../../../cmp/ViewportView";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {Subject} from "rxjs";
import AndroidReceiver from "../../../models/android/AndroidReceiver";
import {IntentFilter} from "../../../models/android/IntentFilter";
import AndroidProvider from "../../../models/android/AndroidProvider";
import {Nullable} from "../../../base/Nullable";




@Component({
  selector: 'app-viewport-topo-receiver',
  templateUrl: './viewport-topo-receiver.component.html',
  styleUrls: ['./viewport-topo.component.scss']
})
export class ViewportTopoReceiverComponent implements OnInit, IViewportContainer, OnChanges, AfterViewInit {

  @Input() item: any;
  @Input() data: any; //AndroidReceiver[]; // ModelMethod
  @Input() controller!: TopologyController;
  @Input() parent!: ViewportComponent;

  @Input() height!: number;
  @Input() width!: number;

  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl!:ElementRef;
  @ViewChild(ViewportSplittedComponent) layout!:ViewportSplittedComponent;


  NODE_TYPES = NodeInternalType;

  gIcons: any = GLOBAL_ICONS;
  cIcons: any = CODE_ICONS;
  icons: any = TOPO_ICONS;

  id: number = -1;
  uid = "";

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Receivers',
      icon: GLOBAL_ICONS['GLOBE'],
      color: 'dxc-text-clear100'
    })
  });



  size:any = {
    height: '150px'
  };

  resize$: Subject<any> = new Subject<any>();

  //ctr: number = 0;
  //activeTop: string;
  activeTopLeft: string = 'if';
  private cmp_impl: Nullable<ModelClass> = null;

  constructor(private codeService:CodeControllerService) {
  }

  // ----- BEGIN of IViewportContainer  -------

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
  }

  onClose(): boolean {
    this.controller.close(this,'vp:receiver');
    return true;
  }

  // ----- END of IViewportContainer  -------
  activeTopRight: string;

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {

    let c:any = null;
    if(changes.hasOwnProperty('data')){
      const data = (changes as any).data.currentValue.__ppts.internals;

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

  showImplementation(pView: string) {

    this.codeService.getClass(this.data.__impl==null ? this.data.name : this.data.__impl).subscribe((pData:any)=>{

      if( pData != null){
        this.cmp_impl = new ModelClass(pData.data);
      }else{
        this.cmp_impl = null;
      }
      this.activeTopRight = pView;
    });
  }
  
  ngAfterViewInit() {

    this.parent.resize$.subscribe( (pSize:any)=>{
      this.layout.resize(pSize);
    });
  }

  configure( pData:any):void {
    this.data = pData;

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

  getIntentFilters():IntentFilter[] {
    if(this.data==null){
      return [];
    }else
      return (this.data as AndroidReceiver).intentFilters;
  }
}
