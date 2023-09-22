import {ICON_TYPE, IconModel} from "../../base/icon/IconModel";

export const NATIVE_ICONS = {
  SECTIONS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'bars',
    color1: 'dxc-text-clear100'
  }),
  FUNC: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'function',
    color1: 'dxc-text-clear100'
  }),
  IMPORTS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'file-import',
    color1: 'dxc-text-clear100'
  }),
};
