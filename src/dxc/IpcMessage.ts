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
