

/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {PrivacyFinding} from "./PrivacyFinding";
import {TrackerInfo} from "./TrackerInfo";
import {DataFlowInfo} from "../common/DataFlowInfo";
import {IStringIndex} from "../../../base/IStringIndex";

export interface PrivacyReportOptions extends IStringIndex<any>{
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
