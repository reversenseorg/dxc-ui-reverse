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
  type:string = null;

  /**
   * Icon name
   * @type string
   */
  name:string = null;

  /**
   * Icon primary color (class name)
   * @type string
   */
  color1:string = null;

  /**
   * Icon secondary color (class name)
   * @type string
   */
  color2:string = null;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) this[i] = pConfig[i];
    }
  }
}
