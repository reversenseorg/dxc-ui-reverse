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
import {RoleUUID, UserAccount, UserAccountUUID} from "./UserAccount";
import {INode} from "../INode";
import {Role} from "./Role";
import {Nullable} from "../../base/Nullable";

export type UserGroupUUID = string;

export interface UserGroupOptions {
    uuid?: string;
    name?: string;
    description?: string;
    members?: UserAccountUUID[];
    roles?: RoleUUID[];
    _attr?:any;
}


/**
 *
 */
export class UserGroup  implements INode {

    __:NodeInternalType = NodeInternalType.USER_GROUP;

    public uuid: string;
    public name: string;
    public description: string;
    public members: UserAccountUUID[] = [];
    public roles: RoleUUID[] = [];
    public _attr: any;

    public tags:number[];

    constructor( pOptions: Nullable<UserGroupOptions> = null) {

        if(pOptions!=null){
            this.uuid = pOptions.uuid!;
            this.name = pOptions.name!;
            this.members = (pOptions.members!=null? pOptions.members : []);
            this.roles = (pOptions.roles!=null? pOptions.roles : []);
            this.roles = pOptions.roles!;
            this._attr = pOptions._attr!;

        }
    }

    getUID():string {
        return this.uuid;
    }

    countMembers():number {
        return this.members.length;
    }

    countRoles():number {
        return this.roles.length;
    }

    /**
     *
     * @param pOption
     */
    toJsonObject(): any {
        return {
            uuid: this.uuid,
            name: this.name,
            description: this.description,
            members: this.members,
            roles: this.roles,
            tags: this.tags
        };
    }

    addMember(pAccount: UserAccount) {
        if(this.members.indexOf(pAccount.getUID())==-1){
            this.members.push(pAccount.getUID());
        }
    }

    addRole(pRole: Role) {
        if(this.roles.indexOf(pRole.getUID())==-1){
            this.roles.push(pRole.getUID());
        }
    }
}