import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot} from "@angular/router";
import {inject, NgModule} from "@angular/core";
import {ProjectResolver} from "./ctrl/project-resolver.service";


@NgModule({
  imports: [RouterModule.forChild([{
      path: 'puid/:uid',
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
