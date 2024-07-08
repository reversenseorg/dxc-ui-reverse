import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {CoreModule} from "../core/core.module";
import {ModalBaseComponent} from "./modal-base/modal-base.component";
import {IconComponent} from "./icon/icon.component";
import {
  SubnavbarButtonComponent,
  SubnavbarComponent, SubnavbarInputComponent, SubnavbarLabelComponent,
  SubnavbarMenuComponent,
  SubnavbarTabComponent
} from "./subnavbar/subnavbar.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ModalProgressComponent} from "./modal-progress/modal-progress.component";
import {FormsModule} from "@angular/forms";
import {PreviewerComponent} from "./previewer/previewer.component";
import {MetaComponent} from "./meta/meta.component";
import {AppMenuComponent} from "./appmenu/app-menu.component";
import {AppMenuService} from "./appmenu/app-menu.service";
import {BoxComponent} from "./box/box.component";
import {PaginatorComponent} from "./paging/dxc-paginator.component";
import {DxcButtonComponent} from "./button/btn.component";
import {AppMenuItemComponent} from "./appmenu/app-menu-item.component";

@NgModule({
  declarations: [
    ModalBaseComponent,
    IconComponent,
    SubnavbarComponent,
    SubnavbarButtonComponent,
    SubnavbarTabComponent,
    SubnavbarMenuComponent,
    SubnavbarInputComponent,
    SubnavbarLabelComponent,
    ModalProgressComponent,
    PreviewerComponent,
    MetaComponent,
    BoxComponent,
    AppMenuComponent,
    AppMenuItemComponent,
    PaginatorComponent,
    DxcButtonComponent
  ],
    exports: [
        ModalBaseComponent,
        IconComponent,
        SubnavbarComponent,
        SubnavbarButtonComponent,
        SubnavbarTabComponent,
        SubnavbarMenuComponent,
        SubnavbarInputComponent,
        SubnavbarLabelComponent,
        ModalProgressComponent,
        PreviewerComponent,
        MetaComponent,
        AppMenuComponent,
        AppMenuItemComponent,
        BoxComponent,
        PaginatorComponent,
        DxcButtonComponent,
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        NgbModule,
        CoreModule,
        FormsModule,
    ]
})
export class DxcBaseModule { }
