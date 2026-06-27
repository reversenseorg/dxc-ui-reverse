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
} from "@angular/core";
import {MessageService} from "primeng/api";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {CountryService} from "../../../service/country.service";
import {LayoutService} from "../../../../layout/service/app.layout.service";

export interface ReleaseTag {
    name: string;
    code: string;
}



@Component({
    selector: 'dxp-release-tag',
    template: `
        <p-dropdown
                [options]="releaseTags"
                [(ngModel)]="selectedTag"
                optionLabel="name"
                optionValue="val"
                [filter]="true"
                filterBy="name"
                [showClear]="true"
                placeholder="Select a Country"
                styleClass="w-20rem">
            <ng-template pTemplate="filter" let-options="options">
                <div class="flex gap-1">
                    <div class="p-inputgroup" (click)="$event.stopPropagation()">
                        <span class="p-inputgroup-addon"><i class="pi pi-search"></i></span>
                        <input
                                type="text"
                                pInputText
                                placeholder="Filter"
                                [(ngModel)]="filterValue"
                                (keyup)="filterCountries($event, options)"/>
                    </div>
                    <button pButton icon="pi pi-times" (click)="resetFunction(options)" severity="secondary"></button>
                </div>
            </ng-template>
            <ng-template pTemplate="selectedItem" let-selectedOption>
                <div class="flex align-items-center gap-2">
                    <div>{{ selectedOption.name }}</div>
                </div>
            </ng-template>
            <ng-template let-country pTemplate="item">
                <div class="flex align-items-center gap-2">
                    <div>{{ country.name }}</div>
                </div>
            </ng-template>
        </p-dropdown>
    `,
    providers: [MessageService],
    standalone: true,
    imports: [
        FormsModule,
        DropdownModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseTagComponent implements OnInit {

    @Input() selected: ReleaseTag;

    filterValue: string;

    selectedTag: ReleaseTag;
    releaseTags: ReleaseTag[] = [];

    constructor(
        private _countrySvc:CountryService,
        private _changeRef: ChangeDetectorRef,
        public layoutService: LayoutService) {
    }


    ngOnInit() {
        /*this._auditSvc.getR().then((vCountries:Country[])=>{
            this.countries = vCountries;
            this._changeRef.detectChanges();
        })*/
    }

    resetFunction(options: any) {
        
    }

    filterCountries(pEvent:any, pOptions:any){

    }
}
