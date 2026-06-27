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
