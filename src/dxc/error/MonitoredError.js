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
exports.MonitoredError = exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["GLOBAL"] = 1000] = "GLOBAL";
    ErrorCode[ErrorCode["CONN"] = 20000] = "CONN";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
var MonitoredError = /** @class */ (function (_super) {
    __extends(MonitoredError, _super);
    function MonitoredError(pCmp, pMsg, pCode, pExtra) {
        if (pCode === void 0) { pCode = null; }
        if (pExtra === void 0) { pExtra = null; }
        var _this = _super.call(this, pMsg) || this;
        _this.cmp = pCmp;
        _this.code = pCode;
        _this.extra = pExtra;
        return _this;
    }
    MonitoredError.prototype.getCode = function () {
        return this.code;
    };
    MonitoredError.prototype.getExtra = function () {
        return this.extra;
    };
    MonitoredError.prototype.toString = function () {
        return "[" + this.cmp + "] [#" + (this.code != null ? this.code : "<null>") + " " + this.message;
    };
    /**
     *
     * @param pIncludeExtra
     */
    MonitoredError.prototype.toObject = function (pIncludeExtra) {
        if (pIncludeExtra === void 0) { pIncludeExtra = false; }
        return {
            cmp: this.cmp,
            code: this.code,
            msg: this.message,
            extra: pIncludeExtra ? this.extra : null
        };
    };
    return MonitoredError;
}(Error));
exports.MonitoredError = MonitoredError;
//# sourceMappingURL=MonitoredError.js.map