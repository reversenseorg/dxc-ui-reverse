import { NodeInternalType } from "../../NodeInternalType";
import {CodeSignature} from "./CodeSignature";
import {NetworkSignature} from "./NetworkSignature";
import { TrackerCategory } from "./TrackerCategory";


export class TrackerInfo {

    uid = "";

    name = "";

    codeSignature:CodeSignature[] = [];
    networkSignature:NetworkSignature[] = [];

    category:TrackerCategory[] = [];

    website = "";

    constructor( pConfig:any) {
        for(const i in pConfig){
            this[i] = pConfig[i];
        }
    }

}
