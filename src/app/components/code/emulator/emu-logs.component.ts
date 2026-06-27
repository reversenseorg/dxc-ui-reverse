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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';

// (contextmenu)="openVmMenu($event)"

@Component({
    selector: 'dxc-code-emu-log',
    template: `
        <table class="w-full h-full dxc-text-std dxc-table">
            <thead>
                <th style="width: 10%">
                    <div class="w-full border-1 pl-2">Type</div>
                </th>
                <th style="width: 90%">
                    <div class="w-full border-1 pl-2">Message</div></th>
            </thead>
            <tbody>
            <ng-container *ngIf="vmLog!=null && vmLog.length>0; else noLog">
                <tr *ngFor="let l of vmLog">
                    <td>{{ l.t }}</td>
                    <td class="dxc-text-clear75"><pre>{{ l.v }}</pre></td>
                </tr>
            </ng-container>
            <ng-template #noLog>
                <tr>
                    <td colspan="2" class="text-center p-2">No logs here.</td>
                </tr>
            </ng-template>
            </tbody>
        </table>
    `,
    styleUrls:['../viewport-code/viewport-code.component.scss','../../../forms.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEmuLoggerComponent {

    @Input() vmLog: any[] = [];

    constructor(
        private changeRef:ChangeDetectorRef) {

    }

    push(pLog:any):void {
        this.vmLog.push(pLog);
        this.changeRef.detectChanges();
    }

    update(pLogs:any[]):void {
        this.vmLog = pLogs;
        this.changeRef.detectChanges();
    }
}
