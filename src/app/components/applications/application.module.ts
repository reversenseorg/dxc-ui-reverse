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

import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import {TagModule} from "primeng/tag";
import {DividerModule} from "primeng/divider";
import {DropdownModule} from "primeng/dropdown";
import {PaginatorModule} from "primeng/paginator";
import {InputTextModule} from "primeng/inputtext";
import {ToastModule} from "primeng/toast";
import {ApplicationComponent} from "./application.component";
import {ChartModule} from "primeng/chart";
import {TabViewModule} from "primeng/tabview";
import {AvatarModule} from "primeng/avatar";
import {ChipModule} from "primeng/chip";
import {PanelModule} from "primeng/panel";
import {LogsModule} from "../logs/logs.module";
import {BadgeModule} from "primeng/badge";
import {ProjectModule} from "../project/project.module";
import {ApplicationRoutingModule} from "./application-routing.module";
import {DevicesModule} from "../devices/devices.module";
import {MessagesModule} from "primeng/messages";
import {ReleaseUploadFormComponent} from "./upload/upload-form.component";
import {FileUploadModule} from "primeng/fileupload";
import {StepperModule} from "primeng/stepper";
import {AuditModule} from "../audit/audit.module";
import {ReportModule} from "../report/report.module";
import {DashboardModule} from "../dashboard/dashboard.module";
import {ScanOrderListComponent} from "../audit/scan-order-list.component";
import {ProjectListComponent} from "../project/project-list.component";
import {SplitButtonModule} from "primeng/splitbutton";
import {CardModule} from "primeng/card";
import {AccountAvatarComponent} from "../core/account-avatar.component";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {OperatingSystemIconComponent} from "../core/os-icon.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AppbinPreviewComponent} from "./common/app-bin-preview.component";
import {ConnectionSelectComponent} from "../organization/conn/conn-select.component";
import {OrganizationModule} from "../organization/organization.module";
import {LicenseFormComponent} from "../organization/billing/license-form.component";
import {AuditCoverageComponent} from "./common/app-audit-cov";
import {TextCpComponent} from "../core/text-cp.component";
import {MetaComponent} from "../../base/meta/meta.component";
import {NgbProgressbar} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    imports: [
        CommonModule,
        ApplicationRoutingModule,
        FormsModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,

        ButtonModule,
        TagModule,

        DividerModule,
        DropdownModule,
        PaginatorModule,

        InputTextModule,
        ToastModule,
        ChartModule,
        TabViewModule,
        AvatarModule,
        ChipModule,
        PanelModule,
        LogsModule,
        BadgeModule,
        ProjectModule,
        DevicesModule,
        MessagesModule,
        FileUploadModule,
        StepperModule,
        AuditModule,
        ReportModule,
        DashboardModule,
        ScanOrderListComponent,
        ProjectListComponent,
        SplitButtonModule,
        CardModule,
        AccountAvatarComponent,
        ProgressSpinnerModule,
        OperatingSystemIconComponent,
        FaIconComponent,
        NgOptimizedImage,
        OrganizationModule,
        LicenseFormComponent,
        AuditCoverageComponent,
        TextCpComponent,
        MetaComponent,
        NgbProgressbar
    ],
    exports: [
        ApplicationComponent,
        ReleaseUploadFormComponent,
        ConnectionSelectComponent,
        AppbinPreviewComponent
    ],
    declarations: [
        ApplicationComponent,
        ReleaseUploadFormComponent,
        ConnectionSelectComponent,
        AppbinPreviewComponent
    ]
})
export class ApplicationModule { }
