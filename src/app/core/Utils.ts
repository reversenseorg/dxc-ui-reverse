/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

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
