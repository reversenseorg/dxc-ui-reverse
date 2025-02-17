import {inject, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot} from '@angular/router';
import {DeviceResolver} from "./ctrl/device-resolver.service";

@NgModule({
    imports: [
        RouterModule.forChild([{
            path: 'dev/:uid/org/:oid',
            //component:ViewportDeviceComponent,
            resolve: {
                device: (vRoute:ActivatedRouteSnapshot, vState:RouterStateSnapshot)=> {
                     inject(DeviceResolver).resolve(vRoute,vState);
                }
            }
        }])
    ],
    exports: [RouterModule],
    providers: [DeviceResolver]
})
export class DeviceRoutingModule { }
