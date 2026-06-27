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
  AfterContentInit, AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Input,
  OnInit,
  QueryList, ViewChild
} from '@angular/core';
import {CodeItem} from "../explorer-code/CodeItem";
import {CodeController} from "../ctrl/CodeController";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {CodeControllerService} from "../ctrl/code-controller.service";
import {ViewportCodeClassComponent} from "./viewport-code-class.component";
import {IconModel} from "../../../base/icon/IconModel";
import {CODE_ICONS} from "../icons";
import {Subject} from "rxjs";
import {NodeInternalType} from "../../../models/NodeInternalType";
import ModelStringValue from "../../../models/ModelStringValue";


@Component({
  selector: 'app-viewport-code',
  templateUrl: './viewport-code.component.html',
  styleUrls: ['./viewport-code.component.scss']
})
export class ViewportCodeComponent implements OnInit, AfterViewInit, IViewportContainer {

  @Input() controller: CodeController;
  @Input() parent: ViewportComponent;
  @ContentChildren(ViewportCodeClassComponent) classCmp: QueryList<ViewportCodeClassComponent>;

  icons:any = CODE_ICONS;
  opts: { direct:boolean } = {direct:false};

  id: number = -1;
  uid: string = '';
  size:any = {
    height: '150px'
  };

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Code',
      icon: CODE_ICONS['DEFAULT'],
      color: 'dxc-text-clear100'
    })
  });

  resize$: Subject<any> = new Subject<any>();

  data: any;

  constructor() { }

  ngOnInit(): void {

    console.log('size vp > ', this.size);
  }

  configure( pData:any):void {
    this.data = pData;

    console.log('configure viewport>',pData);
    this.view.tab.icon = pData._icon;


    switch(pData.__){
      case NodeInternalType.METHOD:
        if(this.view.tab.icon==null)
          this.view.tab.icon = this.icons['METH'];
        this.view.tab.label = pData.name;
        this.view.tab.tip = pData.__signature__;
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case NodeInternalType.PACKAGE:
        this.view.tab.label = pData.name;
        this.view.tab.tip = pData.name;
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case NodeInternalType.CLASS:
        this.view.tab.label = pData.simpleName;
        this.view.tab.tip = pData.name;
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case NodeInternalType.FIELD:
        this.view.tab.label = pData.__signature__;
        this.view.tab.color = 'text-warning';
        break;
      case NodeInternalType.STRING:
        this.view.tab.label = (pData as ModelStringValue).value?.substring(0,10)+"...";
        this.view.tab.tip = pData.value;
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

  protected readonly NodeInternalType = NodeInternalType;
}
