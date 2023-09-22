import AssuranceModel from "../common/AssuranceModel";


export class PrivacyModel extends AssuranceModel {



    constructor( pConfig:any = null) {
        super(pConfig);

        if(pConfig!=null) for(const i in pConfig) this[i]=pConfig[i];
    }



}
