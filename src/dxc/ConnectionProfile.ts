import {DxcCredentialContainer} from "./DxcCredentialContainer";
import {Nullable} from "../app/base/Nullable";


export enum ConnectionType {
  LOCAL="local",
  REMOTE="remote"
}

export interface ConnectionProfileList {
  [name:string] :ConnectionProfile
}

/**
 * Represents connection parameters required to establish
 * a connection with a remote Dexcalibur server
 *
 * @class
 * @author Georges-Bastien Michel <georges@reversense.com>
 * @since 1.0.0
 */
export class ConnectionProfile {

  type:ConnectionType = ConnectionType.REMOTE;

  protocol = "http";
  /**
   *
   */
  ipv4:Nullable<string> = null;
  ipv6:Nullable<string> = null;
  port:number = -1;
  hostname:Nullable<string> = null;

  /**
   * A volatile flag TRUE if the profile is the default profile.
   */
  pdefault?:boolean;

  ssl = false;
  /**
   * Name for this configuration
   *
   * @field
   * @type string
   */
  name:Nullable<string> = null;

  /**
   * UID
   *
   * @field
   * @type string
   */
  uid:Nullable<string> = null;

  rawIP:Nullable<string> = null;

  /**
   * Preferred authentication type
   *
   * @field
   * @type AuthType
   */
  authType:any = null; // AuthType.PASSWORD;

  credentials:DxcCredentialContainer|null = null; // Credential Container

  //session:string|null = null;

  /**
   *
   * @param pUID
   * @param pName
   * @param pIP
   * @param pPort
   * @constructor
   */
  constructor( pUID:string, pName:string, pIP:string, pPort:number) {
    this.uid = pUID;
    this.name = pName;

    this.rawIP = pIP;
    if(pIP != null){
      if(pIP.indexOf('.')>-1 && pIP.indexOf(':')==-1)
        this.ipv4 = pIP;
      else if(pIP.indexOf(':')==-1)
        this.ipv6 = pIP;
      else
        this.hostname = pIP;
    }

    if(this.uid==""){
      this.uid = this.name+":"+pIP+":"+pPort;
    }

    if(typeof pPort==="string"){
      this.port = parseInt(pPort,10);
    }else{
      this.port = pPort;
    }
  }

  generateUID():void {
    this.uid = this.name+':'+this.rawIP+':'+this.port;
  }
  /**
   * To get configuration name
   */
  getName():Nullable<string> {
    return  this.name;
  }

  getUID():Nullable<string> {
    return this.uid;
  }


  getIpAddress():Nullable<string>{
    if(this.ipv4 != null){
      return this.ipv4
    }
    else if(this.ipv4 != null){
      return this.ipv4
    }
    else{
      return null; //throw DexcaliburConnectionException.IP_NOT_DEFINED();
    }
  }

  getHostname():Nullable<string> {
    if(this.hostname != null){
      return this.hostname;
    }
    else{
      return null; //throw DexcaliburConnectionException.HOSTNAME_NOT_DEFINED();
    }
  }


  getPort():number{
    if(this.port != null){
      return this.port;
    }
    else{
      return -1; //throw DexcaliburConnectionException.PORT_NOT_DEFINED();
    }
  }

  static fromPoorObject(pObj:any):ConnectionProfile {
    const o:ConnectionProfile = new ConnectionProfile(
      pObj.hasOwnProperty('uid')? pObj.uid : null,
      pObj.hasOwnProperty('name')? pObj.name : null,
      pObj.hasOwnProperty('ip')? pObj.ip : null,
      pObj.hasOwnProperty('port')? pObj.port : null,
    );

    o.hostname = pObj.hasOwnProperty('hostname')? pObj.hostname : null;
    o.authType = pObj.hasOwnProperty('authType')? pObj.authType : null;
    o.protocol = pObj.hasOwnProperty('protocol')? pObj.protocol : "https";

    if(pObj.hasOwnProperty('ssl')){
      o.ssl = pObj.ssl;
      o.protocol = (pObj.ssl==true) ? "https":"http";
    }

    if(pObj.hasOwnProperty('credentials')){
      o.credentials = new DxcCredentialContainer(
        pObj.credentials.type,
        pObj.credentials.raw
      );
    }

    return o;
  }

  toJsonObject(pPrivate = false):any {
    const o:any = {
      uid: this.uid,
      name: this.name,
      port: this.port,
    };
    if(this.ipv4!=null) o.ip = this.ipv4;
    if(this.ipv6!=null) o.ip = this.ipv6;
    if(this.hostname!=null) o.hostname = this.hostname;
    if(this.authType!=null) o.authType = this.authType;
    if(this.ssl!=null) o.ssl = this.ssl;
    if(this.pdefault!=null) o.pdefault = this.pdefault;

    if(pPrivate===true){
      if(this.credentials!=null){
        o.credentials = this.credentials.toJsonObject();
      }
    }

    return o;
  }

  asUriSearchParam():string {
    return Buffer.from(JSON.stringify(this.toJsonObject())).toString('base64')
  }
}
