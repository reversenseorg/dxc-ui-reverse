
/**
 * Represents a session of hooking.
 *
 * A session comonly starts when the Frida final script is loaded and
 * finish at the next start.
 *
 * (TODO : or when the device is disconnected)
 *
 * @param {*} manager
 */
import HookMessage from "../HookMessage";
import {NodeInternalType} from "../NodeInternalType";
import {RuntimeEvent} from "./RuntimeEvent";
import HookMessageV2 from "./HookMessageV2";
import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";

// Stub.
// TODO :  replace by defined type
namespace Frida {
  export type Session = any ;
  export type Device = any ;
  export type Script = any ;
}


interface FridaBindings {
    session: Frida.Session,
    device: Frida.Device,
    script: Frida.Script,
    pid: number
}


export interface HookSessionOptions {
  rawOutput:boolean
}

/**
 * @class
 */
export default class HookSession
{
  __:NodeInternalType = NodeInternalType.HOOK_SESSION;

  public _uid:Nullable<string>  = null;

  /**
   * The stack containing the received message
   * @field
   */
  message:RuntimeEvent<any>[] = [];
  //message:HookMessageV2[] = [];


  /**
   * Follow hookset matches
   * @field
   */
  sets_matches:any = {};

  /**
   * The timestamp of the session
   * @field
   */
  time = -1;

  /**
   * To hold some references from frida-node
   * @field
   */
  frida:Nullable<FridaBindings> = null


  active = false;

  opts:HookSessionOptions;

  evTags:any;

  tags:any;

  offset = 0;

  /**
   *
   * @param {HookManager} manager
   * @constructor
   */
  constructor(pConfig:any) {

    for(const i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
  }

  getUID(){
    return this._uid;
  }

  setOptions(pOptions:HookSessionOptions){
    this.opts = pOptions;
  }


  /**
   * @method
   */
  hasMessages( pOffset=0):boolean{
    return this.message.length > pOffset;
  }

  /**
   * @method
   */
  messages():RuntimeEvent<HookMessageV2>[]{
    return this.message;
  }

  /**
   * To get hook messages into the specific interval
   *
   * @param {number} pOffset Offset of the first message to include into return
   * @param {number} pSize Number of message to return
   * @method
   */
  getMessages( pOffset:number, pSize:number ):RuntimeEvent<any>[]{
    const arr = [];
    for(let i=pOffset; i<pOffset+pSize; i++){
      // not null and not undefined
      if(this.message[i] != null){
        arr.push(this.message[i]);
      }
    }

    return arr;
  }

  /**
   * @method
   */
  toJsonObject( pOffset=0, pSize=-1):any{
    const o:any = new Object();
    let limit:number=pSize;
    o.message = [];
    o.active = this.active;
    o.time = this.time;
    o.offset = this.offset;
    o.tags = [];
    for(const k in this.tags) o.tags.push(this.tags[k].getUUID())

    o.opts = this.opts;
    //o._sessid = this._sessid;

    if(limit==-1)
      limit = this.message.length;

    limit += pOffset;
    for(let i=pOffset; i<limit; i++){
      if(this.message[i] != null)
        o.message.push(this.message[i].toJsonObject());
    }

    o.size = o.message.length;
    return o;
  }

  /**
   * to check is the hook session is running
   *
   */
  isActive():boolean {
    return this.active;
  }

  onExit():void {
    //
  }


}


