import {Person} from "./Person";
import {UserRole} from "./acl/rbac/UserRole";
import {IStringIndex} from "../../base/IStringIndex";
import {Nullable} from "../../base/Nullable";

export type UserAccountUUID = string;

export class UserAccount implements IStringIndex<any>{

    private _uid:Nullable<string>  = null;
    private _person: Nullable<Person> = null;
    private _role:Nullable<UserRole>  = null;
    private _username:Nullable<string> = null;
    private _password:Nullable<string> = null;
    private _salt:Nullable<string> = null;
    private _padding:Nullable<string> = null;
    private _time:Nullable<string> = null;
    private _locked:boolean = false;


    constructor(pConfig:any = null) {
        if(pConfig != null){
            for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
        }
        // TODO : replace by incremental uid
        if(this._uid==null && this._username!=null){
            this._uid = this._username;
        }
    }

    get person(): Nullable<Person> {
        return this._person;
    }

    set person(value: Person) {
        this._person = value;
    }

    get username(): Nullable<string> {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get password():  Nullable<string> {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get salt():  Nullable<string> {
        return this._salt;
    }

    set salt(value: string) {
        this._salt = value;
    }

    get padding():  Nullable<string> {
        return this._padding;
    }

    set padding(value: string) {
        this._padding = value;
    }

    get time():  Nullable<string> {
        return this._time;
    }

    set time(value: string) {
        this._time = value;
    }

    set locked(value: boolean) {
        this._locked = value;
    }

    get role():  Nullable<string> {
        if(this._role != null){
            return this._role.name;
        }else{
            return null;
        }
    }


    setUserRole( pRole:UserRole): UserAccount {
        this._role = pRole;
        return this;
    }

    getUserRole( ): Nullable<UserRole> {
        return this._role;
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

    getUID(): Nullable<string> {
        return this.username;
    }

    /**
     * To compare two user account
     *
     * @param pAccount
     */
    is( pAccount:UserAccount):boolean {
        // TODO : replace by uid
        return (this._username===pAccount.username) && (this._password===pAccount.password);
    }
}
