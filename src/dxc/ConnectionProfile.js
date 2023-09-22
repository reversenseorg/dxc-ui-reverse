"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionProfile = exports.ConnectionType = void 0;
var DxcCredentialContainer_1 = require("./DxcCredentialContainer");
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["LOCAL"] = "local";
    ConnectionType["REMOTE"] = "remote";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
/**
 * Represents connection parameters required to establish
 * a connection with a remote Dexcalibur server
 *
 * @class
 * @author Georges-Bastien Michel <georges@reversense.com>
 * @since 1.0.0
 */
var ConnectionProfile = /** @class */ (function () {
    //session:string|null = null;
    /**
     *
     * @param pUID
     * @param pName
     * @param pIP
     * @param pPort
     * @constructor
     */
    function ConnectionProfile(pUID, pName, pIP, pPort) {
        this.type = ConnectionType.REMOTE;
        this.protocol = "http";
        /**
         *
         */
        this.ipv4 = null;
        this.ipv6 = null;
        this.port = null;
        this.hostname = null;
        this.ssl = false;
        /**
         * Name for this configuration
         *
         * @field
         * @type string
         */
        this.name = null;
        /**
         * UID
         *
         * @field
         * @type string
         */
        this.uid = null;
        this.rawIP = null;
        /**
         * Preferred authentication type
         *
         * @field
         * @type AuthType
         */
        this.authType = null; // AuthType.PASSWORD;
        this.credentials = null; // Credential Container
        this.uid = pUID;
        this.name = pName;
        this.rawIP = pIP;
        if (pIP != null) {
            if (pIP.indexOf('.') > -1 && pIP.indexOf(':') == -1)
                this.ipv4 = pIP;
            else if (pIP.indexOf(':') == -1)
                this.ipv6 = pIP;
            else
                this.hostname = pIP;
        }
        if (this.uid == "") {
            this.uid = this.name + ":" + pIP + ":" + pPort;
        }
        if (typeof pPort === "string") {
            this.port = parseInt(pPort, 10);
        }
        else {
            this.port = pPort;
        }
    }
    ConnectionProfile.prototype.generateUID = function () {
        this.uid = this.name + ':' + this.rawIP + ':' + this.port;
    };
    /**
     * To get configuration name
     */
    ConnectionProfile.prototype.getName = function () {
        return this.name;
    };
    ConnectionProfile.prototype.getUID = function () {
        return this.uid;
    };
    ConnectionProfile.prototype.getIpAddress = function () {
        if (this.ipv4 != null) {
            return this.ipv4;
        }
        else if (this.ipv4 != null) {
            return this.ipv4;
        }
        else {
            return null; //throw DexcaliburConnectionException.IP_NOT_DEFINED();
        }
    };
    ConnectionProfile.prototype.getHostname = function () {
        if (this.hostname != null) {
            return this.hostname;
        }
        else {
            return null; //throw DexcaliburConnectionException.HOSTNAME_NOT_DEFINED();
        }
    };
    ConnectionProfile.prototype.getPort = function () {
        if (this.port != null) {
            return this.port;
        }
        else {
            return null; //throw DexcaliburConnectionException.PORT_NOT_DEFINED();
        }
    };
    ConnectionProfile.fromPoorObject = function (pObj) {
        var o = new ConnectionProfile(pObj.hasOwnProperty('uid') ? pObj.uid : null, pObj.hasOwnProperty('name') ? pObj.name : null, pObj.hasOwnProperty('ip') ? pObj.ip : null, pObj.hasOwnProperty('port') ? pObj.port : null);
        o.hostname = pObj.hasOwnProperty('hostname') ? pObj.hostname : null;
        o.authType = pObj.hasOwnProperty('authType') ? pObj.authType : null;
        o.protocol = pObj.hasOwnProperty('protocol') ? pObj.protocol : "https";
        if (pObj.hasOwnProperty('ssl')) {
            o.ssl = pObj.ssl;
            o.protocol = (pObj.ssl == true) ? "https" : "http";
        }
        if (pObj.hasOwnProperty('credentials')) {
            o.credentials = new DxcCredentialContainer_1.DxcCredentialContainer(pObj.credentials.type, pObj.credentials.raw);
        }
        return o;
    };
    ConnectionProfile.prototype.toJsonObject = function (pPrivate) {
        if (pPrivate === void 0) { pPrivate = false; }
        var o = {
            uid: this.uid,
            name: this.name,
            port: this.port,
        };
        if (this.ipv4 != null)
            o.ip = this.ipv4;
        if (this.ipv6 != null)
            o.ip = this.ipv6;
        if (this.hostname != null)
            o.hostname = this.hostname;
        if (this.authType != null)
            o.authType = this.authType;
        if (this.ssl != null)
            o.ssl = this.ssl;
        if (this.pdefault != null)
            o.pdefault = this.pdefault;
        if (pPrivate === true) {
            if (this.credentials != null) {
                o.credentials = this.credentials.toJsonObject();
            }
        }
        return o;
    };
    ConnectionProfile.prototype.asUriSearchParam = function () {
        return Buffer.from(JSON.stringify(this.toJsonObject())).toString('base64');
    };
    return ConnectionProfile;
}());
exports.ConnectionProfile = ConnectionProfile;
//# sourceMappingURL=ConnectionProfile.js.map