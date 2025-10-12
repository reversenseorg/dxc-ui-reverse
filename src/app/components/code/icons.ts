import {ICON_TYPE, IconModel} from "../../base/icon/IconModel";

export const CODE_ICONS = {
  DEFAULT: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'code'
  }),
  FIELD: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: 'F:',
    color1: 'dxc-icon-field'
  }),
  METH: new IconModel({
    /*iconType: ICON_TYPE.TEXT,
    label: 'M:',
    color1: 'dxc-icon-meth'*/


    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'm',
    color1: 'dxc-icon-meth'
  }),
  STATIC: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: 'S:',
    color1: 'dxc-icon-static'
  }),
  STATICB: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: 'L:',
    color1: 'dxc-icon-staticb'
  }),
  NEW: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: 'C:',
    color1: 'dxc-icon-const'
  }),
  NATIVE: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: 'N:',
    color1: 'dxc-icon-native'
  }),
  CLASS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'circle',
    color1: 'dxc-icon-class'
  }),
  ABSTRACT_CLASS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'circle-a',
    color1: 'dxc-icon-abstract'
  }),

  ABSTRACT_METH: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'square-m',
    color1: 'dxc-icon-abstract'
  }),

  PKG: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-folders'
  }),
  PKG_MIXED: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-folders-mixed'
  }),
  PKG_INT: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-folders-internal'
  }),
  PKG_VENDOR: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-folders-vendor'
  }),
  XREF: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'route',
    color1: 'dxc-icon-field'
  }),
  TRACE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'layer-group',
    color1: 'dxc-icon-field'
  }),
  XREF_FROM: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: 'XF: ',
    color1: 'text-warning'
  }),
  XREF_TO: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: 'XT: ',
    color1: 'text-info'
  }),
  STR: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'font-case',
    color1: 'dxc-icon-folders-internal'
  })
};
