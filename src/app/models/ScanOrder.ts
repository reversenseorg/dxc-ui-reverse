import {Nullable} from "../base/Nullable";
import {NodeInternalType} from "./NodeInternalType";


export interface ScanOrderSettings {
    modelUID?: string;
    targetDevice?: string;
    targetOS?: string;
    projectUID?: string;
    fileUploadID?:string;
}




export interface ScanOrderOptions {
    _id?:string;
    uuid?:string;
    slaveUID?:Nullable<string>;
    webhook?:Nullable<string>;
    settings?:ScanOrderSettings;
    signatures?:Nullable<string>;
    appPath?:Nullable<string>;
    options?:any;
    state?:Nullable<ScanState>;
    tags?:number[];
    dates?: any;
    stateDates?: Record<string,number>;
    report?:any;
}

export enum ScanState {
    RUNNING="running",
    WAITING="waiting",
    IDLE="idle",
    TERMINATED="terminated",
    GENERATE_REPORT="genreport",
    ABORTED="aborted",
    CRASHED="crashed",
    /**
     * That means Scan has been never started
     */
    NONE="none"
}

/**
 * Represent an order to scan a project with a specified
 * configuration.
 *
 * 1/ The cost of ScanOrder is estimated and validated by LicenseManager,
 * the LicenseManager should sign it.
 *
 * 2/ Signed scan are push into global scan queue of the master server.

 * 3/ If there is not slave node engine already up for the target project,
 * the scan scheduler generate an unique webhook and spawn the salve node
 * with scan order, target project, and webhook URL as parameters.
 *
 * 4/ The master receive scan report. The scan report includes :
 *  -  findings
 *  -  assurance model
 *  -  metrics
 *  -  slave node UID
 *  -  signature from slave node
 *
 *
 * @class
 */
export class ScanOrder{


    __:NodeInternalType = NodeInternalType.SCAN_ORDER;

    /**
     * Internal MongoDB UID
     * ! important
     * @field
     */
    _id:Nullable<string> = null;

    /**
     * Scan order UUID (per Infra Node)
     * @field
     */
    uuid:Nullable<string> = null;

    /**
     * UUID of the instance of DexcaliburEngine running the scan
     * @type {Nullable<string>}
     * @field
     */
    slaveUID:Nullable<string> = null;

    webhook:Nullable<string> = null;

    settings:ScanOrderSettings;

    signatures:Nullable<string> = null;

    appPath:Nullable<string>;

    options:any = {};

    private state:ScanState = ScanState.NONE;

    /**
     * To store dates state switch
     * @field
     */
    stateDates:Record<string,number> = {};

    report:Nullable<any> = null;

    tags:number[] = [];

    dates: any = {
        start: -1,
        stop: -1
    };


    $project:Nullable<any> = null;

    $model:Nullable<any> = null;


    constructor(pOptions:Nullable<ScanOrderOptions> = null) {
        if(pOptions!=null){
            for(let i in pOptions)
                (this as Record<string,any>)[i] = (pOptions as Record<string,any>)[i];
        }
    }

    static fromScanOptions(pSettings:ScanOrderSettings):ScanOrder {
        const order = new ScanOrder();
        order.settings = pSettings;

        return order;
    }

    setDate( pType:any, pDate:Nullable<number> = null){
        this.dates[pType] = (pDate===null ? (new Date()).getTime() : pDate);
    }



    getUID(): Nullable<string> {
        return this._id;
    }

    getUUID(): Nullable<string> {
        return this.uuid;
    }

    setSlaveNode(pUID:string):void {
        this.slaveUID = pUID;
    }

    hasSlaveNode():boolean {
        return (this.slaveUID!=null);
    }

    getProjectUID(): Nullable<string> {
        return this.settings.projectUID;
    }

    /**
     * To set the path to the file to analyze
     *
     * @param {string} pPath
     */
    setTargetFile(pPath:string){
        this.appPath = pPath;
    }

    getTargetFile():Nullable<string> {
        return this.appPath;
    }

    getModelUID(): Nullable<string> {
        return this.settings.modelUID;
    }

    getState():ScanState {
        return this.state;
    }

    /**
     * To change the state of the scan order
     *
     * When state changes, the date of change is saved in `this.stateDates`
     *
     * @param {ScanState} pState State of the order
     * @method
     */
    setState(pState:ScanState):void {
        this.state = pState;
        this.stateDates[pState] = (new Date()).getTime();
    }

    toJsonObject(pOptions?:any):any {
        const obj:any = {};
        const fields = (pOptions!=null ? pOptions.include : null);
        const exclude = (pOptions!=null && Array.isArray(pOptions.exclude))? pOptions.exclude : [];

        if(fields != null && fields.length>0){
            for(let i:number=0; i<fields.length; i++){
                if((this as Record<string,any>)[fields[i]] != null && (this as Record<string,any>)[fields[i]].toJsonObject != null){
                    obj[fields[i]] = (this as Record<string,any>)[fields[i]].toJsonObject();
                }else{
                    obj[fields[i]] = (this as Record<string,any>)[fields[i]];
                }
            }
        }else{
            for(let i in this){

                if(exclude.indexOf(i)>-1) continue;

                switch(i){
                    default:
                        obj[i] = this[i]
                        break;
                }
            }

        }
        return obj;
    }
}