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
    AfterContentInit,
    Component, ComponentFactory,
    ComponentFactoryResolver, ComponentRef,
    ElementRef,
    Input,
    OnChanges,
    OnInit, SimpleChanges,
    ViewChild, ViewContainerRef
} from "@angular/core";
import {ExplorerItem} from "../../cmp/ExplorerItem";
import {SubExplorerComponent} from "../explorer/subexplorer.component";
import {Nullable} from "../Nullable";
import {ExplorerDirective} from "../explorer/explorer.directive";
import {Subject} from "rxjs";
import {IStringIndex} from "../IStringIndex";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";



/**
 * This class represents the Explorer Area (left panel)
 *
 * @class
 * @since 1.0.0
 */
@Component({
    selector: 'dxc-box',
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.scss']
})
export class BoxComponent  {

    @Input() public parent: any;

    /**
     * The collection of explorer components
     *
     * @type {SubExplorerComponent[]}
     * @field
     * @since 1.0.0
     */
    elements: SubExplorerComponent<any>[] = [];

    /**
     * The active explorer component
     * By default, its the first
     *
     * @type {number}
     * @field
     * @since 1.0.0
     */
    active = 0;


    resize$: Subject<any> = new Subject<any>();



    constructor(private componentFactoryResolver: ComponentFactoryResolver) {

    }



}
