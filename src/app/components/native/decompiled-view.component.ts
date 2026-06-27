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
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    Input, OnChanges,
    OnInit,
    QueryList, SimpleChanges,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {Subject} from "rxjs";
import {IViewportContainer} from "../../base/viewport/IViewportContainer";
import {NativeController} from "./ctrl/NativeController";
import {NativeService} from "./ctrl/native.service";
import ModelFile from "../../models/ModelFile";
import ModelBasicBlock from "../../models/ModelBasicBlock";
import {Nullable} from "../../base/Nullable";
import {ContextMenuComponent, ContextMenuList, ContextMenuState} from "../../base/context-menu/context-menu.component";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {ModelFunction} from "../../models/ModelFunction";
import ModelCpuInstruction from "../../models/ModelCpuInstruction";

@Component({
  selector: 'dxs-decompiled-view',
  template: `
    <pre>{{ decText }}</pre>
  `,
  styles: [`
  
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecompiledViewComponent implements OnInit, OnChanges {

    //@Input() func:Nullable<ModelFunction> = null;
    @Input() funcUID:Nullable<string> = null;

    ctxMenu: Record<string,ContextMenuComponent> = {};
    ctxMenuState:ContextMenuState = { subject: null };

    decText:string = "";

    readonly gIcons = GLOBAL_ICONS;
    private activeItem: any = -1;

    constructor(private nativeSvc: NativeService,
                private _chref: ChangeDetectorRef) {

    }


    ngOnChanges(pChanges: SimpleChanges): void {
        if(pChanges['funcUID'].currentValue!=null
            || pChanges['func'].currentValue!=null) {
            console.log("disass view : ngOnChanges : ", pChanges);
            this.refresh();
            return;
        }
    }

    ngOnInit() {
    }


    refresh() {
        if(this.funcUID==null) return;
        console.log("decomp view : refresh : ", this.funcUID);
        this.nativeSvc.decompile(this.funcUID).subscribe(res=>{
            this.decText = res;
            this._chref.detectChanges();
        });
    }
}
