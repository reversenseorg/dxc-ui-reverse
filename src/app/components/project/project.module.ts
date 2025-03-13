import {NgModule} from "@angular/core";
import {ProjectsListComponent} from "./project-list/projects-list.component";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {CommonModule, DatePipe, NgClass, NgSwitch} from "@angular/common";
import {ProjectCardComponent} from "./project-card/project-card.component";
import {ProjectMgtRoutingModule} from "./project-routing.module";
import {CoreModule} from "../../core/core.module";


@NgModule({
    imports: [
        CommonModule,
        DxcBaseModule,
        NgClass,
        DatePipe,
        NgSwitch,
        ProjectMgtRoutingModule,
        CoreModule
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
