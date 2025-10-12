import {IStringIndex} from "../IStringIndex";
import {Nullable} from "../Nullable";
import {IconName, IconPrefix} from "@fortawesome/fontawesome-common-types";

export interface IconModelCollection {
  [iconName:string] :IconModel
}

export enum ICON_TYPE {
  ICON = 'img',
  TEXT = 'txt',
  SVG = 'svg',
  NONE = 'none'
}

export interface IconEmptyOptions extends IStringIndex<any> {
  iconType: ICON_TYPE;
}

export interface IconImgOptions extends IStringIndex<any> {
  iconType?: ICON_TYPE;
  type:IconPrefix;
  name:IconName;
  color1:string;
  src?:string;
  style?:IStringIndex<string>;
  color2?:string;
  spin?:boolean;
}

export interface IconTextOptions extends IStringIndex<any> {
  iconType?: ICON_TYPE;
  label:string;
  color1:string;
}

export interface IconSvgOptions extends IStringIndex<any> {
  iconType?: ICON_TYPE;
  src:string;
  styles?:IStringIndex<string>;
  color1:string;
}

export type IconOptions = IconImgOptions | IconTextOptions | IconEmptyOptions;

export class IconModel {

  static EMPTY = new IconModel({
    iconType: ICON_TYPE.NONE
  });

  iconType: ICON_TYPE = ICON_TYPE.ICON;
  type: IconPrefix;
  name: IconName;
  label: string;
  color1: string;
  color2: Nullable<string> = null;
  style: IStringIndex<string> = {};
  spin: boolean = false;

  src?:Nullable<string> = null;

  constructor(pConfig:IconOptions) {
    if(pConfig != null){
      for(let i in pConfig) {
          (this as IStringIndex<any>)[i] = pConfig[i];
      }
    }
  }

  /*toIconName():IconName {
    return this.type+this.name.split("-").map(x => x[0].toUpperCase()+x.substring(1)).join('');
  }*/

  isIcon(){
    return this.iconType===ICON_TYPE.ICON;
  }
}
