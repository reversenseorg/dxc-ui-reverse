import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StatusComponent} from "./components/status/status.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [
    StatusComponent
  ],
  exports: [
    StatusComponent
  ],
    imports: [
        CommonModule,
        FontAwesomeModule
    ]
})
export class CoreModule { }
