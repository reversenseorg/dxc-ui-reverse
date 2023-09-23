import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";

export enum FileLocation {
  LOCAL,
  REMOTE
}

export class File {
  type:FileLocation = FileLocation.LOCAL;
  path:Nullable<string>  = null;
  name:Nullable<string> = null;
  ext:Nullable<string> = null;
  ctn:any = null;
  fmt:string[] = [];

  constructor( pConfig:any = {}) {
    for(let p in pConfig)
      (this as IStringIndex<any>)[p] = pConfig[p];
  }

  isLocal():boolean {
    return this.type === FileLocation.LOCAL;
  }
}
