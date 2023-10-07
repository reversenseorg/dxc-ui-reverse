import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StageComponent} from "./components/stage/stage.component";



@NgModule({
  imports: [RouterModule.forRoot([{
      path: 'home',
      component: StageComponent
  }, {
      path: '**',
      redirectTo: '/home'
  },
  ], { useHash:true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
