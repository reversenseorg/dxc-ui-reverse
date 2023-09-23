import {NodeInternalType} from "./NodeInternalType";
import {INode} from "./INode";
import {OperatingSystem} from "./OperatingSystem";
import {Architecture} from "./Architecture";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


/**
 * Represents a Syscall
 * @param {Object} config Optional, an object wich can be used in order to initialize the instance
 * @constructor
 */
export default class ModelSyscall implements INode
{
  __:NodeInternalType = NodeInternalType.SYSCALL;

  os:OperatingSystem;

  arch:Architecture;

  sysnum:number;

  name:string;

  func_name:Nullable<string> = null;

  sys_name:Nullable<string> = null;

  args:any = [];

  ret:any = null;
  retType?:any = null;
  errCodes?:any = null;
  tags:number[] = [];

  probing = false;

  hooks:any[] = [];

  constructor(pConfig:any=null){
    if(pConfig!=null){
      for(const i in pConfig)
        (this as IStringIndex<any>)[i]=pConfig[i];
    }
  }

  /**
   *
   * @param pOsUid
   * @param pArch
   * @param pDefine
   * @return {ModelSyscall}
   *
   */
  static fromInterruptorDefine( pOsUid:OperatingSystem, pArch:Architecture, pDefine:any[] ):ModelSyscall {
    return new ModelSyscall({
      os: pOsUid,
      arch: pArch,
      sysnum: pDefine[0],
      name: pDefine[1],
      args: pDefine[3],
      ret: pDefine[4],
      errCodes: (pDefine[4]!=null ? pDefine[4].e : null)
    });
  }

  toJsonObject():any{
    const o:any = {};
    for(const i  in this) o[i] = this[i];
    // o.sysnum = this.sysnum.join(",");
    // o.args = this.args.join(",");
    return o;
  }

  /**
   * @return {number}
   * @method
   */
  getNumber():number {
    return this.sysnum;
  }

  getUID(): string {
    return this.os+':'+this.arch+':'+this.sysnum;
  }
}
