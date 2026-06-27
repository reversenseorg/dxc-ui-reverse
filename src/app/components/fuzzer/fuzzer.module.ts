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

import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {CommonModule, DatePipe, NgClass, NgSwitch} from "@angular/common";
import {FuzzerRoutingModule} from "./fuzzer-routing.module";
import {MetaComponent} from "../../base/meta/meta.component";
import {IconComponent} from "../../base/icon/icon.component";
import {TagBadgeComponent} from "../tag/tag-badge/tag-badge.component";
import {ExplorerNavbarComponent} from "../../base/explorer-navbar/explorer-navbar.component";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ModalBaseComponent} from "../../base/modal-base/modal-base.component";
import {FormsModule} from "@angular/forms";
import {ViewportFuzzerComponent} from "./viewport-fuzzer/viewport-fuzzer.component";
import {DeviceModule} from "../device/device.module";
import {ViewportSplittedComponent} from "../../base/viewport-splitted/viewport-splitted.component";

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        DxcBaseModule,
        NgClass,
        DatePipe,
        NgSwitch,
        NgbTooltip,
        FuzzerRoutingModule,

        IconComponent,
        MetaComponent,
        TagBadgeComponent,
        ExplorerNavbarComponent,
        FontAwesomeModule,
        ModalBaseComponent,
        FormsModule,
        DeviceModule,
        ViewportSplittedComponent,
    ],
    exports: [
        ViewportFuzzerComponent
    ],
    declarations: [
        ViewportFuzzerComponent
    ]
})
export class FuzzerModule {

}
