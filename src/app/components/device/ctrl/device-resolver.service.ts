/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

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