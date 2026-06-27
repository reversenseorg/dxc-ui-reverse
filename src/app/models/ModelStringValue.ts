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

import {Savable, STUB_TYPE} from "./ModelSavable";
import {NodeInternalType} from "./NodeInternalType";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


export default class ModelStringValue extends Savable
{
  override __:NodeInternalType = NodeInternalType.STRING;

  // SRC_NODE_TYPE : SRC_UUID : STR_TYPE : UID
  override _uid:string;

  src:any = null;
  instr:any = null;
  value:Nullable<string> = null;
  override tags:number[] = [];

  constructor(pConfig:any=null) {
    super(STUB_TYPE.STRING_VALUE);

    if(pConfig !== null)
      for(const i in pConfig)
        (this as IStringIndex<any>)[i] = pConfig[i];
  }


  toJsonObject():any{
    const o:any = {};
    o.__ = this.__;
    o.value = this.value;
    o.instr = this.instr.toJsonObject();
    o.tags = this.tags;
    return o;
  }

}
