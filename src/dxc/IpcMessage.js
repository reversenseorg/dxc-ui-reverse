"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcMessage = void 0;
/**
 * Represents an IPC message
 *
 * @class
 * @since 1.0.0
 */
var IpcMessage = /** @class */ (function () {
    function IpcMessage(pCmd, pData) {
        this.cmd = '';
        this.data = {};
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
    IpcMessage.from = function (pRaw) {
        if (!pRaw.hasOwnProperty('cmd'))
            throw new Error('Invalid IPC command');
        return new IpcMessage(pRaw.cmd, (pRaw.hasOwnProperty('data') ? pRaw.data : null));
    };
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
    IpcMessage.is = function (pMsg) {
        return (pMsg.hasOwnProperty('cmd') && pMsg.hasOwnProperty('data'));
    };
    /**
     * To get IPC command
     *
     * @return {string}
     */
    IpcMessage.prototype.getCommand = function () {
        return this.cmd;
    };
    /**
     * To get IPC data
     *
     * @return {any}
     *
     */
    IpcMessage.prototype.getData = function () {
        return this.data;
    };
    return IpcMessage;
}());
exports.IpcMessage = IpcMessage;
//# sourceMappingURL=IpcMessage.js.map