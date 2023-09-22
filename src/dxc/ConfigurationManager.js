"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationManager = void 0;
var _fs_ = require("fs");
var _path_ = require("path");
var _os_ = require("os");
var const_1 = require("./const");
var ConnectionManager_1 = require("./ConnectionManager");
/**
 * To load configuration files required by clientto configure it and
 * to initialize communication with remote server
 *
 * @class
 */
var ConfigurationManager = /** @class */ (function () {
    /**
     *
     *
     * @param pUserData
     */
    function ConfigurationManager(pUserData) {
        this.clientPath = null;
        this.localServerPath = null;
        this._server = null;
        this._client = null;
        this._connMgr = null;
        this._userData = "";
        this._userData = pUserData;
        // load client config
        //this.clientPath = _path_.join(__dirname, 'config',(process.env.DXC_DEVMODE==="1" ? "dxc.dev.json" : "dxc.prod.json"));
        this.clientPath = _path_.join(this._userData, (process.env.DXC_DEVMODE === "1" ? "dxc.dev.json" : "dxc.prod.json"));
        if (_fs_.existsSync(this.clientPath)) {
            this._client = JSON.parse(_fs_.readFileSync(this.clientPath).toString());
        }
        // try to load local server config
        if (process.env.DXC_HOME != null && process.env.DXC_HOME.length > 0) {
            this.localServerPath = _path_.join(process.env.DXC_HOME, const_1.DEFAULT_DXC_CONFIG_FILE);
        }
        else {
            this.localServerPath = _path_.join(_os_.homedir(), const_1.DEFAULT_DXC_FOLDER, const_1.DEFAULT_DXC_CONFIG_FILE);
        }
        if (_fs_.existsSync(this.localServerPath)) {
            this._server = JSON.parse(_fs_.readFileSync(this.localServerPath).toString());
        }
    }
    /**
     * To get the connection manager responsible to
     * manage connection data ( remote server, credentials, ...)
     *
     * Data of connection manager are stored inside : $home/.dexcalibur/conns.json
     *
     * @return ConnectionManager
     * @method
     */
    ConfigurationManager.prototype.getConnectionMgr = function () {
        if (this._connMgr == null) {
            // load client connections file
            var conn = _path_.join(this._userData, const_1.DEFAULT_DXC_CONN_FILE);
            console.log(conn);
            this._connMgr = new ConnectionManager_1.ConnectionManager(conn);
        }
        return this._connMgr;
    };
    /**
     * To get local Dexcalibur's server configuration (port, ipc, ...)
     *
     * @method
     */
    ConfigurationManager.prototype.getLocalServerConfig = function () {
        return this._server;
    };
    /**
     * To get local Dexcalibur's client configuration (devmode, ...)
     *
     * @method
     */
    ConfigurationManager.prototype.getClientConfig = function () {
        return this._client;
    };
    return ConfigurationManager;
}());
exports.ConfigurationManager = ConfigurationManager;
//# sourceMappingURL=ConfigurationManager.js.map