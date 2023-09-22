
export class ExternalTool {

  _uid:string;
  path:string;
  opts:any = {};

  _edited = false;
  _editing = false;


  /**
   *
   * @param pUID
   * @param pPath
   * @param pOptions
   */
  constructor( pUID:string, pPath:string, pOptions:any={}) {
    this._uid = pUID;
    this.path = pPath;
    this.opts = pOptions;
  }


  getUID():string {
    return this._uid;
  }

  getPath():string {
    return this.path;
  }

  getOptions(){
    return this.opts;
  }
}
