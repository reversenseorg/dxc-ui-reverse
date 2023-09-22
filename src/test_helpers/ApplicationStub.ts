import * as _path_ from "path";


export default class ApplicationStub {

  __b:string;

  constructor(pBasePath:string) {
    this.__b = pBasePath;
  }

  getPath( pType:string):string{
    return {
      'userData': _path_.join(this.__b,'..','spec','.res'),
      'temp': this.__b
    }[pType];
  }

  getAppPath( pType:string):string{
    return _path_.join(this.__b,'..','spec');
  }

  relaunch(){
    // skipped
  }

  exit(pCode:number):void{
    process.exit(0);
  }
}
