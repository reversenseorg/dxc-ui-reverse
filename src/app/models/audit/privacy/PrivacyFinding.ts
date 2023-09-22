import {Finding, FindingOptions} from "../common/Finding";
import {TrackerInfo} from "./TrackerInfo.js";

export enum PrivacyFindingType {
    UNKNOWN,
    TRACKER,
    PERM_ABUSE,
    PII_FLOW,
    PII_DATA,
    API_ABUSE
}

export interface PrivacyFindingOptions<T> extends FindingOptions {
    type?:PrivacyFindingType;
    source?:T;
}

export class PrivacyFinding<T> extends Finding {

    type:PrivacyFindingType = PrivacyFindingType.UNKNOWN;

    source:T;

    constructor(pConfig:PrivacyFindingOptions<T>) {
        super(pConfig);

        if(pConfig.type!=null) this.type = pConfig.type;
    }

}
