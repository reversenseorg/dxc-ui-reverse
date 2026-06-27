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

import {NodeInternalType} from "./NodeInternalType";
import {INode} from "./INode";
import {OperatingSystem} from "./OperatingSystem";
import {Architecture} from "./Architecture";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";
import {RenderedModelNode} from "../base/RenderedModelNode";


/**
 * Represents a Syscall
 * @param {Object} config Optional, an object wich can be used in order to initialize the instance
 * @constructor
 */
export default class ModelSyscall  extends RenderedModelNode implements INode
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
      super();
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
