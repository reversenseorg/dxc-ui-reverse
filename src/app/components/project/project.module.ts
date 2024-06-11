import {NgModule} from "@angular/core";
import {ProjectsListComponent} from "./project-list/projects-list.component";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {CommonModule, DatePipe, NgClass, NgSwitch} from "@angular/common";
import {ProjectCardComponent} from "./project-card/project-card.component";


@NgModule({
    imports: [
        CommonModule,
        DxcBaseModule,
        NgClass,
        DatePipe,
        NgSwitch
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
