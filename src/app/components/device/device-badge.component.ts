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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {DeviceManagerService, DeviceUID} from "./ctrl/device-manager.service";
import {Nullable} from "../../base/Nullable";
import {Device} from "../../models/Device";
import {IconModelCollection} from "../../base/icon/IconModel";
import {DEV_ICONS} from "./icons";
import {IconComponent} from "../../base/icon/icon.component";
import {NgClass, NgIf} from "@angular/common";


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxc-device-badge',
    template: `
        <span *ngIf="dev!=null" [ngClass]="'badge dxc-no-gutters dxc-meta rounded-pill dev-badge pb-0 pt-0'">
            <dxc-icon [model]="icons['MOBILE']"></dxc-icon>
            {{ dev.id }}
        </span>
    `,
    styles: [`
      .dev-badge {
        background-color: #ffd700;
        color: black;
        font-size: 0.8em;
      }
    `],
    standalone: true,
    imports: [
        IconComponent,
        NgClass,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceBadgeComponent implements OnInit {


    @Input() dev:Nullable<Device> = null;
    @Input() devUID:Nullable<DeviceUID> = null;

    icons:IconModelCollection = DEV_ICONS;


    constructor(
        public devSvc: DeviceManagerService,
        private changeRef:ChangeDetectorRef) {

    }


    ngOnInit() {
        if(this.dev==null && this.devUID!=null){
            const oid = sessionStorage.getItem("org");
            if(oid==null) return;

            this.devSvc.getDevice(this.devUID, oid).subscribe((vDev:Nullable<Device>)=>{
                   if(vDev!=null){
                       this.dev = vDev;
                       this.changeRef.detectChanges();
                   }
            })
        }
    }

    /**
     * Navigate to the item
     *
     * @param {INode} pItem
     */
    goTo(pItem:any = null){

    }
}
