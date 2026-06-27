/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

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
