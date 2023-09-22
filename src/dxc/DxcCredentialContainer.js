"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DxcCredentialContainer = exports.AuthType = void 0;
var AuthType;
(function (AuthType) {
    AuthType["PASSWORD"] = "pwd";
    AuthType["TOKEN"] = "token";
    AuthType["API_KEY"] = "api_key";
    AuthType["CERT"] = "cert";
})(AuthType = exports.AuthType || (exports.AuthType = {}));
var DxcCredentialContainer = /** @class */ (function () {
    function DxcCredentialContainer(pType, pData) {
        this.type = AuthType.PASSWORD;
        this.raw = null;
        this.type = pType;
        this.raw = pData;
    }
    // later : uncipher container with a masterkey derived from license, checksum and computer
    DxcCredentialContainer.prototype.open = function (pMasterKey) {
        if (pMasterKey === void 0) { pMasterKey = null; }
        switch (this.type) {
            case AuthType.PASSWORD:
                this.raw = JSON.parse(this.raw);
                break;
        }
    };
    DxcCredentialContainer.prototype.save = function () {
        return Buffer.from(JSON.stringify({
            type: this.type,
            raw: this.raw
        })).toString('base64');
    };
    DxcCredentialContainer.prototype.getUsername = function () {
        if (this.type !== AuthType.PASSWORD) {
            throw new Error("Invalid auth type");
        }
        return this.raw.username;
    };
    DxcCredentialContainer.prototype.getPassword = function () {
        if (this.type !== AuthType.PASSWORD) {
            throw new Error("Invalid auth type");
        }
        return this.raw.password;
    };
    DxcCredentialContainer.prototype.toJsonObject = function () {
        return {
            type: this.type,
            raw: this.save()
        };
    };
    return DxcCredentialContainer;
}());
exports.DxcCredentialContainer = DxcCredentialContainer;
//# sourceMappingURL=DxcCredentialContainer.js.map