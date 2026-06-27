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

import {UNKNOWN_ERROR_CODE} from "@angular/compiler-cli";
import {IStringIndex} from "../base/IStringIndex";


export enum ModelNativeRefType {
  CALL,
  CODE,
  UNKNOWN
}

export class ModelNativeRef {
  addr:number = -1;
  at:number = -1;
  __t:ModelNativeRefType = ModelNativeRefType.UNKNOWN;

  constructor(pConfig:any = null){

    if(pConfig!==undefined)
      for(let i in pConfig)
        (this as IStringIndex<any>)[i]=pConfig[i];

  }
}
