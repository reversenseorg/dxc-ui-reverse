"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManagerException = void 0;
var MonitoredError_js_1 = require("./MonitoredError.js");
var ConnectionManagerException = /** @class */ (function (_super) {
    __extends(ConnectionManagerException, _super);
    function ConnectionManagerException(pMsg, pCode, pExtra) {
        if (pCode === void 0) { pCode = null; }
        if (pExtra === void 0) { pExtra = null; }
        return _super.call(this, 'CONNECTION MGR', pMsg, pCode, pExtra) || this;
    }
    ConnectionManagerException.CODE = {
        EMPTY_CONN_PARAMS: MonitoredError_js_1.ErrorCode.CONN + 301,
        EMPTY_CREDS: MonitoredError_js_1.ErrorCode.CONN + 302,
        AUTH_TYPE_UNSUPPORTED: MonitoredError_js_1.ErrorCode.CONN + 303,
        MISSING_CONN_FILE: MonitoredError_js_1.ErrorCode.CONN + 304,
        SAVE_FAILED_MISSING_PATH: MonitoredError_js_1.ErrorCode.CONN + 305
    };
    ConnectionManagerException.EMPTY_CONN_PARAMS = function () {
        return new ConnectionManagerException("The connection params are not provided.", MonitoredError_js_1.ErrorCode.CONN + 301);
    };
    ConnectionManagerException.EMPTY_CREDS = function () {
        return new ConnectionManagerException("The credentials are not provided", MonitoredError_js_1.ErrorCode.CONN + 302);
    };
    ConnectionManagerException.AUTH_TYPE_UNSUPPORTED = function () {
        return new ConnectionManagerException("This authentication type is not supported by remote server.", MonitoredError_js_1.ErrorCode.CONN + 303);
    };
    ConnectionManagerException.MISSING_CONN_FILE = function () {
        return new ConnectionManagerException("Missing connection profile file found.", MonitoredError_js_1.ErrorCode.CONN + 304);
    };
    ConnectionManagerException.SAVE_FAILED_MISSING_PATH = function () {
        return new ConnectionManagerException("Save failed, file path is missing.", MonitoredError_js_1.ErrorCode.CONN + 305);
    };
    return ConnectionManagerException;
}(MonitoredError_js_1.MonitoredError));
exports.ConnectionManagerException = ConnectionManagerException;
//# sourceMappingURL=ConnectionManagerException.js.map