import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {finalize, from, Observable, Subject} from "rxjs";
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
import {UIException} from "./error/UIException";
import {map} from "rxjs/operators";

/*
export interface ServerResponse {
  success: boolean;
  data?: any;
  msg?: string;
}*/

export interface ServerLocation {
  ssl:boolean;
  ip: string;
  port: string;
}

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

export
let gAuthProfile:any = null;
let gCreating = false;
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

  static gAuthProfileUpdate$:Subject<any> = new Subject<any>();
  static baseUrlUpdate$:Subject<string> = new Subject<string>();

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
      gAuthProfile = {
        ssl: (document.location.protocol=='https:'),
        ip: document.location.hostname, //"127.0.0.1",
        port: document.location.port //"8080"
      };
    }

    //this._baseURL = (gAuthProfile.ssl===true?'https':'http')+'://'+gAuthProfile.ip+':'+gAuthProfile.port+'/api';
    this._baseURL = document.location.protocol+'//'+gAuthProfile.ip+':'+gAuthProfile.port+'/api';
    /*
    const sub = DxcApiService.baseUrlUpdate$.subscribe((pURL)=>{
      this._baseURL = pURL;
      sub.unsubscribe();
    });

    if(gAuthProfile==null && !gCreating){
      gCreating = true;
      pHttp.get('/assets/env.json').subscribe((pData:any)=>{

        gAuthProfile = {
          ssl: pData.ssl,
          ip: pData.host,
          port: pData.port
        };

        DxcApiService.gAuthProfileUpdate$.next(gAuthProfile);
        DxcApiService.baseUrlUpdate$.next((gAuthProfile.ssl===true?'https':'http')+'://'+gAuthProfile.ip+':'+gAuthProfile.port+'/api');
      });
    }*/
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

  /**
   * To retrive the base URL of remote API server
   *
   * If the baseURL is not yet intialized it is built from gAuthProfile.
   *
   * @return {string} API server location
   * @method
   */
  getBaseUrl():string {
    return  this._baseURL;
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
   * @param {any} pHttpOptions Additional options for Angular HTTP client
   * @protected
   */
  protected _delegateProcess( pEndpoint:EndpointInfo,
                              pConnParam:Nullable<DexcaliburConnectionParams> = null,
                              pOptions:any = {},
                              pHttpOptions:any = {
                                responseType: 'json',
                                reportProgress:false
                              }):Observable<any>{

    let url:string = this._baseURL; //this.getBaseUrl(); //environment.apiUrl ;
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
            console.log("ProjectUID token is required but not set. [method="+pEndpoint.method+"][url="+url+"]");
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
            console.log("API token is required but not set. [method="+pEndpoint.method+"][url="+url+"]");
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

        if(!pHttpOptions.reportProgress){
          body = { _t: Date.now() };
          for(const i in pOptions){
            if(i[0]!=':')
              body[i] = pOptions[i];
            else
              extra[i.substring(1)] = pOptions[i];
          }
        }else{
          body = pOptions;
        }


        if(pEndpoint.puid){
          if(DxcApiToken.exists("puid")){
            const puid_t = DxcApiToken.getInstance( "puid");
            if(puid_t!=null){
              url += `${url.indexOf('?')>-1? '&':'?'}_puid=${puid_t.getToken()}`;
            }
          }else if (this._output != null){
            this._output.print( OutputMessage.newError({msg:"ProjectUID token is required but not set."}));
            console.log("ProjectUID token is required but not set. [method="+pEndpoint.method+"][url="+url+"]");
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
            console.log("API token is required but not set. [method="+pEndpoint.method+"][url="+url+"]");
            return from([]);
          }else{
            throw new Error("API token is required but not set.");
          }
        }

        if(pEndpoint.window){
          url += `${url.indexOf('?')>-1? '&':'?'}__f=${JSON.stringify(pEndpoint.window.and(extra).toJsonObject())}`;
        }

        if(pHttpOptions.upload){

        }else{

        }
        // @ts-ignore
        obs = (this._http as IStringIndex<any>)[pEndpoint.method.toLowerCase()]<any>(
          url,
          body,
          {
            observe: 'body',
            ...pHttpOptions
          }
        );
        break;
      default:
        throw new Error("DxcApiService cannot build request");
        break;
    }



    return obs.pipe(map((pEl:any)=>{
      if(pEl.success == false && pEl.msg=="Access denied"){
        this._output?.alert( OutputMessage.newWarning({
          msg: "Your session has expired. Please refresh this page or re-authenticate"
        }),{
          title: "Session timeout"
        });
        return null;
      }else{
        return pEl;
      }
    }));
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

  /**
   * To make an http request to local server
   *
   * @param pEndpoint
   * @param pOptions
   * @protected
   */
  protected _processUpload( pEndpoint:EndpointInfo, pOptions:FormData):Observable<any>{


    return this._delegateProcess( pEndpoint, null, pOptions, {
      //headers: new HttpHeaders().append('Content-Type', 'multipart/form-data'),
      reportProgress: true,
    });
  }
}
