import {WebsocketClient} from "../WebsocketClient";
import {Nullable} from "../Nullable";


export enum WebsocketEventType  {
  CONN_READY,
  CONN_LOST,
  CHANNEL_READY,
  CHANNEL_LOST

}

/**
 * Represent an event related to websocket client status
 * Such events are trigged when a "major" event happens on websocket commumnication
 * or children channels.
 *
 *
 *
 * @class
 */
export class WebsocketEvent {
  /**
   * The event type
   * @type {WebsocketEventType}
   */
  type: WebsocketEventType;

  client: Nullable<WebsocketClient>;

  constructor(pType:WebsocketEventType) {
    this.type = pType;
    this.client = null;
  }

  /**
   * To create a new "connection ready" event
   * @param {}pCli
   */
  static newConnectionReady(pCli:WebsocketClient):WebsocketEvent {
    const o = new WebsocketEvent(WebsocketEventType.CONN_READY);
    o.setClient(pCli);
    return o;
  }

  /**
   * To set the websocket client instance of the event
   *
   * @param {WebsocketClient} pInstance The client instance related to this event
   * @method
   */
  setClient(pInstance:WebsocketClient):void {
    this.client = pInstance;
  }

  /**
   * To get the websocket client instance associated to event
   * May be null
   *
   * @return {WebsocketClient|null} The socket instance
   * @method
   */
  getClient():Nullable<WebsocketClient> {
    return this.client;
  }
}
