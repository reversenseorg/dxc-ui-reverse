import {ICON_TYPE, IconModel} from "../../base/icon/IconModel";

export const AUTH_ICONS = {
  SERVER: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'server'
  }),
  USER: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'user'
  }),
  KEY: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'key'
  }),
  TOKEN: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'code'
  }),
  UNLOCK: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'user-unlock'
  }),
  AUTH_SUCCESS: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fad',
    name: 'user-check'
  }),
  AUTH_FAIL: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fad',
    name: 'user-times'
  }),
  PEOPLE: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'code'
  }),
  PEER: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fas',
    name: 'user-friends'
  }),
  CFG: new IconModel({
    iconType: ICON_TYPE.ICON,
    type: 'fad',
    name: 'user-cog'
  })
};
