import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {AppMenuService} from "../../../core/components/appmenu/appmenu.service";
import {DexcaliburServerService, ElectronService} from "../../../core/services";


export interface HelpDoc {
  id:string,
  title?:string,
  doc?:string
}

export interface HelpDocCache {
  [docID:string] :HelpDoc
}

export enum HelperType {
  VIEWER,
  TOOLTIP
}

export enum HelperBtnType {
  BTN,
  NAVBAR
}

export enum HelpDbProtocol {
  HTTP,
  IPC
}
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  BTN_BTN = HelperBtnType.BTN;
  BTN_NAV = HelperBtnType.NAVBAR;

  /**
   * A flag to hold the state of ipc handlers
   *
   * @private
   */
  private _ipcReady = false;

  /**
   * @deprecated
   * @private
   */
  private _ipc:any = null;

  private _protocol:HelpDbProtocol = HelpDbProtocol.IPC;

  private _cache:HelpDocCache = {};

  endpoints: any = {

  }



  onShowDoc$: Subject<HelpDoc> = new Subject();

  constructor( private appmenuSvc:AppMenuService,
               private eSvc:ElectronService,
               private http:HttpClient) {

    this.appmenuSvc.addMenu({
      id:'help',
      label: 'Help',
      enabled:true,
      submenu: [{
        label: 'About Dexcalibur',
      },{
        type: 'separator'
      },{
        label: 'Online documentation',
      }]
    },10);

    // get  ipcRenderer object only when the UI runs inside Electron
    if(this.eSvc.isElectron){
      this.setProtocol( HelpDbProtocol.IPC);
    }
  }

  private _initIpcHandler(){
    if(this._ipcReady) return;

// TODO : replace by help service
    /*this.eSvc.ipcRenderer.on('help:get-doc', ( pEvent:any, pArgs:any[])=>{
      console.log('[HELPER SERVICE] (help:get-doc) : ',pEvent,pArgs);

      const doc = JSON.parse(pArgs[0]);
      this._cache[doc.id] = {
        id: doc.id,
        title: doc.title,
        doc: doc.doc,
      };

      this.onShowDoc$.next(this._cache[doc.id]);
    });*/
  }


  /**
   * To switch protocol to communicate with help db
   *
   * @param {HelpDbProtocol} pProtocol
   * @method
   */
  setProtocol( pProtocol:HelpDbProtocol){
    this._protocol = pProtocol;
    if(this._protocol == HelpDbProtocol.IPC){
      //this._ipc = this.eSvc.ipcRenderer;
      this._initIpcHandler();
    }else{
      //this._ipc = null;
    }
  }



  addTime( pData:any, pType:string='GET', pSep:string = '&'){
    if(pType === 'GET'){
      return pData+pSep+'_t='+Date.now();
    }else{
      pData['_t'] = Date.now();
      return pData;
    }
  }

  /**
   * To load an help documentation with the given id
   *
   * Nothing is cached by this method
   *
   * @param pDocumentID
   * @return {HelpDoc}
   * @method
   */
  loadDoc(pDocumentID:string) {
    console.log(this.eSvc.isElectron);
    if(this.eSvc.isElectron){
      // load over IPC
      // this.eSvc.ipcRenderer.send('help',[{ cmd:'get-doc', data:{ id:pDocumentID }}]);
    }
    else{
      // TODO : load over HTTP
    }
  }

  /**
   *
   * @param pDocumentID
   */
  openDoc( pDocumentID:string, pType:HelperType = HelperType.VIEWER):void {

    console.log("[HELPER SERVICE] openDoc : "+pDocumentID);
    if(this._cache[pDocumentID] == null){
      this.loadDoc(pDocumentID);
    }else{
      this.onShowDoc$.next(this._cache[pDocumentID]);
    }
  }
}
