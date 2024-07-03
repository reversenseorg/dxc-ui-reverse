import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StageComponent} from "./components/stage/stage.component";



@NgModule({
  imports: [RouterModule.forRoot([{
      path: 'home/:id',
      component: StageComponent
  },{
      path: 'home/:id/code/:node/:node_uid',
      component: StageComponent
  }, {
      path: '**',
      redirectTo: '/home/-'
  },{
      path: '',
      redirectTo: '/home/-'
  }
  ], { useHash:true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
