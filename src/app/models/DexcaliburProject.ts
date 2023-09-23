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
     * @type {*}
     * @field Connector
     */
    connector:any = null;

    /**
     * @field
     */
    simplifier:any = null;

    saveManager:any = null;

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
     * To select the way to store the internal data
     *
     * @param {String} pConnectorType Connector type
     * @method
     */
    /*
    setConnector( pConnectorType:string):void{
        this.connector = ConnectorFactory.getInstance().newConnector( pConnectorType, this);
    }*/

    /**
     * @return {boolean}
     * @method
     */
    hasVM():boolean{
        return this.platform.isVmSupported();
    }

    /**
     * @return {DexcaliburVM}
     * @method
     */
    getVM():any {
        return this.platform.getNewDexcaliburVM(this);
    }

    /**
     * @return {Simplifier}
     * @method
     */
    getSimplifier():any{
        // refresh binding
        return this.simplifier;
    }
    /**
     * To get DexcaliburEngine instance associated to this project
     *
     * @returns {DexcaliburEngine} DexcaliburEngine instance
     * @method
     */
    getContext():DexcaliburEngine{
        return this.engine;
    }

    /**
     * To suggest a new project name
     *
     * @param {*} pUID
     * @method
     */
    static suggests( pUID:string):string{
        // bind suggest
      return "";
    }

    /**
     * To detect if there is a project with the specified UID
     *
     * @param {String} pUID Project UID
     * @returns {Boolean} TRUE if a project exists, else FALSE
     * @method
     */
    static exists( pUID:string):boolean{
      /*
      // refresh
        let proj = DexcaliburWorkspace.getInstance().listProjects();
        let status = false;

        proj.map((vProject)=>{
            if(vProject === pUID)
                status = true;
        });
*/
        return false;
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
     *
     * @param {*} pPath
     */
    useAPK( pPath:string):void{
        // remote binding
    }

    /**
     * To synchronize project platform used during analysis with device and APK
     *
     * @param {*} pName
     * @method
     * @async
     */
    async synchronizePlatform( pName:string):Promise<boolean>{
        // remote binding
        return true;
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
     * To open an existing project
     *
     * Read `project.json` file
     *
     * @method
     */
    async open(){
        //throw new Error('[DEXCALIBUR PROJECT] open() : Not implemented');
        // re-scan
        return this.fullscan();
    }

    /**
     *
     * @param {*} pContext
     * @param {*} pProjectUID
     * @param {*} pConfigPath
     */
    static load( pEngine:DexcaliburEngine, pProjectUID:string, pConfigPath:Nullable<string> = null):Nullable<DexcaliburProject>
    {
        // remote binding
      return null;
    }

    /**
     * To save project metadata into 'project.json'
     *
     */
    save():void{
        // remote binding
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
     * To set target platform to use during analysis
     *
     * Replace `Project.useAPI()`
     *
     * @param {String} pVersion
     */
    async usePlatform( pVersion:string){
        // remote binding
        return this;
    };


    /**
     * To perform a scan of the application byetcode only.
     *
     * All reference to Android system classes will be tagged MissingReference or VMBinding
     *
     * @param {string} path Optional, the path of the folder containing the decompiled smali code.
     * @returns {Project} Returns the instance of this project
     * @deprecated ?
     * @method
     */
    scan( pPath:string):void{
        // app scan
    }

    /**
     * To perform a fullsacn of the application. It  performs :
     *      - Android API bytecode scan (for the specified API version - by default it's API 25)
     *      - Application bytecode scan
     *      - Application package scan
     * @param {string} path Optional, the path of the folder containing the decompiled smali code.
     * @returns {Project} Returns the instance of this project
     * @method
     */
    fullscan( pPath:Nullable<string>=null):Nullable<DexcaliburProject>{
        // bind fullscan
      return null;
    };

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

