import {Nullable} from "../../base/Nullable";

export class AuthToken {

  _t:Nullable<string> = null;

  constructor(pToken:string) {
    this._t = pToken;
  }

  getToken():string {
    if(this._t != null){
      return this._t;
    }else{
      throw new Error("Authentication token is null");
    }
  }
}
