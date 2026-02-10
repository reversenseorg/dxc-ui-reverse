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
        ModalBaseComponent
    ],
    exports: [
        ExplorerTopoComponent,
        ModalSendIntentComponent,
        ViewportTopoActivityComponent,
        ViewportTopoProviderComponent,
        ViewportTopoReceiverComponent,
        ViewportTopoServiceComponent,
        TopologyMapComponent,
        OsApiProjectionListComponent
    ],
    declarations: [
        ExplorerTopoComponent,
        ModalSendIntentComponent,
        ViewportTopoActivityComponent,
        ViewportTopoProviderComponent,
        ViewportTopoReceiverComponent,
        ViewportTopoServiceComponent,
        TopologyMapComponent,
        OsApiProjectionListComponent
    ]
})
export class TopologyModule { }
