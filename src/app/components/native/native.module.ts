/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

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