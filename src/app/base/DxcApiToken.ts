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

import {AuthenticationException} from "../models/user/auth/AuthTypes";
import {Nullable} from "./Nullable";

interface DxcApiTokenMap {
  [name:string] :Nullable<DxcApiToken>;
}

var _TOKENS:DxcApiTokenMap = {};


export class DxcApiToken {

  static ready:boolean = false;

  _n:string;
  _t:Nullable<string> = null;

  constructor(pName:string, pToken:string) {
    this._t = pToken;
    this._n = pName;
  }

  // TODO : add a mask unique per session
  static updateLocalStorage():void{
    for(let n in _TOKENS){
      if(_TOKENS[n]!=null){
        localStorage.setItem('DxcApiToken:'+n, (_TOKENS[n] as DxcApiToken).getToken());
      }
    }
  }

  /**
   * To count active tokens
   *
   * @return {number} Token count
   *
   */
  static count():number {
    return Object.keys(_TOKENS).length;
  }

  /**
   * To destroy a token by connection name
   *
   * @param {}pConnName
   */
  static remove( pConnName:string):void {
    _TOKENS[pConnName] = null;
    let t:DxcApiTokenMap = {};
    for(let k in _TOKENS) if(_TOKENS[k]!=null) t[k] = _TOKENS[k];
    _TOKENS = t;
    localStorage.removeItem("DxcApiToken:"+pConnName);
  }

  static importLocalStorage():void{


    const OFFSET = 'DxcApiToken:'.length;
    let tkn:string;
    for(let n in localStorage){
      if(n.startsWith('DxcApiToken:')){
        tkn = n.substr(OFFSET);
        if(localStorage.getItem(n) == null){
          throw new Error("DxcApiToken not found");
        }
        _TOKENS[tkn] = new DxcApiToken( tkn, localStorage.getItem(n) as string);
      }
    }

    DxcApiToken.ready = true;
  }

  static exists( pName = "local"):boolean {
    return _TOKENS.hasOwnProperty(pName);
  }

  static create( pName = "local", pval:string):DxcApiToken {
    if(_TOKENS.hasOwnProperty(pName)==false){
      _TOKENS[pName] = new DxcApiToken(pName, pval);
      DxcApiToken.updateLocalStorage();
    }

    return _TOKENS[pName] as DxcApiToken;
  }

  /**
   * To create a temporay tokean not persisted into local storage
   *
   * Typically use case are a user browsing a code reference from
   * scan report. A user could explore several report of different project
   * in same time.
   *
   * @param {string} pName The token name
   * @param {string} pValue the token value
   * @return {DxcApiToken} The token instance
   * @method
   * @static
   */
  static createTemporary( pName = "local", pValue:string):DxcApiToken {
    if(_TOKENS.hasOwnProperty(pName)==false){
      _TOKENS[pName] = new DxcApiToken(pName, pValue);
    }

    return _TOKENS[pName] as DxcApiToken;
  }

  static getInstance( pName:Nullable<string> = "local"):Nullable<DxcApiToken> {
    if(pName==null && DxcApiToken.count()==1){
      return Object.values(_TOKENS)[0];
    }

    if(pName==null){
      throw new AuthenticationException("API token not found : name is null");
    }

    if(_TOKENS.hasOwnProperty(pName)==false){
      if(localStorage.getItem(pName)!=null){
        _TOKENS[pName] = new DxcApiToken(pName,localStorage.getItem(pName) as string);
      }
      if(sessionStorage.getItem(pName)!=null){
        _TOKENS[pName] = new DxcApiToken(pName,sessionStorage.getItem(pName) as string);
      }
      if(_TOKENS[pName]==null){
        throw new AuthenticationException("API token not found");
      }
    }

    return _TOKENS[pName];
  }

  getDefaultConnName():string {
    return "local";
  }

  getName():string {
    return this._n;
  }

  getToken():string {
    if(this._t != null){
      return this._t;
    }else{
      throw new Error("Authentication token is null");
    }
  }

  /**
   *
   * @param {string} pValue
   * @method
   */
  updateToken(pValue:string):void {
    this._t = pValue;
    DxcApiToken.updateLocalStorage();
  }
}


if(!DxcApiToken.ready){
  DxcApiToken.importLocalStorage();
}
