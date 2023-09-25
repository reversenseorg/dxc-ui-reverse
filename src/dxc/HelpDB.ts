
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
