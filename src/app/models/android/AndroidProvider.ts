import {IntentFilter} from "./IntentFilter";
import AndroidComponent from "./AndroidComponent";
import {NodeType} from "../../components/search/ctrl/ModelNode";
import {IconModel} from "../../base/icon/IconModel";
import {NodeInternalType} from "../NodeInternalType";


export default class AndroidProvider extends AndroidComponent
{
    __:NodeInternalType = NodeInternalType.ANDROID_PROVIDER;
    _t:NodeType = NodeType.PROVIDER;

    _icon?:IconModel = null;

    constructor(config=null){
        super();

        // auto config
        if(config != null){
            for(let i in config)
                if(this[i] !==  undefined)
                    this[i] = config[i];

        }
    }

    static fromXml(xmlobj:any):AndroidProvider{
        let act:AndroidProvider = new AndroidProvider();

        for(let j in xmlobj){
            switch(j){
                case '$':
                    act.setAttributes(xmlobj.$);
                    act.label = act.attr.label;
                    act.name = act.attr.name;



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
