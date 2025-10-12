import {Nullable} from "../../../base/Nullable";


export enum AvatarType {
    IMG='img',
    SVG='svg',
    GENERATED="gen"
}


export class Avatar {

    type:AvatarType = AvatarType.GENERATED;
    encoding:string = 'base64';
    binary: Nullable<Buffer> = null;

    constructor() {

    }

    getHtmlString(){
        return "base64 ";
    }
}