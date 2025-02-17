import {Person} from "./Person";
import {INode} from "../INode";
import {NodeInternalType} from "../NodeInternalType";
import {OrganizationUnitUUID} from "../orgs/OrganizationUnit";

export enum UserAccountType {
    LOCAL='local',
    FEDERATED='federated'
}
export type UserAccountUUID = string;
export type RoleUUID = string;

export interface UserAccountOptions extends Record<string, any> {
    _uid?:UserAccountUUID,
    _person?: Person,
    _roles?:RoleUUID[],
    _username?:string,
    _time?:string,
    _locked?:boolean,
    _type?:UserAccountType;
    _authorized_ips?:string[];
    _projects?:any[],
    _orgs?:OrganizationUnitUUID[]
}

export class UserAccount implements  INode {

    __:NodeInternalType = NodeInternalType.USER_ACCOUNT;

    private _uid:UserAccountUUID;
    private _person: Person;

    private _roles:RoleUUID[] = [];
    private _username:string;
    private _time:string;
    private _authorized_ips:string[] = [];
    private _type:UserAccountType = UserAccountType.LOCAL;
    private _locked:boolean = false;
    private _orgs:OrganizationUnitUUID[] = [];
    private _attrs:any = {};

    tags:number[] = [];

    /**
     * Projects
     */
    private _projects:string[] = [];


    constructor(pConfig:UserAccountOptions = {}) {
        if(pConfig != null){
            for(let i in pConfig) (this as any)[i] = pConfig[i];
        }
    }

    get person(): Person {
        return this._person;
    }

    set person(value: Person) {
        this._person = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get time(): string {
        return this._time;
    }

    set time(value: string) {
        this._time = value;
    }

    set locked(value: boolean) {
        this._locked = value;
    }

    getType():UserAccountType {
        return this._type;
    }

    setType( pType:UserAccountType):void {
        this._type = pType;
    }

    getRoles():RoleUUID[] {
        return this._roles;
    }

    isLocked():boolean {
        return this._locked;
    }

    lock():void {
        this._locked = true;
    }

    unlock():void {
        this._locked = false;
    }

    hasUsername(pUsername:string):boolean {
        return (this._username === pUsername);
    }


    getUID():UserAccountUUID {
        return this._uid; //username;
    }

    getAuthorizedIPs():string[] {
        return this._authorized_ips;
    }

    addAuthorizedIP( pIpAddress:string):void {
        if(this._authorized_ips.indexOf(pIpAddress)==-1){
            this._authorized_ips.push(pIpAddress);
        }
    }

    getOrgUnits():OrganizationUnitUUID[] {
        return this._orgs;
    }

    isIpFiltered():boolean {
        return (this._authorized_ips.length>0);
    }

    toJsonObject(): any {
        let o:any = {};

        o._uid = this.getUID();
        o._person = (this._person!=null ? this.person : null);
        o._roles = this._roles;
        o._username = this._username;
        o._time = this._time;
        o._locked = this._locked;
        o._type = this._type;
        o._authorized_ips = this._authorized_ips;

        return o;
    }
}