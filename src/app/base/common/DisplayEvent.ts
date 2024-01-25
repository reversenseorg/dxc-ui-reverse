import {Nullable} from "../Nullable";
import {IStringIndex} from "../IStringIndex";

export interface DisplayEvent {
    src:string;
    evt:string;
    data?:Nullable<IStringIndex<any>>
}