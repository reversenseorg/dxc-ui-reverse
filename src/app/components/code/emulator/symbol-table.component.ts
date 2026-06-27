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
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {Nullable} from "../../../base/Nullable";
import {OutputService} from "../../output/ctrl/output.service";
import {CodeControllerService} from "../ctrl/code-controller.service";
import ModelMethod from "../../../models/ModelMethod";
import {ModelFunction} from "../../../models/ModelFunction";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {from, Observable} from "rxjs";
import * as ace from "ace-builds";
import {IconModel} from "../../../base/icon/IconModel";
import DDVM_SymbolTable from "../../../models/vm/DDVM_SymbolTable";
import DDVM_Symbol from "../../../models/vm/DDVM_Symbol";

// (contextmenu)="openVmMenu($event)"

@Component({
    selector: 'dxc-code-symbol-table',
    template: `
        <table class="w-full h-full dxc-text-std dxc-table">
            <thead>
                <th style="width: 30%">
                    <div class="w-full border-1 pl-2">Symbol</div>
                </th>
                <th style="width: 20%">
                    <div class="w-full border-1 pl-2">Value</div></th>
                <th style="width: 40%">
                    <div class="w-full border-1 pl-2">Code</div></th>
                <th style="width: 10%">
                    <div class="w-full border-1 pl-2">Extra</div></th>
            </thead>
            <tbody>
                <ng-container *ngIf="table!=null && table.length()>0; else noSymbol">
                    <tr *ngFor="let sym of getSymbols()">
                        <td>{{ sym.label }}</td>
                        <td>{{ sym.symbol.getValue() }}</td>
                        <td>{{ sym.symbol.getCode() }}</td>
                        <td>-</td>
                    </tr>
                    <!--<div class="row" *ngFor="let sym of getSymbols()">
                        <div class="col-3">{{ sym.label }}</div>
                        <div class="col-3">{{ sym.symbol.getValue() }}</div>
                        <div class="col-3">{{ sym.symbol.getCode() }}</div>
                        <div class="col-3">-</div>
                    </div>-->
                </ng-container>
                <ng-template #noSymbol>
                    <tr>
                        <td colspan="4" class="text-center p-2">Not yet symbols here.</td>
                    </tr>
                </ng-template>
            </tbody>
        </table>
        
    `,
    styleUrls:['../viewport-code/viewport-code.component.scss','../../../forms.scss'],
})
export class CodeSymbolTableComponent {

    @Input() table: Nullable<DDVM_SymbolTable>;

    constructor(
        private _outputSvc: OutputService,
        private codeSvc: CodeControllerService,
        private changeRef:ChangeDetectorRef) {

    }

    ngOnInit() {

    }


    getSymbols():{ label:string, symbol:DDVM_Symbol }[] {
        if(this.table==null){
            return [];
        }else {
            return Object.keys(this.table.getSymbols()).map(x => {
                return { label:x, symbol: (this.table as DDVM_SymbolTable).getSymbol(x) };
            })
        }
    }

    update(pTable:DDVM_SymbolTable):void {
        this.table = pTable;
        this.changeRef.detectChanges();
    }
}
