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

import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {ICON_TYPE, IconModel} from "../../base/icon/IconModel";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {HelperBtnType, HelperService, HelperType} from "./ctrl/HelperService";


@Component({
  selector: 'dxc-helper-btn',
  template: `
    <ng-container *ngIf="fmt==helperSvc.BTN_BTN; then btnFmt else navFmt"></ng-container>
    <ng-template #btnFmt ><span class="btn-close" (click)="open()"><dxc-icon [model]="helpIcon"></dxc-icon></span></ng-template>
    <ng-template #navFmt ><app-subnavbar-btn (click)="open()" [icon]="helpIcon">Help</app-subnavbar-btn></ng-template>

  `,
  styleUrls: ['../../base/subnavbar/subnavbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DxcHelperBtnComponent  {


  @Input() docid = '';
  @Input() fmt: HelperBtnType;
  @Input() type: HelperType = HelperType.VIEWER;

  helpIcon:IconModel = GLOBAL_ICONS['HELPER'];

  constructor( public helperSvc:HelperService) {
    this.fmt = helperSvc.BTN_BTN;
  }

  open():void{
    this.helperSvc.openDoc(this.docid, this.type);
  }
}
