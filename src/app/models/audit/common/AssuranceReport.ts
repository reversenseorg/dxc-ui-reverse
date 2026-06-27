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

import Asset from "./Asset";
import Threat from "./Threat";
import {ConstraintMatch} from "./ConstraintMatch";
import CodeConstraint from "./CodeConstraint";
import DexcaliburProject, {DexcaliburProjectUUID} from "../../DexcaliburProject";
import AssuranceModel, {AssuranceModelUUID, ControlNode, ControlNodeCanonicalUID} from "./AssuranceModel";
import {IStringIndex} from "../../../base/IStringIndex";
import {Metadata} from "./Metadata";
import {ApplicationUnit, ApplicationUnitUUID} from "../../ApplicationUnit";
import {Nullable} from "../../../base/Nullable";
import {INodeRef, NodeInternalType} from "../../NodeInternalType";
import {Device, DeviceUUID} from "../../Device";
import {Indicator} from "./Indicator";
import {OperatingSystem} from "../../OperatingSystem";


export interface MatchOccurence<T> {
    node: T; // (INodeRef|INode);
    meta?: Metadata[];
    ruleIdx:number
}

interface TargetParams {
    os:string;
    api_version:string;
    base_api:string;
    image_src:string;
}



interface ReportGroupMapping {
    [modelID:string] :ReportGroup
}


export interface HttpBody {
    format?:string;
    compress?:string;
    data?:any;
    size:number;
}


export interface NetworkSource {
    name:string;
    uid:string;
}


export interface RemoteServer {
    ip:string;
    countryCode:string;
}

export interface HttpRequest {
    type:string;
    protocol:string;
    url:string;
    body:HttpBody,
    method:string,
    source:NetworkSource,
    time?:number;
    location?:string;
    server:RemoteServer
}

export interface HttpResponse {
    type:string;
    protocol:string;
    url?:string;
    body:HttpBody,
    method:string,
    source:NetworkSource,
    time?:number;
    location?:string;
}

export type NetworkTransaction = HttpRequest | HttpResponse;

const SOURCES:{ [id:string]: NetworkSource } = {
    SMITM: {
        uid: 'smitm',
        name: "Soft MITM"
    },
    HMITM: {
        uid: 'hmitm',
        name: "Hard MITM"
    },
    IAST: {
        uid: 'iast',
        name: "Predict"
    },
}

export interface ReportSkeletonEntry {
    control?: any, //(Control|ControlAssessment),//  ControlNode,
    matches?: any[],
    [extra:string]:any
}

export interface ReportGroup {
    model?: AssuranceModel,
    reports? :AssuranceReport[],
    skeleton?: ReportSkeletonEntry[]
}


export interface AssuranceReportOptions extends IStringIndex<any>{
    time?:number;

    application?:any;
    device?:any;

    model?:AssuranceModel;

    project?:DexcaliburProject;

    primaryAssets?:ConstraintMatch<Asset>[];
    secondaryAssets?:ConstraintMatch<Asset>[];
    globalThreats?:ConstraintMatch<Threat>[];

}



export interface Match {
    // deprecated:
    assessment?: ControlNode;
    match?: any;
    // ok:
    ruleIdx?: number;
    meta?: Metadata[];
    node?:INodeRef;
}

export interface MatchesMap {
    [canonicalID:string]:Match;
}

export interface AssuranceReportOptions extends IStringIndex<any>{
    time?:number;

    application?:any;
    device?:any;

    model?:AssuranceModel;

    project?:DexcaliburProject;

    primaryAssets?:ConstraintMatch<Asset>[];
    secondaryAssets?:ConstraintMatch<Asset>[];
    globalThreats?:ConstraintMatch<Threat>[];

}

export type AssuranceReportUUID = string;

export default class AssuranceReport {

    __:NodeInternalType = NodeInternalType.ASSURANCE_REPORT;

    _loadingModel = false;
    _loadingProj = true;

    __preloaded = false;


    app:Nullable<ApplicationUnit> = null;


    // pojo

    uid:Nullable<AssuranceReportUUID> = null;

    time:number;

    /**
     Start time
     * @since 1.3.10
     */
    started:number = -1;

