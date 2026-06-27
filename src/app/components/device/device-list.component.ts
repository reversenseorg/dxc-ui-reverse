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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from "@angular/core";
import Platform from "../../models/Platform";
import {PlatformService} from "../platform/ctrl/platform.service";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {DeviceManagerService} from "./ctrl/device-manager.service";
import { Device } from "../../models/Device";
import {Nullable} from "../../base/Nullable";
import {OutputMessage} from "../../cmp/OutputMessage";
import {DEV_SUBVIEW} from "./explorer-dev.const";


@Component({
  selector: 'dxc-device-list',
  template: `

    <div class="row g-0">
      <div class="col-10">
        <select [(ngModel)]="device" name="devuid" id="devuid" #dev="ngModel" (ngModelChange)="change($event)" class="dxc-input" dxcInputValidation dxcToken="device:uid">
          <option [value]="null">None</option>
          <ng-container *ngFor="let d of devices">
            <option [value]="d.uid" [disabled]="(!allowNotEnrolled)&&(!d.enrolled)"><i *ngIf="!d.enrolled">[!] NOT ENROLLED :</i>&nbsp;{{ d.product }}&nbsp;|&nbsp;{{ d.id }}</option>
          </ng-container>
        </select>
        <div *ngIf="dev.invalid && (dev.dirty || dev.touched)"
             class="text-danger">

          <div *ngIf="dev.errors?.dxcType=='device:device.uid'">
            Invalid Device UID
          </div>
          <div *ngIf="dev.errors?.dxcType=='device:not_enrolled'">
            This device is not enrolled.
          </div>
        </div>
      </div>
      <div class="col-2 pl-2">
        <dxc-refresh-btn (newClick)="refresh()"></dxc-refresh-btn>
      </div>
    </div>


  `,
  styleUrls: ['./device.component.scss','../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceListComponent implements OnInit{

  gIcons:any = GLOBAL_ICONS;

  @Input() allowNotEnrolled = false;
  @Input() device:string;
  @Input() devices:Device[];
  @Output() selectDevice:EventEmitter<Device> = new EventEmitter<Device>();

  constructor(  private dmSvc:DeviceManagerService,
                private _changeDetectorRef:ChangeDetectorRef) {
  }

  ngOnInit(){
    this.dmSvc.devices$.subscribe((pDevices)=>{
      this.devices = pDevices;
      this._changeDetectorRef.detectChanges();
    })

    this.refresh();
  }

  refresh():void {
    const subs = this.dmSvc.listDevices().subscribe(( pDevs)=>{
      subs.unsubscribe();
    });
  }

  change(pEvent: string) {
    let dev:Nullable<Device> = null;
    for(let i=0; i<this.devices.length; i++){
      if(this.devices[i].uid===pEvent){
        dev = this.devices[i];
        break;
      }
    }

    if(dev!=null){
      this.selectDevice.emit(dev);
    }
  }
}
