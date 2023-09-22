import {Injectable} from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer, webFrame} from 'electron';
import * as _remote_ from '@electron/remote';

import * as childProcess from 'child_process';
import * as fs from 'fs';
import {ClipBoard} from "./ClipBoard";
import {DxcSelection, DxcSelectionType, SelectionManager} from "./SelectionManager";

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  private _sm:SelectionManager;
  clipboard: ClipBoard ;
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof _remote_;
  childProcess: typeof childProcess;
  fs: typeof fs;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {

    this._sm = new SelectionManager();

    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      // If you wan to use remote object, pleanse set enableRemoteModule to true in main.ts
      this.remote = window.require('@electron/remote'); //_remote_; //window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }

    this.clipboard = new ClipBoard();
  }

  /**
   * To get the selection manager
   */
  getSelectionManager():SelectionManager {
    return this._sm;
  }

  /**
   * To pin a DxcSelection into clip board
   *
   * @param pData
   * @param pOptions
   */
  pinToClipboard( pData:DxcSelection, pOptions:any = null):void {

    // push to clip board history
    this.clipboard.push(pData);

    if(pData.type==DxcSelectionType.NODE){
      if(pData.short != null){
        this.writeToClipboard(pData.short, pOptions);
      }
    }else{
      this.writeToClipboard(pData.el, pOptions);
    }
  }


  /**
   *
   * @param pData
   * @param pOptions
   */
  writeToClipboard( pData:string, pOptions:any=null):void {
    console.log("writing [",pData,"] to clipboard");
    if(pOptions==null){
      this.remote.clipboard.writeText( pData);
    }else if(pOptions.hasOwnProperty('format')){
      switch(pOptions.format){
        case "html":
          this.remote.clipboard.writeHTML(pData);
          break;
        default:
          this.remote.clipboard.writeText(pData);
          break;
      }
    }
  }

  /**
   *
   * @param pData
   * @param pOptions
   */
  readFromClipboard( pOptions:any=null):string {
    if(pOptions==null){
      return this.remote.clipboard.readText();
    }else if(pOptions.hasOwnProperty('format')){
      switch(pOptions.format){
        case "html":
          return this.remote.clipboard.readHTML();
          break;
        default:
          return this.remote.clipboard.readText();
          break;
      }
    }

    return null;
  }

  setSelection( pSelection:any){

  }

}
