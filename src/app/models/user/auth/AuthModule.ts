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

import {Nullable} from "../../../base/Nullable";


export enum AuthModuleType {
    LOCAL_PASSWD='local_pwd',
    OIDC='oidc',
    APIKEY='api_key',
    PASSWORDLESS='pwdl'
}

export interface SelfRegistrationStatus extends Record<string, boolean> {
    orgMember:boolean;
    external:boolean;
    guests:boolean;
}

export interface AuthModuleOptions {
    type?:AuthModuleType;
    uid?:string;
    name?:string;
    active?:boolean;
    btnImg?:Buffer;
    selfReg?:SelfRegistrationStatus;
    [extra:string]:any;
}

export class AuthModule {

    type:AuthModuleType;

    uid:string = "";

    name:string;

    active = false;

    btnImg:Nullable<Buffer> = null;

    selfReg:SelfRegistrationStatus = {
        orgMember: false,
        external: false,
        guests: false
    };

    constructor(pOptions:AuthModuleOptions) {
        this.update(pOptions);
    }

    getUID():string {
        return this.uid;
    }

    setUID(pUUID:string):void {
        this.uid = pUUID;
    }

    update(pOptions:AuthModuleOptions|AuthModule) {
        if(pOptions.type!=null) this.type = pOptions.type;
        if(pOptions.uid!=null) this.uid = pOptions.uid;
        if(pOptions.name!=null) this.name = pOptions.name;
        if(pOptions.active!=null) this.active = pOptions.active;
        if(pOptions.btnImg!=null) this.btnImg = pOptions.btnImg;
        if(pOptions.selfReg!=null) this.selfReg = pOptions.selfReg;
    }

    toJsonObject():any{
        return {
            type: this.type,
            uid: this.uid,
            name: this.name,
            active: this.active,
            btnImg: this.btnImg,
            selfReg: this.selfReg
        };
    }
}