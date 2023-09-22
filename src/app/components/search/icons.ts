import {ICON_TYPE, IconModel} from "../../base/icon/IconModel";

export const SEARCH_ICONS = {
  ALIAS: new IconModel({
    iconType: 'txt',
    label: '@:',
    color1: 'dxc-icon-field'
  }),
  RAW: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fad',
    name: 'circle-info',
    color1: 'dxc-text-75'
  }),
  FILE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'file',
    color1: 'dxc-text-75'
  })
};
