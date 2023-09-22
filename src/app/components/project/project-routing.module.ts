import {RouterModule, Routes} from "@angular/router";
import {SplashComponent} from "./splash.component";
import {NgModule} from "@angular/core";

import {LatestProjectComponent} from "./latest-project.component";
import {NewProjectComponent} from "./new-project.component";
import {OpenProjectComponent} from "./open-project.component";
import {SvcStatusComponent} from "./SvcStatus.component";

const routes: Routes = [{
    path: 'splash',
    component: SplashComponent,
    children: [
      {
        path: 'recents',
        component: LatestProjectComponent,
        outlet: 'splash'
      },
      {
        path: 'new',
        component: NewProjectComponent,
        outlet: 'splash'
      },
      {
        path: 'open',
        component: OpenProjectComponent,
        outlet: 'splash'
      },
      {
        path: 'info',
        component: SvcStatusComponent,
        outlet: 'splash'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectMgtRoutingModule { }
