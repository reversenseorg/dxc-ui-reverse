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

export const TOPO_ICONS = {
  ACTIVITIES: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-native'
  }),
  ACTIVITY: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: 'Act:',
    color1: 'dxc-icon-native'
  }),
  PROVIDERS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-native'
  }),
  PROVIDER: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: 'Prv:',
    color1: 'dxc-icon-native'
  }),
  RECEIVER: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'folder',
    color1: 'dxc-icon-native'
  }),
  SERVICE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'folder',
    color1: 'dxc-icon-native'
  }),
  DEX: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'sensor',
    color1: 'text-success'
  }),
  PERM: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'lock-keyhole',
    color1: 'text-warning'
  }),
  DB: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'database',
    color1: 'text-warning'
  }),
  KS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'key',
    color1: 'dxc-icon-const'
  }),
  LIBS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'atom',
    color1: 'dxc-icon-const'
  }),
  INTENT_FILTER: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fad',
    name: 'right-left',
    color1: 'dxc-icon-dyellow'
  }),
};
