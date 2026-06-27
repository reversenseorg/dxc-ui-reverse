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
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {Nullable} from "../../../base/Nullable";
import {Tag} from "../../../models/tags/Tag";
import {IconModel, IconModelCollection} from "../../../base/icon/IconModel";
import {CODE_ICONS} from "../icons";
import ModelCall from "../../../models/ModelCall";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxs-xref-item',
    template: `
    <div class="row g-0">
        <div  *ngIf="item.tags!=null && item.tags.length>0" class="col-lg-1">
            <ng-container [ngSwitch]="item.instr">
                <span *ngSwitchCase="'GETTER'" class="badge padge-pill text-bg-success">GET</span>
                <span *ngSwitchCase="'SETTER'" class="badge padge-pill text-bg-success">SET</span>
                <span *ngSwitchCase="'INVOKE'" class="badge padge-pill text-bg-danger">CALL</span>
                <span *ngSwitchCase="'CLASS_CHECK'" class="badge padge-pill text-bg-success">TYPE CHECK</span>
                <span *ngSwitchDefault class="badge padge-pill">{{ item.instr }}</span>
            </ng-container>
        </div>
        <div [ngClass]="'col-lg-'+((item.tags!=null&& item.tags.length>0)?'9':'11')">
            <dxc-hook-status *ngIf="hookstatus" [ref]="getNode()"></dxc-hook-status>
            <dxc-icon [model]="xrefIcon"></dxc-icon>
            <dxc-node-token [interactive]="true" [cache]="true" [ref]="getNode()"></dxc-node-token>
        </div>
        <div  *ngIf="item.tags!=null && item.tags.length>0" class="col-lg-2">
            <ng-container *ngFor="let t of item.tags">
                <dxc-tag-badge [editable]="true" [tagUUID]="t"></dxc-tag-badge>
            </ng-container>
        </div>
    </div>
    `,
    styles:[`
      .dxc-grid-body div.row {
        &:hover {
          background-color: var(--nav-btn-hover-bg);
          color: var(--nav-btn-hover-color);
        }
        
        &.focus {
          background-color: var(--menu-bg-hover);
          color: var(--text-100);
        }
        
        &.footer {
          position: absolute;
          bottom: 0;
          right: 0;
        }
        
        cursor: pointer;
      }
    `]
})
export class XrefItemComponent implements OnInit, AfterViewInit {

    @Input() item:ModelCall; //ModelMethod|ModelClass|ModelField;
    @Input() hookstatus = false;
    @Input() type:"to"|"from";


    xrefIcon:IconModel = CODE_ICONS.XREF_FROM;


    selected:Nullable<Tag> = null;

    canDrop = false;

     icons:IconModelCollection = CODE_ICONS;
     gIcons:IconModelCollection = GLOBAL_ICONS;

    constructor(

        private changeRef:ChangeDetectorRef) {

    }

    ngAfterViewInit() {
        this.xrefIcon = (this.type=="to")? CODE_ICONS.XREF_TO : CODE_ICONS.XREF_FROM;
    }

    ngOnInit() {

    }

    getNode():any {
        console.log("xref getNode > ",this.item, " type : ", (this.type=="to" ? this.item._caller : this.item._called),this);
        return (this.type=="to" ? this.item._caller : this.item._called);
    }

}
