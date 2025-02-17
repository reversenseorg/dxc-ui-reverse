import {NgModule} from "@angular/core";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {CommonModule, DatePipe, NgClass, NgSwitch} from "@angular/common";
import {EopEditorComponent} from "./eop-editor/eop-editor.component";
import {EopPhaseEditorComponent} from "./eop-editor/eop-phase-editor.component";
import {FormsModule} from "@angular/forms";
import {DeviceRoutingModule} from "./device-routing.module";
import {ViewportDeviceComponent} from "./viewport-device/viewport-device.component";
import {CoreModule} from "../../core/core.module";
import {DeviceResolver} from "./ctrl/device-resolver.service";


@NgModule({
    imports: [
        CommonModule,
        DxcBaseModule,
        NgClass,
        DatePipe,
        NgSwitch,
        FormsModule,
        DeviceRoutingModule,
        CoreModule
    ],
    exports: [
        EopEditorComponent,
        EopPhaseEditorComponent,
        ViewportDeviceComponent
    ],
    declarations: [
        EopEditorComponent,
        EopPhaseEditorComponent,
        ViewportDeviceComponent
    ]
})
export class DeviceModule { }
