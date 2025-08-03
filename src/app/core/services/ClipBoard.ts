import {DxcSelection} from "./SelectionManager";
import {Nullable} from "../../base/Nullable";

export class ClipBoard {
  
  clips: DxcSelection [] = [];

  /**
   * To get all elements clipped
   */
  getAllElement():DxcSelection[] {
    return this.clips;
  }

  push( pData:any):void {
    this.clips.push(pData);
  }

  /**
   * To get last copied element in order to perform a rich copy/paste inside Dexcalibur
   */
  last():DxcSelection {
    if(this.clips.length==0){
      throw new Error("ClipBoard is empty");
    }

    return this.clips[this.clips.length-1];
  }

  /**
   * To get clipped value from external
   */
  lastExternal():Nullable<string> {
    const v = this.last();
    if( (v !== null) && (typeof (v) == "object")) {
      return v.el;
    }else{
      return null;
    }
  }

  /**
   * To flush the clipboard
   */
  flush():void {
    this.clips = [];
  }

}
