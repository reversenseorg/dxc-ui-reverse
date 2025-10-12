import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {ExplorerNavbarComponent} from "../../base/explorer-navbar/explorer-navbar.component";
import {DxcBaseModule} from "../../base/dxc-base.module";

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
    ],
    exports: [
    ],
    imports: [
        DxcBaseModule,
        ExplorerNavbarComponent
    ]
})
export class HookModule {}