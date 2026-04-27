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
