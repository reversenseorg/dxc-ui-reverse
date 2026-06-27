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

import {UserAccountUUID} from "./user/UserAccount";
import DexcaliburProject, {DexcaliburProjectUUID} from "./DexcaliburProject";
import {DeviceUUID} from "./Device";
import {NodeInternalType} from "./NodeInternalType";
import {HookSessionUUID} from "../components/hooks/ctrl/HookSession";
import {Nullable} from "../base/Nullable";
import HookSession from "./hook/HookSession";


export type RuntimeSessionUUID = string;

export interface RuntimeSessionOpts extends Record<string,any>{
    uuid?:RuntimeSessionUUID;
    owner?:UserAccountUUID;
    project?:DexcaliburProjectUUID;
    device?:DeviceUUID;
}

export class RuntimeSession {

    __ = NodeInternalType.RUNTIME_SESS;

    uuid:Nullable<RuntimeSessionUUID>;
    hksess:HookSessionUUID[] = [];
    owner:Nullable<UserAccountUUID> = null;
    project:Nullable<DexcaliburProjectUUID> = null;
    device:Nullable<DeviceUUID> = null;
    tools:any[] = [];
    tags:number[] = [];

    _ctx:Nullable<DexcaliburProject> = null;

    _sess:Record<HookSessionUUID , HookSession> = {};

    constructor(pOpts:RuntimeSessionOpts){
        if(pOpts!=null){
            for (let i in pOpts){
                (this as any)[i] = pOpts[i];
            }
        }
    }

    getUID(): Nullable<RuntimeSessionUUID> {
        return this.uuid;
    }

    addHookSess(pSess:HookSession):any{
        const u = pSess.getUID();
        if(u==null) return;

        this._sess[u] = pSess;
    }

    subscribe(pHkSess:HookSessionUUID, pListener:any):any{
        if(this._sess[pHkSess]==null) return;

        //this._sess[pHkSess].;
    }

    unsubscribe(pHkSess:HookSessionUUID):void{
        //this._subs
    }

    toJsonObject(pOption?: any): any {
        return {
            uuid: this.uuid,
            hksess: this.hksess,
            owner: this.owner,
            project: this.project,
            device: this.device,
            tools: this.tools,
            tags: this.tags
        }
    }
}