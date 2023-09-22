"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcDispatcher = exports.IpcDispatcherType = void 0;
var IpcMessage_1 = require("./IpcMessage");
var Log_1 = require("../app/core/Log");
var IpcDispatcherType;
(function (IpcDispatcherType) {
    IpcDispatcherType[IpcDispatcherType["NODE"] = 0] = "NODE";
    IpcDispatcherType[IpcDispatcherType["ELECTRON"] = 1] = "ELECTRON";
})(IpcDispatcherType = exports.IpcDispatcherType || (exports.IpcDispatcherType = {}));
/**
 *
 *
 * @class
 */
var IpcDispatcher = /** @class */ (function () {
    function IpcDispatcher() {
        this._type = IpcDispatcherType.NODE;
        this._process = null;
        // events:
        this._events = [];
        // event listener
        this._listeners = {};
        // IPC handler
        this._handlers = {};
        this._defaultHandler = null;
    }
    IpcDispatcher.prototype.setupDispatch = function (pProcess, pType) {
        var _this = this;
        if (pType === void 0) { pType = IpcDispatcherType.NODE; }
        var self = this;
        this._process = pProcess;
        this._type = pType;
        if (pType == IpcDispatcherType.NODE) {
            this._process.on('message', function (pMsg) {
                try {
                    self.dispatch(IpcMessage_1.IpcMessage.from(pMsg));
                }
                catch (err) {
                    Log_1.__log('[MAIN][DXC_SRV][ERROR] (dispatch) invalid IPC message caught : ' + JSON.stringify(pMsg));
                    Log_1.__log(err.message);
                }
            });
            this._process.on('disconnect', function (pMsg) {
                Log_1.__log('[MAIN][DXC_SRV][ERROR] (dispatch:disconnect) Process has exited ');
                _this.trigger('exit', null);
            });
            this._process.on('close', function (pMsg) {
                Log_1.__log('[MAIN][DXC_SRV][ERROR] (dispatch:close) Process has exited ');
                _this.trigger('exit', null);
            });
            this._process.on('exit', function (pMsg) {
                Log_1.__log('[MAIN][DXC_SRV][ERROR] (dispatch:exit) Process has exited ');
                _this.trigger('exit', null);
            });
        }
    };
    /**
     * To register an handler for an event issued by child process
     * @param pCommand
     * @param pHandler
     * @since 1.0.0
     */
    IpcDispatcher.prototype.register = function (pCommand, pHandler) {
        if (this._type === IpcDispatcherType.NODE) {
            this._handlers[pCommand] = pHandler;
        }
        else {
            this._process.on(pCommand, pHandler);
        }
    };
    /**
     * To register an handler for an event issued by child process
     *
     * @param {any} pHandlers
     * @since 1.0.0
     */
    IpcDispatcher.prototype.registerMultiple = function (pHandlers) {
        for (var i in pHandlers)
            this.register(i, pHandlers[i]);
    };
    /**
     * To register a "by default" handler
     *
     * @param pHandler
     */
    IpcDispatcher.prototype.registerDefault = function (pHandler) {
        this._defaultHandler = pHandler;
    };
    /**
     * To dispatch messages receipt from child process
     *
     * This method is called only if process is a classic NodejS process.
     * This method is NOT called if _process is Electron ipcMain
     *
     * @param pMessage
     * @method
     * @since 1.0.0
     */
    IpcDispatcher.prototype.dispatch = function (pMessage) {
        Log_1.__log('[MAIN][DXC_SRV] (dispatch) IPC message caught : ' + JSON.stringify(pMessage));
        if (this._handlers.hasOwnProperty(pMessage.getCommand())) {
            this._handlers[pMessage.getCommand()](pMessage);
        }
        else if (this._defaultHandler != null) {
            this._defaultHandler(pMessage);
        }
        else {
            Log_1.__log('[MAIN][DXC_SRV][ERROR] (dispatch) invalid IPC message caught : ' + JSON.stringify(pMessage));
        }
    };
    /**
     * To send a message to child process
     *
     * @param pMessage
     * @param pArg
     * @since 1.0.0
     */
    IpcDispatcher.prototype.send = function (pMessage, pArg) {
        if (pArg === void 0) { pArg = null; }
        if (this._type === IpcDispatcherType.NODE) {
            if (pArg != null)
                this._process.send(JSON.stringify(pMessage), pArg);
            else
                this._process.send(JSON.stringify(pMessage));
        }
        else {
        }
    };
    IpcDispatcher.prototype.on = function (pEventName, pCallback) {
        if (this._events.indexOf(pEventName) == -1)
            this._events.push(pEventName);
        this._listeners[pEventName] = pCallback;
    };
    IpcDispatcher.prototype.trigger = function (pEventName, pArgs) {
        if (this._events.indexOf(pEventName) > -1) {
            this._listeners[pEventName](this, pArgs);
        }
    };
    /**
     * To get child process
     *
     * @method
     * @since 1.0.0
     */
    IpcDispatcher.prototype.getProcess = function () {
        return this._process;
    };
    return IpcDispatcher;
}());
exports.IpcDispatcher = IpcDispatcher;
//# sourceMappingURL=IpcDispatcher.js.map