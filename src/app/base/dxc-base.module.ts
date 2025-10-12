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
import {AppMenuComponent} from "./appmenu/app-menu.component";
import {BoxComponent} from "./box/box.component";
import {PaginatorComponent} from "./paging/dxc-paginator.component";
import {DxcButtonComponent} from "./button/btn.component";
import {AppMenuItemComponent} from "./appmenu/app-menu-item.component";
import {ExpandableListComponent} from "./expandable-list/expandable-list.component";
import {ExpandableItemComponent} from "./expandable-list/expandable-item.component";
import {ContextMenuComponent} from "./context-menu/context-menu.component";
import {ExpandableDirective} from "./expandable-list/expandable.directive";
import {ContextItemComponent} from "./context-menu/context-item.component";

@NgModule({
  declarations: [
    SubnavbarComponent,
    SubnavbarButtonComponent,
    SubnavbarTabComponent,
    SubnavbarMenuComponent,
    SubnavbarInputComponent,
    SubnavbarLabelComponent,
    BoxComponent,
    AppMenuComponent,
    AppMenuItemComponent,
    PaginatorComponent,
    DxcButtonComponent,
    ExpandableListComponent,
    ExpandableItemComponent,
    ContextMenuComponent,
  ContextItemComponent,
  ],
    exports: [
        SubnavbarComponent,
        SubnavbarButtonComponent,
        SubnavbarTabComponent,
        SubnavbarMenuComponent,
        SubnavbarInputComponent,
        SubnavbarLabelComponent,
        AppMenuComponent,
        AppMenuItemComponent,
        BoxComponent,
        PaginatorComponent,
        DxcButtonComponent,
        ExpandableListComponent,
        ExpandableItemComponent,
        ContextMenuComponent,
        ContextItemComponent,
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        NgbModule,
        CoreModule,
        FormsModule,
        ModalBaseComponent,
        ModalProgressComponent,
        IconComponent,
        ExpandableDirective
    ]
})
export class DxcBaseModule { }