    /**
     * Terminated / Aborted time
     * @since 1.3.10
     */
    terminated:number = -1;



    application:ApplicationUnitUUID;

    device:Nullable<DeviceUUID> = null;

    project:Nullable<DexcaliburProjectUUID> = null;
    _proj:Nullable<DexcaliburProject> = null;

    _dirty = false;

    _model:Nullable<AssuranceModel> = null;

    model:AssuranceModelUUID;
    modelInfo:any = {};

    primaryAssets:ConstraintMatch<Asset>[] = [];
    secondaryAssets:ConstraintMatch<Asset>[] = [];
    globalThreats:ConstraintMatch<Threat>[] = [];
    assets:ConstraintMatch<Asset>[] = [];

    matches:ControlNodeCanonicalUID[] = [];

    tags:number[] = [];

    // private _project: DexcaliburProject;
    _device: Device;
    _options: any;


    // --- BEGIN OF EXPLAINED REPORT ---
    title: string;

    description = "";

    controls: ControlNode[] = [];

    metadata: Metadata[] = [];

    indicators: Indicator[] = [];

    private deviceInfo: Nullable<{ uid: string; os: OperatingSystem; emulated: boolean; arch: string }> = null;
    private appInfo: Nullable<{ package: string; os: OperatingSystem; version:string }>=null;



    constructor( pConfig:AssuranceReportOptions = {}) {
        if(pConfig!=null) for(const i in pConfig) (this as any)[i]=pConfig[i];
    }

    getUID(){
        return this.uid;
    }

    getAssets():ConstraintMatch<Asset>[] {
        return this.assets;
    }

    getThreats():ConstraintMatch<Threat>[] {
        return this.globalThreats;
    }
    getPrimaryAssets():ConstraintMatch<Asset>[] {
        return this.primaryAssets;
    }
    getSecondaryAssets():ConstraintMatch<Asset>[] {
        return this.secondaryAssets;
    }

    addCodeMatch( pConstraint:CodeConstraint, pSubject:any):void {
        if(pConstraint.el!=null){
            if(pConstraint.el instanceof Threat){
                this.globalThreats.push(
                    new ConstraintMatch<Threat>(
                        pConstraint,
                        pConstraint.pattern,
                        pSubject,
                        pConstraint.el
                    )
                );
            }
            else if(pConstraint.el instanceof Asset){
                this.primaryAssets.push(
                    new ConstraintMatch<Asset>(
                        pConstraint,
                        pConstraint.pattern,
                        pSubject,
                        pConstraint.el
                    )
                );

            }
        }
    }


    toJsonObject():any {
        const o:any = {};

        for(let i in this){
            switch (i){
                case "primaryAssets":
                case "secondaryAssets":
                case "globalThreats":
                case "assets":
                    o[i] = [];
                   /* (this[i] as any).map((x:any) => {
                        o[i].push((x as ConstraintMatch<any>).toJsonObject());
                    })*/
                    break;
                case "project":
                    if(this._proj == null) break;
                    o._proj = {
                        uid: this._proj.getUID(),
                        app: this._proj.pkg,
                        platform: null,
                        device: null
                    };

                    if(this._proj.platform!=null){
                        o._proj.platform = {
                            api: this._proj.getPlatform().getApiVersion(),
                            uid: this._proj.getPlatform().getUID()
                        };
                    }

                    if(this._proj.getDevice()!=null){
                        const dev = this._proj.getDevice();
                        o.project.device = {
                            uid: dev.getUID(),
                            os: dev.getProfile().getSystemProfile().getOperatingSystem(),
                            arch: dev.getProfile().getSystemProfile().getArchitecture(),
                            abi: dev.getProfile().getSystemProfile().getABI(),
                            platform: {
                                api: dev.getPlatform().getApiVersion(),
                                uid: dev.getPlatform().getUID()
                            },
                        };
                    }
                    break;
                default:
                    o[i] = this[i];
                    break;
            }
        }

        return o;
    }

    isLoadingModel(){
        return this._loadingModel;
    }

    static fromJsonObject(pData:any):AssuranceReport {
        const a = new AssuranceReport(pData);

        return a;
    }
}

