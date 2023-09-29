import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


/**
 * Represent an application icon
 *
 * @class
 */
export class AppIcon {

  data:Nullable<Buffer> = null;

  localPath:string = "";
  appPath:string = "";

  /**
   * Icon Size
   */
  size:any = null;

  format:Nullable<string> = null;

  /**
   * @constructor
   * @param pConfig
   */
  constructor( pConfig:any = {}) {
    for(let i in pConfig)

        (this as IStringIndex<any>)[i] = pConfig[i];
  }

  toJsonObject(){
    //let o:any = new Object();
    //for(let i in this) o[i] = this[i];
    return this;
  }

}
