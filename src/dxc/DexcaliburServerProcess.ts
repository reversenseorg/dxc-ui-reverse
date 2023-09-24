import {ChildProcessWithoutNullStreams, fork, spawn} from 'child_process';
import * as _path_ from 'path';
import * as _fs_ from 'fs';
import {IpcMessage} from "./IpcMessage";
import {__log} from "../app/core/Log";
import {IpcDispatcher} from "./IpcDispatcher";


import {app} from 'electron';



/**
 * Represents a reference to Dexcalibur Engine child process
 *
 * This class helps to spawn and to
 * communicate with a Dexcalibur Engine process
 *
 * @class
 * @since 1.0.0
 */
export class DexcaliburServerProcess extends IpcDispatcher {

  handlers: any = {};
  options: any = {};

  private _cache: any = {
    ready: false
  };

  private _ready: boolean = false;

  child: ChildProcessWithoutNullStreams = null;

  constructor( pRuntimeConfig:string[], pOptions:any={}) {
    super();

    this.options = pOptions;

    // To create a Dexcalibur instance, server must be executed by Electron interpreter
    if(this.options.embedded){

      let env: any =  this.options.env;

      if(this.options.log){
        env.DXC_LOG_PATH =  _path_.join(app.getPath('logs'), 'server.log');
      }

      __log( _path_.join(process.resourcesPath,'dexcalibur-server', 'dexcalibur.js') );
      __log( pRuntimeConfig.join(" ") );
      __log( JSON.stringify(env) );

      env.ELECTRON_RUN_AS_NODE = 1;
      env.DISPLAY = process.env['DISPLAY'];
      env.PATH = process.env['PATH'];

      // Fork main process to simulate spawn (ELECTRON_RUN_AS_NODE)
      let ferr:number=-1, fout:number=-1;
      try{
         ferr = _fs_.openSync( _path_.join(app.getPath('logs'), 'fork_err.log'),'w+');
         fout = _fs_.openSync( _path_.join(app.getPath('logs'), 'fork_out.log'),'w+');
        this.child = fork( _path_.join(process.resourcesPath,'dexcalibur-server', 'dexcalibur.js') , pRuntimeConfig,
          {
            stdio: ['pipe',ferr,fout,'ipc'], //ferr,fout,'ipc'], // 'pipe','pipe'
            env: env
          });

      }catch(err){
        __log("[MAIN][DXC] Fork error :"+err.message);
      }finally {
        _fs_.closeSync(ferr);
        _fs_.closeSync(fout);
      }

    }else{
      this.child = spawn(  process.execPath, [_path_.join(__dirname, '..', '..', 'node_modules', 'dexcalibur-ts', 'dexcalibur.js')].concat(pRuntimeConfig),
        {
          stdio: ['pipe','pipe','pipe','ipc'],
          env: (this.options!=null && this.options.env!=null ? this.options.env : {} )
        });
    }


    this.setupDispatch(this.child);
    this.init();
  }


  /**
   *
   * @param pRuntimeConfig
   */
  restart(pRuntimeConfig:string[]):void{
    /*this.child = spawn(  process.execPath, [_path_.join(__dirname, '..', '..', 'node_modules', 'dexcalibur-ts', 'dexcalibur-ts', 'dexcalibur.js')].concat(pRuntimeConfig),
      {
        stdio: ['pipe','pipe','pipe','ipc']
      });*/

    if(this.options.embedded){

      this.child = fork( _path_.join(__dirname, 'extraResources' , 'dexcalibur-server', 'dexcalibur-ts', 'dexcalibur.js'), pRuntimeConfig,
        {
          stdio: ['pipe','pipe','pipe','ipc'],
          env: (this.options!=null && this.options.env!=null ? this.options.env : {} )
        });

    }else{

      __log('[MAIN][DXC-HANDLER] (start) : '+process.execPath);
      this.child = spawn(  process.execPath, [_path_.join(__dirname, '..', '..', 'node_modules', 'dexcalibur-ts', 'dexcalibur-ts', 'dexcalibur.js')].concat(pRuntimeConfig),
        {
          stdio: ['pipe','pipe','pipe','ipc'],
          env: (this.options!=null && this.options.env!=null ? this.options.env : {} )
        });
    }

    this.setupDispatch(this.child);
    this.init();
  }

  init():void {

    // prevent context issues
    let self:DexcaliburServerProcess = this;

    // register handlers for IPC sent from dexcalibur child process
    this.registerMultiple( {

      // once child process is started, dexcalibur can start
      'initialized': (pMsg)=> {
        __log('[MAIN][DXC-HANDLER] (initialized) : '+JSON.stringify(pMsg));

        /*self.start({
          port: 8000,
          ws: 8001,
          restore: false
        });*/

        self.start(this.options.options);
      },

      // trigged when dexcalibur has starte, its triggers
      'started': (pMsg)=> {

        if(pMsg != null) __log('[MAIN][DXC-HANDLER] (started) : '+JSON.stringify(pMsg));

        if(pMsg.data.success){
          this._cache.ready = true;
        }

        pMsg.cmd = 'dxc-status';
        self.trigger('ui-forward', pMsg);
      },
    });

    // By default, IPC message are forwarded as 'ui-forward' event
    this.registerDefault((pMsg)=> {
      self.trigger('ui-forward', pMsg);
    })


    /*

     When a Renderer processes send 'dxc' event top Main process,
     DexcaliburServerProcess instance catches message.
     In some conditions, it forwards it to Dexcalibur process else it performs action locally.

     */

    // register listeners for events trigged by main process

    // dxc-status : read status from cache
    this.on('dxc-status', (pCtx: any, pCmd:string, pOpts:any)=>{
      self.trigger('ui-forward', { cmd:'dxc-status', data:{ success: self.isReady() }});
    });

    // ask if the given project is ready or not
    this.on('dxc-project-ready', (pCtx: any, pCmd:string, pOpts:any)=>{
      self.send({ cmd:'project-ready', data: pOpts });
    });
  }




  isReady():boolean {
    return this._cache.ready;
  }



  /**
   * To start server
   *
   * @param pOpts
   */
  start( pOpts:any={}):any {
    this.send({ cmd:'start', data:pOpts });
  }

  /**
   * To launch install procedure
   * @param pOpts
   */
  install( pOpts:any={}):any {
    this.send({ cmd:'install', data:pOpts });
  }

  /**
   * To reinstall server
   *
   * @param {any} pOpts
   */
  reinstall( pOpts: any = {}): any {
    this.send({ cmd: 'reinstall', data: pOpts });
  }

  /**
   * To kill child process
   *
   * @param {string} pSignal Signal type
   * @method
   */
  kill( pSignal: NodeJS.Signals = 'SIGKILL'): void{
      if ( this.child != null ){
        this.child.kill(pSignal);
      }
  }
}
