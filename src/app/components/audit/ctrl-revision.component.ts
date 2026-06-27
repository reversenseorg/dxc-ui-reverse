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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {Nullable} from "../../base/Nullable";
import {Metadata, MetadataTopic} from "src/app/models/audit/common/Metadata";
import {DatePipe, NgIf} from "@angular/common";

@Component({
    selector: 'dxp-ctrl-revision',
    template: `
        <ng-container *ngIf="rev">
            <b>{{ rev.date | date: 'dd/MM/yyyy'}}&nbsp;-&nbsp;{{ rev.version }}</b>
            <p>{{ rev.author }}</p>
        </ng-container> 
    `,
    standalone: true,
    imports: [
        NgIf,
        DatePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlRevisionComponent implements OnInit {

    @Input() metas: Metadata[] = [];
    @Input() last = true;

    rev:Nullable<any> = null;

    constructor(
        private _chref: ChangeDetectorRef) {
    }

    ngOnInit() {
        const sorted = this.metas
            .filter(x => (x.key===MetadataTopic.REVISION))

        const s = sorted.sort((a, b) => (a.value.date < b.value.date ? -1 : 1));

        if(sorted.length > 0){
            this.rev = s[0].value;
            this._chref.detectChanges();
        }
    }

}