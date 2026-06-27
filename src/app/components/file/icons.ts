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

export const FILE_ICONS = {
  LOCAL_FS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'code'
  }),
  APP_FS: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: 'APP:',
    color1: 'dxc-icon-field'
  }),


  XML: new IconModel({
    iconType: ICON_TYPE.SVG,
    src: 'assets/icons/files_format_2/xml.svg',
    color1: 'dxc-icon-ff'
  }),
  PNG: new IconModel({
    iconType: ICON_TYPE.SVG,
    src: 'assets/icons/files_format_2/png.svg',
    color1: 'dxc-icon-ff'
  }),
  BIN: new IconModel({
    iconType: ICON_TYPE.SVG,
    src: 'assets/icons/files_format_3/bin-1.svg',
    color1: 'dxc-icon-ff',
    style: {
      filter: 'invert(66%) sepia(61%) saturate(2560%) hue-rotate(4deg) brightness(108%) contrast(104%)'
    }
  }),
  FILE: new IconModel({
    iconType: ICON_TYPE.SVG,
    src: 'assets/icons/files_format_2/info.svg',
    color1: 'dxc-icon-ff'
  })
};
