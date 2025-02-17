import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes} from "@angular/router";
import {SplashComponent} from "./splash.component";
import {inject, NgModule} from "@angular/core";

import {NewProjectComponent} from "./new-project.component";
import {OpenProjectComponent} from "./open-project.component";
import {SvcStatusComponent} from "./SvcStatus.component";
import {DeviceResolver} from "../device/ctrl/device-resolver.service";
import {ProjectResolver} from "./ctrl/project-resolver.service";


@NgModule({
  imports: [RouterModule.forChild([{
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
  },{
      path: 'puid/:uid',
      //component:ViewportDeviceComponent,
      resolve: {
        device: (vRoute:ActivatedRouteSnapshot, vState:RouterStateSnapshot)=> {
          inject(ProjectResolver).resolve(vRoute,vState);
        }
      }
    }
  ])],
  exports: [RouterModule],
  // providers: [ProjectResolver]
})
export class ProjectMgtRoutingModule { }
