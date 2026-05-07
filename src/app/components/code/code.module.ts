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
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {CodeEditorModule} from "../code-editor/code-editor.module";
import {AppModule} from "../../app.module";
import {ModalRenameComponent} from "./modal-rename/modal-rename.component";
import {ModalBaseComponent} from "../../base/modal-base/modal-base.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SearchModule} from "../search/search.module";
import {XrefListComponent} from "./xref-list/xref-list.component";
import {XrefItemComponent} from "./xref-item/xref-item.component";
import {HookStatusComponent} from "../hooks/hook-status/hook-status.component";
import {CodeEmulatorComponent} from "./emulator/emulator.component";
import {OsApiXrefComponent} from "./osapi-xref.component";
import {ModelGraphViewerComponent} from "../../base/viewer/graph-viewer.component";
import {CodeGraphViewerComponent} from "./graph/graph-viewer.component";
import {CodeAstViewerComponent} from "./graph/ast-viewer.component";


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
        FontAwesomeModule,
        CodeEditorModule,
        ModalBaseComponent,
        ReactiveFormsModule,
        HookStatusComponent,
        FormsModule,
        OsApiXrefComponent,
        ModelGraphViewerComponent
    ],
    exports: [
        CodeSymbolTableComponent,
        CodeEmuLoggerComponent,
        CodeEmulatorComponent,
        NodeTokenComponent,
        XrefListComponent,
        XrefItemComponent,


        ExplorerCodeComponent,
        ViewportCodeComponent,
        ViewportCodePackageComponent,
        ViewportCodeClassComponent,
        ViewportCodeMethComponent,
        ViewportCodeFieldComponent,
        ViewportCodeClassComponent,
        ViewportCodeStringComponent,

        ModalRenameComponent,
        XrefListComponent
    ],
    declarations: [
        CodeSymbolTableComponent,
        CodeEmuLoggerComponent,
        CodeEmulatorComponent,
        ViewportCodeStringComponent,
        NodeTokenComponent,
        XrefListComponent,
        XrefItemComponent,

        ExplorerCodeComponent,
        ViewportCodeComponent,
        ViewportCodePackageComponent,
        ViewportCodeClassComponent,
        ViewportCodeMethComponent,
        ViewportCodeFieldComponent,
        ViewportCodeClassComponent,

        ModalRenameComponent,
        CodeGraphViewerComponent,
        CodeAstViewerComponent

    ]
})
export class CodeModule {

}
