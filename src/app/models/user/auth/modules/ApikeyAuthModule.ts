
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


export interface ApikeyAuthModuleOptions extends AuthModuleOptions {
    authorizedIPs?:string[];
    authorizedCIDR?:string[];
    ttl?:number;
    keysize?:number;
}

/**
 *
 * @class
 */
export class ApikeyAuthModule extends AuthModule {

    static DEFAULT_KEY_LEN = 256;
    static DEFAULT_KEY_TTL = 24*60;


    authorizedIPs:string[] = [];

    authorizedCIDR:string[] = [];

    /**
     * Time To Live (in hours)
     */
    ttl: number = ApikeyAuthModule.DEFAULT_KEY_TTL; // 60d : avg 2 months

    keysize: number = ApikeyAuthModule.DEFAULT_KEY_LEN;

    constructor(pOptions: ApikeyAuthModuleOptions) {
        super({
            ...pOptions,
            type: AuthModuleType.APIKEY
        });

        this.update(pOptions);
    }

    override update(pOptions: ApikeyAuthModuleOptions | ApikeyAuthModule) {
        super.update(pOptions);

        this.authorizedIPs = (pOptions.authorizedIPs!=null ? pOptions.authorizedIPs : []);
        this.authorizedCIDR = (pOptions.authorizedCIDR!=null ? pOptions.authorizedCIDR : []);
        this.keysize = (pOptions.keysize!=null ? pOptions.keysize : ApikeyAuthModule.DEFAULT_KEY_LEN);
        this.ttl = (pOptions.ttl!=null ? pOptions.ttl : ApikeyAuthModule.DEFAULT_KEY_TTL);
    }

    getAuthorizedIps():string[]{
        return this.authorizedIPs;
    }

    getAuthorizedCIDR():string[]{
        return this.authorizedCIDR;
    }

    /**
     * To get TTL in seconds
     *
     * @returns {number} api key ttl
     * @method
     */
    geTTL():number{
        return this.ttl*60*60;
    }

    getKeySize():number {
        return this.keysize;
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
        o.keysize = this.keysize;
        o.ttl = this.ttl;
        return o;
    }
}