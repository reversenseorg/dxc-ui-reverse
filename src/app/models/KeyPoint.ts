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

import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";
import {NodeInternalType} from "./NodeInternalType";


export enum KeyPointType {
  HOOK=0,
  FS_EVENT
}

export enum KeyPointLifecycleEventType {
  KP_DELETED,
  REACHED
}

export interface KeyPointLifecycleEvent {
  event:KeyPointLifecycleEventType;
  data?:any;
}

/**
 * Represents a key point into application cinetiq
 *
 * from where hook can be load/unload or action triggered
 *
 * @class
 */
export default class KeyPoint {

  //static TYPE:NodeType = new NodeType("key_point", NodeInternalType.KEY_POINT, []);
  __:NodeInternalType = NodeInternalType.KEY_POINT;


  /**
   * If the key point is from a state caught by another key point
   * @field
   * @type {KeyPoint}
   */
  parent:Nullable<KeyPoint> = null;

  /**
   * Should be unique
   */
  name:string;

  token:string;
  description:string;
  condition:string;
  code:string;
  generator: any;
  enable:boolean;
  enabled?:boolean;
  type: KeyPointType = KeyPointType.HOOK;

  constructor(pConfig:any={}) {
    for(let i in pConfig){
      (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }

  getUID():string {
    return this.name;
  }

  getName():string {
    return this.name;
  }

  setName(pName:string) {
    this.name = pName;
  }

  isHookBased():boolean {
    return this.type === KeyPointType.HOOK;
  }

  getDescription():string {
    return this.description;
  }

  toJsonObject():any {
    const o:any = {};
    for(let i in this){
      switch (i){
        case 'parent':
          o.parent = this.parent==null ? null :  this.parent.getUID();
          break;
        default:
          o[i as string] = this[i];
          break;
      }
    }
    return o;
  }
}
