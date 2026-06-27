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

import {UserAccount, UserAccountUUID} from "./UserAccount";
import {Access} from "./acl/Access";
import {NodeInternalType} from "../NodeInternalType";
import {INode} from "../INode";
import {OrganizationUnitUUID} from "../orgs/OrganizationUnit";
import {Nullable} from "../../base/Nullable";

export type RoleUUID = string;

export interface RoleOpts {
    uuid?:RoleUUID;
    name?:string;
    description?:string;
    permissions?:Access[];
    authorized?:string[];
    orgUnit?:Nullable<OrganizationUnitUUID>;
    tags?:number[]
}

/**
 *
 */
export class Role implements INode {


    __:NodeInternalType = NodeInternalType.ACL_ROLE;

    tags:number[] = [];

    _uuid:Nullable<RoleUUID> = null;
    _name:string ;
    _description:string = "";
    _permissions:Access[] = [];
    _authorized:UserAccountUUID[] = [];
    _orgUnit:Nullable<OrganizationUnitUUID> = null

    constructor( pOptions:Nullable<RoleOpts> = null) {
        if(pOptions!=null){
            this._uuid = pOptions.uuid!;
            this._name = pOptions.name!;
            this._description = pOptions.description!;
            this._permissions = (pOptions.permissions!=null? pOptions.permissions : []);
            this._authorized = (pOptions.authorized!=null? pOptions.authorized : []);
            this._orgUnit = pOptions.orgUnit!;
        }
    }

    getUID(): string {
        return this._uuid as string;
    }

    addAccess(pAccess:Access):void {
        this._permissions.push(pAccess);
    }

    hasAccess(pAccess:Access):boolean {
        return (this._permissions.find(x => (x.name===pAccess.name))!=null)
    }

    grant(pAccount:UserAccount){
        if(this._authorized.indexOf(pAccount.getUID())==-1){
            this._authorized.push(pAccount.getUID());
        }
    }

    isAuthorized(pAccount:UserAccount):boolean {
        return (this._authorized.indexOf(pAccount.getUID())>-1);
    }

    isGeneric():boolean {
        return (this._orgUnit===null || this._orgUnit===undefined);
    }

    hasOrg(pOrg:OrganizationUnitUUID):boolean {
        return (this._orgUnit===pOrg);
    }

    getPermission():Access[] {
        return this._permissions;
    }

    countPermissions():number {
        return this._permissions.length;
    }

    countAuthorized():number {
        return this._authorized.length;
    }

    toJsonObject():any {
        return {
            uuid:this._uuid,
            description:this._description,
            name:this._name,
            permissions:this._permissions,
            authorized:this._authorized,
            orgUnit:this._orgUnit
        }

    }
}
