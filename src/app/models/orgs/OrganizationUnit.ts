import {NodeInternalType} from "../NodeInternalType";
import {UserAccountUUID} from "../user/UserAccount";
import {Connection} from "./auth/Connection";
import {UserGroup} from "../user/UserGroup";
import {AuthModule, AuthModuleType} from "../user/auth/AuthModule";
import {Nullable} from "../../base/Nullable";


export type OrganizationUnitUUID = string;



export interface OrganizationUnitOptions {
    uuid?:string;
    name?:string;
    companyName?:string;
    description?:string;
    owner?:string;
    members?:UserAccountUUID[];
    authModules?:AuthModule[];
    connections?:Connection[];
    devices?:string[];
    deviceTpls?:string[];
    groups?:UserGroup[];
    _attr?:any;
    tags?:number[];
}


export class OrganizationUnit {

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


    tags:number[] = [];

    constructor(pOptions:Nullable<OrganizationUnitOptions>) {

        if(pOptions!=null){
            this.uuid = pOptions.uuid!;
            this.name = pOptions.name!;
            this.companyName = pOptions.companyName!;
            this.description = pOptions.description!;
            this.owner = pOptions.owner!;
            this.tags = pOptions.tags!;
            this.authModules = pOptions.authModules!;
            this.devices = (pOptions.devices!=null ? pOptions.devices : []);
            this.connections = (pOptions.connections!=null ? pOptions.connections : []);
            this.deviceTpls = pOptions.deviceTpls!;
            this.members = (pOptions.members!=null ? pOptions.members : []);
        }

    }

    getUID():string {
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