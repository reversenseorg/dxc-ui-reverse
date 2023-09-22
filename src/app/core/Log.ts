import * as _fs_ from "fs";
import * as _os_ from "os";
import * as _path_ from "path";
import {app} from "electron";
import {environment} from "../../environments/environment";



const CONFIG = JSON.parse(_fs_.readFileSync(_path_.join(
  (environment.production ? app.getAppPath() : _path_.join(__dirname,'..','..','..')),'config',"dxc.config.json"
)).toString())

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
const LOG_FILE = (CONFIG.gui.log ?
    (CONFIG.gui.env.DXC_LOG_PATH!=null  ?
        CONFIG.gui.env.DXC_LOG_PATH
        : (environment.production ?
        _path_.join(app.getPath('logs'), 'client.log') : false)
    ):false
);

if(process.env.DXC_TMP_LOG != null){
  _fs_.writeFileSync(process.env.DXC_TMP_LOG,JSON.stringify({
    logfile:LOG_FILE
  }));
}

if(_fs_.existsSync(LOG_FILE)===false){
  _fs_.writeFileSync(LOG_FILE,"--");
}else{
  _fs_.appendFileSync(LOG_FILE, "Start logger"+_os_.EOL);
}


export function __log( pMessage:string):void{
  if(LOG_FILE)
    _fs_.appendFileSync(LOG_FILE, pMessage+_os_.EOL);
}
