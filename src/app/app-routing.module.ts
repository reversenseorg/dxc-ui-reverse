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
