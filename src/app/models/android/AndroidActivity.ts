


import ModelClass from "../ModelClass";
import {IntentFilter} from "./IntentFilter";
import AndroidComponent from "./AndroidComponent";
import {AndroidPermission} from "./Permissions";
import {ICON_TYPE, IconModel} from "../../base/icon/IconModel";
import {NodeInternalType} from "../NodeInternalType";
import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";



// TODO : not integrated
class AndroidActivityAlias
{
    enabled:Nullable<boolean> = null;
    exported:Nullable<boolean> =null;
    icon:Nullable<string> =null;
    label:Nullable<string> =null;
    name:Nullable<string> =null;
    permission:Nullable<AndroidPermission> =null;
    targetActivity:Nullable<AndroidActivity> =null;

    constructor(config:any=null){

        if(config != null){
            for(let i in config)
                if((this as IStringIndex<any>)[i] !==  undefined)
                    (this as IStringIndex<any>)[i] = config[i];
        }
    }


    toXmlObject():any{
        let o:any = {$:{}};

        for(let i in this){
            o.$["android:"+i] = this[i];
        }

        return o;
    }

    static fromXml(xmlobj:any):AndroidActivityAlias{
        let act = new AndroidActivityAlias();

        for(let i in xmlobj.$){
            if(i.indexOf("android:")>-1)
                (act as IStringIndex<any>)[i.substr(8)] = xmlobj.$[i];
            else
                (act as IStringIndex<any>)[i] = xmlobj.$[i];
        }

        return act;
    }

}

/**
 * To represent an activity declared into the Android manifest
 *
 */
export default class AndroidActivity extends AndroidComponent
{
    override __:NodeInternalType = NodeInternalType.ANDROID_ACTIVITY;
    _t?:string;

    _icon?:Nullable<IconModel> = null;

    static MODEL = {
        allowEmbedded:["true" , "false"],
        allowTaskReparenting:["true" , "false"],
        alwaysRetainTaskState:["true" , "false"],
        autoRemoveFromRecents:["true" , "false"],
        banner:"drawable resource",
        clearTaskOnLaunch:["true" , "false"],
        colorMode:[ "hdr" , "wideColorGamut"],
        configChanges:["mcc", "mnc", "locale",
            "touchscreen", "keyboard", "keyboardHidden",
            "navigation", "screenLayout", "fontScale",
            "uiMode", "orientation", "density",
            "screenSize", "smallestScreenSize"],
        directBootAware:["true" , "false"],
        documentLaunchMode:["intoExisting" , "always" ,
            "none" , "never"],
        enabled:["true" , "false"],
        excludeFromRecents:["true" , "false"],
        exported:["true" , "false"],
        finishOnTaskLaunch:["true" , "false"],
        hardwareAccelerated:["true" , "false"],
        icon:"drawable resource",
        immersive:["true" , "false"],
        label:"string resource",
        launchMode:["standard" , "singleTop" ,
            "singleTask" , "singleInstance"],
        lockTaskMode:["normal" , "never" ,
            "if_whitelisted" , "always"],
        maxRecents:"integer",
        maxAspectRatio:"float",
        multiprocess:["true" , "false"],
        name:"string",
        noHistory:["true" , "false"],
        parentActivityName:"string",
        persistableMode:["persistRootOnly" ,
            "persistAcrossReboots" , "persistNever"],
        permission:"string",
        process:"string",
        relinquishTaskIdentity:["true" , "false"],
        resizeableActivity:["true" , "false"],
        screenOrientation:["unspecified" , "behind" ,
            "landscape" , "portrait" ,
            "reverseLandscape" , "reversePortrait" ,
            "sensorLandscape" , "sensorPortrait" ,
            "userLandscape" , "userPortrait" ,
            "sensor" , "fullSensor" , "nosensor" ,
            "user" , "fullUser" , "locked"],
        showForAllUsers:["true" , "false"],
        stateNotNeeded:["true" , "false"],
        supportsPictureInPicture:["true" , "false"],
        taskAffinity:"string",
        theme:"resource or theme",
        uiOptions:["none" , "splitActionBarWhenNarrow"],
        windowSoftInputMode:["stateUnspecified",
            "stateUnchanged", "stateHidden",
            "stateAlwaysHidden", "stateVisible",
            "stateAlwaysVisible", "adjustUnspecified",
            "adjustResize", "adjustPan"]
    }


    constructor(pConfig:any=null){
        super();

        // auto config
        if(pConfig != null){
            for(let i in pConfig)
                if((this as IStringIndex<any>)[i] !==  undefined)
                    (this as IStringIndex<any>)[i] = pConfig[i];

        }
    }


    static fromXml(xmlobj:any):AndroidActivity{
        let act:AndroidActivity = new AndroidActivity();

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
