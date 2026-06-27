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

import {OperatingSystem} from "../OperatingSystem";
import {NodeInternalType} from "../NodeInternalType";
import {MerlinSearchRequest} from "./MerlinSearchRequest";
import ModelClass from "../ModelClass";
import DataScope from "../DataScope";
import {Nullable} from "../../base/Nullable";


export interface SearchOptions {
  query_string?:boolean;

  regexp?:boolean;

  range?:string[];

  not: boolean;

  copyTo?:any;

  strict?:boolean;
  exists?:boolean;
  nocase?:boolean;
}


/**
 * The SearchAPI. Allow the user to perform search into the object
 * database.
 *
 * @param {Object} data The database of objects
 * @constructor
 */
export class MerlinSearchAPI
{
  targetOS:OperatingSystem|undefined;

  _queryCache:any = [];
  _caseSensitive:boolean = true;
  _byID:boolean = false;
  //get:SearchAPISelector;


  constructor(){

    this._queryCache = [];

    // set default case sensitivity for all search
    this._caseSensitive = true;
  }



  /**
   * Switch case sensitive On/Off of following search
   */
  nocase():MerlinSearchAPI{
    this._caseSensitive = false;
    return this;
  }

  byID():MerlinSearchAPI{
    this._byID = true;
    return this;
  }




  class(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.CLASS, pattern, pOptions);
  }

  package(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.PACKAGE, pattern, pOptions);
  }

  method(pattern:any|string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.METHOD, pattern, pOptions);
  }

  field(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.FIELD, pattern, pOptions);
  }

  file(pattern:string="", pOptions:SearchOptions = { not:false }, pScope:Nullable<DataScope> = null):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.FILE, pattern, pOptions);
  }

  array(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.DATA_BLOCK, pattern, pOptions);
  }

  activity(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.ANDROID_ACTIVITY, pattern, pOptions);
  }

  service(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.ANDROID_SERVICE, pattern, pOptions);
  }

  receiver(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.ANDROID_RECEIVER, pattern, pOptions);
  }

  provider(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.ANDROID_PROVIDER, pattern, pOptions);
  }

  permission(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.ANDROID_PERM, pattern, pOptions);
  }

  call(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.CALL, pattern, pOptions);
  }

  strings(pattern:string|any="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition(NodeInternalType.STRING, pattern, pOptions);
  }

  func(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.FUNC, pattern, pOptions);
  }

  syscall(pattern:string="", pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    return MerlinSearchRequest.fromCondition( NodeInternalType.SYSCALL, pattern, pOptions);
  }


  /**
   * @param {String} pattern Search pattern
   */
  /*
  setter(pattern:string="", pOptions:SearchOptions = { not:false }):FinderResult{
    let res:FinderResult = null;
    if(pattern != null){
      res = this._finder._find(
          this._db.call, ModelCall.TYPE,
          "calleed."+pattern, false, true);
      res = res.filter("instr.opcode.type:"+CONST.INSTR_TYPE.SETTER);
    }
    else{
      res = this._finder._find(
          this._db.call, ModelCall.TYPE,
          "instr.opcode.type:"+CONST.INSTR_TYPE.SETTER, false, true);
    }

    return res;
  }
*/
  /**
   *
   * @param {String} pattern Field signature
   */
  /*
  settersOf(signature:string="", pOptions:SearchOptions = { not:false }):FinderResult{
    return this.setter("__signature__:"+signature);
  }*/

  /**
   * @param {String} pattern Field signature
   */
  /*
  getter(pattern:string="", pOptions:SearchOptions = { not:false }):FinderResult{
    let res:FinderResult = null;
    if(pattern != null){
      res = this._finder._find(
          this._db.call, ModelCall.TYPE,
          "calleed."+pattern, false, true);
      res = res.filter("instr.opcode.type:"+CONST.INSTR_TYPE.GETTER);
    }
    else{
      res = this._finder._find(
          this._db.call, ModelCall.TYPE,
          "instr.opcode.type:"+CONST.INSTR_TYPE.GETTER, false, true);
    }

    return res;
  }
*/

  /**
   * TODO : deprecated ?
   * @param {String} pattern Field signature
   */
  /*
  gettersOf(signature:string="", pOptions:SearchOptions = { not:false }):FinderResult
  {
    return this._finder._find(
        this._db.call, ModelCall.TYPE,
        "instr.opcode.type:"+CONST.INSTR_TYPE.GETTER, false, true);
  }*/



  static getMethodFromNodeType( pType:NodeInternalType):string {
    switch (pType){
      case NodeInternalType.METHOD: return "method";
      case NodeInternalType.CLASS: return "class";
      case NodeInternalType.FIELD: return "field";
      case NodeInternalType.STRING: return "strings";
      case NodeInternalType.PACKAGE: return "package";
      case NodeInternalType.FUNC: return "func";
      case NodeInternalType.FILE: return "file";
      case NodeInternalType.DATA_BLOCK: return "array";
      case NodeInternalType.ANDROID_ACTIVITY: return "activity";
      case NodeInternalType.ANDROID_PROVIDER: return "provider";
      case NodeInternalType.ANDROID_SERVICE: return "service";
      case NodeInternalType.ANDROID_RECEIVER: return "receiver";
      case NodeInternalType.ANDROID_PERM: return "permission";
      case NodeInternalType.SYSCALL: return "syscall";
      case NodeInternalType.CALL: return "call";
      default: throw new Error("MerlinSearchAPI : unknow node type");
    }
  }

  toJsonObject():any {
    const o = {
      targetOS: this.targetOS,
      _queryCache: this._queryCache,
      _caseSensitive: this._caseSensitive,
      _byID: this._byID
    };
    return o;
  }
}
