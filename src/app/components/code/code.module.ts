import {NgModule} from "@angular/core";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {CommonModule, DatePipe, NgClass, NgSwitch} from "@angular/common";
import {CodeRoutingModule} from "./code-routing.module";
import {CodeSymbolTableComponent} from "./emulator/symbol-table.component";
import {CodeEmuLoggerComponent} from "./emulator/emu-logs.component";


@NgModule({
    imports: [
        CommonModule,
        DxcBaseModule,
        NgClass,
        DatePipe,
        NgSwitch,
        CodeRoutingModule
    ],
    exports: [
        CodeSymbolTableComponent,
        CodeEmuLoggerComponent
    ],
    declarations: [
        CodeSymbolTableComponent,
        CodeEmuLoggerComponent
    ]
})
export class CodeModule {

}
