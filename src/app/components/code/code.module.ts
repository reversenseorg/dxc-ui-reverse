import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {CommonModule, DatePipe, NgClass, NgSwitch} from "@angular/common";
import {CodeRoutingModule} from "./code-routing.module";
import {CodeSymbolTableComponent} from "./emulator/symbol-table.component";
import {CodeEmuLoggerComponent} from "./emulator/emu-logs.component";
import {ViewportCodeStringComponent} from "./viewport-code/viewport-code-string.component";
import {MetaComponent} from "../../base/meta/meta.component";
import {IconComponent} from "../../base/icon/icon.component";
import {ViewportSplittedComponent} from "../../base/viewport-splitted/viewport-splitted.component";
import {TagBadgeComponent} from "../tag/tag-badge/tag-badge.component";
import {ExplorerNavbarComponent} from "../../base/explorer-navbar/explorer-navbar.component";
import {NodeTokenComponent} from "./node-token/node-token.component";
import {NodeAliasComponent} from "./node-alias/node-alias.component";
import {DiagramModule} from "../diagram/diagram.module";
import {GraphModule} from "../graph/graph.module";
import {ViewportCodeClassComponent} from "./viewport-code/viewport-code-class.component";
import {ExplorerCodeComponent} from "./explorer-code/explorer-code.component";
import {ViewportCodePackageComponent} from "./viewport-code/viewport-code-package.component";
import {ViewportCodeMethComponent} from "./viewport-code/viewport-code-meth.component";
import {ViewportCodeFieldComponent} from "./viewport-code/viewport-code-field.component";
import {ViewportCodeComponent} from "./viewport-code/viewport-code.component";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        DxcBaseModule,
        NgClass,
        DatePipe,
        NgSwitch,
        NgbTooltip,
        CodeRoutingModule,
        DiagramModule,
        GraphModule,

        IconComponent,
        MetaComponent,
        ViewportSplittedComponent,
        TagBadgeComponent,
        ExplorerNavbarComponent,
        NodeAliasComponent,
    ],
    exports: [
        CodeSymbolTableComponent,
        CodeEmuLoggerComponent,
        NodeTokenComponent,


        ExplorerCodeComponent,
        ViewportCodeComponent,
        ViewportCodePackageComponent,
        ViewportCodeClassComponent,
        ViewportCodeMethComponent,
        ViewportCodeFieldComponent,
        ViewportCodeClassComponent,
        ViewportCodeStringComponent

    ],
    declarations: [
        CodeSymbolTableComponent,
        CodeEmuLoggerComponent,
        ViewportCodeStringComponent,
        NodeTokenComponent,

        ExplorerCodeComponent,
        ViewportCodeComponent,
        ViewportCodePackageComponent,
        ViewportCodeClassComponent,
        ViewportCodeMethComponent,
        ViewportCodeFieldComponent,
        ViewportCodeClassComponent

    ]
})
export class CodeModule {

}
