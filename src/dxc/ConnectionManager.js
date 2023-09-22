"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManager = void 0;
var _fs_ = require("fs");
var ConnectionProfile_1 = require("./ConnectionProfile");
var ConnectionManagerException_1 = require("./error/ConnectionManagerException");
var electron_1 = require("electron");
var DxcCredentialContainer_1 = require("./DxcCredentialContainer");
/**
 * The class to manage, edit, save connection settings and credentials
 * to connect to a remote server
 *
 * @class
 */
var ConnectionManager = /** @class */ (function () {
    /**
     *
     * @param {string} pPath The path of conneection file
     * @constructor
     */
    function ConnectionManager(pPath) {
        /**
         * List of connection profiles
         * @type {ConnectionProfileList}
         * @public
         */
        this.profiles = {};
        this.defaultName = null;
        this.active = "none";
        this._onConnReady = (function (profile) { return null; });
        try {
            this.load(pPath);
        }
        catch (err) {
            if (err.code == ConnectionManagerException_1.ConnectionManagerException.CODE.MISSING_CONN_FILE) {
                // create file with empty structure
                this.save(pPath);
                // reload
                this.load(pPath);
            }
        }
        this.registerIpcHandler();
    }
    /**
     * To load connection profiles from file
     *
     * @param pPath
     */
    ConnectionManager.prototype.load = function (pPath) {
        if (!_fs_.existsSync(pPath)) {
            throw ConnectionManagerException_1.ConnectionManagerException.MISSING_CONN_FILE();
        }
        this.path = pPath;
        var data = JSON.parse(_fs_.readFileSync(pPath, { encoding: 'utf8' }).toString());
        if (data.defaults != null) {
            this.defaultName = data.defaults;
        }
        for (var prof in data.profiles) {
            this.profiles[prof] = ConnectionProfile_1.ConnectionProfile.fromPoorObject(data.profiles[prof]);
            if (prof === this.defaultName) {
                this.profiles[prof].pdefault = true;
            }
        }
        return true;
    };
    /**
     *
     * @param pType
     */
    ConnectionManager.prototype.getProfilesFor = function (pType) {
        var prfs = [];
        for (var name_1 in this.profiles) {
            if (this.profiles[name_1].type == pType) {
                prfs.push(this.profiles[name_1]);
            }
        }
        return prfs;
    };
    ConnectionManager.prototype.getDefaultProfile = function () {
        if (this.defaultName == null)
            return null;
        if (this.defaultName) {
            return this.profiles[this.defaultName];
        }
        else {
            return null;
        }
    };
    ConnectionManager.prototype.save = function (pPath) {
        if (pPath === void 0) { pPath = null; }
        var path = (pPath != null ? pPath : this.path);
        if (path == null) {
            throw ConnectionManagerException_1.ConnectionManagerException.SAVE_FAILED_MISSING_PATH();
        }
        var o = {
            defaults: this.defaultName,
            profiles: {}
        };
        for (var i in this.profiles) {
            o.profiles[i] = this.profiles[i].toJsonObject(true);
        }
        _fs_.writeFileSync(path, JSON.stringify(o));
    };
    ConnectionManager.prototype.registerIpcHandler = function () {
        var _this = this;
        // register handlers
        electron_1.ipcMain.on('conn-profile-list', function (pEvent, pArgs) { _this.handlerProfileList(pEvent, pArgs); });
        electron_1.ipcMain.on('conn-profile-save', function (pEvent, pArgs) { _this.handlerProfileSave(pEvent, pArgs); });
        //ipcMain.on('conn-profile-read', (pEvent,pArgs)=>{ v.handlerProfileRead(pEvent,pArgs);  });
        electron_1.ipcMain.on('conn-auth-do', function (pEvent, pArgs) { _this.handlerAuthPerform(pEvent, pArgs); });
        electron_1.ipcMain.on('finish-btn', function (pEvent, pArgs) { _this.handlerStart(pEvent, pArgs); });
        electron_1.ipcMain.on('quit-btn', function (pEvent, pArgs) { _this.handlerReset(pEvent, pArgs); });
    };
    ConnectionManager.prototype.handlerProfileList = function (pEvent, pArgs) {
        var o = {
            defaults: this.defaultName,
            profiles: {}
        };
        for (var i in this.profiles) {
            o.profiles[i] = this.profiles[i].toJsonObject();
        }
        pEvent.reply('conn-resp-profile-list', [JSON.stringify(o)]);
    };
    ConnectionManager.prototype.handlerProfileSave = function (pEvent, pArgs) {
        try {
            console.log("profile => " + pArgs);
            var args = JSON.parse(pArgs);
            var profile = {};
            this.active = args.pname;
            profile.port = args.port;
            profile.name = args.pname;
            profile.ip = args.host;
            profile.port = args.port;
            profile.ssl = args.ssl;
            profile.protocol = (args.ssl == true) ? "https" : "http";
            // auth
            switch (args.authType) {
                case DxcCredentialContainer_1.AuthType.PASSWORD:
                    if (!args.hasOwnProperty("credentials")) {
                        profile.credentials = new DxcCredentialContainer_1.DxcCredentialContainer(DxcCredentialContainer_1.AuthType.PASSWORD, {
                            username: args.auth_user,
                            password: args.auth_pwd,
                        });
                    }
                    break;
                default:
                    break;
            }
            var conn = ConnectionProfile_1.ConnectionProfile.fromPoorObject(profile);
            if (conn.uid == null) {
                conn.generateUID();
            }
            this.profiles[conn.getName()] = conn;
            if (args.pdefault === true) {
                this.defaultName = conn.getName();
            }
            this.save();
            pEvent.reply('conn-resp-profile-save', [JSON.stringify({ success: true })]);
        }
        catch (err) {
            pEvent.reply('conn-resp-profile-save', [JSON.stringify({ success: false, error: err.message })]);
        }
    };
    ConnectionManager.prototype.handlerProfileRead = function (pEvent, pArgs) {
        var args = JSON.parse(pArgs);
        pEvent.reply('conn-resp-profile-read', [JSON.stringify({ success: true })]);
    };
    ConnectionManager.prototype.handlerAuthPerform = function (pEvent, pArgs) {
        var args = JSON.parse(pArgs);
        console.log(pArgs);
        console.log(JSON.stringify(this.profiles));
        var profile = this.profiles[args.pname];
        switch (profile.authType) {
            case DxcCredentialContainer_1.AuthType.PASSWORD:
                break;
            default:
                break;
        }
        pEvent.reply('conn-resp-auth-do', [JSON.stringify({ success: true })]);
    };
    ConnectionManager.prototype.handlerReset = function (pEvent, pArgs) {
        // restart
        electron_1.app.exit(0);
    };
    ConnectionManager.prototype.handlerStart = function (pEvent, pArgs) {
        var args = JSON.parse(pArgs);
        var profile = this.profiles[args.pname];
        console.log(pArgs);
        console.log(profile);
        console.log(this._onConnReady);
        if (this._onConnReady != null) {
            (this._onConnReady)(profile); //.bind(this,profile);
            this._onConnReady.bind(this, profile);
        }
    };
    ConnectionManager.prototype._doPasswordAuth = function () {
        return null;
    };
    /**
     * To set a listener on connection ready
     *
     * @param pFunc
     */
    ConnectionManager.prototype.onConnectionReady = function (pFunc) {
        this._onConnReady = pFunc;
    };
    ConnectionManager.prototype.startConnection = function () {
        if (this._onConnReady != null) {
            this._onConnReady.bind(this, this.profiles[this.active]);
        }
    };
    return ConnectionManager;
}());
exports.ConnectionManager = ConnectionManager;
//# sourceMappingURL=ConnectionManager.js.map