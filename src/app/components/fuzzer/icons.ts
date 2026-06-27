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

export const FUZZ_ICONS = {
        SUCCESS: new IconModel({
            iconType: ICON_TYPE.ICON,
            type: 'fas',
            name: 'arrow-right-from-bracket',
            color1: 'dxc-success-icon'
        }),
        FAILURE: new IconModel({
            iconType: ICON_TYPE.ICON,
            type: 'fas',
            name: 'arrow-right-from-bracket',
            color1: 'dxc-error-icon'
        }),
    ENTRY: new IconModel({
        iconType: ICON_TYPE.ICON,
        type: 'fas',
        name: 'arrow-right-to-bracket',
        color1: 'dxc-text-75'
    }),
    POLICY: new IconModel({
        iconType: ICON_TYPE.ICON,
        type: 'fas',
        name: 'brain-circuit',
        color1: 'dxc-text-yellow'
    })
};
