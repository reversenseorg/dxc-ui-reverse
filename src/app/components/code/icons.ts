import {IconModel} from "../../base/icon/IconModel";

export const CODE_ICONS = {
  DEFAULT: new IconModel({
    iconType: 'img',
    type: 'fas',
    name: 'code'
  }),
  FIELD: new IconModel({
    iconType: 'txt',
    label: 'F:',
    color1: 'dxc-icon-field'
  }),
  METH: new IconModel({
    iconType: 'txt',
    label: 'M:',
    color1: 'dxc-icon-meth'
  }),
  STATIC: new IconModel({
    iconType: 'txt',
    label: 'S:',
    color1: 'dxc-icon-static'
  }),
  STATICB: new IconModel({
    iconType: 'txt',
    label: 'L:',
    color1: 'dxc-icon-staticb'
  }),
  NEW: new IconModel({
    iconType: 'txt',
    label: 'C:',
    color1: 'dxc-icon-const'
  }),
  NATIVE: new IconModel({
    iconType: 'txt',
    label: 'N:',
    color1: 'dxc-icon-native'
  }),
  CLASS: new IconModel({
    iconType: 'img',
    type: 'fas',
    name: 'circle',
    color1: 'dxc-icon-class'
  }),
  PKG: new IconModel({
    iconType: 'img',
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-folders'
  }),
  PKG_MIXED: new IconModel({
    iconType: 'img',
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-folders-mixed'
  }),
  PKG_INT: new IconModel({
    iconType: 'img',
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-folders-internal'
  }),
  PKG_VENDOR: new IconModel({
    iconType: 'img',
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-folders-vendor'
  }),
  XREF: new IconModel({
    iconType: 'img',
    type: 'fas',
    name: 'route',
    color1: 'dxc-icon-field'
  }),
  XREF_FROM: new IconModel({
    iconType: 'txt',
    label: 'XF: ',
    color1: 'text-warning'
  }),
  XREF_TO: new IconModel({
    iconType: 'txt',
    label: 'XT: ',
    color1: 'text-info'
  })
};
