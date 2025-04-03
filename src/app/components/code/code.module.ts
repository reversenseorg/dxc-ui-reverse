import {NgModule} from "@angular/core";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {CommonModule, DatePipe, NgClass, NgSwitch} from "@angular/common";
import {CodeRoutingModule} from "./code-routing.module";


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

    ],
    declarations: [

    ]
})
export class CodeModule {

}
