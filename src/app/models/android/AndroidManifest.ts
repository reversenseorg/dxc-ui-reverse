import DexcaliburProject from "../DexcaliburProject";
import {AndroidPermission, AndroidPermissionGroup, AndroidPermissionSdk23, AndroidPermissionTree} from "./Permissions";
import AndroidApplication from "./AndroidApplication";
import {AndroidAttributeSet} from "./AndroidAttribute";
import {
    AndroidConfiguration, AndroidFeature,
    AndroidGlTexture,
    AndroidInstrumentation,
    AndroidScreen,
    AndroidSupportedScreen
} from "./DeviceComponent";
import {Nullable} from "../../base/Nullable";

export class AndroidManifest
{
    attributes:AndroidAttributeSet = {};

    usesPermissions:AndroidPermission[] = [];
    permissions:AndroidPermission[] = [];
    permissionTrees:AndroidPermissionTree[] = [];
    permissionGroups:AndroidPermissionGroup[] = [];
    instrumentation:AndroidInstrumentation[] = [];
    usesPermissionsSdk23:AndroidPermissionSdk23[] = [];

    usesSdk:any = {};

    usesConfiguration:AndroidConfiguration[] = [];
    usesFeatures = [];

    supportsScreens:AndroidSupportedScreen[] = [];
    compatibleScreens:AndroidScreen[] = [];
    supportsGlTextures:AndroidGlTexture[] = [];
    application:Nullable<AndroidApplication> = null;

    __context:Nullable<DexcaliburProject> = null;
    __additionalContent:any = {};

    constructor(ctx:Nullable<DexcaliburProject> = null){


        this.usesSdk = {
            'android:minSdkVersion': null,
            'android:targetSdkVersion': null,
        };

        this.__context = ctx;
    }

    setAttributes(attrs:any){
        this.attributes = attrs;
    }

    getAttrVersionCode():string{
        return this.attributes['android:versionCode'];
    }

    getAttrVersionName():string{
        return this.attributes['android:versionName'];
    }

    getAttrPackage():string{
        return this.attributes['package'];
    }

    getAttrPlatformBuildVersionCode():string{
        return this.attributes['platformBuildVersionCode'];
    }

    getAttrPlatformBuildVersionName():string{
        return this.attributes['platformBuildVersionName'];
    }

    getAttrXmlNS():string{
        return this.attributes['xmlns:android'];
    }

    getMinSdkVersion():string{
        return this.usesSdk['android:minSdkVersion'];
    }

    getTargetSdkVersion():string{
        return this.usesSdk['android:targetSdkVersion'];
    }

    /**
     * To get the Application description as declared into the manifest
     * @returns {AndroidApplication} The manifest's description of the application
     */
    getApplication():Nullable<AndroidApplication>{
        return this.application;
    }

    /**
     * To get the permissions of the applciaton as declared into the manifest
     *
     */
    getPermissions(){
        return this.permissions;
    }

    /**
     * To check is the application require the given permission
     * @param {AndroidPermission | String} perm The permission to search
     * @returns {Boolean} Return TRUE if the given permission is required, else FALSE
     */
    requirePermission(perm:AndroidPermission|string):boolean{
        let res:boolean = false;
        if(perm instanceof AndroidPermission){
            this.usesPermissions.map(function(p){
                if(p.getName()===perm.getName())
                    res = true;
            })
        }else{
            this.usesPermissions.map(function(p){
                if(p.getName()===perm)
                    res = true;
            })
        }
        return res;
    }


}
