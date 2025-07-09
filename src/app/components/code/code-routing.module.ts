import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot} from "@angular/router";
import {inject, NgModule} from "@angular/core";
import {ProjectResolver} from "../project/ctrl/project-resolver.service";
import {CodeResolver} from "./code-resolver.service";
import {ProjectCodeDirectResolver} from "../project/ctrl/project-code-resolver.service";

@NgModule({
  imports: [RouterModule.forChild([{
      path: 'puid/:uid/g/:type/:nuid',
      //component:ViewportDeviceComponent,
      resolve: {
        project: (vRoute:ActivatedRouteSnapshot, vState:RouterStateSnapshot)=> {
          inject(CodeResolver).resolve(vRoute,vState);
        }
      }
    }
  ])],
  exports: [RouterModule],
  providers: [CodeResolver]
})
export class CodeRoutingModule { }
