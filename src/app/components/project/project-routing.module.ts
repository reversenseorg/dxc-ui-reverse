import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot} from "@angular/router";
import {SplashComponent} from "./splash.component";
import {inject, NgModule} from "@angular/core";
import {NewProjectComponent} from "./new-project.component";
import {OpenProjectComponent} from "./open-project.component";
import {SvcStatusComponent} from "./SvcStatus.component";
import {ProjectResolver} from "./ctrl/project-resolver.service";
import {DeviceResolver} from "../device/ctrl/device-resolver.service";


@NgModule({
  imports: [RouterModule.forChild([/*{
    path: 'splash',
    component: SplashComponent,
    children: [
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
  },*/{
      path: 'puid/:uid',
      //component:ViewportDeviceComponent,
      resolve: {
        project: (vRoute:ActivatedRouteSnapshot, vState:RouterStateSnapshot)=> {
          inject(ProjectResolver).resolve(vRoute,vState);
        }
      }
    }
  ])],
  exports: [RouterModule],
  providers: [ProjectResolver]
  // providers: [ProjectResolver]
})
export class ProjectMgtRoutingModule { }
