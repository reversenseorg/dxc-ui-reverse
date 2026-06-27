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
    Component,
    Input,
} from '@angular/core';
import {Nullable} from "../../../base/Nullable";
import {NgbTooltip, NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {NgClass, NgIf} from "@angular/common";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxc-node-alias',
    template: `
        <ng-container *ngIf="hasAlias(); else noAlias">
            <span [ngClass]="aliasClass" [ngbTooltip]="getText()" >@{{ item.alias }}</span>
        </ng-container>
        <ng-template #noAlias>
            {{ getText() }}
        </ng-template>
    `,
    styleUrls: ['../explorer-code/explorer-code.component.scss'],
    providers: [NgbTooltipConfig],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        NgbTooltip,
        NgIf
    ]
})
export class NodeAliasComponent {

    @Input() item:any = null; //ModelMethod|ModelClass|ModelField|ModelFunction|ModelPackage;
    @Input() text:Nullable<string> = null;
    @Input() aliasClass = "text-warning";

    constructor() {

    }

    hasAlias():boolean {
        return (typeof this.item!=="string") && this.item!=null && this.item.alias!=null;
    }


    getText():string {
        if (this.text==null){
            switch (this.item.__){
                case NodeInternalType.METHOD:
                    this.text = this.item.__signature__;
                    break;
                case NodeInternalType.CLASS:
                    this.text = this.item.name;
                    break;
                case NodeInternalType.FUNC:
                    this.text = this.item.name;
                    break;
                case NodeInternalType.FIELD:
                    this.text = this.item.__signature__;
                    break;
                case NodeInternalType.PACKAGE:
                    this.text = this.item.name;
                    break;
            }
        }

        return this.text as string;
    }
}
