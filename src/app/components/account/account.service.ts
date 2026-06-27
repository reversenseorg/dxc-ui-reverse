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

import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {from, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {OrganizationService} from "../organization/organization.service";
import {DxcApiService} from "../../base/DxcApiService";
import {Nullable} from "../../base/Nullable";
import {UserAccount, UserAccountUUID} from "../../models/user/UserAccount";
import {Access} from "../../models/user/acl/Access";
import {OrganizationUnitUUID} from "../../models/orgs/OrganizationUnit";
import {AuthService} from "../auth/ctrl/auth.service";
import {OutputService} from "../output/ctrl/output.service";
import {DxApiResponse} from "../../base/common/common";


const AUTH_ENFORCE = false;


export interface SsoOptions {
    clientId?: string;
    clientSecret?: string;
    discoverUri?: string;
}

export enum Action {
    NONE,
    DEV_DROP,
}

/**
 * Represent the service to manage projects
 *
 * @class
 */
@Injectable({
    providedIn: 'root'
})
export class AccountService extends DxcApiService {


    currentAcc:Nullable<UserAccount> = null;
    currentPerm:Record<OrganizationUnitUUID,Access[]> = {};

    accountChanges$:Subject<UserAccount> = new Subject<UserAccount>();

    private _aclmatrix:Record<string, boolean> = {};


    /**
     *
     * @param {OutputService} outputSvc
     * @param {HttpClient} _http
     * @constructor
     */
    constructor( private _authSvc:AuthService,
                 private _outputSvc:OutputService,
                 private _orgSvc:OrganizationService,
                 _http:HttpClient) {
        super(
            {
                apikeys: {
                    list: { method: 'GET', url:'/user/account/uid/:uid/apikeys', format:'json', auth:AUTH_ENFORCE, puid:false},
                    create: { method: 'POST', url:'/user/account/uid/:uid/apikeys', format:'json', auth:AUTH_ENFORCE, puid:false},
                    drop: { method: 'DELETE', url:'/user/account/uid/:uid/apikey/:keyuuid', format:'json', auth:AUTH_ENFORCE, puid:false},
                },
                user: {
                    current: { method: 'GET', url:'/user/account/current', format:'json', auth:AUTH_ENFORCE, puid:false },
                    profile: { method: 'GET', url:'/user/account/uid/:uid', format:'json', auth:AUTH_ENFORCE, puid:false },

                    change_pwd: { method: 'POST', url:'/user/account/passwd', format:'json', auth:false },

                    edit: { method: 'PUT', url:'/user/account/profile/:uid', format:'json', auth:AUTH_ENFORCE, puid:false},
                    block: { method: 'PUT', url:'/user/block/:uid', format:'json', auth:AUTH_ENFORCE, puid:false},
                    perm: { method: 'GET', url:'/user/account/perm/:uid', format:'json', auth:AUTH_ENFORCE, puid:false},


                }
            },_http, _outputSvc
        );
    }

    getCurrentUser(pForceRefresh = false):Observable<Nullable<UserAccount>>{
        if(this.currentAcc!=null && !pForceRefresh){
            return from([this.currentAcc]);
        }else{
            return this._process(
                this.endpoints['user']['current']
            ).pipe(
                map((pEl:any)=>{
                    if(pEl.success){
                        const acc = new UserAccount(pEl.data);
                        this.currentAcc = acc;
                        // add roles
                        return acc;
                    }else{
                        return null;
                    }
                })
            );
        }
    }

    showUser(pUserUID:UserAccountUUID):Observable<Nullable<UserAccount>>{
        return this._process(
            this.endpoints['user']['profile'],
            { uid: pUserUID }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    const acc = new UserAccount(pEl.data);
                    // add roles
                    return acc;
                }else{
                    return null;
                }
            })
        );
    }

    /**
     * To edit a user
     * @param pAccount
     */
    editUser(pAccount:UserAccount):Observable<Nullable<UserAccount>>{
        return this._process(
            this.endpoints['user']['edit'],
            pAccount.toJsonObject()
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    return new UserAccount(pEl.data);
                }else{
                    return null;
                }
            })
        );
    }


    canDropDevice():boolean {
        return false;
    }

    listApiKeys(pAccount: UserAccountUUID):Observable<DxApiResponse<any[]>> {
        return this._processApiRequest<any>(this.endpoints['apikeys']['list'], {
            uid: encodeURIComponent(pAccount)
        });
    }

    createApiKeys(pAccount: UserAccountUUID, pOptions:any):Observable<DxApiResponse<any>> {
        return this._processApiRequest<any>(this.endpoints['apikeys']['create'], {
            uid: encodeURIComponent(pAccount),
            opts:pOptions
        });
    }

    dropApiKeys(pAccount: UserAccountUUID, pKeyUUID:string):Observable<DxApiResponse<any>> {
        return this._processApiRequest<any>(this.endpoints['apikeys']['drop'], {
            uid: encodeURIComponent(pAccount),
            keyuuid:pKeyUUID
        });
    }
}

