import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot} from "@angular/router";
import {inject, NgModule} from "@angular/core";
import { CodeResolver } from "../code/code-resolver.service";

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
export class FuzzerRoutingModule { }
