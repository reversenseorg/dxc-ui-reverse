import AndroidActivity from "./AndroidActivity";
import AndroidProvider from "./AndroidProvider";
import AndroidService from "./AndroidService";
import AndroidReceiver from "./AndroidReceiver";
import {AndroidAttributeSet} from "./AndroidAttribute";
import {AndroidManifest} from "./AndroidManifest";
import DexcaliburProject from "../DexcaliburProject";
import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";



const ANDROID_PREFIX = "android:";
const ANDROID_PREFIX_LEN = 8;

export default class AndroidApplication
{
    /*static MODEL:any = {
        allowTaskReparenting:["true" | "false"],
        allowBackup:["true" | "false"],
        allowClearUserData:["true" | "false"],
        backupAgent:"string",
        backupInForeground:["true" | "false"],
        banner:"drawable resource",
        debuggable:["true" | "false"],
        description:"string resource",
        directBootAware:["true" | "false"],
        enabled:["true" | "false"],
        extractNativeLibs:["true" | "false"],
        fullBackupContent:"string",
        fullBackupOnly:["true" | "false"],
        hasCode:["true" | "false"],
        hardwareAccelerated:["true" | "false"],
        icon:"drawable resource",
        isGame:["true" | "false"],
        killAfterRestore:["true" | "false"],
        largeHeap:["true" | "false"],
        label:"string resource",
        logo:"drawable resource",
        manageSpaceActivity:"string",
        name:"string",
        networkSecurityConfig:"xml resource",
        permission:"string",
        persistent:["true" | "false"],
        process:"string",
        restoreAnyVersion:["true" | "false"],
        requiredAccountType:"string",
        resizeableActivity:["true" | "false"],
        restrictedAccountType:"string",
        supportsRtl:["true" | "false"],
        taskAffinity:"string",
        testOnly:["true" | "false"],
        theme:"resource or theme",
        uiOptions:["none" | "splitActionBarWhenNarrow"],
        usesCleartextTraffic:["true" | "false"],
        vmSafeMode:["true" | "false"]
    }*/

    androidPrefixed:string[] = [];
    attr:AndroidAttributeSet = {};

    activities:AndroidActivity[] = [];
    activityAliases = [];
    launcherActivities = [];
    services:AndroidService[] = [];
    receivers:AndroidReceiver[] = [];
    providers:AndroidProvider[] = [];

    usesLibraries = [];
    metaData = [];
    manifest: Nullable<AndroidManifest> = null;

    dataDir:string = "";

    __context:Nullable<DexcaliburProject> = null;

    constructor(pContext:DexcaliburProject, config:any=null){

        if(config!=null)
            for(let i in config)
                if((this as IStringIndex<any>)[i] !== undefined)
                    (this as IStringIndex<any>)[i] = config[i];
    }

    setManifest(pManifest:AndroidManifest):void{
        this.manifest = pManifest;
    }


    getMinApiVersion():Nullable<string>{
        if(this.manifest != null){
            return this.manifest.getMinSdkVersion();
        }else{
            return null;
        }
    }


    getTargetApiVersion():Nullable<string>{
        if(this.manifest != null){
            return this.manifest.getTargetSdkVersion();
        }else{
            return null;
        }
    }

    /**
     * To serialize to XML
     * @returns {String} The activity data ready to be writen into an XML file
     * @function
     */
    toXmlObject():any {
        let o: any = {}
        o.$ = {};
        for (let i in this.attr) {
            if (this.androidPrefixed.indexOf(i) > -1)
                o.$[ANDROID_PREFIX + i] = this.attr[i];
            else
                o.$[i] = this.attr[i];
        }

        return o;
    }
}
