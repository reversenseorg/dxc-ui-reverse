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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StageComponent} from "./components/stage/stage.component";
import {IsAuthenticatedGuard} from "./IsAuthenticateGuard";



@NgModule({
  imports: [RouterModule.forRoot([
      {
          path: '',
          canActivate: [IsAuthenticatedGuard],
          component: StageComponent,
          children: [
              { path: 'project',
                  canActivate: [IsAuthenticatedGuard],
                  loadChildren: () => import('./components/project/project.module').then(m => m.ProjectModule) },
              { path: 'device',
                  canActivate: [IsAuthenticatedGuard],
                  loadChildren: () => import('./components/device/device.module').then(m => m.DeviceModule) },
              { path: 'code',
                  canActivate: [IsAuthenticatedGuard],
                  loadChildren: () => import('./components/code/code.module').then(m => m.CodeModule) },
              {
                  path: 'home/:id',
                  component: StageComponent,
                  data: {
                      code: false
                  }
              },/*{
                  path: 'project/:puid/device/:duid',
                  component: StageComponent
              },*/{
                  path: 'device/**',
                  component: StageComponent
              },{
                  path: 'home/:id/code/:node/:node_uid',
                  component: StageComponent,
                  data: {
                      code: true
                  }
              }/*,{
                  path: '**',
                  redirectTo: '/home/-'
              }*/,{
                  path: '',
                  redirectTo: '/home/-'
              }
          ]
      }
  ], { useHash:true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
