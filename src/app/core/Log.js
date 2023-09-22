"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__log = void 0;
var _fs_ = require("fs");
var _os_ = require("os");
var _path_ = require("path");
var electron_1 = require("electron");
var environment_1 = require("../../environments/environment");
var CONFIG = JSON.parse(_fs_.readFileSync(_path_.join((environment_1.environment.production ? electron_1.app.getAppPath() : _path_.join(__dirname, '..', '..', '..')), 'config', "dxc.config.json")).toString());
console.log(CONFIG);
/*
const LOG_FILE = (CONFIG.gui.log ?
    (environment.production ?
        _path_.join(app.getPath('logs'), 'client.log')
        : (CONFIG.gui.env.DXC_LOG_PATH!=null?
          CONFIG.gui.env.DXC_LOG_PATH : false)
    ):false
);*/
/*
 * Log file location depends of several factors :
 *  - is logging enabled into configuration file
 *  - is path specified into CONFIG.gui.env.DXC_LOG_PATH ?
 *  - is production mode ?  <apppath>/logs/client.log
 */
var LOG_FILE = (CONFIG.gui.log ?
    (CONFIG.gui.env.DXC_LOG_PATH != null ?
        CONFIG.gui.env.DXC_LOG_PATH
        : (environment_1.environment.production ?
            _path_.join(electron_1.app.getPath('logs'), 'client.log') : false)) : false);
if (process.env.DXC_TMP_LOG != null) {
    _fs_.writeFileSync(process.env.DXC_TMP_LOG, JSON.stringify({
        logfile: LOG_FILE
    }));
}
if (_fs_.existsSync(LOG_FILE) === false) {
    _fs_.writeFileSync(LOG_FILE, "--");
}
else {
    _fs_.appendFileSync(LOG_FILE, "Start logger" + _os_.EOL);
}
function __log(pMessage) {
    if (LOG_FILE)
        _fs_.appendFileSync(LOG_FILE, pMessage + _os_.EOL);
}
exports.__log = __log;
//# sourceMappingURL=Log.js.map