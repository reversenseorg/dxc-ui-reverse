
import * as assert from "assert";
import DexcaliburEngine from "../app/models/DexcaliburEngine";
import {Nullable} from "../app/base/Nullable";

export interface IpcMessage {
  cmd: string;
  data: any;
}

/**
 * Represents
 */
export class DexcaliburServerChildProcess {

  engine:any = null; // DexcaliburEngine
  process:any = null;

  constructor( pProcess:any) {
    this.process = pProcess;
    this.process.on('message', this.dispatch);
  }

  /*
  ----------------- IPC HANDLER --------------------
   */
  dispatch( pMessage:IpcMessage):void {

    switch(pMessage.cmd){
      case 'start':
        this.engine = (DexcaliburEngine as any).getInstance();
        break;
      case 'install':
        this.install(pMessage.data);
        break;
      case 'reinstall':
        this.reinstall(pMessage.data);
        break;
      default:
        console.log('[DXC][CHILD] Invalid IPC command :',pMessage);
        break;
    }
    console.log("got a message", pMessage);
  }

  send( pMessage:any):void {
    this.process.send(pMessage);
  }

  /*
  ---------------- DXC BOOTLOADER -------------
   */

  /**
   * To re-install dexcalibur.
   *
   * It starts by removing Dexcalibur configuration files and run install.
   *
   * @method
   * @since v1.0.0
   */
  reinstall(pOptions:any = {}):void {

    (DexcaliburEngine as any).clearInstall();

    this.install(pOptions,'reinstalled');
  }


  /**
   * To install dexcalibur.
   *
   * It creates workspace, generates settings, download plugins and more
   *
   * @method
   * @since v1.0.0
   */
  install(pOptions:any = {}, pCmd='installed'):void {
    assert.notEqual(this.engine, null);

    const port:number = (pOptions.port!=null) ? pOptions.port : 8000;

    this.engine.prepareInstall(
      port,
      ""
    );

    this.engine.start(
      port,
      pOptions.uipath!==undefined? pOptions.uipath : null
    );
  }

  /**
   * To start Dexcalibur server
   *
   */
  start(pOptions:any = {}):void {

    let ready=false;

    if((DexcaliburEngine as any).requireInstall()){
      this.process.send({ cmd:'started', data: { success:false, msg:'Dexcalibur is not installed'}});
      return;
    }

    let dxcWebRoot:Nullable<string> = null;

    this.engine.loadWorkspaceFromConfig();

    ready = this.engine.boot(
      pOptions.restore===true? true : false,
      dxcWebRoot
    );

    if(ready){
      this.engine.start((pOptions.port!=null) ? pOptions.port : 8000 );
      this.send( {cmd:'started', data: {success:true }});
      return ;
    }else{
      this.send( {cmd:'started', data: {success:false, msg:'Dexcalibur engine is not ready.' }});
      return ;
    }
  }

  /**
   * To get process ref
   */
  getProcess():any {
    return this.process;
  }
}
