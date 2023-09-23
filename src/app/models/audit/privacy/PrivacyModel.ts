import AssuranceModel from "../common/AssuranceModel";
import {IStringIndex} from "../../../base/IStringIndex";


export class PrivacyModel extends AssuranceModel {



    constructor( pConfig:any = null) {
        super(pConfig);

        if(pConfig!=null) for(const i in pConfig) (this as IStringIndex<any>)[i]=pConfig[i];
    }



}
