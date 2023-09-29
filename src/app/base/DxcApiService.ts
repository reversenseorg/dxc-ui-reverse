import {HttpClient, HttpParams} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Utils} from "../cmp/Utils";
import {Injectable} from "@angular/core";
import {DxcApiToken} from "./DxcApiToken";
import {DexcaliburConnectionParams} from "../models/remote/DexcaliburConnectionParams";
import {WebApiWindowing} from "./WebApiWindowing";
import {OutputService} from "../components/output/ctrl/output.service";
import {OutputMessage} from "../cmp/OutputMessage";
import {Nullable} from "./Nullable";
import {IStringIndex} from "./IStringIndex";

/*
export interface ServerResponse {
  success: boolean;
  data?: any;
  msg?: string;
}*/

export interface EndpointInfo {
  method :string;
  url :string;
  format :string;
  auth?: boolean;
  puid?:boolean;
  window?:WebApiWindowing;
}



/**
 * Represents a collection of API endpoints , each are identified by a name
 *
 */
export interface EndpointGroup {
  [action:string] :EndpointInfo
}

/**
 * Represents a collection of group of API endpoints
 *
 */
export interface EndpointMap {
  [group :string]: EndpointGroup
}

let gAuthProfile:any = null;

/**
 * This class helps to send request HTTP API
 *
 * @class
 * @since 1.0.0
 * @author Georges-Bastien MICHEL
 */

/*@Injectable({
  providedIn: 'root'
})*/
export class DxcApiService {

  token: Nullable<DxcApiToken> = null;

  private _baseURL = "";

  protected _http:HttpClient;
  endpoints: EndpointMap;
  window: Nullable<WebApiWindowing> = null;
  protected _output:Nullable<OutputService>;

  constructor(pEndpoints:EndpointMap, pHttp:HttpClient, pOutputSvc:Nullable<OutputService> = null) {
    this.endpoints = pEndpoints;
    this._http = pHttp;
    this._output = pOutputSvc;

    const params = (new URL(location.href)).searchParams;

    if(gAuthProfile==null){
      if(params.get('auth')!=null){
        gAuthProfile = JSON.parse(atob(params.get('auth') as string));
        console.log("[AUTH PROFILE] Saving profile ",gAuthProfile);
        this._baseURL = (gAuthProfile.ssl===true?'https':'http')+'://'+gAuthProfile.ip+':'+gAuthProfile.port+'/api';
        // persist
        this._saveAuthProfile('profile:default',gAuthProfile);
        console.log(this._baseURL)
      }else{
        try{
          gAuthProfile = this._restoreAuthProfile('profile:default');
          this._baseURL = (gAuthProfile.ssl===true?'https':'http')+'://'+gAuthProfile.ip+':'+gAuthProfile.port+'/api';
          console.log("[AUTH PROFILE] Profile restored ",gAuthProfile);
        }catch(err){
          console.log("[AUTH PROFILE] Profile not found. Creating new one :",gAuthProfile);
          this._baseURL = location.protocol+'//'+location.host+'/api';

          location.host.split(":")[0]
          gAuthProfile = {
            ssl: location.protocol.endsWith('s'),
            ip: location.host.split(":")[0],
            port: location.port
          };
        }

      }
      console.log("BaseURL = "+this._baseURL)
    }else{
     //this._baseURL = location.protocol+'//'+location.host+'/api';
      this._baseURL = (gAuthProfile.ssl===true?'https':'http')+'://'+gAuthProfile.ip+':'+gAuthProfile.port+'/api';

    }

  }

  /**
   * To return active "auth profile"
   *
   * @return {any}
   * @method
   */
  static getAuthProfile():any {
    return gAuthProfile;
  }

  protected _setWindowing( pOffset:number, pSize:number):void {
    this.window = new WebApiWindowing(pOffset,pSize);
  }

