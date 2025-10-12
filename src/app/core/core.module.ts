import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StatusComponent} from "./components/status/status.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ViewportSplittedComponent} from "../base/viewport-splitted/viewport-splitted.component";
import {IconComponent} from "../base/icon/icon.component";
import {MetaComponent} from "../base/meta/meta.component";

@NgModule({
  declarations: [
    StatusComponent,
  ],
  exports: [
    StatusComponent,
  ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        IconComponent,MetaComponent
    ]
})
export class CoreModule { }
