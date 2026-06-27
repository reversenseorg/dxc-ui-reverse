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

export const HOOK_ICONS = {
  DEFAULT: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'code'
  }),
  DOWN: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'circle',
    color1: 'dxc-error-icon'
  }),
  UP: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'circle',
    color1: 'dxc-success-icon'
  }),
  FRAGMENTS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'puzzle-piece',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  FRIDA: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: 'F',
    color1: 'dxc-clear-100'
  }),
  BUILTIN_HS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-folders',
  }),
  CUSTOM_HS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-darkpink',
  }),
  NATIVE_HS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-darkblue',
  }),
  HK_LOAD: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'arrow-up-to-line',
    color1: 'dxc-success-icon'
  }),
  HK_UNLOAD: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'arrow-down-to-line',
    color1: 'dxc-error-icon'
  }),
  PRIORITY: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'traffic-light',
    color1: 'dxc-text-75'
  }),
  KEYPOINT: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'location-dot',
    color1: 'dxc-text-blue'
  }),
  KEYPOINT_DOWN: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'location-dot',
    color1: 'dxc-text-75'
  }),
  PROCESS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'microchip',
    color1: 'dxc-text-100'
  }),
  THREAD: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'layer-group',
    color1: 'dxc-text-yellow'
  }),
  UNKNOWN_HOOK_STATE:new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'circle-exclamation',
    color1: 'dxc-error-icon'
  }),
  NOT_HOOKED:new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'circle',
    color1: 'dxc-text-50'
  }),
  SCRIPT:new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'scroll',
    color1: 'dxc-text-50'
  }),
    RTSESS:new IconModel({
        iconType: ICON_TYPE.ICON,
        type: 'fas',
        name: 'clock-rotate-left',
        color1: 'dxc-text-75', //'dxc-text-75',
    }),
    HKSESS: new IconModel({
        iconType: ICON_TYPE.ICON,
        type: 'fas',
        name: 'bolt',
        color1: 'dxc-text-yellow'
    }),
};
