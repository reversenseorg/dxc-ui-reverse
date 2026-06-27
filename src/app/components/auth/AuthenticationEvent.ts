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

import {UserAccount} from "../../models/user/UserAccount";
import {DxcApiToken} from "../../base/DxcApiToken";
import {DexcaliburConnectionParams} from "../../models/remote/DexcaliburConnectionParams";
import {Nullable} from "../../base/Nullable";

export enum AuthenticationEventType {
  AUTH_SUCCESS,
  AUTH_FAILED,
  AUTH_REQUEST,
  AUTH_NEW,
  ASK_LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  REFRESH
}

export class AuthenticationEvent {

  type: AuthenticationEventType;
  user: Nullable<UserAccount>;
  username: Nullable<string>;
  token: Nullable<DxcApiToken>;
  conn: DexcaliburConnectionParams;
  extra: any = {};

  constructor() {

  }

  static newSuccess( pToken:Nullable<DxcApiToken>, pAccount:UserAccount ):AuthenticationEvent{
    let o:AuthenticationEvent = new AuthenticationEvent();
    o.token = pToken;
    o.type = AuthenticationEventType.AUTH_SUCCESS;
    o.user = pAccount;
    return o;
  }

  static newLogoutSuccess():AuthenticationEvent{
    let o:AuthenticationEvent = new AuthenticationEvent();
    o.type = AuthenticationEventType.LOGOUT_SUCCESS;
    return o;
  }

  static refresh(pExtra:any):AuthenticationEvent{
    let o:AuthenticationEvent = new AuthenticationEvent();
    o.type = AuthenticationEventType.REFRESH;
    o.extra = pExtra;
    return o;
  }

  static newLogoutFailure():AuthenticationEvent{
    let o:AuthenticationEvent = new AuthenticationEvent();
    o.type = AuthenticationEventType.LOGOUT_FAILURE;
    return o;
  }



  static newAuthFailed( pUsername:string ):AuthenticationEvent{
    let o:AuthenticationEvent = new AuthenticationEvent();
    o.type = AuthenticationEventType.AUTH_FAILED;
    o.username = pUsername;
    return o;
  }


  static requestNewAuth():AuthenticationEvent{
    let o:AuthenticationEvent = new AuthenticationEvent();
    o.type = AuthenticationEventType.AUTH_NEW;
    return o;
  }

  static requestLogout():AuthenticationEvent{
    let o:AuthenticationEvent = new AuthenticationEvent();
    o.type = AuthenticationEventType.ASK_LOGOUT;
    return o;
  }

  static requestAuth( pConn:DexcaliburConnectionParams  ):AuthenticationEvent{
    let o:AuthenticationEvent = new AuthenticationEvent();
    o.type = AuthenticationEventType.AUTH_NEW;
    o.conn = pConn;
    return o;
  }


  getConnName(){
    return this.conn.name;
  }

  appendExtra(pExtra:any):AuthenticationEvent {
    this.extra = pExtra;
    return this;
  }
}