  /**
   *
   * If windowing is enabled for the endpoint, else ':start' and ':length' can be
   * used as magic parameter to control remote windowing
   *
   * @param pEndpoint
   * @param pConnParam
   * @param pOptions
   * @protected
   */
  protected _delegateProcess( pEndpoint:EndpointInfo, pConnParam:Nullable<DexcaliburConnectionParams> = null, pOptions:any = {}):Observable<any>{

    console.log(this._baseURL);
    let url:string = this._baseURL; //environment.apiUrl ;
    const extra:any = {};

    if(pEndpoint.url.indexOf(':')>-1){
      url += Utils.dxc_prepareURL( pEndpoint.url, pOptions);
    }else{
      url += pEndpoint.url;
    }

    let obs:Observable<any>;
    let body:any;
    switch (pEndpoint.method) {
      case "GET":
        url += `${url.indexOf('?')>-1? '&':'?'}_t=${Date.now()}`;
        for(const i in pOptions){
          if(i[0]!=':')
            url += `&${i}=${pOptions[i]}`;
          else
            extra[i.substring(1)] = pOptions[i];
        }


        if(pEndpoint.puid){
          if(DxcApiToken.exists("puid")){
            url += `&_puid=${(DxcApiToken.getInstance( "puid") as DxcApiToken).getToken()}`;
          }else if (this._output != null){
            this._output.print( OutputMessage.newError({msg:"ProjectUID token is required but not set."}));
            return from([]);
          }else{
            throw new Error("ProjectUID token is required but not set.");
          }
        }

        if(pEndpoint.auth){
          if(DxcApiToken.exists()){
            const t = DxcApiToken.getInstance( pConnParam==null? "local":pConnParam.getName());
            if(t!=null){
              url += `&_a=${t.getToken()}`;
            }

          }else if (this._output != null){
            this._output.print( OutputMessage.newError({msg:"API token is required but not set."}));
            return from([]);
          }else{
            throw new Error("API token is required but not set.");
          }
        }

        if(pEndpoint.window){
          url += `${url.indexOf('?')>-1? '&':'?'}__f=${JSON.stringify(pEndpoint.window.and(extra).toJsonObject())}`;
        }

        obs = this._http.get<any>(
          url,
          {
            observe: 'body',
            responseType: 'json' //(pEndpoint.format as string)
          }
        );
        break;
      case "POST":
      case "PUT":
      case "DELETE":
        body = { _t: Date.now() };
        for(const i in pOptions){
          if(i[0]!=':')
            body[i] = pOptions[i];
          else
            extra[i.substring(1)] = pOptions[i];
        }

        if(pEndpoint.puid){
          if(DxcApiToken.exists("puid")){
            const puid_t = DxcApiToken.getInstance( "puid");
            if(puid_t!=null){
              url += `${url.indexOf('?')>-1? '&':'?'}_puid=${puid_t.getToken()}`;
            }
          }else if (this._output != null){
            this._output.print( OutputMessage.newError({msg:"ProjectUID token is required but not set."}));
            return from([]);
          }else{
            throw new Error("ProjectUID token is required but not set.");
          }
        }

        if(pEndpoint.auth){
          if(DxcApiToken.exists()){

            const t1 = DxcApiToken.getInstance( pConnParam==null? "local":pConnParam.getName());
            if(t1!=null){
              url += `${url.indexOf('?')>-1? '&':'?'}_a=${t1.getToken()}`;
            }


          }else if (this._output != null){
            this._output.print( OutputMessage.newError({msg:"API token is required but not set."}));
            return from([]);
          }else{
            throw new Error("API token is required but not set.");
          }
        }

        if(pEndpoint.window){
          url += `${url.indexOf('?')>-1? '&':'?'}__f=${JSON.stringify(pEndpoint.window.and(extra).toJsonObject())}`;
        }

        // @ts-ignore
        obs = (this._http as IStringIndex<any>)[pEndpoint.method.toLowerCase()]<any>(
          url,
          body,
          {
            observe: 'body',
            responseType: 'json' //(pEndpoint.format as string)
          }
        );
        break;
      default:
        throw new Error("DxcApiService cannot build request");
        break;
    }



    return obs;
  }

  private _saveAuthProfile(pName:string, pProfile:any):void {
    localStorage.setItem(pName, JSON.stringify(pProfile));
  }

  private _restoreAuthProfile(pName:string):void {
    const profile = localStorage.getItem(pName);

    if(profile==null)  {
      throw new Error("Profile "+pName+" not found");
    }

    return JSON.parse(profile);
  }


  /**
   * To make an http request to local server
   *
   * @param pEndpoint
   * @param pOptions
   * @protected
   */
  protected _process( pEndpoint:EndpointInfo, pOptions:any = {}):Observable<any>{
    return this._delegateProcess( pEndpoint, null, pOptions);
  }
}
