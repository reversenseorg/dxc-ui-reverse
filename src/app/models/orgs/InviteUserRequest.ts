import {Nullable} from "../common";
import {UserGroup} from "../user/UserGroup";


export interface InviteUserRequestOptions {
    emails?:string[];
    group?:Nullable<UserGroup>;
}
/**
 * @class
 */
export class InviteUserRequest {

    emails:string[] = [];
    group:Nullable<UserGroup> = null;

    constructor(pOptions?:InviteUserRequestOptions) {
        if(pOptions!=null){
            this.emails = (pOptions.emails !=null ? pOptions.emails :[]);
            this.group = pOptions.group!;
        }
    }
}