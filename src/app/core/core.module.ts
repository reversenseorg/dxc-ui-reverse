import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StatusComponent} from "./components/status/status.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ViewportSplittedComponent} from "../base/viewport-splitted/viewport-splitted.component";

@NgModule({
  declarations: [
    StatusComponent,
      ViewportSplittedComponent
  ],
  exports: [
    StatusComponent,
      ViewportSplittedComponent
  ],
    imports: [
        CommonModule,
        FontAwesomeModule
    ]
})
export class CoreModule { }
