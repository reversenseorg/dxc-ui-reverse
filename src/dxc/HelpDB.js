"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpDB = exports.HelpFormat = void 0;
var _fs_ = require("fs");
var _path_ = require("path");
var HelpFormat;
(function (HelpFormat) {
    HelpFormat["MARKDOWN"] = "md";
    HelpFormat["HTML"] = "html";
})(HelpFormat = exports.HelpFormat || (exports.HelpFormat = {}));
var HelpDB = /** @class */ (function () {
    function HelpDB(pRoot) {
        this._root = null;
        this._root = pRoot;
    }
    /**
     * To execute a command to help db
     *
     * @param pCommand
     * @param pData
     * @param pIpcEvent
     */
    HelpDB.prototype.exec = function (pCommand, pData, pIpcEvent) {
        if (pIpcEvent === void 0) { pIpcEvent = null; }
        switch (pCommand) {
            case 'get-doc':
                this.read(pData.id, function (vDoc) {
                    if (pIpcEvent != null) {
                        pIpcEvent.reply('help:get-doc', [JSON.stringify(vDoc)]);
                    }
                });
                break;
        }
    };
    /**
     *
     * @param pDocumentID
     * @param cb Callback
     */
    HelpDB.prototype.read = function (pDocumentID, cb) {
        if (cb === void 0) { cb = null; }
        var path = _path_.join(this._root, pDocumentID + '.' + HelpDB.FMT);
        if (!_fs_.existsSync(path)) {
            throw new Error("[HELP] Document '" + pDocumentID + "' not found.");
        }
        _fs_.readFile(path, { encoding: 'utf-8' }, function (err, data) {
            (cb)({
                id: pDocumentID,
                title: pDocumentID,
                doc: data
            });
        });
    };
    HelpDB.prototype.readSync = function (pDocumentID, cb) {
        if (cb === void 0) { cb = null; }
        var path = _path_.join(this._root, pDocumentID + '.' + HelpDB.FMT);
        if (!_fs_.existsSync(path)) {
            throw new Error("[HELP] Document '" + pDocumentID + "' not found.");
        }
        return {
            id: pDocumentID,
            title: pDocumentID,
            doc: _fs_.readFileSync(path).toString()
        };
    };
    HelpDB.FMT = HelpFormat.HTML;
    return HelpDB;
}());
exports.HelpDB = HelpDB;
//# sourceMappingURL=HelpDB.js.map