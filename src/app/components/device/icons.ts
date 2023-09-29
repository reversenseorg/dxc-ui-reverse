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
