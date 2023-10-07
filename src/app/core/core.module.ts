import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StatusComponent} from "./components/status/status.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {DexcaliburServerService, ElectronService} from "./services";
import {AppMenuComponent} from "./components/appmenu/appmenu.component";
import {AppMenuService} from "./components/appmenu/appmenu.service";
import {DxcBaseModule} from "../base/dxc-base.module";

@NgModule({
  declarations: [
    StatusComponent,
    AppMenuComponent
  ],
  exports: [
    StatusComponent,
    //ElectronService,
    //DexcaliburServerService,
    AppMenuComponent,
    //AppMenuService
  ],
    imports: [
        CommonModule,
        FontAwesomeModule
    ]
})
export class CoreModule { }
