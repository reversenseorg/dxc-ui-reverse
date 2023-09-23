

import {PrivacyFinding} from "./PrivacyFinding";
import {TrackerInfo} from "./TrackerInfo";
import {DataFlowInfo} from "../common/DataFlowInfo";

export interface PrivacyReportOptions {
    time?:number;
    threats?:PrivacyFinding<TrackerInfo>[];
    pii?:PrivacyFinding<DataFlowInfo<any>>[];
    owner?:any;
}

/**
 * Represent a pricavy report
 */
export class PrivacyReport {

    time = -1;

    owner:any = null;

    /**
     * Threats :
     *
     * - trackers
     * - malicious libs
     * - permission abuses
     * - API/SDK abuses
     */
    threats:PrivacyFinding<TrackerInfo>[] = [];

    /**
     * PII related findings :
     * - Data Inputs
     * - Flows
     * - Storage / Communications
     */
    pii:PrivacyFinding<DataFlowInfo<any>>[] = [];

    constructor(pOptions:PrivacyReportOptions) {
        for(const i in pOptions){
            (this as IStringIndex<any>)[i] = pOptions[i];
        }

        if(this.time === -1){
            this.time = (new Date()).getTime();
        }
    }

    getThreats():PrivacyFinding<TrackerInfo>[] {
        return this.threats;
    }

    addThreat(pFinding:PrivacyFinding<TrackerInfo>):void{
        this.threats.push(pFinding);
    }

    getPiiFlows():PrivacyFinding<DataFlowInfo<any>>[] {
        return this.pii;
    }

    addPii(pFinding:PrivacyFinding<DataFlowInfo<any>>):void{
        this.pii.push(pFinding);
    }

    toJsonObject():any {
        const o:any = {};

        o.time = this.time;
        o.pii = [];
        o.threats = [];

        this.pii.map(x => o.pii.push(x.toJsonObject()));
        this.threats.map(x => o.threats.push(x.toJsonObject()));

        return o;
    }

    static fromJsonObject(pRaw:any):PrivacyReport {
      const o = new PrivacyReport(pRaw);

      for(let i=0; i<o.pii.length; i++){
        o.pii[i] = (new PrivacyFinding<DataFlowInfo<any>>(o.pii[i]));
      }

      for(let i=0; i<o.threats.length; i++){
        o.threats[i] = (new PrivacyFinding<TrackerInfo>(o.threats[i]));
      }

      return o;
    }
}
