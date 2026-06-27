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
import {TagBadgeComponent} from "../tag/tag-badge/tag-badge.component";
import {ModalAddAssessmentComponent} from "./misc/modal-add-assessment";

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
        TerminalAuditComponent,
        ModalAddAssessmentComponent
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

        ModalEditRuleComponent,
        ModalAddAssessmentComponent
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
        TagBadgeComponent,


    ]
})
export class AuditModule {

}