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

import {NodeInternalType} from "../NodeInternalType";
import {UserAccountUUID} from "../user/UserAccount";
import {Connection} from "./auth/Connection";
import {UserGroup} from "../user/UserGroup";
import {Nullable} from "../../base/Nullable";
import {AssuranceModelUUID} from "../audit/common/AssuranceModel";
import {BusinessPlan} from "../billing/BusinessPlan";
import {AuthModule, AuthModuleType} from "../user/auth/AuthModule";
import {Secret} from "../core/Secret";

export type OrganizationUnitUUID = string;


export interface OrganizationUnitOptions {
    uuid?:string;
    name?:string;
    companyName?:string;
    description?:string;
    owner?:string;
    members?:UserAccountUUID[];
    authModules?:any[];
    connections?:Connection[];
    settings?:SettingPolicy;

    businessPlan?:BusinessPlan;
    devices?:string[];
    deviceTpls?:string[];
    groups?:UserGroup[];
    _attr?:any;
    tags?:number[];
}



/**
 * @since 1.8.14
 */
export interface SettingPolicy {
    starredModels: AssuranceModelUUID[],
    inputTTL: number,
    traceTTL: number,
    reportTTL: number
}


export class OrganizationUnit {

    /**
     * @since 1.8.14
     */
    static DEFAULT_POLICY:SettingPolicy = {
        starredModels: [],
        reportTTL: -1,
        inputTTL: 365,
        traceTTL: -1
    };

    __:NodeInternalType = NodeInternalType.ORG_UNIT;

    uuid:OrganizationUnitUUID;
    name: string;
    companyName: string;
    description:string;
    owner:string;
    authModules: AuthModule[] = [];
    connections: Connection[] = [];
    devices: string[] = [];
    deviceTpls: any[] = [];
    members:UserAccountUUID[] = [];
    settings: SettingPolicy = OrganizationUnit.DEFAULT_POLICY;

    secrets?:Secret[];
    groups?:UserGroup[];

    businessPlan:BusinessPlan;

    tags:number[] = [];

    constructor(pOptions:Nullable<OrganizationUnitOptions>) {

        if(pOptions!=null){
            this.uuid = pOptions.uuid!;
            this.name = pOptions.name!;
            this.companyName = pOptions.companyName!;
            this.settings = pOptions.settings!;
            this.description = pOptions.description!;
            this.owner = pOptions.owner!;
            this.tags = pOptions.tags!;
            this.authModules = pOptions.authModules!;
            this.businessPlan = pOptions.businessPlan!;
            this.devices = (pOptions.devices!=null ? pOptions.devices : []);
            this.connections = (pOptions.connections!=null ? pOptions.connections : []);
            this.deviceTpls = pOptions.deviceTpls!;
            this.members = (pOptions.members!=null ? pOptions.members : []);
        }

    }

    getUID():OrganizationUnitUUID {
        return this.uuid;
    }

    getAuthModules():AuthModule[] {
        return this.authModules;
    }

    getAuthModuleByType(pType:AuthModuleType):Nullable<AuthModule> {
        return this.authModules.find(x => x.type===pType);
    }

    getAuthModuleByUUID(pUUID:string):Nullable<AuthModule> {
        return this.authModules.find(x => x.getUID()===pUUID);
    }

    getBusinessPlan():Nullable<BusinessPlan> {
        return this.businessPlan;
    }

    toJsonObject(pOption?: any): any {
        const o:any = {
            uuid: this.uuid,
            name: this.name,
            description: this.description,
            companyName: this.companyName,
            connections: this.connections,
            devices: this.devices,
            deviceTpls: this.deviceTpls,
            owner: this.owner,
            members: this.members,
            tags: this.tags
        };

        return o;
    }
}