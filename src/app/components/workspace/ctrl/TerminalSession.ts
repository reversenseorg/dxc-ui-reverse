import {Subject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {WebsocketChannel} from "../../../base/WebsocketClient";
import {IconModel} from "../../../base/icon/IconModel";
import {XtermComponent} from "../../../base/xterm/xterm.component";
import {INFO_TYPE, InfoMessage} from "../../../cmp/InfoMessage";
import {Device} from "../../../models/Device";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";


export enum TerminalSessionType {
  SH='sh',
  DEV='dev',
  BASH='bash'
}

export interface TerminalInfo {
  type: TerminalSessionType;
  label: string;
  uid: string;
  icon?: Nullable<IconModel>;
  target?:any;
  priv?:boolean;
}



export class TerminalSession {

  uid:Nullable<string> = null;
  icon:Nullable<IconModel> = null;
  label:string = 'Terminal';
  active: boolean = false;
  exited:boolean = false;


  channel:Nullable<WebsocketChannel> = null;
  xterm:Nullable<XtermComponent> = null;
  _prompt:string = "$ ";

  // _stdout: Function = null;
  stdout: Subject<any> = new Subject<any>();
  stderr: Subject<any> = new Subject<any>();


  info: Subject<any> = new Subject<any>();

  /**
   * History cursor
   */
  _histCursor:number = 0;

  _hist:string[] = [''];

  _mirror:string[] = [];

  _out_buffer:string[] = [];
  _err_buffer:string[] = [];

  // WS client subscribes to this observable
  stdin: Subject<any> = new Subject<any>();

  constructor(pLabel:string, pIcon:IconModel, pUid:string) {
    this.label = pLabel;
    this.uid = pUid;
    this.icon = pIcon;

    this.xterm = null;


    const self = this;
    this.channel = new class extends WebsocketChannel {
      onClose(pEvent: any): void {
        self.stderr.next('Connection lost');
      }

      onError(pEvent: any): void {
        let s:string = "";

        console.log(pEvent);
        if(typeof pEvent=='string'){
          s = pEvent.toString().replace(/\n/g, "\r\n");
        }else if(pEvent.closed){
          s = pEvent.msg;
        }

        self._mirror.push('\r\n'+s);
        if(self.active)
          self.stderr.next(s);
      }

      onMessage(pEvent: any): void {

        let s:string = "";
        if(typeof pEvent=='string'){
          s = pEvent.toString().replace(/\n/g, "\r\n");
        }

        self._mirror.push('\r\n'+s);
        if(self.active)
          self.stdout.next(s);
      }

      processMessage(pMsg: any):void {

        switch(pMsg.action){
          case 'cmd':

            if(pMsg.data.hasOwnProperty('stdout')){}
              this.out.next(pMsg.data.stdout);

            if(pMsg.data.hasOwnProperty('stderr'))
              this.err.next(pMsg.data.stderr);

            break;

          case 'new':

            if(pMsg.data.hasOwnProperty('sessid')==false) {
              self.info.next( new InfoMessage({
                type: INFO_TYPE.WARNING,
                msg:'[TerminalSession] Invalid sessid on NEW message'
              }));
            }else{
              this.sessid = pMsg.data.sessid;
            }

            break;
          case 'ext':

            if(pMsg.data.hasOwnProperty('payload')==false) {
              self.info.next( new InfoMessage({
                type: INFO_TYPE.WARNING,
                msg:'[TerminalSession] Invalid payload on EXT message'
              }));
            }else{
              self.exited = true;
              this.err.next(pMsg.data.payload);
            }

            break;
          case 'err':

            if(pMsg.data.hasOwnProperty('stderr'))
              this.err.next(pMsg.data.stderr);
            else if(pMsg.data.hasOwnProperty('msg'))
              this.err.next(pMsg.data.msg);
            else{
              self.info.next( new InfoMessage({
                type: INFO_TYPE.WARNING,
                msg:'[TerminalSession] Unhandled message on ERR message'
              }));
            }

            break;
          default:

            self.info.next( new InfoMessage({
              type: INFO_TYPE.WARNING,
              msg:'[TerminalSession] Unhandled message '
            }));
            break;
        }

      }
    };

    this.channel.localid = this.uid;

    this.stdin.subscribe( (pObs:any) => {

      if(this.channel==null){
        throw UIException.WEBSOCKET_CHANNEL_IS_NOT_READY("TerminalSession","processMessage");
      }
      this.channel.send({ action:'cmd', svc:'xterm', data: { stdin: pObs }});
    });
  }

  getUID():string{
    if(this.channel==null){
      throw UIException.WEBSOCKET_CHANNEL_IS_NOT_READY("TerminalSession","getUID");
    }
    return this.channel.getSessID();
  }

  start( pType:string ='bash', pOpts:any = null){

    if(this.channel==null){
      throw UIException.WEBSOCKET_CHANNEL_IS_NOT_READY("TerminalSession","start");
    }
    this.channel.sendRaw({ action:'new', svc:'xterm', data: { type:pType, opts:pOpts }});
  }

  registerXterm( pXterm:XtermComponent):void{
    this.xterm = pXterm;
  }

  removeXterm():void{
    this.xterm = null;
  }

  writeIn(pIn:string):void{
    this._mirror.push(pIn);
    this._hist.push(pIn);
    // reset and increment history cursor position
    this._histCursor = this._hist.length;
    this.stdin.next(pIn);
  }

  writeOut(pOut:string):void{
    this._mirror.push(pOut);
  }

  exit():void{
    if(this.channel==null){
      throw UIException.WEBSOCKET_CHANNEL_IS_NOT_READY("TerminalSession","exit");
    }
    this.channel.send({ action:'exit', svc:'xterm', data: { }});
  }

  getPrompt():string {
    return this._prompt;
  }

  getBuffer():string{
    //return this._out_buffer.join("\r\n");
    return this._mirror.join('');
  }

  /**
   * To retrieve a command from history
   *
   * @param pOffset
   */
  readHistory(pPrevious:boolean):string {
    if(pPrevious){
      if(this._histCursor>0)
        return this._hist[--this._histCursor]
      else
        return this._hist[0];
    }else{
      if(this._histCursor< (this._hist.length-1))
        return this._hist[++this._histCursor]
      else
        return this._hist[this._hist.length-1];
    }
  }

  readCurrentHistory():string {
    return this._hist[this._histCursor];
  }
}
