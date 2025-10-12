import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {IconComponent} from "../../base/icon/icon.component";
import {NgIf} from "@angular/common";
import {ClassDiagramComponent} from "./class-diagram.component";

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        ClassDiagramComponent
    ],
    exports: [
        ClassDiagramComponent
    ],
    imports: [
        DxcBaseModule,
        FontAwesomeModule,
        FormsModule,

        IconComponent,
        NgIf
    ]
})
export class DiagramModule {}