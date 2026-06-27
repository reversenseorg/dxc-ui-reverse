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

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
import ModelClass from "../../../models/ModelClass";
import {CODE_ICONS} from "../icons";
import {ModelPackage} from "../../../cmp/ModelPackage";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";


@Component({
  selector: 'app-viewport-code-package',
  templateUrl: './viewport-code-package.component.html',
  styleUrls: ['./viewport-code.component.scss']
})
export class ViewportCodePackageComponent implements OnInit {

  @Input() item: any;
  @Input() data: ModelPackage;
  @Input() controller: CodeController;
  @Input() parent: ViewportComponent;

  @Input() height: number;
  @Input() width: number;



  @Input() direct = false;

  id: number = -1;
  icons:any = CODE_ICONS;
  gIcons:any = GLOBAL_ICONS;

  constructor() { }

  ngOnInit(): void {

  }

  configure( pData:any):void {
    this.data = pData;

  }

  onClose(): boolean {
    return true;
  }

}
