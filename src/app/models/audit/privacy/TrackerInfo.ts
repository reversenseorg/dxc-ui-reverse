import { NodeInternalType } from "../../NodeInternalType";
import {CodeSignature} from "./CodeSignature";
import {NetworkSignature} from "./NetworkSignature";
import { TrackerCategory } from "./TrackerCategory";
import {IStringIndex} from "../../../base/IStringIndex";


export class TrackerInfo {

    uid = "";

    name = "";

    codeSignature:CodeSignature[] = [];
    networkSignature:NetworkSignature[] = [];

    category:TrackerCategory[] = [];

    website = "";

    constructor( pConfig:any) {
        for(const i in pConfig){
            (this as IStringIndex<any>)[i] = pConfig[i];
        }
    }

}
