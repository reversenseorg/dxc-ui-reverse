import {IntentFilter} from "./IntentFilter";
import AndroidComponent from "./AndroidComponent";
import {IconModel} from "../../base/icon/IconModel";
import {NodeType} from "../../components/search/ctrl/ModelNode";
import {NodeInternalType} from "../NodeInternalType";
import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";

export default class AndroidService extends AndroidComponent
{
  override __:NodeInternalType = NodeInternalType.ANDROID_SERVICE;
    _t:NodeType = NodeType.SERVICE;
    _icon?:Nullable<IconModel> = null;

    constructor(config:any=null){
        super();

        // auto config
        if(config != null){
            for(let i in config)
                if((this as IStringIndex<any>)[i] !== undefined)
                    (this as IStringIndex<any>)[i] = config[i];

        }
    }


    static fromXml(xmlobj:any):AndroidService{
        let act:AndroidService = new AndroidService();

        for(let j in xmlobj){
            switch(j){
                case '$':
                    act.setAttributes(xmlobj.$);
                    act.label = (act.attr as any).label;
                    act.name = (act.attr as any).name;



                    break;
                case 'intent-filter':
                    for(let i=0; i<xmlobj[j].length; i++){
                        act.addIntentFilters(
                            IntentFilter.from(xmlobj[j][i])
                        );
                    }
                    break;
            }
        }



        return act;
    }
}
