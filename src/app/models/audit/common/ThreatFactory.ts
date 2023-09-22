import CodeThreat, {CodeThreatOptions} from "./CodeThreat";


export class ThreatFactory {

    static newCodeThreatByTechnic( pTechnicUID:string, pConfig:CodeThreatOptions):CodeThreat {
        return new CodeThreat({
            ...pConfig,
            uid: "att&ck:"+pTechnicUID+":"+pConfig.id
        })
    }

}
