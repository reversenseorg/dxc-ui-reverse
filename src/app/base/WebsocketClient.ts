import {EndpointMap} from "./DxcApiService";
import {w3cwebsocket as W3CWebSocket} from "websocket" ;
import {Subject} from "rxjs";
import {Nullable} from "./Nullable";


const ALPHA = 'abcdefghijklmnopqrstuvwxyz';
const ALPHANUM =  'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Represents a communication channel.
 *
 * Channels helps to isolate messages
 * transfered over the same socket.
 *
 * @class
 * @author Georges-Bastien MICHEL
 * @since 1.0.0
 */
export abstract class WebsocketChannel {

  localid:Nullable<string> = null;
  sessid:Nullable<string> = null;
  group:Nullable<string> = null;
  data:string = '';
  ready:boolean = false;

  in: Subject<any> = new Subject<any>();
  out: Subject<any> = new Subject<any>();
  err: Subject<any> = new Subject<any>();

  constructor(pConfig:any={}) {

    for(let i in pConfig)
      if(this.hasOwnProperty(i))
        this[i]=pConfig[i];

    this.out.subscribe( pObs => {
      this.onMessage(pObs);
    });

    this.err.subscribe( pObs => {
      this.onError(pObs);
    });
  }

  abstract onError(pEvent:any):void;
  abstract onMessage(pEvent:any):void;
  abstract onClose(pEvent:any):void;
  abstract processMessage(pEvent:any):void;

  /**
   *
   * @param pData
   */
  send( pData:any ){
    pData.data.sessid = this.sessid;
    this.sendRaw(pData);
  }

  sendRaw( pData:any ){
    pData.data.localid = this.localid;
    this.in.next(pData);
  }
}


interface ChannelIndex {
  [sessid:string] :WebsocketChannel;
}

/**
 * Multiplexed web socket client
 *
 * @class
 * @author Georges-Bastien MICHEL
 * @since 1.0.0
 */
export class WebsocketClient
{
  protected _client:any = null;
  protected _waiting:WebsocketChannel[] = [];
  protected _channels:ChannelIndex = {};

  protected _pingTimer:any = null;
  protected _ping:WebsocketChannel = null;

  _recv:Subject<any> = new Subject<any>();
  _err:Subject<any> = new Subject<any>();
  _close:Subject<any> = new Subject<any>();
  _send:Subject<any> = new Subject<any>();


  readonly endpoints: EndpointMap;
  readonly host: string;

  ready:boolean = false;

  constructor(pHost:string, pProtocol:string) {

    this.endpoints = null;
    this.host = pHost;
    this._client = new W3CWebSocket(pHost, pProtocol);

    // init socket listeners
    this._client.onerror = (vEvent:any) => {
      this._err.next({ event:vEvent, socket:this._client });
    };

    this._client.onopen = (vEvent:any) => {
      //this._open.next({ event:ev, socket:this._client });
      // init dispatch and set ready status to true
      this.initDispatch(this._client);
      // init ping/pong to keep socket up
      this.initPingPong(this._client);

    };

    this._client.onclose = (vEvent:any) => {

      //.log("Websocket ("+pHost+':'+pProtocol+') closed.');
      this._close.next({ event:vEvent, socket:this._client });
    };

    this._client.onmessage = (vEvent:any) => {

      if (typeof vEvent.data === 'string') {

        // seulement si pProtocol est 'term-protocol'
        // TODO : deplacer cette logique


        let msg:any = JSON.parse(vEvent.data);
        if(this._channels[msg.data.localid] != null){
          this._channels[msg.data.localid].processMessage(msg);
        }else{
          this._recv.next(vEvent.data);
        }

      }
    };

    this._send.subscribe( (pObs:any)=>{
      if(this.ready) {
        if(this._client.readyState === this._client.OPEN){
          this._client.send(JSON.stringify(pObs));
        }else{
          console.log('Websocket is close, reopen ..');
        }

      }else{
        console.log('Data cannot be send : connection is not ready !');
      }
    })
    // subscribe dispatcher

  }

  /**
   * To start ping<->pong with server to keep channel open
   *
   * Create an internal channel dedicated to ping/pong with server
   *
   * @param {number} pDelay Delay between two pings (seconds)
   */
  initPingPong( pWS:any, pDelay:number = 5000):void {
    console.log("websocketclient init ping pong");
    if(this._ping == null){
      this._ping = new class extends WebsocketChannel {
        onClose(pEvent: any): void {}
        onError(pEvent: any): void {}
        onMessage(pEvent: any): void {}
        processMessage(pMsg: any):void {}
      };

      this.registerChannel(this._ping);

      this._ping.send({ action:"_", svc:"_ping", data: {} });

      // todo : replace by worker
      this._pingTimer = setInterval( ()=>{;
        this._ping.send({ action:"_", svc:"_ping", data: {} });
      }, pDelay);
    }
  }

  initDispatch( pWS:any){
    console.log("websocketclient init dispatch",pWS.readyState,pWS.OPEN,pWS);
    if(pWS.readyState == pWS.OPEN){
      this.ready = true;
    }
  }

  static _randString(size:number, charset:string):string{
    let s:string ="";

    while(s.length <= size){
      s += charset[Math.round(Math.random() * (charset.length-1))];
    }
    return s;
  }

  generateLocalUUID(pPrefix:string=''){
    let luid:string = pPrefix;
    do {
      luid += WebsocketClient._randString(15, ALPHANUM);
    }while(this._channels[luid] != null);
    return luid;
  }

  /**
   * To register a new channel
   *
   * @param pChannel
   */
  registerChannel( pChannel:WebsocketChannel):void{
    console.log("RegisterChannel", pChannel);

    pChannel.in.subscribe( (pData:any)=> {
      this._send.next(pData);
    });

    if(pChannel.localid == null){
      pChannel.localid = this.generateLocalUUID('_');
    }

    this._channels[pChannel.localid] = pChannel;
  }
}
