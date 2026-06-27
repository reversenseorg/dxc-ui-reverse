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

import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {Subject} from "rxjs";
import {NativeController} from "../ctrl/NativeController";
import {FILE_ICONS} from "../../file/icons";
import ModelFile from "../../../models/ModelFile";
import {ViewportNativeComponent} from "./viewport-native.component";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";

@Component({
  selector: 'app-viewport-native',
  template: `
      <div [class.dxc-hidden]="(parent.activeCtn==null) || (id!=parent.activeCtn.id)"  class="container-fluid viewport-out viewport-native">
          <dxc-viewport-native [data]="data" [height]="size.height"  [parent]="this.parent" [controller]="controller" [id]="id"></dxc-viewport-native>
      </div>
  `,
  styleUrls: ['./viewport-native.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ViewportNativeMainComponent implements OnInit, AfterViewInit, IViewportContainer {


  @Input() controller: NativeController;
  @Input() parent: ViewportComponent;


  @ViewChild(ViewportNativeComponent) libViewCmp:ViewportNativeComponent;


  id: number = -1;
  uid: string = '';
  size:any = {
    height: '150px'
  };

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Lib',
      icon: FILE_ICONS['BIN'],
      color: 'dxc-text-clear100'
    })
  });


  resize$: Subject<any> = new Subject<any>();


  data: Nullable<ModelFile> = null;

  constructor() { }

  ngOnInit(): void {

    console.log('size vp > ', this.size);
  }

  configure( pData:any):void {
    this.data = pData;

    console.log('configure viewport>',pData);
    this.view.tab.icon = pData._icon;
    this.view.tab.label = pData.name;
    this.view.tab.color = 'dxc-text-clear100';

    if(pData.alias != null){
      this.view.tab.label = '@'+pData.alias;
      this.view.tab.color = 'text-warning';
    }


  }

  ngAfterViewInit() {
    if(this.libViewCmp != null){
      if(this.data==null){
        throw UIException.MISSING_LIBRARY("native-view");
      }
      this.libViewCmp.configure(this.data);
    }
  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
    /*console.log('resize vp > ', pSize, this.codeEditor.getEditor());
    if(this.codeEditor != null){
      this.codeEditor.nativeElement.style.minHeight = pSize.height;
      this.codeEditor.nativeElement.style.height = pSize.height;
    }*/
  }
}
