import {NodeInternalType} from "../NodeInternalType";
import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";

export class AndroidPermission
{
  __:NodeInternalType = NodeInternalType.ANDROID_PERM;
    description:Nullable<string> = null;
    label:Nullable<string> = null;
    name:Nullable<string> = null;
    permissionGroup:Nullable<AndroidPermissionGroup> = null;
    protectionLevel:any = null;
    apiVersion:number = 1;
    controls:any = null;
    query:any = null;

    __custom:boolean = false;
    __tag:any = [];
    __raw:any = null;

    constructor(config:any=null){

        if(config != null){
            for(let i in config){
                (this as IStringIndex<any>)[i] = config[i];
            }
        }
    }

    getName():Nullable<string>{
        return this.name;
    }

    addTag(tag:string){
        if(this.__tag.indexOf(tag)==-1)
            this.__tag.push(tag);
    }

    getTags():any{
        return this.__tag;
    }


    isCustom():boolean{
        return this.__custom===true;
    }

    setCustom(bool:boolean){
        this.__custom = bool;
    }

    update(otherPerm:AndroidPermission, override:boolean=false){
        for(let i in otherPerm){
            if(override || (this as IStringIndex<any>)[i]===null){
                (this as IStringIndex<any>)[i] = (otherPerm as IStringIndex<any>)[i];
            }
        }
    }

    toXmlObject():any{
        let o:any = {$:{}};

        for(let i in this){
            o.$["android:"+i] = this[i];
        }

        return o;
    }

    static fromXml(xmlobj:any):AndroidPermission{
        let p:AndroidPermission = new AndroidPermission();

        p.__raw = xmlobj;
        for(let i in xmlobj){
            if(i.startsWith('android:')){
                (p as IStringIndex<any>)[i.substr(8)] = xmlobj[i];
            }else{
                (p as IStringIndex<any>)[i] = xmlobj[i];
            }
        }

        return p;
    }

    toJsonObject():any{
        let o:any = {};

        o.name = this.name;
        o.label = this.label;
        o.description = this.description;
        o.apiVersion = this.apiVersion;
        o.controls = this.controls;
        o.query = this.query;


        if(this.permissionGroup != null)
            o.permissionGroup = this.permissionGroup.name;
        else
            o.permissionGroup = null;


        if(this.protectionLevel != null){
            if(this.protectionLevel instanceof Array){
                o.protectionLevel = [];
                for(let i=0; i<o.protectionLevel.length; i++){
                    o.protectionLevel.push(this.protectionLevel[i].name);
                }
            }else
                o.protectionLevel = this.protectionLevel.name;
        }else
            o.protectionLevel = null;

        return o;
    }
}


export class AndroidPermissionGroup
{
    description:Nullable<string> = null;
    label:Nullable<string> = null;
    name:Nullable<string> = null;

    children:AndroidPermission[] = [];

    constructor(config:any=null){

        // auto config
        if(config != null){
            for(let i in config)
                if((this as IStringIndex<any>)[i] !== undefined)
                    (this as IStringIndex<any>)[i] = config[i];
        }

        for(let i=0; i<this.children.length; i++){
            if(this.children[i].permissionGroup === null){
                this.children[i].permissionGroup = this;
            }
        }
    }


    toXmlObject():any{
        let o:any = {$:{}};

        for(let i in this){
            o.$["android:"+i] = this[i];
        }

        return o;
    }

    static fromXml(xmlobj:any):AndroidPermissionGroup{
        let p = new AndroidPermissionGroup();
        for(let i in xmlobj){
            if(i.startsWith('android:'))
                (p as IStringIndex<any>)[i.substr(8)] = xmlobj[i];
            else
                (p as IStringIndex<any>)[i] = xmlobj[i];
        }
        return p;
    }
}


export class AndroidPermissionTree
{
    icon:Nullable<string> = null;
    label:Nullable<string> = null;
    name:Nullable<string> = null;

    constructor(config:any=null){

        // auto config
        if(config != null){
            for(let i in config)
                if((this as IStringIndex<any>)[i] !== undefined)
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

    static fromXml(xmlobj:any):AndroidPermissionTree{
        let p = new AndroidPermissionTree();
        for(let i in xmlobj){
            if(i.startsWith('android:'))
                (p as IStringIndex<any>)[i.substr(8)] = xmlobj[i];
            else
                (p as IStringIndex<any>)[i] = xmlobj[i];
        }
        return p;
    }
}


export class AndroidProtectionLevel
{
    static NORMAL:AndroidProtectionLevel = new AndroidProtectionLevel({ name:"normal" });
    static SIGNATURE:AndroidProtectionLevel = new AndroidProtectionLevel({ name:"signature" });
    static SPECIAL:AndroidProtectionLevel = new AndroidProtectionLevel({ name:"special" });
    static DANGEROUS:AndroidProtectionLevel = new AndroidProtectionLevel({ name:"dangerous" });
    static PRIVILEGED:AndroidProtectionLevel = new AndroidProtectionLevel({ name:"privileged" });
    static DEVELOPMENT:AndroidProtectionLevel = new AndroidProtectionLevel({ name:"development" });

    name:Nullable<string> = null;

    constructor(config:any=null){

        if(config != null){
            for(let i in config){
                (this as IStringIndex<any>)[i] = config[i];
            }
        }
    }
}


export class AndroidPermissionSdk23
{
    static MODEL = {
        name:"string",
        maxSdkVersion:"integer"
    }

    name:Nullable<string> = null;
    maxSdkversion:Nullable<string> = null;

    constructor(){

    }


    toXmlObject():any{
        let o:any = {$:{}};

        for(let i in this){
            o.$["android:"+i] = this[i];
        }

        return o;
    }

    static fromXml(xmlobj:IStringIndex<any>){
        let o = new AndroidPermissionSdk23();

        for(let i in xmlobj){
            if(i.startsWith('android:')){
                (o as IStringIndex<any>)[i.substr(8)] = xmlobj[i];
            }else{
                (o as IStringIndex<any>)[i] = xmlobj[i];
            }
        }

        return o;
    }
}
