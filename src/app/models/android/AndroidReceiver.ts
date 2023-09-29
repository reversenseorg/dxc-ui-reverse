import {IntentFilter} from "./IntentFilter";
import AndroidComponent from "./AndroidComponent";
import {NodeType} from "../../components/search/ctrl/ModelNode";
import {ICON_TYPE, IconModel} from "../../base/icon/IconModel";
import {NodeInternalType} from "../NodeInternalType";
import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";


export default class AndroidReceiver extends AndroidComponent
{

  override __:NodeInternalType = NodeInternalType.ANDROID_RECEIVER;
    _t:NodeType = NodeType.RECEIVER;
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
}
