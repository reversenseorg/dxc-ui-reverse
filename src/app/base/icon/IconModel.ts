import {IStringIndex} from "../IStringIndex";
import {Nullable} from "../Nullable";


export interface IconModelCollection {
  [iconName:string] :IconModel
}

export enum ICON_TYPE {
  ICON = 'img',
  TEXT = 'txt',
  NONE = 'none'
}

export class IconModel {

  static EMPTY = new IconModel({
    type: ICON_TYPE.NONE
  });

  iconType: ICON_TYPE = ICON_TYPE.ICON;
  type: Nullable<string> = null;
  name: Nullable<string> = null;
  label: Nullable<string> = null;
  color1: Nullable<string> = null;
  color2: Nullable<string> = null;
  style: Nullable<string> = null;
  spin: boolean = false;

  src?:Nullable<string> = null;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) {
        if(this.hasOwnProperty(i))
          (this as IStringIndex<any>)[i] = pConfig[i];
      }
    }
  }
}
