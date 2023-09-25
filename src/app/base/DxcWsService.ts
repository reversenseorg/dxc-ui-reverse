import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Utils} from "../cmp/Utils";
import {Injectable} from "@angular/core";
import {w3cwebsocket as W3CWebSocket} from "websocket" ;
import {EndpointMap} from "./DxcApiService";
import {Nullable} from "./Nullable";


// @ts-ignore
/**
 * This class helps to send request to WS API
 *
 * @class
 * @since 1.0.0
 * @author Georges-Bastien MICHEL
 */
export class DxcWsService {

  public _client:W3CWebSocket;

  endpoints: EndpointMap;

  constructor(pEndpoints:EndpointMap) {
    this.endpoints = pEndpoints;
    this._client = new W3CWebSocket('ws://localhost:8001/', 'echo-protocol');

    this._client.onerror = function() {
      console.log('Connection Error');
    };

    this._client.onopen = ()=> {
      console.log('WebSocket Client Connected');

      // TODO : improve performand with $timeout
      /*function sendNumber() {
        if ( this._client.readyState ===  this._client.OPEN) {
          let n:number = Math.round(Math.random() * 0xFFFFFF);
          this._client.send(n.toString());
          setTimeout(sendNumber, 1000);
        }
      }*/

      const sendNumber = (()=>{
        const cli= this._client;
        if (cli.readyState ===  cli.OPEN) {
          let n:number = Math.round(Math.random() * 0xFFFFFF);
          cli.send(n.toString());
          setTimeout(sendNumber, 1000);
        }
      });


      sendNumber();
    };

    this._client.onclose = function() {
      console.log('echo-protocol Client Closed');
    };

    this._client.onmessage = function(e) {
      if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
      }
    };
  }
}
