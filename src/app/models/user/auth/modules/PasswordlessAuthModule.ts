
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
import {ApikeyAuthModuleOptions} from "./ApikeyAuthModule";

export interface PasswordlessAuthModuleOptions extends AuthModuleOptions {
    authorizedIPs?:string[];
    authorizedCIDR?:string[];
    banned?: string[];
    ttl?:number;
}

export class PasswordlessAuthModule extends AuthModule {

    static DEFAULT_TTL = 60*15;

    authorizedIPs:string[] = [];

    authorizedCIDR:string[] = [];

    banned: string[] = [];

    ttl: number = PasswordlessAuthModule.DEFAULT_TTL;

    constructor(pOptions: PasswordlessAuthModuleOptions) {
        super({
            ...pOptions,
            type: AuthModuleType.PASSWORDLESS
        });

        this.authorizedIPs = (pOptions.authorizedIPs!=null ? pOptions.authorizedIPs : []);
        this.authorizedCIDR = (pOptions.authorizedCIDR!=null ? pOptions.authorizedCIDR : []);
        this.banned = (pOptions.banned!=null ? pOptions.banned : []);
        this.ttl = (pOptions.ttl!=null ? pOptions.ttl : PasswordlessAuthModule.DEFAULT_TTL);
    }


    override update(pOptions: PasswordlessAuthModuleOptions | PasswordlessAuthModule) {
        super.update(pOptions);

        this.authorizedIPs = (pOptions.authorizedIPs!=null ? pOptions.authorizedIPs : []);
        this.authorizedCIDR = (pOptions.authorizedCIDR!=null ? pOptions.authorizedCIDR : []);
        this.banned = (pOptions.banned!=null ? pOptions.banned : []);
        this.ttl = (pOptions.ttl!=null ? pOptions.ttl : PasswordlessAuthModule.DEFAULT_TTL);
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

    getTTL():number{
        return this.ttl;
    }

    addAuthorizedIP( pIpAddress:string ):void {
        this.authorizedIPs.push(pIpAddress);
    }

    addAuthorizedCIDR( pCIDR:string ):void {
        this.authorizedCIDR.push(pCIDR);
    }



    override toJsonObject(): any {
        let o:any = super.toJsonObject();
        o.authorizedCIDR = this.authorizedCIDR;
        o.authorizedIPs = this.authorizedIPs;
        o.banned = this.banned;
        o.ttl = this.ttl;
        return o;
    }
}