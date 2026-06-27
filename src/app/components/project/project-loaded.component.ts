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
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {ProjectService} from "./ctrl/project.service";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgIf} from "@angular/common";
import {DxcBaseModule} from "../../base/dxc-base.module";

@Component({
  selector: 'dxs-project-status',
  template: `
    <ng-container *ngIf="ready;else addpdown">
      <app-subnavbar-btn [color]="'status'">
        <fa-icon [icon]="['fas','circle']" class="running"></fa-icon>&nbsp;AppDB Ready
      </app-subnavbar-btn>
    </ng-container>
    <ng-template #addpdown>
      <app-subnavbar-btn [color]="'status'">
        <fa-icon [icon]="['fas','circle']" [class]="unknown?'unknown':'stopped'"></fa-icon>&nbsp;AppDB Down
      </app-subnavbar-btn>
    </ng-template>
  `,
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgIf,
    DxcBaseModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectStatusComponent implements OnInit {

  unknown:boolean = false;
  ready = false;

  constructor( private _prjSvc: ProjectService,
               private _chRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    const puid = sessionStorage.getItem('puid');
    if(puid==null){
      this.unknown = true;
      this._chRef.detectChanges();
    }else{
      this._prjSvc.getProject(puid).subscribe( (pEvent)=>{
        this.ready = pEvent.loaded;
        this._chRef.detectChanges();
      });
    }
  }
}
