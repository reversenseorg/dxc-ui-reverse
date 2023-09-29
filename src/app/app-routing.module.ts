import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StageComponent} from "./components/stage/stage.component";

const routes: Routes = [{
    path: 'home',
    component: StageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
