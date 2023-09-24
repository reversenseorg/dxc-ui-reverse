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

  static getInstance( pName:Nullable<string> = "local"):Nullable<DxcApiToken> {
    if(pName==null && DxcApiToken.count()==1){
      return Object.values(_TOKENS)[0];
    }

    if(pName==null || _TOKENS.hasOwnProperty(pName)==false){
      throw new AuthenticationException("API token not found");
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
}


if(!DxcApiToken.ready){
  DxcApiToken.importLocalStorage();
}
