import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {GraphExplorerComponent} from "./graph-viewer.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {IconComponent} from "../../base/icon/icon.component";
import {NgIf} from "@angular/common";

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        GraphExplorerComponent
    ],
    exports: [
        GraphExplorerComponent
    ],
    imports: [
        DxcBaseModule,
        FontAwesomeModule,
        FormsModule,

        IconComponent,
        NgIf
    ]
})
export class GraphModule {}