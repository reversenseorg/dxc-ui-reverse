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
  selector: 'dxc-virtual-device-form',
  template: `
    <p class="dxc-text-std dxc-text-100 mb-0 pt-1">
      A virtual device is not able to execute code as a real device or a device emulator but it allows to use others components
    </p>
    <div class="row">
      <div class="col-6">
        <div class="dxc-frm-label">Model</div>
        <div><input type="text" [(ngModel)]="model" placeholder="Model name" class="dxc-input"/></div>
      </div>
      <div class="col-6">
        <div class="dxc-frm-label">Product</div>
        <div><input type="text" [(ngModel)]="product" placeholder="Product name" class="dxc-input"/></div>
      </div>

    </div>

    <div class="dxc-frm-label">
      Serial
    </div>
    <div>
      <input type="text" [(ngModel)]="product" placeholder="Product name" class="dxc-input mb-1"/>
    </div>
    <div class="dxc-frm-label">
      Plateform Version
    </div>
    <div>
      <dxc-platform-list [platform]="platform" (selectPlatform)="platformChange($event)"></dxc-platform-list>
    </div>
  `,
  styleUrls: ['./device.component.scss','../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualDeviceSettingsComponent {

  @Input() targetOs = "android";
  model:string;
  product:string;
  serial:string;

  platform:string;

  @Output() selectTarget:EventEmitter<string> = new EventEmitter<string>();


  targetChange(pEvent: any) {

    console.log("targetChange ",pEvent);
    this.selectTarget.emit(pEvent as string);
  }

  platformChange(pEvent: string) {
    this.platform = pEvent;
  }
}
