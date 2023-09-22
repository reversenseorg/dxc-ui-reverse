import {IconModel} from "../../base/icon/IconModel";

export const FILE_ICONS = {
  LOCAL_FS: new IconModel({
    iconType: 'img',
    type: 'fas',
    name: 'code'
  }),
  APP_FS: new IconModel({
    iconType: 'txt',
    label: 'APP:',
    color1: 'dxc-icon-field'
  }),


  XML: new IconModel({
    iconType: 'img',
    type: 'svg',
    src: 'assets/icons/files_format_2/xml.svg',
    color1: 'dxc-icon-ff'
  }),
  PNG: new IconModel({
    iconType: 'img',
    type: 'svg',
    src: 'assets/icons/files_format_2/png.svg',
    color1: 'dxc-icon-ff'
  }),
  BIN: new IconModel({
    iconType: 'img',
    type: 'svg',
    src: 'assets/icons/files_format_3/bin-1.svg',
    color1: 'dxc-icon-ff',
    style: {
      filter: 'invert(66%) sepia(61%) saturate(2560%) hue-rotate(4deg) brightness(108%) contrast(104%)'
    }
  }),
  FILE: new IconModel({
    iconType: 'img',
    type: 'svg',
    src: 'assets/icons/files_format_2/info.svg',
    color1: 'dxc-icon-ff'
  })
};
