import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import {ProjectNewComponent} from "./project-new/project-new.component";
import {StageComponent} from "./components/stage/stage.component";
import {SplashComponent} from "./components/project/splash.component";
import {LatestProjectComponent} from "./components/project/latest-project.component";
import {NewProjectComponent} from "./components/project/new-project.component";
import {OpenProjectComponent} from "./components/project/open-project.component";
import {SvcStatusComponent} from "./components/project/SvcStatus.component";

const routes: Routes = [
  /*{
    path: 'project-new',
    component: ProjectNewComponent
  },*/{
    path: 'home',
    component: StageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
