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
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {CODE_ICONS} from "../../code/icons";
import {NATIVE_ICONS} from "../icons";
import {ModelFunction} from "../../../models/ModelFunction";

@Component({
    selector: 'dxs-viewport-native-func',
    template: `
        <div [class.dxc-hidden]="(parent.activeCtn==null) || (id!=parent.activeCtn.id)"  class="container-fluid viewport-out viewport-native">

            <app-viewport-splitted [controller]="controller" [parent]="this" [flex]="true" [leftWidth]="50" [type]="'1:2'">
                <ng-container nav-left>
                    <app-subnavbar [type]="'navbar'" [parent]="this">
                        <ng-container main>
                            <app-subnavbar-btn [icon]="icons['FUNC']" [active]="activeTopLeft == 'di'" (click)="activeTopLeft = 'di'">&nbsp;Disassembly</app-subnavbar-btn>
                        </ng-container>
                    </app-subnavbar>
                </ng-container>
                <ng-container body-left>
                    <ng-container *ngIf="activeTopLeft == 'di' ">
                        <dxs-disass-view *ngIf="data!=null" [funcUID]="data.__s"></dxs-disass-view>
                    </ng-container>
                </ng-container>


                <ng-container nav-right>
                    <app-subnavbar [type]="'navbar'"  [parent]="this" [opts]="true">
                        <ng-container main>
                            <app-subnavbar-btn [icon]="icons['DECOMPILED']" [active]="activeTopRight == 'de'" (click)="selectRightTab('di')">Decompiled</app-subnavbar-btn>
                            <app-subnavbar-btn [icon]="cIcons['XREF_TO']" [active]="activeTopRight == 'xr'" (click)="selectRightTab('xr')">Xref</app-subnavbar-btn>
                            <app-subnavbar-btn [icon]="gIcons['HOOKS']" [active]="activeTopRight == 'hk'" (click)="selectRightTab('hk')">Hooks</app-subnavbar-btn>
                        </ng-container>
                        <ng-container options>
                            <app-subnavbar-btn [icon]="gIcons['FIND']" (click)="findInRight()"></app-subnavbar-btn>
                        </ng-container>
                    </app-subnavbar>
                </ng-container>
                <ng-container body-right>

                    <ng-container *ngIf="activeTopRight == 'de'">
                        <dxs-decompiled-view *ngIf="data!=null" [funcUID]="data.__s"></dxs-decompiled-view>
                    </ng-container>
                </ng-container>

            </app-viewport-splitted>
        
         </div>
    `,
    styleUrls: ['./viewport-native.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportNativeFuncComponent implements OnInit, AfterViewInit, IViewportContainer {


  @Input() controller: NativeController;
  @Input() parent: ViewportComponent;


  @ViewChild(ViewportNativeComponent) libViewCmp:ViewportNativeComponent;



    activeTop: string;
    activeTopLeft: string = 'di';
    activeTopRight: string = 'de';
    activeItem:any = null;
    activeObj: any = null;

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


  data: Nullable<ModelFunction> = null;

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

    protected readonly gIcons = GLOBAL_ICONS;
    protected readonly cIcons = CODE_ICONS;
    protected readonly icons = NATIVE_ICONS;
    activeRight: string;


    selectRightTab(pView: string) {
        this.activeTopRight = pView;
    }

    findInRight() {

    }
}
