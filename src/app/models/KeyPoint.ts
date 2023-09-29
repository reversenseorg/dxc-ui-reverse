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
