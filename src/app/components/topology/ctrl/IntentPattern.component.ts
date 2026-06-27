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

import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {IntentDataCriteria} from "../../../models/android/Intent";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {Nullable} from "../../../base/Nullable";


@Component({
  selector: 'dxc-intent-criteria-data',
  template: `
    <ng-container *ngIf="inputMode; else tagMode">

      <span *ngIf="_f.scheme!=null">

        <span class="badge text-bg-secondary dxc-meta" style="line-height: 12px;">URI:</span>
        <input class="dxc-frm-input dxc-meta" style="line-height: 12px; padding: 2px 0 1px 1em;color:#ee8f4e; font-weight:800; font-family:'Courier New', Courier, monospace; font-size:11px; width:70%;"  [(ngModel)]="uri">
      </span>
    </ng-container>
    <ng-template #tagMode>
      <span *ngIf="_f.scheme!=null">

        <span class="badge text-bg-secondary dxc-meta">URI:</span>
        <span class="badge text-bg-info dxc-meta">{{ _f.scheme }}</span>
        <span class="badge text-bg-secondary dxc-meta">://</span>
        <span *ngIf="_f.host!=null">
          <span class="badge text-bg-info dxc-meta">{{ _f.host }}</span>
          <span class="badge text-bg-secondary dxc-meta" *ngIf="_f.port!=null">:</span>
          <span class="badge text-bg-info dxc-meta" *ngIf="_f.port!=null">{{ _f.port }}</span>
        </span>
        <span class="badge text-bg-secondary dxc-meta" *ngIf="_f.host==null">*</span>
        <span class="badge text-bg-secondary dxc-meta" *ngIf="_f.port!=null">/</span>
        <span *ngIf="_f.pathPattern!=null">
          <span class="badge text-bg-secondary dxc-meta">pathPattern:</span>
          <span class="badge text-bg-info dxc-meta">{{ _f.pathPattern }}</span>
        </span>
        <span *ngIf="_f.path!='*'">
          <span *ngIf="_f.pathPattern!=null" class="badge text-bg-warning dxc-meta">OR</span>
          <span class="badge text-bg-secondary dxc-meta">path:</span>
          <span class="badge text-bg-info dxc-meta">{{ _f.path }}</span>
        </span>
        <span *ngIf="_f.pathPrefix!=null">
          <span *ngIf="_f.path!=null || _f.pathPattern!=null" class="badge text-bg-warning dxc-meta">OR</span>
          <span class="badge text-bg-secondary dxc-meta">pathPrefix:</span>
          <span class="badge text-bg-info dxc-meta">{{ _f.pathPrefix }}</span>
        </span>

        <span class="badge text-bg-secondary dxc-meta" *ngIf="_f.port!=null">&nbsp;</span>
      </span>
    </ng-template>

    <span *ngIf="_f.mimeType!=null" class="ml-1">
      <span class="badge text-bg-secondary dxc-meta">MIME:</span>
      <span class="badge text-bg-info dxc-meta">{{ _f.mimeType }}</span>
    </span>
  `,
  styleUrls: ['../../../forms.scss'],

})
export class IntentPatternComponent implements OnChanges{
  @Input() _f:IntentDataCriteria;
  @Input() inputMode:boolean = false;
  @Output() enter:EventEmitter<any> = new EventEmitter<any>()

  uri:Nullable<string> = null;
  prefix:Nullable<string> = null;
  pattern:Nullable<string> = null;

  constructor() {
  }

  ngOnChanges(pChanges: SimpleChanges): void {
    if(pChanges.hasOwnProperty('_f')){
      this.prepareURI(pChanges['_f'].currentValue);
    }
  }

  prepareURI( pData:IntentDataCriteria):void {
    if(pData.scheme==null){
      return;
    }

    this.uri = pData.scheme;

    if(pData.host!=null){
      this.uri += '://'+pData.host;
      if(pData.port!='*'){
        this.uri += ':'+pData.port;
      }
    }

    if(pData.path!=null){
      this.uri += '/'+pData.path;
    }
    else if(pData.pathPattern!=null){
      this.uri += '/'+pData.pathPattern;
      this.pattern = pData.pathPattern;
    }
    else if(pData.pathPrefix!=null){
      this.uri += '/'+pData.pathPrefix;
      this.prefix = pData.pathPrefix;
    }


  }

}
