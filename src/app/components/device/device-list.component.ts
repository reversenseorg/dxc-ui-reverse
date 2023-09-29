import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import Platform from "../../models/Platform";
import {PlatformService} from "../platform/ctrl/platform.service";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {DeviceManagerService} from "./ctrl/device-manager.service";
import { Device } from "../../models/Device";
import {Nullable} from "../../base/Nullable";


@Component({
  selector: 'dxc-device-list',
  template: `

    <div class="row no-gutters">
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

  constructor(  private dmSvc:DeviceManagerService) {
  }

  ngOnInit(){
    this.refresh();
  }

  refresh():void {
    const subs = this.dmSvc.listDevices().subscribe(( pDevs)=>{
      this.devices = pDevs;
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
