"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _child_ = require("child_process");
var Log_1 = require("./Log");
var AppUtils = /** @class */ (function () {
    function AppUtils() {
    }
    AppUtils.stripAnsi = function (pText) {
        return (typeof pText === 'string' ? pText.replace(AppUtils.ANSI, '') : pText);
    };
    AppUtils.getDefaultShell = function () {
        var env = process.env;
        if (process.platform === 'darwin') {
            return env.SHELL || '/bin/bash';
        }
        if (process.platform === 'win32') {
            return env.COMSPEC || 'cmd.exe';
        }
        return env.SHELL || '/bin/sh';
    };
    AppUtils.getEnv = function (pEnv, shell) {
        if (shell === void 0) { shell = null; }
        if (process.platform === 'win32') {
            return process.env;
        }
        try {
            var getEnvSh = [shell || AppUtils.getDefaultShell(), '-ilc', 'env; exit'].join(" ");
            Log_1.__log("Start ( " + (shell || AppUtils.getDefaultShell()) + " , " + getEnvSh + " )");
            var stdout = _child_.execSync(getEnvSh, {
                shell: shell || AppUtils.getDefaultShell(),
                timeout: 200,
            }); //.stdout;
            Log_1.__log("Ok...");
            Log_1.__log(stdout.toString());
            var ret_1 = [];
            AppUtils.stripAnsi(stdout.toString()).split('\n').forEach(function (x) {
                var parts = x.split('=');
                ret_1[parts.shift()] = parts.join('=');
                //ret.push(parts.join(=));
            });
            return ret_1[pEnv];
        }
        catch (err) {
            Log_1.__log('Err :  ' + err.message);
            if (shell) {
                throw err;
            }
            else {
                return process.env;
            }
        }
    };
    AppUtils.updateEnvPATH = function () {
        if (process.platform !== 'darwin') {
            return;
        }
        process.env.PATH = AppUtils.getEnv('PATH') || [
            './node_modules/.bin',
            '/.nodebrew/current/bin',
            '/usr/local/bin',
            process.env.PATH
        ].join(':');
    };
    AppUtils.ANSI = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
    return AppUtils;
}());
exports.default = AppUtils;
//# sourceMappingURL=Utils.js.map