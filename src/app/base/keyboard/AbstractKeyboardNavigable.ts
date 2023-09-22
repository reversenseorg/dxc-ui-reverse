import {IKeyboardNavigable} from "./IKeyboardNavigable";

let NAV_COUNTER = 0;

export function nextCUID():number {
  return NAV_COUNTER++;
}

export abstract class AbstractKeyboardNavigable implements IKeyboardNavigable {

  protected _cuid:number;

  constructor( pCUID = -1) {
    if(pCUID>-1){
      this._cuid = pCUID;
    }else{
      this._cuid = nextCUID();
    }
  }

  getCUID():number  {
    return this._cuid;
  }


  abstract onKeyPress( pEvent:KeyboardEvent):void ;
}
