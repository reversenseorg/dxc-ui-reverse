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
        TagBadgeComponent
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
