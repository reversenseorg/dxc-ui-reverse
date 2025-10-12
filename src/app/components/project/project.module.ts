import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {ProjectsListComponent} from "./project-list/projects-list.component";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {CommonModule, DatePipe, NgClass, NgSwitch} from "@angular/common";
import {ProjectCardComponent} from "./project-card/project-card.component";
import {ProjectMgtRoutingModule} from "./project-routing.module";
import {CoreModule} from "../../core/core.module";
import {IconComponent} from "../../base/icon/icon.component";
import {MetaComponent} from "../../base/meta/meta.component";
import {ExplorerNavbarComponent} from "../../base/explorer-navbar/explorer-navbar.component";


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
        ProjectMgtRoutingModule,
        CoreModule,

        IconComponent,
        MetaComponent,
        ExplorerNavbarComponent
    ],
    exports: [
        ProjectsListComponent,
        ProjectCardComponent
    ],
    declarations: [
        ProjectsListComponent,
        ProjectCardComponent
    ]
})
export class ProjectModule { }
