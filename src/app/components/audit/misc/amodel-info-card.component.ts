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
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnInit,
  Output,
} from "@angular/core";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import ControlAssessment from "../../../models/audit/common/ControlAssessment";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {ProjectService} from "../../project/ctrl/project.service";
import {OutputService} from "../../output/ctrl/output.service";
import {SearchService} from "../../search/ctrl/search.service";
import {Nullable} from "../../../base/Nullable";
import {DxcComponent} from "../../../base/DxcComponent";
import AssuranceModel from "../../../models/audit/common/AssuranceModel";
import {DxcBaseModule} from "../../../base/dxc-base.module";
import {NgIf} from "@angular/common";
import {ControlRevisionComponent} from "../ctrl-revision.component";
import {IconComponent} from "../../../base/icon/icon.component";

/**
 * Represent a Merlin rule as a single row
 *
 * Useless
 * @class
 */
@Component({
  selector: 'dxc-audit-model-card',
  template: `
    <div class="card">
      <div class="card-header">
        <h5 class="card-title dxc-herb">Current Revision:</h5>
      </div>
      <div class="card-body">
        <dxp-ctrl-revision [metas]="model.metadata"></dxp-ctrl-revision>
        <ng-container  *ngIf="descr">
          <h5 class="card-title">{{ model.id }}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">{{ model.name }}</h6>
          <p class="card-text" *ngIf="descr">{{ shortDescription() }}</p>
          <a href="#" class="card-link">
            <dxc-icon [model]="gIcons['DOWNLOAD']" class="mr-2 dxc-text-darker"></dxc-icon>&nbsp;Website
          </a>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: #FFFFFF60;
    }
  `],
  standalone: true,
  imports: [
    DxcBaseModule,
    NgIf,
      IconComponent,
    ControlRevisionComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssuranceModelInfoCardComponent {

  @Input() model:AssuranceModel;
  @Input() descr = false;

  gIcons:any = GLOBAL_ICONS;

  constructor(
      private _changeDetector:ChangeDetectorRef
  ) {
  }

  /**
   * To return a short form of the description truncated after `pLength` chars
   *
   * @param {number} pLength
   */
  shortDescription(pLength:number = -1):string {
    if(this.model.description==null){
      return "This assurance model has not description"
    }
    return "";
  }
}

