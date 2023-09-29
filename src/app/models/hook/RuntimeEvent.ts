import {INode} from "../INode";
import {Tag} from "../tags/Tag";
import BusEvent from "../BusEvent";
import {NodeInternalType} from "../NodeInternalType";
import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";

export enum RuntimeEventType {
  HOOK= 'h',
  MEMORY='m',
  NETWORK='n',
  FILESYSTEM='f'
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

  __:NodeInternalType = NodeInternalType.RUNTIME_EVENT;

  override type:Nullable<RuntimeEventType> = null;

  id:any = null;

  raw: Nullable<P> = null;

  node:INode[] = [];

  tags:number[] = [];

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
    return (this.type==RuntimeEventType.HOOK);
  }

  getHookMessage():HookRawMessage {
    return this.data;
  }

  getHookMessageData():IStringIndex<any> {
    return (this.data.data==null ? {} : this.data.data);
  }

  setNodes(pNodes:INode[]){
    this.node = pNodes;
  }

  addNode(pNode:INode){
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
