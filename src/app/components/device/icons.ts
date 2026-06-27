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

import {ICON_TYPE, IconModel, IconModelCollection} from "../../base/icon/IconModel";

export const DEV_ICONS: IconModelCollection = {
  DEFAULT: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'device'
  }),
  USB: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fab',
    name: 'usb'
  }),
  WIFI: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'wifi'
  }),
  APP_INSTALL: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'arrow-up-from-bracket'
  }),
  APP_UNINSTALL: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'eraser'
  }),
  MOBILE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'mobile-notch'
  }),
  TABLET: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'far',
    name: 'tablet-button'
  }),
  WATCH: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'far',
    name: 'watch-smart'
  })
};
