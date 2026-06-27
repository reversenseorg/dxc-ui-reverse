/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

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
