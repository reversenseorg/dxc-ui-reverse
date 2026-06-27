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
import {PlatformService, PlatformSet} from "../platform/ctrl/platform.service";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";


@Component({
  selector: 'dxc-platform-list',
  template: `
    <div class="row no-gutters">
      <div class="col-10">
        <select [(ngModel)]="platform"  (ngModelChange)="pltChange($event)"  class="dxc-input">
          <option value="none">None</option>
          <option value="min">Minimal version supported</option>
          <option value="target">Target version from manifest</option>
          <optgroup label="Installed">
            <ng-container *ngFor="let plt of platforms.installed">
              <option [value]="plt.uid">{{ plt.vendor | titlecase }}&nbsp;{{ plt.source | uppercase }}&nbsp;{{ plt.name }}&nbsp;{{ plt.version }}</option>
            </ng-container>
          </optgroup>
          <optgroup label="Available  (Internet required)">
            <ng-container *ngFor="let plt of platforms.remote">
              <option [value]="plt.uid">{{ plt.vendor | titlecase }}&nbsp;{{ plt.source | uppercase }}&nbsp;{{ plt.name }}&nbsp;{{ plt.version }}</option>
            </ng-container>
          </optgroup>
        </select>
      </div>
      <div class="col-2 pl-2">
        <dxc-refresh-btn (newClick)="refresh()"></dxc-refresh-btn>
      </div>
    </div>


  `,
  styleUrls: ['./device.component.scss','../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformListComponent implements OnInit{

  gIcons:any = GLOBAL_ICONS;
  @Input() platform:string;
  @Input() platforms:PlatformSet;

  @Output() selectPlatform:EventEmitter<string> = new EventEmitter<string>();

  constructor(  private platformSvc:PlatformService,
                private chRef:ChangeDetectorRef) {

  }

  ngOnInit(){
    this.refresh();
  }

  refresh():void {
    const subs = this.platformSvc.list().subscribe(( pPlatforms)=>{
      this.platforms = pPlatforms;
      this.chRef.detectChanges();
      subs.unsubscribe();
    });
  }

  pltChange(pEvent: any) {
    console.log("pltChange ",pEvent);
    this.selectPlatform.emit(pEvent as string);
  }
}
