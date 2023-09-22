
/*
import {SplashComponent} from "./splash.component";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {ProjectMgtRoutingModule} from "./project-routing.module";
import {ProjectMgtComponent} from "./project-mgt.component";
import {NewProjectComponent} from "./new-project.component";
import {OpenProjectComponent} from "./open-project.component";
import {LatestProjectComponent} from "./latest-project.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {SvcStatusComponent} from "./SvcStatus.component";
import {CoreModule} from "../../core/core.module";
import {ViewportSplashComponent} from "./viewport-project/viewport-splash.component";
import {RouterModule, Routes} from "@angular/router";
import {ModalActiveProjectComponent} from "./modals/active-project.component";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {ModalNewProjectComponent} from "./modal-new-project/modal-new-project.component";
import {ModalOpenProjectComponent} from "./modal-open-project/modal-open-project.component";
import {FormsModule} from "@angular/forms";



const routes: Routes = [
    {
      path: 'splash-recents',
      component: LatestProjectComponent,
      outlet: 'splash',
    },
    {
      path: 'splash-new',
      component: NewProjectComponent,
      outlet: 'splash',
    },
    {
      path: 'splash-open',
      component: OpenProjectComponent,
      outlet: 'splash',
    },
    {
      path: 'splash-info',
      component: SvcStatusComponent,
      outlet: 'splash',
    }
];

@NgModule({
  declarations: [
    SplashComponent,
    ProjectMgtComponent,
    NewProjectComponent,
    OpenProjectComponent,
    LatestProjectComponent,
    SvcStatusComponent,
    ViewportSplashComponent,
    ModalActiveProjectComponent,
    ModalNewProjectComponent,
    ModalOpenProjectComponent
  ],
  exports: [
    SplashComponent,
    ViewportSplashComponent,
    ModalActiveProjectComponent,
    ModalNewProjectComponent,
    ModalOpenProjectComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    //RouterModule,
    //ProjectMgtRoutingModule,
    RouterModule.forChild(routes),
    FormsModule,
    CoreModule,
    DxcBaseModule
  ]
})
export class ProjectManagementModule { }*/
