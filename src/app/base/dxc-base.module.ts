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

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {CoreModule} from "../core/core.module";
import {ModalBaseComponent} from "./modal-base/modal-base.component";
import {IconComponent} from "./icon/icon.component";
import {
  SubnavbarButtonComponent,
  SubnavbarComponent, SubnavbarInputComponent, SubnavbarLabelComponent,
  SubnavbarMenuComponent,
  SubnavbarTabComponent
} from "./subnavbar/subnavbar.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ModalProgressComponent} from "./modal-progress/modal-progress.component";
import {FormsModule} from "@angular/forms";
import {AppMenuComponent} from "./appmenu/app-menu.component";
import {BoxComponent} from "./box/box.component";
import {PaginatorComponent} from "./paging/dxc-paginator.component";
import {DxcButtonComponent} from "./button/btn.component";
import {AppMenuItemComponent} from "./appmenu/app-menu-item.component";
import {ExpandableListComponent} from "./expandable-list/expandable-list.component";
import {ExpandableItemComponent} from "./expandable-list/expandable-item.component";
import {ContextMenuComponent} from "./context-menu/context-menu.component";
import {ExpandableDirective} from "./expandable-list/expandable.directive";
import {ContextItemComponent} from "./context-menu/context-item.component";
import {DxcHelperBtnComponent} from "../components/helper/dxc-helper.component";

@NgModule({
  declarations: [
    SubnavbarComponent,
    SubnavbarButtonComponent,
    SubnavbarTabComponent,
    SubnavbarMenuComponent,
    SubnavbarInputComponent,
    SubnavbarLabelComponent,
    BoxComponent,
    AppMenuComponent,
    AppMenuItemComponent,
    PaginatorComponent,
    DxcButtonComponent,
    ExpandableListComponent,
    ExpandableItemComponent,
    ContextMenuComponent,
    ContextItemComponent,
    DxcHelperBtnComponent
  ],
    exports: [
        SubnavbarComponent,
        SubnavbarButtonComponent,
        SubnavbarTabComponent,
        SubnavbarMenuComponent,
        SubnavbarInputComponent,
        SubnavbarLabelComponent,
        AppMenuComponent,
        AppMenuItemComponent,
        BoxComponent,
        PaginatorComponent,
        DxcButtonComponent,
        ExpandableListComponent,
        ExpandableItemComponent,
        ContextMenuComponent,
        ContextItemComponent,
        DxcHelperBtnComponent
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        NgbModule,
        CoreModule,
        FormsModule,
        ModalBaseComponent,
        ModalProgressComponent,
        IconComponent,
        ExpandableDirective,

    ]
})
export class DxcBaseModule { }
