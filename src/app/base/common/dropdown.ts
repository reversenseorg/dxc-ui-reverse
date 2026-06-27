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

import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {IconModel} from "../icon/IconModel";
import {DxcBaseModule} from "../dxc-base.module";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {Nullable} from "../Nullable";
import {MenuView} from "../../cmp/MenuView";
import {IconComponent} from "../icon/icon.component";


export interface MenuItem {
    icon?:Nullable<IconModel>;
    label?:Nullable<string>;
    styleClass?:string;
}


@Component({
    selector: 'dxc-dropdown-item',
    template: `
        <dxc-icon *ngIf="item.icon" [model]="item.icon"></dxc-icon>  {{ item.label }}
    `,
    styleUrls: ['../../forms.scss'],
    standalone: true,
    imports: [
        DxcBaseModule,
        IconComponent,
        NgIf,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DxcDropdownItemComponent {

    @Input() item: MenuItem;

    constructor() { }
}


@Component({
    selector: 'dxc-dropdown',
    template: `
        <div ngbDropdown [ngClass]="{'borderless':borderless}" class="d-inline-block nav-menu">
            <button [ngClass]="styleClass" class="btn dxc-text-clear100" id="ddb" ngbDropdownToggle>
                <dxc-icon *ngIf="selected.icon" [model]="selected.icon"></dxc-icon>  {{ selected.label }}
            </button>
            <div ngbDropdownMenu aria-labelledby="ddb">
                <button *ngFor="let item of options" [ngClass]="item.styleClass"
                        (click)="select(item)" ngbDropdownItem>
                    <dxc-icon *ngIf="item.icon" [model]="item.icon"></dxc-icon> {{ item.label }}
                </button>
            </div>
        </div>
    `,
    styleUrls: ['../../forms.scss'],
    standalone: true,
    styles: [`
      .borderless, .borderless:hover {
        border: none;
      }
    `],
    imports: [
        DxcBaseModule,
        NgForOf,
        NgIf,
        NgbDropdown,
        NgbDropdownItem,
        NgbDropdownMenu,
        NgbDropdownToggle,
        NgClass,
        IconComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DxcDropdownComponent implements OnInit {

    @Input() icon:IconModel;
    @Input() label = "";

    @Input() borderless = false;
    @Input() disable:boolean = false;

    @Input() options: MenuItem[] = [];
    @Input() styleClass = "";

    @Input() selected: MenuItem;

    @Input() menu:Nullable<MenuView> = null;

    @Output() itemClick:EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
        if(this.menu!=null){
            this.options = this.menu.items;
            if(this.menu.selected>-1){
                this.selected = this.options[this.menu.selected];
            }else{
                this.selected = this.options[0];
            }
        }else{
            if(this.selected==null && this.options.length>0){
                this.selected = this.options[0];
            }
        }


    }

    select(item:any):void{
        this.selected = item;
        this.itemClick.emit(this.selected);
    }
}
