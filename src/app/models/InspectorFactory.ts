import {INSPECTOR_TYPE} from "./Inspector";
import {Nullable} from "../base/Nullable";
import {HookRevision} from "./HookRevision";
import {NodeInternalType} from "./NodeInternalType";
import {Operation} from "./search/MerlinSearchRequest";
import {CustomCode} from "./CustomCode";
import {FlattenTagCategoryOptions} from "./tags/Tag";


export interface HookStrategySelectorOptions {
    type: string;
    uid?:Nullable<any>;
    req?:Nullable<string|Operation[]>;
    opts?:any;
}


export interface HookStrategyOptions {
    name:string;
    search:HookStrategySelectorOptions;
    autoEmit?:boolean;
    emitEvent?:Nullable<string>;
    descr?:Nullable<string>;
    before?:Nullable<string>;
    after?:Nullable<string>;
    replace?:Nullable<string>;
    loadOn?:Nullable<string>;
    unloadOn?:Nullable<string>;
    deprecated?:boolean;
    removed?:boolean;
    [key:string] :any;
}



export type CodeLang = "js" | "ts";


export interface CustomCodeOptions {
    fn?:Function;
    compiled?:string;
    source?:string;
    lang?:CodeLang;
    errors?:string;
    description?:string;
}

export interface EventListeners {
    [p:string]: any;
}

export interface EventListenersSource {
    [p:string]: CustomCodeOptions
}

export interface EventListenersCode {
    [p:string]: CustomCode
}




export enum UpgradeLevel {
    PATCH,
    MINOR,
    MAJOR
}

export interface HookSetOptions {
    id?:Nullable<string>;
    name?:Nullable<string>;
    description?:Nullable<string>;
    require?:string[];
    hookShare?:Record<string,any>;
    prologue?:string;
    strategies: HookStrategyOptions[]
}


export interface InspectorDbmsOptions {
    dbms:string;
    type:string;
    name: string;
}

export interface InspectorFactoryOptions {
    id?:string;
    name?:string;
    version?:string;
    description?:Nullable<string>;
    deprecated?:boolean;
    removed?:boolean;
    webapi?:Nullable<any>;
    useGUI?:Nullable<boolean>;
    startStep: INSPECTOR_TYPE;
    db?:Nullable<InspectorDbmsOptions>;
    //tags?:Nullable<TagDefinitions>;
    tags?:Nullable<FlattenTagCategoryOptions[]>;
    color?:Nullable<string>;
    eventListeners?:EventListeners;
    eventListenerSources?:EventListenersSource;
    eventListenersCode?:EventListenersSource|EventListenersCode;
    hookSet?:HookSetOptions;
    revisions?:HookRevision[];
    require?:string[];
}
/**
 * There is one InspectorFactory for each type prototype of Inspector.
 *
 * This instance is shared by every project and it is a member of DexcaliburEngine objects.
 * Its purpose if to create Inspector instance per project.
 *
 *
 *
 * @class
 */
export default class InspectorFactory
{
    __ = NodeInternalType.INSPECTOR_PLUGIN;
    _config:Nullable<InspectorFactoryOptions> = null;




    id:Nullable<string>=null;
    name:Nullable<string> = null;
    description:Nullable<string> = null;
    version:string = "1.0.0";
    color:any = null;
    startStep:INSPECTOR_TYPE = INSPECTOR_TYPE.ON_DEMAND;
    hookSet:Nullable<HookSetOptions> = null;
    webapi: Nullable<any> = null;
    db:Nullable<any> = null;
    eventListeners:EventListeners = {};
    eventListenersCode:EventListenersCode = {};
    eventListenerSources:EventListenersSource = {};
    useGUI = false;
    require:string[] = [];
    revisions:HookRevision[] = [];
    itags:FlattenTagCategoryOptions[] = [];

    /**
     * Flag. TRUE if the factory has been created from an older version of DxEngine
     * and will be removed in future
     *
     * The user should migrate or remove this inspector.
     *
     * @type {boolean}
     * @field
     */
    deprecated = false;

    /**
     * Flag. TRUE if the factory has been created from an older version of DxEngine,
     * and has been removed from current version.
     *
     * The user should remove this inspector.
     *
     * @type {boolean}
     * @field
     */
    removed = false;

    //author:UserAccount
    /**
     * The step when the inspector must be deployed
     */
    step:INSPECTOR_TYPE = INSPECTOR_TYPE.ON_DEMAND;

    tags:number[] = [];

    /**
     * Flag. True if webapi is ready
     * @private
     */
    private _r:boolean  = false;

    constructor( pModel:InspectorFactoryOptions ){
        this._config = pModel;
        this.step = pModel.startStep;

        if(pModel.id!=null){
            this.id = pModel.id;
        }

        if(pModel.name != null) this.name = pModel.name;
        if(pModel.description != null) this.description = pModel.description;
        if(pModel.version != null) this.version = pModel.version;
        if(pModel.startStep != null) this.startStep = pModel.startStep;
        if(pModel.color != null) this.color = pModel.color;
        if(pModel.hookSet != null){
            this.hookSet = pModel.hookSet;
            if(this.name==null||this.name.length==0) this.name = pModel.hookSet.name;
            if(this.description==null||this.description.length==0) this.description = pModel.hookSet.description;
            if(this.id==null||this.id.length==0) this.id = pModel.hookSet.id;
            if(pModel.hookSet.id==null && this.id!=null && this.id.length>0) pModel.hookSet.id = this.id;
        }
        if(pModel.require != null) this.require = pModel.require;
        if(pModel.db != null) this.db = pModel.db;

        if(pModel.tags != null)
            this.itags = pModel.tags;
        else
            this.itags = [];

        if(pModel.useGUI != null) this.useGUI = pModel.useGUI;
        if(pModel.deprecated != null) this.deprecated = pModel.deprecated;
        if(pModel.removed != null) this.removed = pModel.removed;
        if(pModel.eventListeners != null) this.eventListeners = pModel.eventListeners;
        if(pModel.revisions != null) this.revisions = pModel.revisions;
        if(pModel.eventListenerSources != null) this.eventListenerSources = pModel.eventListenerSources;
        if(pModel.hasOwnProperty('webapi'))  this.webapi = pModel.webapi

    }

    getUID():Nullable<string>  {
        return this.id;
    }

    toJsonObject(pOption?: any): any {
        const o:any = {};
        for(let k in this){
            switch(k){
                case "context":
                    // skip
                    break;
                default:
                    o[k] = this[k];
                    break;
            }
        }
        return o;
    }
}