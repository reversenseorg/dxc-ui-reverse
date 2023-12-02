/**
 * @class
 * @author Georges-B. MICHEL
 */
import {Inspector} from "./Inspector";
import DexcaliburEngine from "./DexcaliburEngine";
import {AppIcon} from "./AppIcon";
import {Nullable} from "../base/Nullable";

interface DigestSet {
  [type:string] :string
}

export default class DexcaliburProject
{

    apk?:any = null;

    /**
     * @type {DexcaliburEngine}
     * @field Dexcalibur engine (context)
     */
    engine:any = null;

    /**
     * @type {String}
     * @field Project UID
     */
    uid:string = '';

    /**
     * @type {String}
     * @field Package name of the target
     */
    pkg:Nullable<string> = null;
    package:Nullable<string> = null;

    /**
     * @field Instance of project's configuration
     */
    config:any = null;

    /**
     * @field Flag
     */
    nofrida:boolean = false;

    /**
     * @field the default android API version to use.
     */
    apiVersion:Nullable<string> = null;

    // set the Search API which allow the user to perform search
    /**
     *
     * @type {SearchAPI}
     * @field the finder API configured for this project
     */
    find:any = null;

    // set SC analyzer
    /**
     * @type {Analyzer}
     * @field The static analyzer for this project
     */
    analyze:any = null;

    // dex helper
    dexHelper:any = null;

    //package Patcher
    // packagePatcher:PackagePatcher = null;

    // hook, deprecated here ?
    hook:any = null;

    // set the workspace API
    /**
     * @type {Workspace}
     * @field Project workspace
     */
    workspace:any = null;

    // setup File Analyzer
    /**
     * @type {DataAnalyzer}
     * @field Raw data analyzer unit
     */
    dataAnalyzer:any = null;

    /**
     * @type {Bus}
     * @field The event bus
     */
    bus:any = null;

    /**
     * @type {AndroidAppAnalyzer}
     * @field Application topology analyzer unit (depend of application type : apk,bin, ...)
     */
    appAnalyzer = null;

    /**
     * @type {Inspector[]}
     * @field All inspectors
     */
    inspectors:Inspector[] = [];

    // FridaBuilder make Frida script chunk from cls
    fridaBuilder:any = null;

    //
    graph:any = null;

    // NEW

    /**
     * Ready flag
     * @field
     */
    ready:boolean = false;

    /**
     * Target platform
     * @field
     */
    platform:any = null; // Platform

    /**
     * Default device
     */
    device:any = null; // Device

    /**
     * @field Class representing target application
     */
    application:any = null; // AndroidApplication

    /**
     * Application Icon
     *
     * @type {AppIcon}
     * @field
     */
    icon:Nullable<AppIcon> = null;

    /**
     * A set of package checksum
     *
     * @type {DigestSet}
     * @field
     */
    checksum:DigestSet = {};


    /**
     *
     * @param {DexcaliburEngine} pEngine  Instance of the DexcaliburEngine (holding the context)
     * @param {String} pUID The UID of the project, an unique name for this project
     * @constructor
     */
    constructor( pEngine:any, pUID:string){

        this.engine = pEngine;
        this.uid = pUID;
    }


    /**
     * To get the project UID
     *
     * @returns {String} ProjectUID
     * @method
     */
    getUID():string{
        return this.uid;
    }

    /**
     * To get the inspector with specified name
     *
     * @param {string} pName name
     * @returns {Nullable<Inspector>} Inspector instance
     * @method
     */
    getInspector( pName:string):Nullable<Inspector>{
        const res = this.inspectors.filter((vInspector:Inspector)=>{
            return (vInspector.name===pName);
        });

        if(res.length > 0){
            return res[0];
        }else{
            return null;
        }
    }

    /**
     * To set default device
     * @method
     */
    setDevice( pDevice:any){
        this.device = pDevice;
        this.analyze.useSyscalls(this.device.getSyscallList());
    }


    /**
     * To get device target of the project
     *
     * @method
     */
    getDevice():any{
        return this.device;
    }


    /**
     * To get Search Engine
     *
     * @returns {Finder.SearchAPI} Search engine for this project
     * @method
     */
    getSearchEngine():any{
        return this.find;
    }


    /**
     * To get the data analyzer.
     *
     * @returns {DataAnalyzer} The data analyzer
     * @method
     */
    getDataAnalyzer():any{
        return this.dataAnalyzer;
    }


    /**
     * To get the application analyzer, which includes manifest and permission analysis.
     *
     * @returns {AndroidAppAnalyzer} The application analyzer
     * @method
     */
    getAppAnalyzer():any{
        return this.appAnalyzer;
    }


    /**
     * To get the bytecode static code analyzer which contains the internal database.
     *
     * @returns {Analyzer} The internal bytecode analyzer
     * @method
     */
    getAnalyzer():any{
        return this.analyze;
    }


    /**
     * To get 'ready' status
     *
     * @returns {Boolean} TRUE if the project has been successully opened and analyzed, else FALSE
     * @method
     */
    isReady():boolean{
        return this.ready;
    }


    /**
     * To get application package name
     *
     * @returns {String} Applciation package name
     * @function
     */
    getPackageName():Nullable<string>{
        return this.pkg;
    }

    setPackageName( pPackageName:string){
        this.pkg = pPackageName;
    }
}

