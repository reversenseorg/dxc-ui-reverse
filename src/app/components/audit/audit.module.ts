import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {RuleRowComponent} from "./misc/rule-row.component";
import {ControlViewComponent} from "./control-view/control-view.component";
import {AssessViewComponent} from "./assessment-view/assess-view.component";
import {ExplorerAuditComponent} from "./explorer-audit/explorer-audit.component";
import {AssuranceModelInfoCardComponent} from "./misc/amodel-info-card.component";
import {AssessmentRowComponent} from "./misc/assessment-row.component";
import {ControlRowComponent} from "./misc/control-row.component";
import {ModalEditRuleComponent} from "./modal-edit-rule/modal-edit-rule.component";
import {TerminalAuditComponent} from "./terminal-audit/terminal-audit.component";
import {ControlRevisionComponent} from "./ctrl-revision.component";
import {CommonModule, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {SearchModule} from "../search/search.module";
import {FormsModule} from "@angular/forms";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {ExplorerNavbarComponent} from "../../base/explorer-navbar/explorer-navbar.component";
import {NodeTokenComponent} from "../code/node-token/node-token.component";
import {CodeModule} from "../code/code.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {IconComponent} from "../../base/icon/icon.component";
import {ContextMenuComponent} from "../../base/context-menu/context-menu.component";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {ExpandableListComponent} from "../../base/expandable-list/expandable-list.component";
import {MetaComponent} from "../../base/meta/meta.component";
import {ModalBaseComponent} from "../../base/modal-base/modal-base.component";

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        RuleRowComponent,
        ControlViewComponent,
        AssessViewComponent,
        ExplorerAuditComponent,
        AssessmentRowComponent,
        ControlRowComponent,
        RuleRowComponent,
        ModalEditRuleComponent,
        TerminalAuditComponent
    ],
    exports: [
        RuleRowComponent,
        ControlViewComponent,
        AssessViewComponent,
        ExplorerAuditComponent,
        AssessmentRowComponent,
        ControlRowComponent,
        RuleRowComponent,
        TerminalAuditComponent,

        ModalEditRuleComponent
    ],
    imports: [
        CommonModule,
        DxcBaseModule,
        SearchModule,
        CodeModule,

        NgStyle,
        FormsModule,
        NgClass,
        NgbTooltip,

        ExplorerNavbarComponent,
        AssuranceModelInfoCardComponent,
        FontAwesomeModule,
        IconComponent,
        MetaComponent,
        NgForOf,
        NgIf,
        ModalBaseComponent,


    ]
})
export class AuditModule {

}