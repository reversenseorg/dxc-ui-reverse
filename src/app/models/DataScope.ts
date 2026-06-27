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

export interface DataScopeMap {
  [name:string] :DataScope
}

export enum DataScopePpts {
  PATH="p",
  OTHER="o"
}

export default class DataScope {
  _n:Nullable<string> = null;
  _p:any = null;

  constructor( pName:string, pOpts:any={}){
    this._n = pName;
    this._p = pOpts;
  }

  getName():Nullable<string> {
    return this._n;
  }

  setPpts( pType:DataScopePpts, pValue:any):DataScope {
    this._p[pType] = pValue;

    return this;
  }

  getBasePath():string {
    return this._p[DataScopePpts.PATH];
  }

  equals( pScope:DataScope):boolean {
    if(pScope==null) return false;

    return (pScope.getName()===this.getName());
  }
}
