
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

import {NodeInternalType} from "../../NodeInternalType";
import {Nullable} from "../../../base/Nullable";



export interface SecretMapping {
    name: string;
    secret: any;
}

export interface FieldMapping {
    name: string;
    field: string;
}

export interface ProtocolMapping {
    secrets: SecretMapping[],
    fields: FieldMapping[],
}

export enum ConnectionProtocol {
    DOCKER="docker_registry",
    HTTP="http",
    HTTP_BASIC="http_basic",
    HTTP_REALM="http_realm",
    FTP="ftp",
    SSH="ssh",
    PLAYSTORE="playstore",
    APPSTORE="appstore"
}

export enum ConnectionSubject {
    USER="user",
    GROUP="group",
    APP="app"
}

export type ConnectionUUID = string;

export interface ConnectionOptions {
    uuid?:ConnectionUUID;
    type?: ConnectionProtocol;
    name?: string;
    description?:string;
    address?: string;
    secrets?:Record<string, any>;
    fields?:Record<string, string>;
}

export class Connection   {


    __:NodeInternalType = NodeInternalType.CONNECTION;

    uuid:ConnectionUUID;
    type: ConnectionProtocol;
    name: string;
    description:string;
    address: string;
    tags:number[] = [];
    secrets:Record<string, any> = {};
    fields:Record<string, string> = {};

    constructor(pOptions:Nullable<ConnectionOptions>) {

        if(pOptions!=null){
            this.uuid = pOptions.uuid!;
            this.name = pOptions.name!;
            this.description = pOptions.description!;
            this.type = pOptions.type!;
            this.address = pOptions.address!;
            this.fields = (pOptions.fields!=null ? pOptions.fields : {});
            this.secrets = (pOptions.secrets!=null ? pOptions.secrets : {});
        }

    }

    getUID():ConnectionUUID {
        return this.uuid;
    }



    toJsonObject(pOption?: any): any {
        const o:any = {
            uuid: this.uuid,
            name: this.name,
            description: this.description,
            type: this.type,
            address: this.address,
            secrets: {},
            fields: this.fields,
            tags:  this.tags
        };


        return o;
    }

    getName() {
        return this.name;
    }

    setName(pName:string):void {
        /*if(!Connection.VALIDATE.name.test(pName)){
            throw OrganizationManagerException.INVALID_USER_ACCOUNTS_LIST();
        }*/

        this.name = pName;
    }

    setDescription(pVal:string):void {
        this.description = pVal;
    }

    setType(pVal:ConnectionProtocol):void {
        this.type = pVal;
    }

    setAddress(pVal:string):void {
        this.address = pVal;
    }

    mapField(pFieldName: string, pFieldValue: any) {
        this.fields[pFieldName] = pFieldValue;
    }

    mapSecret(pSecretName: string, pSecret: any) {
        this.secrets[pSecretName] = pSecret;
    }

    removeSecret(pName:string):void {
        delete this.secrets[pName];
    }

    removeField(pName:string):void {
        delete this.fields[pName];
    }
}