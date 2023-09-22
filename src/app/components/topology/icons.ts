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
