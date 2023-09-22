import {ICON_TYPE, IconModel} from "../../base/icon/IconModel";

export const HOOK_ICONS = {
  DEFAULT: new IconModel({
    iconType: 'img',
    type: 'fas',
    name: 'code'
  }),
  DOWN: new IconModel({
    iconType: 'img',
    type: 'fas',
    name: 'circle',
    color1: 'dxc-error-icon'
  }),
  UP: new IconModel({
    iconType: 'img',
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
    iconType: 'txt',
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
};
