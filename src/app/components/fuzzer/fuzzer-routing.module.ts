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
