
const PLATFORM_RE:RegExp = new RegExp('(?<source>[^_.]+)_(?<name>[^_.]+)_(?<version>[^_.]+)_(?<vendor>[^_.]+)\.(?<format>[^.]+)');
const LOCAL_PLATFORM_RE:RegExp = new RegExp('(?<source>[^_.]+)_(?<name>[^_.]+)_(?<version>[^_.]+)_(?<vendor>[^_.]+)');


export default class Platform
{
    uid:string = null;
    name:string = null;
    version:string = null;
    source:string = null;
    vendor:string = null;
    model:string = null;
    format:string = null;
    path:string = null;
    hash:string = null;
    size:number = null;
    remoteURL:string = null;
    localPath:string = null;
    installed:boolean = false;

    apiVersion:string = null;
    binaryPath:string = null;

    _installing:boolean = false;

    constructor(pPlatformConfig:any ){

        for(let i in pPlatformConfig) this[i] = pPlatformConfig[i];

        return this;
    }

    static fromRemoteName( pName:string):Platform{
        let matches:any = PLATFORM_RE.exec(pName);

        if(matches[0] === pName){
            return new Platform({
                source: matches.groups.source,
                name: matches.groups.name,
                version: matches.groups.version,
                vendor: matches.groups.vendor,
                format: matches.groups.format
            });
        }else{
            return null;
        }

    }

    static fromLocalName( pName:string):Platform{
        let matches:any = LOCAL_PLATFORM_RE.exec(pName);

        if(matches[0] === pName){
            return new Platform({
                source: matches.groups.source,
                name: matches.groups.name,
                version: matches.groups.version,
                vendor: matches.groups.vendor
            });
        }else{
            return null;
        }
    }


    getRemotePath():string{
        return this.remoteURL;
    }

    getLocalPath():string{
        return this.localPath;
    }

    getUID():string{
        return this.uid = `${this.source}_${this.name}_${this.version}_${this.vendor}`;
    }

    /**
     * To return the name of the folder where the
     * Platform  is stored.
     */
    getInternalName():string{
        // TODO : add file path check in order to avoid traversal path
        return this.name+"_"+this.apiVersion;
    }

    isAndroid():boolean{
        return this.name.indexOf("android")>-1;
    }

    isIOS():boolean{
        return this.name.indexOf('ios')>-1;
    }


    isVmSupported(){
        if(this.isAndroid())
            return true;
        else
            return false;
    }



    getPublicVersion():string{
        return this.name+":"+this.version;
    }

    getApiVersion():string{
        return this.apiVersion;
    }

    getBinPath():string{
        return this.binaryPath;
    }




    toJsonObject():any{
        let o:any = {};

        for(let i in this){
            if(typeof this[i] == 'function') continue;
            o[i] = this[i];
        }

        return o;
    }

}
