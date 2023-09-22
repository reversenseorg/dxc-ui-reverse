import * as _fs_ from 'fs';

import {ConnectionProfile, ConnectionProfileList, ConnectionType} from "./ConnectionProfile";
import {ConnectionManagerException} from "./error/ConnectionManagerException";
import {app, ipcMain} from "electron";
import {AuthType, DxcCredentialContainer} from "./DxcCredentialContainer";

interface IStringIndex {
  [key:string] :any
}

/**
 * The class to manage, edit, save connection settings and credentials
 * to connect to a remote server
 *
 * @class
 */
export class ConnectionManager {

  path:string|null;

  /**
   * List of connection profiles
   * @type {ConnectionProfileList}
   * @public
   */
  profiles:ConnectionProfileList = {};

  defaultName:string|null = null;

  active = "none";

  private _onConnReady:(profile:any)=>any = ((profile:any)=>{ return null; });
  /**
   *
   * @param {string} pPath The path of conneection file
   * @constructor
   */
  constructor(pPath:string ) {
    try{
      this.load(pPath);
    }catch(err){
      if(err.code==ConnectionManagerException.CODE.MISSING_CONN_FILE){
        // create file with empty structure
        this.save(pPath);
        // reload
        this.load(pPath);
      }
    }

    this.registerIpcHandler();
  }


  /**
   * To load connection profiles from file
   *
   * @param pPath
   */
  load(pPath:string):boolean {
    if(!_fs_.existsSync(pPath)) {
      throw ConnectionManagerException.MISSING_CONN_FILE();
    }

    this.path = pPath;


    const data:IStringIndex = JSON.parse(_fs_.readFileSync(pPath, {encoding:'utf8'}).toString());

    if(data.defaults!=null){
      this.defaultName = data.defaults;
    }

    for(const prof in data.profiles){
      this.profiles[prof] = ConnectionProfile.fromPoorObject(data.profiles[prof]);
      if(prof===this.defaultName){
        this.profiles[prof].pdefault = true;
      }
    }


    return true;
  }

  /**
   *
   * @param pType
   */
  getProfilesFor(pType:ConnectionType):ConnectionProfile[] {
    const prfs:ConnectionProfile[] = [];
    for(const name in this.profiles){
      if(this.profiles[name].type==pType){
        prfs.push(this.profiles[name])
      }
    }

    return prfs;
  }

  getDefaultProfile():ConnectionProfile|null {
    if(this.defaultName==null) return null;
    if(this.defaultName){
      return this.profiles[this.defaultName];
    }else{
      return null;
    }
  }

  save(pPath:string|null = null):void {

    const path = (pPath!=null? pPath : this.path);
    if(path == null){
      throw ConnectionManagerException.SAVE_FAILED_MISSING_PATH();
    }

    const o:any = {
      defaults: this.defaultName,
      profiles: {}
    };

    for(const i in this.profiles){
      o.profiles[i] = this.profiles[i].toJsonObject(true);
    }


    _fs_.writeFileSync(path, JSON.stringify(o));
  }

  registerIpcHandler():void{


    // register handlers
    ipcMain.on('conn-profile-list', (pEvent,pArgs)=>{ this.handlerProfileList(pEvent,pArgs); });
    ipcMain.on('conn-profile-save', (pEvent,pArgs)=>{ this.handlerProfileSave(pEvent,pArgs); });
    //ipcMain.on('conn-profile-read', (pEvent,pArgs)=>{ v.handlerProfileRead(pEvent,pArgs);  });
    ipcMain.on('conn-auth-do', (pEvent,pArgs)=>{ this.handlerAuthPerform(pEvent,pArgs); });
    ipcMain.on('finish-btn', (pEvent,pArgs)=>{ this.handlerStart(pEvent,pArgs); });
    ipcMain.on('quit-btn', (pEvent,pArgs)=>{ this.handlerReset(pEvent,pArgs); });
  }

  handlerProfileList(pEvent:any, pArgs:any):void {

    const o:any = {
      defaults: this.defaultName,
      profiles: {}
    };

    for(const i in this.profiles){
      o.profiles[i] = this.profiles[i].toJsonObject();
    }

    pEvent.reply('conn-resp-profile-list', [JSON.stringify(o)]);
  }


  handlerProfileSave(pEvent:any, pArgs:any):void {
    try{
      console.log("profile => "+pArgs);


      const args = JSON.parse(pArgs);
      const profile:any = {};

      this.active = args.pname;

      profile.port = args.port;
      profile.name = args.pname;
      profile.ip = args.host;
      profile.port = args.port;
      profile.ssl = args.ssl;
      profile.protocol = (args.ssl==true)? "https" : "http";


      // auth
      switch (args.authType) {
        case AuthType.PASSWORD:
          if(!args.hasOwnProperty("credentials")){
            profile.credentials = new DxcCredentialContainer(AuthType.PASSWORD, {
                username: args.auth_user,
                password: args.auth_pwd,
              })
          }
          break;
        default:
          break;
      }



      const conn = ConnectionProfile.fromPoorObject(profile);


      if(conn.uid==null){
        conn.generateUID();
      }

      this.profiles[conn.getName()] = conn;

      if(args.pdefault===true){
        this.defaultName = conn.getName();
      }

      this.save();

      pEvent.reply('conn-resp-profile-save', [JSON.stringify({ success:true })]);
    }catch (err){
      pEvent.reply('conn-resp-profile-save', [JSON.stringify({ success:false, error:err.message })]);
    }

  }

  handlerProfileRead(pEvent:any, pArgs:any):void {
    const args = JSON.parse(pArgs);

    pEvent.reply('conn-resp-profile-read', [JSON.stringify({ success:true })]);
  }

  handlerAuthPerform(pEvent:any, pArgs:any):void {
    const args = JSON.parse(pArgs);

    console.log(pArgs);
    console.log(JSON.stringify(this.profiles));

    const profile = this.profiles[args.pname];

    switch(profile.authType){
      case AuthType.PASSWORD:
        break;
      default:
        break;
    }

    pEvent.reply('conn-resp-auth-do', [JSON.stringify({ success:true })]);
  }

  handlerReset(pEvent:any, pArgs:any):void {
      // restart
      app.exit(0);
  }


  handlerStart(pEvent:any, pArgs:any):void {

    const args = JSON.parse(pArgs);
    const profile = this.profiles[args.pname];

    console.log(pArgs);
    console.log(profile);
    console.log(this._onConnReady);

    if(this._onConnReady!=null){
      (this._onConnReady)(profile);//.bind(this,profile);
      this._onConnReady.bind(this,profile);
    }

  }


  private _doPasswordAuth():any {
      return null;
  }

  /**
   * To set a listener on connection ready
   *
   * @param pFunc
   */
  onConnectionReady(pFunc:(profile:any)=>any):void {
    this._onConnReady = pFunc;
  }

  startConnection(){
    if(this._onConnReady!=null){
      this._onConnReady.bind(this,this.profiles[this.active]);
    }
  }
}
