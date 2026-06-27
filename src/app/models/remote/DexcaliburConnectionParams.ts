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

import {Nullable} from "../../base/Nullable";


export enum DexcaliburConnectionType {
    LOCAL="local",
    REMOTE="remote"
}

export interface DexcaliburConnectionParamsList {
    [name:string] :DexcaliburConnectionParams
}

/**
 * Represents connection parameters required to establish
 * a connection with a remote Dexcalibur server
 *
 * @class
 * @author Georges-Bastien Michel <georges@reversense.com>
 * @since 1.0.0
 */
export class DexcaliburConnectionParams {

    type:DexcaliburConnectionType = DexcaliburConnectionType.REMOTE;

    protocol = "http";
    /**
     *
     */
    ipv4:Nullable<string> = null;
    ipv6:Nullable<string> = null;
    port:number = -1;
    hostname:Nullable<string> = null;

    /**
     * Name for this configuration
     *
     * @field
     * @type string
     */
    name:Nullable<string> = null;

    /**
     * UID
     *
     * @field
     * @type string
     */
    uid:Nullable<string> = null;

    /**
     * Preferred authentication type
     *
     * @field
     * @type AuthType
     */
    authType:any = null; // AuthType.PASSWORD;


    /**
     *
     * @param pUID
     * @param pName
     * @param pIP
     * @param pPort
     * @constructor
     */
    constructor( pUID:string, pName:string, pIP:string, pPort:number) {
        this.uid = pUID;
        this.name = pName;

        if(pIP != null){
          if(pIP.indexOf('.')>-1 && pIP.indexOf(':')==-1)
            this.ipv4 = pIP;
          else if(pIP.indexOf(':')==-1)
            this.ipv6 = pIP;
          else
            this.hostname = pIP;
        }


        this.port = pPort;
    }

    /**
     * To get configuration name
     */
    getName():Nullable<string> {
        return  this.name;
    }

    getUID():Nullable<string> {
        return this.uid;
    }


    getIpAddress():Nullable<string>{
        if(this.ipv4 != null){
            return this.ipv4
        }
        else if(this.ipv4 != null){
            return this.ipv4
        }
        else{
            return null; //throw DexcaliburConnectionException.IP_NOT_DEFINED();
        }
    }

    getHostname():Nullable<string> {
        if(this.hostname != null){
            return this.hostname;
        }
        else{
            return null; //throw DexcaliburConnectionException.HOSTNAME_NOT_DEFINED();
        }
    }


    getPort():number{
        if(this.port != null){
            return this.port;
        }
        else{
            return -1; //throw DexcaliburConnectionException.PORT_NOT_DEFINED();
        }
    }

    static fromPoorObject(pObj:any):DexcaliburConnectionParams {
        let o:DexcaliburConnectionParams = new DexcaliburConnectionParams(
            pObj.hasOwnProperty('uid')? pObj.uid : null,
            pObj.hasOwnProperty('name')? pObj.name : null,
            pObj.hasOwnProperty('ip')? pObj.ip : null,
            pObj.hasOwnProperty('port')? pObj.port : null,
        );

        o.hostname = pObj.hasOwnProperty('hostname')? pObj.hostname : null;
        o.authType = pObj.hasOwnProperty('authType')? pObj.authType : null;

        return o;
    }
}
