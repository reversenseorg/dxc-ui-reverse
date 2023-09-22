import {IntentFilter} from "./IntentFilter";
import AndroidComponent from "./AndroidComponent";
import {NodeType} from "../../components/search/ctrl/ModelNode";
import {IconModel} from "../../base/icon/IconModel";
import {NodeInternalType} from "../NodeInternalType";


export default class AndroidReceiver extends AndroidComponent
{

  __:NodeInternalType = NodeInternalType.ANDROID_RECEIVER;
    _t:NodeType = NodeType.RECEIVER;
    _icon?:IconModel = null;

    constructor(config:any=null){
        super();

        // auto config
        if(config != null){
            for(let i in config)
                if(this[i] !==  undefined)
                    this[i] = config[i];
        }
    }
}
