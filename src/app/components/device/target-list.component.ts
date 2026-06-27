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

import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";


@Component({
  selector: 'dxc-target-os-list',
  template: `
    <select [(ngModel)]="targetOs" (ngModelChange)="targetChange($event)" class="dxc-input">
      <option value="android">Android</option>
      <option value="ios">iOS</option>
      <option value="tizen">Tizen</option>
      <option value="linux">Linux</option>
      <option value="macos">MacOS</option>
      <option value="fw">Firmware</option>
    </select>
  `,
  styleUrls: ['./device.component.scss','../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetOsListComponent {

  @Input() targetOs = "android";

  @Output() selectTarget:EventEmitter<string> = new EventEmitter<string>();


  targetChange(pEvent: any) {

    console.log("targetChange ",pEvent);
    this.selectTarget.emit(pEvent as string);
  }
}
