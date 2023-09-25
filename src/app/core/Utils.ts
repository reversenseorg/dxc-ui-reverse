import * as _child_ from "child_process"
import {__log} from "./Log";
import {IStringIndex} from "../base/IStringIndex";


export default class AppUtils {

  static ANSI = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;

  static stripAnsi( pText:string):string  {
    return (typeof pText === 'string' ? pText.replace(AppUtils.ANSI, '') : pText);
  }

  static getDefaultShell():string{
    const env = process.env;

    if (process.platform === 'darwin') {
      return env['SHELL'] || '/bin/bash';
    }

    if (process.platform === 'win32') {
      return env['COMSPEC'] || 'cmd.exe';
    }

    return env['SHELL'] || '/bin/sh';
  }

  static getEnv(pEnv:string, shell:any=null):any{
    if (process.platform === 'win32') {
      return process.env;
    }

    try {
      const getEnvSh = [ shell || AppUtils.getDefaultShell(), '-ilc', 'env; exit'].join(" ");
      __log(`Start ( ${shell || AppUtils.getDefaultShell()} , ${getEnvSh} )`);
      const stdout = _child_.execSync( getEnvSh, {
        shell: shell || AppUtils.getDefaultShell(),
        timeout: 200,
      }); //.stdout;

      __log(`Ok...`);
      __log(stdout.toString());
      const ret:IStringIndex<string> = {};

      AppUtils.stripAnsi(stdout.toString()).split('\n').forEach(x => {
        const parts = x.split('=');
        const i = parts.shift();
        if(i!=null) ret[i] = parts.join('=');
      });

      return ret[pEnv];
    } catch (err:any) {
      __log('Err :  '+err.message);
      if (shell) {
        throw err;
      } else {
        return process.env;
      }
    }
  }

  static updateEnvPATH(){
    if (process.platform !== 'darwin') {
      return;
    }

    process.env['PATH'] = AppUtils.getEnv('PATH') || [
      './node_modules/.bin',
      '/.nodebrew/current/bin',
      '/usr/local/bin',
      process.env['PATH']
    ].join(':');
  }
}
