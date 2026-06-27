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

import {IpcMessage} from "./IpcMessage";
import {__log} from "../app/core/Log";


export enum IpcDispatcherType {
  NODE,
  ELECTRON
}
/**
 *
 *
 * @class
 */
export class IpcDispatcher {

  private _type:IpcDispatcherType = IpcDispatcherType.NODE;

  private _process: any  = null;

  // events:
  private _events:string[] = [];

  // event listener
  private _listeners:any = {}

  // IPC handler
  private _handlers:any = {};

  private _defaultHandler:any = null;


  constructor() {

  }

  setupDispatch(pProcess:any, pType:IpcDispatcherType = IpcDispatcherType.NODE){

    let self:IpcDispatcher = this;

    this._process = pProcess;
    this._type = pType;

    if(pType==IpcDispatcherType.NODE) {
      this._process.on('message', (pMsg: any) => {
        try {
          self.dispatch(IpcMessage.from(pMsg));
        } catch (err:any) {
          __log('[MAIN][DXC_SRV][ERROR] (dispatch) invalid IPC message caught : ' + JSON.stringify(pMsg));
          __log(err.message);
        }
      });

      this._process.on('disconnect', (pMsg: any) => {
        __log('[MAIN][DXC_SRV][ERROR] (dispatch:disconnect) Process has exited ' );
        this.trigger('exit', null);
      });


      this._process.on('close', (pMsg: any) => {
        __log('[MAIN][DXC_SRV][ERROR] (dispatch:close) Process has exited ' );
        this.trigger('exit', null);
      });

      this._process.on('exit', (pMsg: any) => {
          __log('[MAIN][DXC_SRV][ERROR] (dispatch:exit) Process has exited ' );
          this.trigger('exit', null);
      });
    }
  }


  /**
   * To register an handler for an event issued by child process
   * @param pCommand
   * @param pHandler
   * @since 1.0.0
   */
  register( pCommand:string, pHandler:any):void {
    if(this._type === IpcDispatcherType.NODE) {
      this._handlers[pCommand] = pHandler;
    }else{
      this._process.on(pCommand, pHandler);
    }
  }

  /**
   * To register an handler for an event issued by child process
   *
   * @param {any} pHandlers
   * @since 1.0.0
   */
  registerMultiple( pHandlers:any):void {
    for(let i in pHandlers)
      this.register(i, pHandlers[i]);
  }

  /**
   * To register a "by default" handler
   *
   * @param pHandler
   */
  registerDefault( pHandler:any):void {
    this._defaultHandler = pHandler;
  }

  /**
   * To dispatch messages receipt from child process
   *
   * This method is called only if process is a classic NodejS process.
   * This method is NOT called if _process is Electron ipcMain
   *
   * @param pMessage
   * @method
   * @since 1.0.0
   */
  dispatch( pMessage:IpcMessage):void {

    __log('[MAIN][DXC_SRV] (dispatch) IPC message caught : '+JSON.stringify(pMessage));
    if(this._handlers.hasOwnProperty(pMessage.getCommand())){
      this._handlers[pMessage.getCommand()](pMessage);
    }else if(this._defaultHandler!=null){
      this._defaultHandler(pMessage);
    }else{
      __log('[MAIN][DXC_SRV][ERROR] (dispatch) invalid IPC message caught : '+JSON.stringify(pMessage));
    }
  }

  /**
   * To send a message to child process
   *
   * @param pMessage
   * @param pArg
   * @since 1.0.0
   */
  send( pMessage:any, pArg:any=null):void {
    if(this._type === IpcDispatcherType.NODE){
      if(pArg!=null)
        this._process.send(JSON.stringify(pMessage),pArg);
      else
        this._process.send(JSON.stringify(pMessage));
    }else{

    }
  }

  on( pEventName:string, pCallback:any):void{
    if(this._events.indexOf(pEventName)==-1)
      this._events.push(pEventName);

    this._listeners[pEventName] = pCallback;
  }

  trigger( pEventName:string, pArgs:any):void {
    if(this._events.indexOf(pEventName)>-1){
      this._listeners[pEventName](this,pArgs);
    }
  }

  /**
   * To get child process
   *
   * @method
   * @since 1.0.0
   */
  getProcess():any {
    return this._process;
  }
}
