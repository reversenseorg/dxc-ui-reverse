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

import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {CodeControllerService} from "./ctrl/code-controller.service";
import {ControllerService} from "../../controller.service";
import {ProjectService} from "../project/ctrl/project.service";
import DexcaliburProject from "../../models/DexcaliburProject";
import {Nullable} from "../../base/Nullable";
import {CodeController} from "./ctrl/CodeController";
import {OutputService} from "../output/ctrl/output.service";
import {OutputMessage} from "../../cmp/OutputMessage";
import {DxcApiToken} from "../../base/DxcApiToken";


@Injectable()
export class CodeResolver {

    constructor( private _ctrlSvc:ControllerService,
                 private _prjSvc:ProjectService,
                 private _outputSvc:OutputService,
                 private _svc:CodeControllerService) {

    }

    resolve(pRoute: ActivatedRouteSnapshot, pState: RouterStateSnapshot): any {


        // get code, ..
        const nodeType = pRoute.params.type
        const nodeUid = pRoute.params.nuid




        this._svc.retrieveNode<any>(pRoute.params.uid, { __:nodeType, _uid:decodeURIComponent(atob(nodeUid)) }).subscribe((vNode   )=>{

            if(!vNode.success){
                this._outputSvc.print(OutputMessage.newError({ msg:"Cannot open node. Cause : "+vNode.msg, src:"Code Analyzer" }));
                return;
            }

            sessionStorage.setItem("puid",pRoute.params.uid);
            sessionStorage.setItem("mode","direct");

            const tok = DxcApiToken.getInstance("puid");
            if(tok!=null){
                tok.updateToken(pRoute.params.uid);
            }else{
                DxcApiToken.create('puid', pRoute.params.uid);
            }

            console.log("CodeResolver > ",vNode);

            const c = this._svc.getController<Nullable<CodeController>>();
            console.log("CodeResolver > ctrl > ",c,vNode);

            (vNode.data as any).__puid__ = pRoute.params.uid;

            if(vNode.data!=null && c!=null){
                c.showItem(vNode.data, true);
            }
        })
    }
}