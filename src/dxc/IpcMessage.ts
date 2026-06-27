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

/**
 * Represents an IPC message
 *
 * @class
 * @since 1.0.0
 */
export class IpcMessage {
  cmd:string = '';
  data:any = {};

  constructor( pCmd:string, pData:any) {
    this.cmd = pCmd;
    this.data = pData;
  }

  /**
   * To create an IpcMessage instance from a raw object
   *
   * @param {any} pRaw A JS object
   * @return {IpcMessage}
   * @static
   * @since 1.0.0
   */
  static from(pRaw:any):IpcMessage {
    if(!pRaw.hasOwnProperty('cmd'))
      throw new Error('Invalid IPC command');

    return new IpcMessage(
      pRaw.cmd,
      (pRaw.hasOwnProperty('data')? pRaw.data : null)
    );
  }

  /**
   * To check if an object has a valid format
   *
   * The valid format has the following format. "data" field is mandatory even if it is empty.
   * ```
   * { cmd: <string>, data: <object> }
   * ```
   *
   * @param {any} pMsg
   */
  static is(pMsg:any):boolean {
    return (pMsg.hasOwnProperty('cmd') && pMsg.hasOwnProperty('data'));
  }

  /**
   * To get IPC command
   *
   * @return {string}
   */
  getCommand():string {
    return this.cmd;
  }

  /**
   * To get IPC data
   *
   * @return {any}
   *
   */
  getData():string {
    return this.data;
  }
}
