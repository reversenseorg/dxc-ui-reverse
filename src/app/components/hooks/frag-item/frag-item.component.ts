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
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {IconModelCollection} from "../../../base/icon/IconModel";
import HookTemplateFragment from "../../../models/hook/HookTemplateFragment";
import {HookService} from "../ctrl/hook.service";
import {AbstractHook} from "../../../models/AbstractHook";


export type FragmentPosition = "after" | "before" | "replace";


@Component({
    selector: 'dxc-frag-item',
    template: `
        <div class="row g-0 dxc-editable-block frag-item-block  overflow-y-auto" [ngClass]="{ 'frag-active':active }" (click)="focusIn($event)" (contextmenu)="hookSvc.displayContextMenu($event, 'hkfrag', { hook:hook, frag:frag, pos:position })">
            <div class="col-10">
                
                <dxc-meta [css]="getCss()" [label]="position|uppercase"></dxc-meta>
                <strong *ngIf="frag.name; else noNameF" class="pl-1">{{ frag.name }}</strong>
                <ng-template  #noNameF>
                    <strong class="pl-1">Fragment #{{ offset>-1? offset:frag._w}}</strong>
                </ng-template>

                <div class="p-2">
                    <p *ngIf="frag.descr; else noDescF">{{ frag.descr }}</p>
                    <ng-template  #noDescF>
                        <p>This fragment has not description</p>
                    </ng-template>
                </div>
                
            </div>
            <div class="col-2 text-right">
                <!--<dxc-icon [model]="gIcons['SAVE']" [color1]="'dxc-text-75'"></dxc-icon>-->
                <dxc-meta [label]="'Priority'" [value]="frag.weight"></dxc-meta>
            </div>
        </div>

        
    `,
    styleUrls:['../viewport-hooks/viewport-hook.component.scss'],
    styles: [`
      div.frag-active {
        border: 2px solid #35a1ff;
      }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HookFragItemComponent implements OnInit {

    @Input() frag:HookTemplateFragment;
    @Input() hook?:AbstractHook;
    @Input() position?:FragmentPosition;
    @Input() active?:boolean;
    @Input() offset:number = -1;

    @Output() onclick:EventEmitter<any> = new EventEmitter<any>();

 gIcons:IconModelCollection = GLOBAL_ICONS;

    constructor(
        public hookSvc: HookService,
        private changeRef:ChangeDetectorRef) {

    }


    ngOnInit() {


    }

    getCss():string {
        let cls = "";
        switch (this.position){
            case "before":
                cls = "dxc-salmon";
                break;
            case "after":
                cls = "dxc-herb";
                break;
            case "replace":
                cls = "dxc-azur";
                break;
        }

        return cls;
    }

    focusOut():void {
        this.active = false;
        this.changeRef.detectChanges();
    }

    focusIn(pEvent: MouseEvent) {

        this.active = true;
        this.changeRef.detectChanges();

        this.onclick.emit({
            event: pEvent,
            cmp: this
        });
    }
}
