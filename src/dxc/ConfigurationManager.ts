import * as _fs_ from "fs";
import * as _path_ from "path";
import * as _os_ from "os";
import {app} from 'electron';

import {DEFAULT_DXC_CONFIG_FILE, DEFAULT_DXC_CONN_FILE, DEFAULT_DXC_FOLDER} from "./const";

import {ConnectionManager} from "./ConnectionManager";

/**
 * To load configuration files required by clientto configure it and
 * to initialize communication with remote server
 *
 * @class
 */
export class ConfigurationManager {

  home:string;

  clientPath:string|null = null;
  localServerPath:string|null = null;

  private _server:any = null;
  private _client:any = null;
  private _connMgr:any = null;

  private _userData = "";

  /**
   *
   *
   * @param pUserData
   */
  constructor(pUserData:string) {

      this._userData = pUserData;

      // load client config
      //this.clientPath = _path_.join(__dirname, 'config',(process.env.DXC_DEVMODE==="1" ? "dxc.dev.json" : "dxc.prod.json"));
      this.clientPath = _path_.join(this._userData,(process.env.DXC_DEVMODE==="1" ? "dxc.dev.json" : "dxc.prod.json"));
      if(_fs_.existsSync(this.clientPath)){
        this._client  = JSON.parse(_fs_.readFileSync(this.clientPath).toString());
      }


      // try to load local server config
      if(process.env.DXC_HOME!=null && process.env.DXC_HOME.length>0){
        this.localServerPath = _path_.join(process.env.DXC_HOME, DEFAULT_DXC_CONFIG_FILE);
      }else{
        this.localServerPath = _path_.join(_os_.homedir(), DEFAULT_DXC_FOLDER, DEFAULT_DXC_CONFIG_FILE);
      }
      if(_fs_.existsSync(this.localServerPath)){
        this._server  = JSON.parse(_fs_.readFileSync(this.localServerPath).toString());
      }
  }

  /**
   * To get the connection manager responsible to
   * manage connection data ( remote server, credentials, ...)
   *
   * Data of connection manager are stored inside : $home/.dexcalibur/conns.json
   *
   * @return ConnectionManager
   * @method
   */
  getConnectionMgr():ConnectionManager {
    if(this._connMgr==null){
      // load client connections file
      const conn = _path_.join(this._userData, DEFAULT_DXC_CONN_FILE);

      console.log(conn);
      this._connMgr = new ConnectionManager(conn);
    }
    return this._connMgr;
  }

  /**
   * To get local Dexcalibur's server configuration (port, ipc, ...)
   *
   * @method
   */
  getLocalServerConfig():any {
    return this._server;
  }

  /**
   * To get local Dexcalibur's client configuration (devmode, ...)
   *
   * @method
   */
  getClientConfig():any {
    return this._client;
  }



}
