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
    OnInit,
    Output
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {Nullable} from "../../../base/Nullable";
import {DeviceResolver} from "../../device/ctrl/device-resolver.service";
import {ProjectResolver} from "../ctrl/project-resolver.service";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxs-project-card',
    templateUrl: './project-card.component.html',
    styles:[`
      div.project-card {
        
        background-color: var(--card-bg);
        color: var(--card-text);
        border: 1px solid var(--input-border);
        border-radius: var(--card-border-radius);
        
        .project-app {
          color: var(--card-text-high);
        }
        .project-name {
          font-size: 0.8rem;
          color: var(--text-100);
          text-decoration: underline;
        }
      }
      
    `],
    providers: [ProjectResolver]
})
export class ProjectCardComponent implements OnInit {

    @Input() project:DexcaliburProject;
    @Input() height: number = 200;


    readonly gIcons = GLOBAL_ICONS;

    constructor(private changeRef:ChangeDetectorRef) {

    }

    ngOnInit() {

    }

}
