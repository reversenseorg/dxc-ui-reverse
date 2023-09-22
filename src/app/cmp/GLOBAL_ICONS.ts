import {ICON_TYPE, IconModel, IconModelCollection} from "../base/icon/IconModel";


export const GLOBAL_ICONS:IconModelCollection = {
  CODE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'code',
    color1: 'dxc-icon-color'
  }),
  WINDOW: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fad',
    name: 'window',
    color1: 'dxc-icon-window'
  }),
  ANDROID: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fab',
    name: 'android',
    color1: 'dxc-icon-android'
  }),
  INTERNAL: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'gear',
    color1: 'dxc-icon-color',
  }),
  FILE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'file-lines',
    color1: 'dxc-text-clear75',
  }),
  LIBS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'books',
    color1: 'dxc-text-clear75',
  }),
  SAVE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'floppy-disk',
    color1: 'dxc-text-clear75',
  }),
  BIN: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'svg',
    src: 'assets/icons/files_format_3/bin-1.svg',
    color1: 'dxc-icon-ff',
    style: {
      filter: 'invert(66%) sepia(61%) saturate(2560%) hue-rotate(4deg) brightness(108%) contrast(104%)'
    }
  }),
  BYTES: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'far',
    name: 'binary',
    color1: 'dxc-text-clear75',
  }),
  HOOKS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'anchor',
    color1: 'dxc-text-clear75',
  }),
  JAVA: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fab',
    name: 'java',
    color1: 'dxc-text-100',
  }),
  APPLE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fab',
    name: 'apple',
    color1: 'dxc-text-black',
  }),
  FOLDER: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'folder',
    color1: 'dxc-icon-folders',
  }),
  FOLDERS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fad',
    name: 'folders',
    color1: 'dxc-icon-folders',
  }),
  PACKAGE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'box-taped',
    color1: 'dxc-text-yellow',
  }),
  DEVICE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'mobile-screen-button',
    color1: 'dxc-text-75',
  }),
  GLOBE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'globe',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  MOVE_TO_TERM: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'arrow-down-left',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  TERMINAL: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'terminal',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  JS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fab',
    name: 'js-square',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  PYTHON: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fab',
    name: 'python',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  PLUS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'plus',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  MINUS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'minus',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  ADD:  new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'plus',
    color1: 'dxc-text-75'
  }),
  FIND: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'magnifying-glass',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  MSG: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'envelope',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  EDIT: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'pencil',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  PLAY: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'play',
    color1: 'dxc-icon-android', //'dxc-text-75',
  }),
  STOP: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'stop',
    color1: 'dxc-error-icon', //'dxc-text-75',
  }),
  ANALYZE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'gear',
    color1: 'dxc-text-100', //'dxc-text-75',
  }),
  HELPER: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'circle-question',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  HISTORY: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'clock-rotate-left',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  INFO: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'circle-info',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  LIST: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'list',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  START_OBSERVE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'eye',
    color1: 'dxc-warning-icon', //'dxc-text-75',
  }),
  STOP_OBSERVE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'eye-slash',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  LOCK: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'lock',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  UNLOCK: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'unlock',
    color1: 'dxc-text-75', //'dxc-text-75',
  }),
  CLOSE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'xmark',
    color1: 'dxc-text-75',
  }),

  // --- status icon
  CHECK: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'check',
    color1: 'dxc-success-icon',
  }),
  WARNING: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'triangle-exclamation',
    color1: 'dxc-warning-icon',
  }),
  SUCCESS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'circle-check',
    color1: 'dxc-success-icon',
  }),
  ERROR: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'xmark',
    color1: 'dxc-error-icon',
  }),
  BELL: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'bell',
    color1: 'dxc-text-75',
  }),
  STAR: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'star',
    color1: 'dxc-text-yellow',
  }),
  DOWNLOAD:  new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'download',
    color1: 'dxc-text-75'
  }),
  UPLOAD:  new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'upload',
    color1: 'dxc-text-75'
  }),
  SPINNER:  new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'circle-notch',
    color1: 'dxc-text-75',
    spin: true
  }),
  REFRESH:  new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'rotate',
    color1: 'dxc-text-75'
  }),
  TRASH:  new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'trash',
    color1: 'dxc-text-75'
  }),
  UNKNOWN: new IconModel({
    iconType: ICON_TYPE.TEXT,
    label: '?:',
    color1: 'dxc-icon-unknown'
  }),
  BOOKMARK: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'bookmark',
    color1: 'text-warning'
  }),
  UP: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'arrow-up',
    color1: 'dxc-text-clear75'
  }),
  DOWN: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'arrow-down',
    color1: 'dxc-text-clear75'
  }),
  LEFT: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'arrow-left',
    color1: 'dxc-text-clear75'
  }),
  RIGHT: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'arrow-right',
    color1: 'dxc-text-clear75'
  }),
  DYN: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'dna',
    color1: 'dxc-text-clear75'
  }),
  TRAIL: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'chevron-right',
    color1: 'dxc-trail-icon'
  }),
  TRAIL_NEG: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'chevron-right',
    color1: 'dxc-trailneg-icon'
  }),
  COPY: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fal',
    name: 'clipboard',
    color1: 'dxc-text-clear75'
  }),
  PASTE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'paste',
    color1: 'dxc-text-clear75'
  }),
  GEN_HOOK: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'bolt',
    color1: 'dxc-text-yellow'
  }),
  ATTACH_HOOK: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'link',
    color1: 'dxc-text-yellow'
  }),
  LAUNCH: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fad',
    name: 'rocket',
    color1: 'dxc-icon-yr'
  }),
  CONNECTED: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fad',
    name: 'link',
    color1: 'dxc-icon-yr'
  }),
  DISCONNECTED: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fad',
    name: 'unlink',
    color1: 'text-danger'
  }),
  NETWORK_OK: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'network-wired',
    color1: 'text-success'
  }),
  NETWORK_NOK: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'network-wired',
    color1: 'text-danger'
  }),
  TOOLS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'screwdriver-wrench',
    color1: 'dxc-text-clear75'
  }),
  WIRED: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'network-wired',
    color1: 'dxc-text-clear75'
  }),
  USER: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'user',
    color1: 'dxc-text-clear75'
  }),
  TARGET: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'bullseye',
    color1: 'dxc-text-75'
  }),
  LOCATION: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'location-dot',
    color1: 'dxc-text-75'
  }),
};
