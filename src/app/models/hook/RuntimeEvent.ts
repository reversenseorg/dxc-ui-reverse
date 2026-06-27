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

import {INode} from "../INode";
import {Tag} from "../tags/Tag";
import BusEvent from "../BusEvent";
import {INodeRef, NodeInternalType} from "../NodeInternalType";
import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";
import HookMessageV2 from "./HookMessageV2";

export enum RuntimeEventType {
  HOOK= 'h',
  MEMORY='m',
  NETWORK='n',
  FILESYSTEM='f',
    ANY='*'
}

export interface HookRawMessage {
  hid?:string;
  fid?:string;
  data?:IStringIndex<any>;
  when?:number;
  frag?:any;
}

/**
 * This class represents any events happening at runtime of target applications and
 * captured by Dexcalibur
 *
 * Most specifialized message - such as hook messages - are lifted to RuntimeEvent
 *
 *
 * @class
 */
export class RuntimeEvent<P> extends BusEvent implements INode{

  static rootPatterns:string[] = [
      '/su',
      'Superuser.apk',
      'magisk',
      '/system/app/Superuser.apk',
      '/system/xbin/su',
      '/proc/meminfo'
  ];
  static rootPattern:RegExp = /(\/su|Superuser\.apk|magisk|\/system\/app\/Superuser\.apk|\/system\/xbin\/su)/g;


  rt_type:RuntimeEventType;

  __:NodeInternalType = NodeInternalType.RUNTIME_EVENT;

  id:any = null;

  raw: Nullable<P> = null;

  node:INodeRef[] = [];

  tags:number[] = [];

  interceptors:string[] = []

  constructor( pConfig:any) {
    super(pConfig);

    for(const i in this){

        (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }


  getUID():string{
    return this.id;
  }

  getMessage():Nullable<P> {
    return this.raw;
  }


  isHookMessage(){
    return (this.data!=null && this.rt_type==RuntimeEventType.HOOK); // this.data.hook!=null); //(this.type==RuntimeEventType.HOOK||this.data);
  }

  getHookMessage():HookRawMessage {
    return this.data;
  }

  getHookMessageData():IStringIndex<any> {
    return (this.data.data==null ? {} : this.data.data);
  }

  isRootDetection():boolean {
    let f = false;
    if(this.data.data==null) return false;

    for(let arg in this.data.data){
      if(typeof this.data.data[arg]!='string') continue;

      if(this.data.data[arg].match(RuntimeEvent.rootPattern)!=null){
        f = true;
        break;
      }
    }
    return f;
  }

  isRootDetectionData(pData:string):boolean {
    if(typeof pData!='string' || pData==null) return false;
    return (pData.match(RuntimeEvent.rootPattern)!=null);
  }

  setNodes(pNodes:INodeRef[]){
    this.node = pNodes;
  }

  addNode(pNode:INodeRef){
    if(this.node == null){
      this.node = [];
    }
    this.node.push(pNode);
  }


  addTag(vTag:Tag){
    const uuid = vTag.getUUID();

    if(!Array.isArray(this.tags)){
      this.tags = [];
    }

    if(this.tags.indexOf(uuid)==-1)
      this.tags.push(uuid);
  }

  hasTag(vTag:Tag):boolean{
    const uuid = vTag.getUUID()
    for(let i=0; i<this.tags.length; i++){
      if(this.tags[i]===uuid){
        return true;
      }
    }
    return false;
  }

  getTags():number[]{
    return this.tags;
  }


  static fromHookMessage(pHMsg:HookMessageV2):RuntimeEvent<HookMessageV2> {
    const msg:RuntimeEvent<HookMessageV2> = new RuntimeEvent({

    });
    msg.raw = pHMsg;
    return msg;
  }

  /**
   * To make an instance of Object which not contain circular reference
   * and which are ready to be serialized.
   * @returns {Object} Returns an Object instance representing the type
   */
  toJsonObject():any{
    const o:any = new Object();

    o.type = this.type
    o.node = this.node;
    o.tags = this.tags;
    o.raw = (this.raw != null ? (this.raw as any).toJsonObject() : null);

    //if(this.tags != null && this.tags.length > 0)
    //    o.tags = this.tags;

    return o;
  }
}
