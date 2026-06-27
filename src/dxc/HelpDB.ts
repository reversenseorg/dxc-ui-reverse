
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

import * as _fs_ from 'fs'
import * as _path_ from 'path'
import {Nullable} from "../app/base/Nullable";

export interface HelpDoc {
  id:string,
  title?:string,
  doc?:string
}

export enum HelpFormat {
  MARKDOWN = 'md',
  HTML = 'html'
}

export class HelpDB {


  static FMT:HelpFormat = HelpFormat.HTML;

  private _root;

  constructor( pRoot:string ) {
    this._root = pRoot;
  }

  /**
   * To execute a command to help db
   *
   * @param pCommand
   * @param pData
   * @param pIpcEvent
   */
  exec( pCommand:string, pData:any, pIpcEvent:any = null){
    switch (pCommand){
      case 'get-doc':
        this.read(pData.id, (vDoc:HelpDoc)=>{
          if(pIpcEvent!=null){

            // TODO : replace by help service to download help sheet
            pIpcEvent.reply('help:get-doc', [JSON.stringify(vDoc)]);
          }
        })
        break;
    }
  }

  /**
   *
   * @param pDocumentID
   * @param cb Callback
   */
  read(pDocumentID:string, cb:any = null){
    const path = _path_.join(this._root, pDocumentID+'.'+HelpDB.FMT);
    if(!_fs_.existsSync(path)){
      throw new Error("[HELP] Document '"+pDocumentID+"' not found.");
    }

    _fs_.readFile(path,{encoding:'utf-8'}, (err,data)=>{
      (cb)({
          id: pDocumentID,
          title: pDocumentID,
          doc: data
        })
    });

  }

  readSync(pDocumentID:string, cb:any = null):HelpDoc{
    const path = _path_.join(this._root, pDocumentID+'.'+HelpDB.FMT);
    if(!_fs_.existsSync(path)){
      throw new Error("[HELP] Document '"+pDocumentID+"' not found.");
    }

    return {
      id: pDocumentID,
      title: pDocumentID,
      doc: _fs_.readFileSync(path).toString()
    };

  }
}
