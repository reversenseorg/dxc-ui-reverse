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
import {CoreModule} from "../../core/core.module";
import {IconComponent} from "../../base/icon/icon.component";
import {MetaComponent} from "../../base/meta/meta.component";
import {TerminalSearchComponent} from "./terminal-search/terminal-search.component";
import {ModalSearchComponent} from "./modal-search/modal-search.component";
import {SearchResultListComponent} from "./search-result-list/search-result-list.component";
import {PreviewerComponent} from "../../base/previewer/previewer.component";
import {ModalBaseComponent} from "../../base/modal-base/modal-base.component";
import {ExplorerNavbarComponent} from "../../base/explorer-navbar/explorer-navbar.component";
import {TagBadgeComponent} from "../tag/tag-badge/tag-badge.component";
import {CodeModule} from "../code/code.module";


@NgModule({
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [
        CommonModule,
        DxcBaseModule,
        NgClass,
        DatePipe,
        NgSwitch,
        CoreModule,

        // standalone cmps
        IconComponent,
        MetaComponent,
        PreviewerComponent,
        ModalBaseComponent,
        ExplorerNavbarComponent,
        TagBadgeComponent,
        CodeModule
    ],
    exports: [
        TerminalSearchComponent,
        ModalSearchComponent,
        SearchResultListComponent
    ],
    declarations: [
        TerminalSearchComponent,
        ModalSearchComponent,
        SearchResultListComponent
    ]
})
export class SearchModule { }
