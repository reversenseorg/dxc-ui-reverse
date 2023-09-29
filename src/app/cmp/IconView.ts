import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";

/**
 * Describe an icon
 * @class
 */
export class IconView {
  /**
   * Icon source such as 'fas','fab',...
   * TODO : add support for others source (not only Font Awesome)
   * @type string
   */
  type:Nullable<string> = null;

  /**
   * Icon name
   * @type string
   */
  name:Nullable<string> = null;

  /**
   * Icon primary color (class name)
   * @type string
   */
  color1:Nullable<string> = null;

  /**
   * Icon secondary color (class name)
   * @type string
   */
  color2:Nullable<string> = null;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }
}
