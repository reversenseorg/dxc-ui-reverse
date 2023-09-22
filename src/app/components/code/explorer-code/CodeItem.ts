



export class CodeItem
{

  _t:string = null;

  /**
   * Package name
   *
   * @type {String}
   * @field
   */
  name:string = null;


  sname:string = null;

  /**
   * Package metadata
   * @type {ModelMetadata}
   * @field
   */
  meta:any = null;

  /**
   * Package children
   * @type {Class[]|ModelPackage[]}
   * @field
   */
  children:any = null;

  /**
   * Tags
   * @type {String|Integer|Tag}
   * @field
   */
  tags:string[];

  size:number;

  absolute_size:number;

  focus?:any;
}
