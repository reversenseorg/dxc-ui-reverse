import {UserAccount} from "./UserAccount";
import {Nullable} from "../../base/Nullable";

export class Person {

    private _firstname: Nullable<string>;
    private _lastname: Nullable<string>;
    private _mail: Nullable<string>;
    private _bio: Nullable<string>;

    get firstname():  Nullable<string> {
        return this._firstname;
    }

    set firstname(value: string) {
        this._firstname = value;
    }

    get lastname():  Nullable<string> {
        return this._lastname;
    }

    set lastname(value: string) {
        this._lastname = value;
    }

    get mail():  Nullable<string> {
        return this._mail;
    }

    set mail(value: string) {
        this._mail = value;
    }

    get bio():  Nullable<string> {
        return this._bio;
    }

    set bio(value: string) {
        this._bio = value;
    }
}
