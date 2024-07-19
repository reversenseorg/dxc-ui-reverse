import {NgModule} from "@angular/core";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {CommonModule, DatePipe, NgClass, NgSwitch} from "@angular/common";
import {EopEditorComponent} from "./eop-editor/eop-editor.component";
import {EopPhaseEditorComponent} from "./eop-editor/eop-phase-editor.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    imports: [
        CommonModule,
        DxcBaseModule,
        NgClass,
        DatePipe,
        NgSwitch,
        FormsModule
    ],
    exports: [
        EopEditorComponent,
        EopPhaseEditorComponent
    ],
    declarations: [
        EopEditorComponent,
        EopPhaseEditorComponent
    ]
})
export class DeviceModule { }
