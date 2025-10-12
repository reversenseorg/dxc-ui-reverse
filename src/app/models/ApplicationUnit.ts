import {DeviceUUID} from "./Device";
import DexcaliburProject from "./DexcaliburProject";
import { OperatingSystem } from "./OperatingSystem";
import {UserAccount, UserAccountUUID} from "./user/UserAccount";
import {Nullable} from "../base/Nullable";
import {Architecture} from "./Architecture";
import {OrganizationUnitUUID} from "./orgs/OrganizationUnit";
import {NodeInternalType} from "./NodeInternalType";
import {Avatar} from "./orgs/misc/Avatar";
import {Policy} from "./audit/common/Policy";

export type ApplicationUnitUUID = string;

export interface ApplicationUnitOptions {
    uuid?: ApplicationUnitUUID;
    name?: string;
    description?:string;
    packageID?: string;
    icon?: Nullable<Avatar>;
    sources?: string;
    stores?: any[];
    latestVer?: string;
    properties?:Record<string,any>;
    policies?:Policy[];
    projects?: DexcaliburProject[];

    os?:OperatingSystem;
    orgUnit?:OrganizationUnitUUID;
    tags?:number[];
}

export class ApplicationUnit {


    __:NodeInternalType = NodeInternalType.APP_UNIT;

    uuid:ApplicationUnitUUID;
    name: string;
    description:string;
    packageID: string;
    icon: Nullable<any>;
    sources: string;
    projects: DexcaliburProject[] = [];
    os: OperatingSystem = OperatingSystem.NONE;
    orgUnit:Nullable<OrganizationUnitUUID> = null;
    archs: Architecture[] = [];
    latestVer: string;
    properties:Record<string,any> = {};
    devices: DeviceUUID[] = [];
    policies: Policy[] = [];
    stores:any[] = [];
    tags:number[] = [];

    _members:UserAccount[] = [];

    constructor(pOptions:Nullable<ApplicationUnitOptions>) {

        if(pOptions!=null){
            this.uuid = pOptions.uuid!;
            this.name = pOptions.name!;
            this.description = pOptions.description!;
            this.packageID = pOptions.packageID!;
            this.icon = pOptions.icon!;
            this.sources = pOptions.sources!;
            this.projects = pOptions.projects!;
            this.latestVer = pOptions.latestVer!;
            this.properties = pOptions.properties!;
            this.stores = pOptions.stores!;
            this.os = (pOptions.os !=null ? pOptions.os : OperatingSystem.NONE);
            this.orgUnit = (pOptions.orgUnit !=null ? pOptions.orgUnit : null);
            this.policies = (pOptions.policies !=null ? pOptions.policies : []);
            this.tags = pOptions.tags!;
        }

    }

    getUID():string {
        return this.uuid;
    }

    getProperty(pPpt:string):any {
        if(this.properties!=null){
            return this.properties[pPpt];
        }else{
            return null;
        }

    }

    addMember(pMember:any){
        const m = this._members.find(x => x.getUID()===pMember.getUID());
        if(m == null) this._members.push(pMember);
    }

    removeMember(pMember: UserAccount) {
        this._members = this._members.filter(x => x.getUID()!==pMember.getUID());
    }

    countMembers():number {
        if(this._members==null){
            this._members = [];
        }

        return this._members.length;
    }


    getMembersUUID():UserAccountUUID[] {
        return this._members.map(x => x.getUID());
    }

    hasReleases():boolean {
        return (this.projects.length>0);
    }

    getReleases():DexcaliburProject[] {
        console.log(this.projects);
        return this.projects;
    }

    getTargetDevices():DeviceUUID[] {
        return this.devices;
    }

    toJsonObject(pOption?: any): any {
        const o:any = {
            uuid: this.uuid,
            name: this.name,
            description: this.description,
            packageID: this.packageID,
            icon: this.icon,
            sources: this.sources,
            projects: this.projects,
            latestVer: this.latestVer,
            properties: this.properties,
            stores: this.stores,
            os: this.os,
            orgUnit: this.orgUnit,
            tags: this.tags,
            _attr: (this as any)._attr,
        };

        return o;
    }
}