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

import {ICON_TYPE, IconModel} from "../../base/icon/IconModel";

export const NATIVE_ICONS = {
  SECTIONS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'bars',
    color1: 'dxc-text-clear100'
  }),
  FUNC: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'function',
    color1: 'dxc-text-clear100'
  }),
  IMPORTS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'file-import',
    color1: 'dxc-text-clear100'
  }),
    EXPORTS: new IconModel({
        iconType: ICON_TYPE.ICON,
        type: 'fal',
        name: 'file-export',
        color1: 'dxc-text-clear100'
    }),
    SYSCALL: new IconModel({
        iconType: ICON_TYPE.ICON,
        type: 'fal',
        name: 'stethoscope',
        color1: 'dxc-text-clear100'
    }),
    DECOMPILED: new IconModel({
        iconType: ICON_TYPE.ICON,
        type: 'fal',
        name: 'code',
        color1: 'dxc-text-clear100'
    }),
};
