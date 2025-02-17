import {Nullable} from "../../../base/Nullable";
import {Device} from "../../../models/Device";
import {Injectable} from "@angular/core";
import {DeviceManagerService} from "./device-manager.service";
import {ControllerService} from "../../../controller.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";


@Injectable()
export class DeviceResolver {

    constructor( private _ctrlSvc:ControllerService,
                 private _devSvc:DeviceManagerService) {

    }

    resolve(pRoute: ActivatedRouteSnapshot, pState: RouterStateSnapshot): any {

        // intercept oute resolve
        this._devSvc.getDevice(pRoute.params.uid, pRoute.params.oid).subscribe((vDev:Nullable<Device>)=>{
            if(vDev !=null){
                // show device in vp
                this._ctrlSvc.getStage('main').showDevice(vDev);
                // display device panel in explorer and expand device
                //this._ctrlSvc.getStage('main').showDeviceExpl(vDev);
            }
        });

        return ;
    }
}