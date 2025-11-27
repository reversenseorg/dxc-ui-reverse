import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {IconComponent} from "../../base/icon/icon.component";
import {KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {DisassemblyViewComponent} from "./disass-view.component";
import {ViewportNativeFuncComponent} from "./vp-viewer/viewport-native-func.component";
import {AppModule} from "../../app.module";
import {ViewportSplittedComponent} from "../../base/viewport-splitted/viewport-splitted.component";
import {DecompiledViewComponent} from "./decompiled-view.component";

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        DisassemblyViewComponent,
        DecompiledViewComponent
    ],
    exports: [
        DisassemblyViewComponent,
        DecompiledViewComponent
    ],
    imports: [
        DxcBaseModule,
        FontAwesomeModule,
        FormsModule,

        IconComponent,
        NgIf,
        NgStyle,
        NgClass,
        NgForOf,
        KeyValuePipe,
        ViewportSplittedComponent
    ]
})
export class NativeModule {}