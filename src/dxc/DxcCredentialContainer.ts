
export enum AuthType {
  PASSWORD='pwd',
  TOKEN='token',
  API_KEY='api_key',
  CERT='cert',
}


export class DxcCredentialContainer {

  type:AuthType = AuthType.PASSWORD;

  raw:any = null;


  constructor(pType:AuthType, pData:any) {
    this.type = pType;
    this.raw = pData;
  }

  // later : uncipher container with a masterkey derived from license, checksum and computer
  open( pMasterKey:string|null = null):void {
    switch (this.type){
      case AuthType.PASSWORD:
        this.raw = JSON.parse(this.raw);
        break;
    }
  }

  save():string {
    return Buffer.from(JSON.stringify({
      type: this.type,
      raw: this.raw
    })).toString('base64');
  }

  getUsername():string {
    if(this.type !== AuthType.PASSWORD){
      throw new Error("Invalid auth type");
    }

    return this.raw.username;
  }


  getPassword():string {
    if(this.type !== AuthType.PASSWORD){
      throw new Error("Invalid auth type");
    }

    return this.raw.password;
  }

  toJsonObject():any {
    return {
      type: this.type,
      raw: this.save()
    };
  }
}
