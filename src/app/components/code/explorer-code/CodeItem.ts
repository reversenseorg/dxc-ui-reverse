import {Nullable} from "../../../base/Nullable";


export class CodeItem
{

  _t:Nullable<string> = null;

  /**
   * Package name
   *
   * @type {String}
   * @field
   */
  name:Nullable<string> = null;


  sname:Nullable<string> = null;

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
