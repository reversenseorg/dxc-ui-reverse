import {NodeInternalType} from "../../NodeInternalType";
import {Nullable} from "../../common";


export enum CredentialFormat {
    PUBLIC_KEY="public",
    PRIVATE_KEY="private",
    SECRET_KEY="secret",
    PASSWORD="password"
}


export interface CredentialOptions {
    uuid?:string;
    name?:string;
    description?:string;
    format?:CredentialFormat;
    extra?:any;
    owner?:string;
}

export class Credential {



    __:NodeInternalType = NodeInternalType.CREDENTIAL;

    uuid:string;
    name:string = "";
    description:string = "";
    format?:CredentialFormat;
    extra:any = {}
    owner:Nullable<string> = null;

    tags:number[] = [];

    constructor(pOptions:CredentialOptions) {

        this.uuid = pOptions.uuid!;
        this.name = pOptions.name!;
        this.description = pOptions.description!;
        this.format = pOptions.format!;
        this.extra = pOptions.extra!;
        this.owner = pOptions.owner!;
    }

    getUID():string {
        return this.uuid;
    }

    toJsonObject(pOption?: any): any {
        const o:any = {
            uuid: this.uuid,
            name: this.name,
            description: this.description,
            format: this.format,
            extra: this.extra,
            owner: this.owner
        };

        return o;
    }
}