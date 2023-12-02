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

}
