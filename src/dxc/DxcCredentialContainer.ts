
/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

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
