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

import {CUSTOM_ELEMENTS_SCHEMA, NgModule, ViewContainerRef} from "@angular/core";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {CommonModule, DatePipe, NgClass, NgIf, NgSwitch} from "@angular/common";
import {ExplorerTopoComponent} from "./explorer-topo/explorer-topo.component";
import {ModalSendIntentComponent} from "./modal-intent/modal-send-intent.component";
import {OsApiProjectionListComponent} from "./osapi-projection-list/osapi-projection-list.component";
import {ViewportTopoActivityComponent} from "./viewport-topo/viewport-topo-activity.component";
import {ViewportTopoReceiverComponent} from "./viewport-topo/viewport-topo-receiver.component";
import {ViewportTopoProviderComponent} from "./viewport-topo/viewport-topo-provider.component";
import {ViewportTopoServiceComponent} from "./viewport-topo/viewport-topo-service.component";
import {AppRoutingModule} from "../../app-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import {CoreModule} from "../../core/core.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CodeEditorModule} from "../code-editor/code-editor.module";
import {NgTerminalModule} from "ng-terminal";
import {DxcClientModule} from "../../dxc-client/dxc-client.module";
import {ExplorerNavbarComponent} from "../../base/explorer-navbar/explorer-navbar.component";
import {IconComponent} from "../../base/icon/icon.component";
import {MetaComponent} from "../../base/meta/meta.component";
import {ViewportSplittedComponent} from "../../base/viewport-splitted/viewport-splitted.component";
import {TagBadgeComponent} from "../tag/tag-badge/tag-badge.component";
import {ModalBaseComponent} from "../../base/modal-base/modal-base.component";
import {TopologyMapComponent} from "./topo-map.component";
import {ViewportTopoCmpComponent} from "./viewport-topo/viewport-topo-cmp.component";
import {AppModule} from "../../app.module";
import {IntentPatternComponent} from "./ctrl/IntentPattern.component";
import {CodeModule} from "../code/code.module";

@NgModule({
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [
        CommonModule,
        DxcBaseModule,
        BrowserModule,
        CoreModule,
        FormsModule,
        HttpClientModule,
        FontAwesomeModule,
        NgbModule,
        CodeEditorModule,
        ReactiveFormsModule,
        NgTerminalModule,
        DxcClientModule,

        NgSwitch,
        NgClass,
        NgIf,

        ExplorerNavbarComponent,
        IconComponent,
        MetaComponent,
        ViewportSplittedComponent,
        TagBadgeComponent,
        ModalBaseComponent,
        CodeModule
    ],
    exports: [
        ExplorerTopoComponent,
        ModalSendIntentComponent,
        ViewportTopoActivityComponent,
        ViewportTopoProviderComponent,
        ViewportTopoReceiverComponent,
        ViewportTopoServiceComponent,
        TopologyMapComponent,
        OsApiProjectionListComponent,
        ViewportTopoCmpComponent,
        IntentPatternComponent
    ],
    declarations: [
        ExplorerTopoComponent,
        ModalSendIntentComponent,
        ViewportTopoActivityComponent,
        ViewportTopoProviderComponent,
        ViewportTopoReceiverComponent,
        ViewportTopoServiceComponent,
        TopologyMapComponent,
        OsApiProjectionListComponent,
        ViewportTopoCmpComponent,
        IntentPatternComponent
    ]
})
export class TopologyModule { }
