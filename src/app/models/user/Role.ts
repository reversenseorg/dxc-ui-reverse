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
