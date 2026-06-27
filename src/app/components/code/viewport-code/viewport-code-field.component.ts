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

import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CodeItem} from "../explorer-code/CodeItem";
import {CodeController} from "../ctrl/CodeController";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {CodeControllerService} from "../ctrl/code-controller.service";
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import {CODE_ICONS} from "../icons";
import ModelField from "../../../models/ModelField";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";


@Component({
  selector: 'app-viewport-code-field',
  templateUrl: './viewport-code-field.component.html',
  styleUrls: ['./viewport-code.component.scss']
})
export class ViewportCodeFieldComponent implements OnInit, AfterViewInit {

  @Input() item: any;
  @Input() data: any; // ModelField
  @Input() controller: CodeController;
  @Input() parent: ViewportComponent;

  @Input() height: number;
  @Input() width: number;

  @Input() direct = false;
  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;
  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;




  activeLeft:string = 'md';
  activeWidth: number = 50;

/*
  topNav: NavbarSimpleView = new NavbarSimpleView({
    style: 'vp-navbar',
    menu: new MenuView({
      items: [
        new MenuItem({
          icon: GLOBAL_ICONS['JAVA'],
          label: "Implemented By"
        }),
        new MenuItem({
          icon: GLOBAL_ICONS['FIND'],
          label: "Instances"
        }),
        new MenuItem({
          icon: GLOBAL_ICONS['HOOKS'],
          label: "Permissions"
        })
      ]
    })

  });

  leftNav: NavbarSimpleView =  new NavbarSimpleView({
    menu: new MenuView({
      label: "Filter",
      items: [
        new MenuItem({
          id: 'app',
          icon: GLOBAL_ICONS['WINDOW'],
          label: "Application"
        }),
        new MenuItem({
          id: 'api',
          icon: GLOBAL_ICONS['ANDROID'],
          label: "Android"
        })
      ]
    })
  });

  rightNav: NavbarSimpleView = new NavbarSimpleView({
    menu: new MenuView({
      items: [
        new MenuItem({
          icon: GLOBAL_ICONS['HOOKS'],
          label: "Hook logs"
        }),
        new MenuItem({
          icon: GLOBAL_ICONS['LIBS'],
          label: "VM Out"
        }),
        new MenuItem({
          icon: GLOBAL_ICONS['ANDROID'],
          label: "adb logs"
        })
      ]
    })
  });*/

  id: number = -1;
  icons:any = CODE_ICONS;
  gIcons:any = GLOBAL_ICONS;


  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
  }

  configure( pData:any):void {
    this.data = pData;

  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  showModel(pWidth:number):void{
    this.activeLeft = 'md';
    this.activeWidth = pWidth;
  }

  showContents(pWidth:number):void{
    this.activeLeft = 'ct';
    this.activeWidth = pWidth;
  }

  showInstance(pWidth:number):void{
    this.activeLeft = 'in';
    this.activeWidth = pWidth;
  }

  showIO(pWidth:number):void{
    this.activeLeft = 'io';
    this.activeWidth = pWidth;
  }

  showPerm(pWidth:number):void{
    this.activeLeft = 'pm';
    this.activeWidth = pWidth;
  }
}
