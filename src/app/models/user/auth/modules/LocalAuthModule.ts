
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

import {AuthModule, AuthModuleOptions, AuthModuleType} from "../AuthModule";

export interface LocalAuthModuleOptions extends AuthModuleOptions {
    authorizedIPs?:string[];
    authorizedCIDR?:string[];
    banned?: string[];
}

export class LocalAuthModule extends AuthModule {


    authorizedIPs:string[] = [];

    authorizedCIDR:string[] = [];

    banned: string[] = [];
    pwdStrength: number = 12;

    constructor(pOptions: LocalAuthModuleOptions) {
        super({
            ...pOptions,
            type: AuthModuleType.LOCAL_PASSWD
        });

        this.authorizedIPs = (pOptions.authorizedIPs!=null ? pOptions.authorizedIPs : []);
        this.authorizedCIDR = (pOptions.authorizedCIDR!=null ? pOptions.authorizedCIDR : []);
        this.banned = (pOptions.banned!=null ? pOptions.banned : []);
        this.pwdStrength = pOptions.pwdStrength!;
    }

    override update(pOptions: LocalAuthModuleOptions | LocalAuthModule) {
        super.update(pOptions);

        this.authorizedIPs = (pOptions.authorizedIPs!=null ? pOptions.authorizedIPs : []);
        this.authorizedCIDR = (pOptions.authorizedCIDR!=null ? pOptions.authorizedCIDR : []);
        this.banned = (pOptions.banned!=null ? pOptions.banned : []);
        this.pwdStrength = pOptions.pwdStrength!;
    }

    getAuthorizedIps():string[]{
        return this.authorizedIPs;
    }

    getAuthorizedCIDR():string[]{
        return this.authorizedCIDR;
    }

    getBannedIPs():string[]{
        return this.banned;
    }


    addAuthorizedIP( pIpAddress:string ):void {
        this.authorizedIPs.push(pIpAddress);
    }

    addAuthorizedCIDR( pCIDR:string ):void {
        this.authorizedCIDR.push(pCIDR);
    }


    override toJsonObject(): any {
        let o = super.toJsonObject();
        o.authorizedCIDR = this.authorizedCIDR;
        o.authorizedIPs = this.authorizedIPs;
        o.banned = this.banned;
        o.pwdStrength = this.pwdStrength;
        return o;
    }
}