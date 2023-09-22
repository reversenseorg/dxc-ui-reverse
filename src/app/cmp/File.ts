
export enum FileLocation {
  LOCAL,
  REMOTE
}

export class File {
  type:FileLocation = FileLocation.LOCAL;
  path:string = null;
  name:string = null;
  ext:string = null;
  ctn:any = null;
  fmt:string[] = [];

  constructor( pConfig:any = {}) {
    for(let p in pConfig)
      this[p] = pConfig[p];
  }

  isLocal():boolean {
    return this.type === FileLocation.LOCAL;
  }
}
