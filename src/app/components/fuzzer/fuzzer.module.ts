import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {CommonModule, DatePipe, NgClass, NgSwitch} from "@angular/common";
import {FuzzerRoutingModule} from "./fuzzer-routing.module";
import {MetaComponent} from "../../base/meta/meta.component";
import {IconComponent} from "../../base/icon/icon.component";
import {TagBadgeComponent} from "../tag/tag-badge/tag-badge.component";
import {ExplorerNavbarComponent} from "../../base/explorer-navbar/explorer-navbar.component";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ModalBaseComponent} from "../../base/modal-base/modal-base.component";
import {FormsModule} from "@angular/forms";
import {ViewportFuzzerComponent} from "./viewport-fuzzer/viewport-fuzzer.component";
import {DeviceModule} from "../device/device.module";
import {ViewportSplittedComponent} from "../../base/viewport-splitted/viewport-splitted.component";

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        DxcBaseModule,
        NgClass,
        DatePipe,
        NgSwitch,
        NgbTooltip,
        FuzzerRoutingModule,

        IconComponent,
        MetaComponent,
        TagBadgeComponent,
        ExplorerNavbarComponent,
        FontAwesomeModule,
        ModalBaseComponent,
        FormsModule,
        DeviceModule,
        ViewportSplittedComponent,
    ],
    exports: [
        ViewportFuzzerComponent
    ],
    declarations: [
        ViewportFuzzerComponent
    ]
})
export class FuzzerModule {

}
