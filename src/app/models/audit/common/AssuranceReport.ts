
import Asset from "./Asset";
import Threat from "./Threat";
import { ConstraintMatch } from "./ConstraintMatch";
import CodeConstraint from "./CodeConstraint";
import DexcaliburProject from "../../DexcaliburProject";
import AssuranceModel from "./AssuranceModel";

export interface AssuranceReportOptions {
    time?:number;

    application?:any;
    device?:any;

    model?:AssuranceModel;

    project?:DexcaliburProject;

    primaryAssets?:ConstraintMatch<Asset>[];
    secondaryAssets?:ConstraintMatch<Asset>[];
    globalThreats?:ConstraintMatch<Threat>[];

}
export default class AssuranceReport {

    time:number;

    application:string;

    device:string;

    project:DexcaliburProject;

    model:AssuranceModel;

    primaryAssets:ConstraintMatch<Asset>[] = [];
    secondaryAssets:ConstraintMatch<Asset>[] = [];
    globalThreats:ConstraintMatch<Threat>[] = [];


    constructor( pConfig:AssuranceReportOptions = {}) {
        if(pConfig!=null) for(const i in pConfig) this[i]=pConfig[i];
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

    getModel():AssuranceModel {
        return this.model;
    }

    toJsonObject():any {
        const o:any = {};

        for(let i in this){
            switch (i){
                /*case "primaryAssets":
                case "secondaryAssets":
                case "globalThreats":
                    o[i] = [];
                    (this[i] as any).map(x => {
                        o[i].push((x as ConstraintMatch<any>).toJsonObject());
                    })
                    break;
                /*case "project":
                    o.project = {
                        uid: this.project.getUID(),
                        app: this.project.pkg,
                        platform: null,
                        device: null
                    };

                    if(this.project.platform!=null){
                        o.project.platform = {
                            api: this.project.getPlatform().getApiVersion(),
                            uid: this.project.getPlatform().getUID()
                        };
                    }

                    if(this.project.getDevice()!=null){
                        const dev = this.project.getDevice();
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
                    break;*/
                default:
                    o[i] = this[i];
                    break;
            }
        }

        return o;
    }

    static fromJsonObject(pData:any):AssuranceReport {
      const o = new AssuranceReport(pData);

      return o;
    }
}
