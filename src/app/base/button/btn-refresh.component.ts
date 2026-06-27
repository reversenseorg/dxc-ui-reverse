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
  Component,EventEmitter,
  Input,Output,
} from '@angular/core';
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {IconModelCollection} from "../icon/IconModel";

@Component({
  selector: 'dxc-refresh-btn',
  template: `
      <button class="btn btn-inline btn-sm" (click)="onClick($event)">
        <dxc-icon [model]="icons['REFRESH']"></dxc-icon><ng-content></ng-content>
      </button>
  `,
  styleUrls: ['../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonRefreshComponent  {

  icons:IconModelCollection = GLOBAL_ICONS;

  @Input() icon = "sync-alt";

  @Output() newClick:EventEmitter<any> = new EventEmitter<any>()

  onClick($event: MouseEvent) {
    this.newClick.next($event)
  }
}

