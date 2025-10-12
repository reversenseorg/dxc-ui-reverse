import Asset from "./Asset";
import Threat from "./Threat";
import CodeThreat from "./CodeThreat";
import CodeConstraint from "./CodeConstraint";
import Control from "./Control";
import {DataOperation, Metadata, MetadataTopic, MetadataType} from "./Metadata";
import {NodeInternalType} from "../../NodeInternalType";
import { Nullable } from "src/app/base/Nullable";
import ControlAssessment, { AnalysisType } from "./ControlAssessment";
import {Indicator, IndicatorUUID} from "./Indicator";

export enum AssuranceModelType {
    SECURITY="sec",
    PRIVACY="pri",
    ECOLOGY="eco",
    QUALITY="qua",
}

export interface IndicatorPreview {
    uuid:IndicatorUUID;
    name:string;
    title?:string;
}

export interface AssuranceModelPreview {
    id: AssuranceModelUUID,
    scannerID: string; //ReversenseProductUUID,
    name: string,
    metadata?: Metadata[],
    indicators?: IndicatorPreview[]
    exp?:{
        scan?:number,
        subs?:number
    }
}

export interface IControl {
    id:string;
    name:string;
    description:string;
    metadata:Metadata[];
    isControlAssessment():boolean;
    isControl():boolean;
}

export type AssuranceModelUUID = string;

export type ControlNodeCanonicalUID = string;

export interface  ControlNode {
    parent?:ControlNode;
    ctrl?: IControl; //Control | ControlAssessment;
    canonicalID: string;
    children?:ControlTree;
    [extra:string]:any;
}


export type ControlTree = Record<string,ControlNode>;

export default class AssuranceModel {


    __:NodeInternalType = NodeInternalType.ASSURANCE_MODEL;

    /**
     * Unique identifier for the model
     */
    id:string;

    /**
     * ID of the scanner able to verify this model
     *
     */
    scannerID:string;

    name:string;

    description = "";

    links: string[] = [];

    modified:Date = (new Date());
    /**
     * The assurance model source helps to differenciate
     * who create the models
     *
     * @type {AssuranceModelSource}
     */
    generic = true;

    primaryAssets:Asset[] = [];

    secondaryAssets:Asset[] = [];

    /**
     * @deprecated
     */
    globalThreats:Threat[] = [];

    controls:Control[] = [];

    metadata:Metadata[] = [];

    indicators:Indicator[] = [];

    _meta:any = {};
    protected _ready = false;

    // Only front-side
    _preview = false;


    constructor( pConfig:any = {}) {
        this.update(pConfig);
    }
    /**
     * To update properties
     *
     * @param pObject
     */
    update(pObject:any, pUpdateChildren = false):void {
        if(pObject.id!=null) this.id = pObject.id;
        if(pObject.scannerID!=null) this.scannerID = pObject.scannerID;
        if(pObject.name!=null) this.name = pObject.name;
        if(pObject.description!=null) this.description = pObject.description;
        if(pObject.links!=null) this.links = pObject.links;
        if(pObject.generic!=null) this.generic = pObject.generic;
        if(pObject.metadata!=null) this.metadata = pObject.metadata;
        if(pObject.indicators!=null) this.indicators = pObject.indicators;


        this._meta = {};
        this.metadata.map(x => {
            this._meta[x.key] = x;
        });

        if(pUpdateChildren){
            if(pObject.primaryAssets!=null) this.primaryAssets = pObject.primaryAssets;
            if(pObject.secondaryAssets!=null) this.secondaryAssets = pObject.secondaryAssets;
            if(pObject.globalThreats!=null) this.globalThreats = pObject.globalThreats;
            if(pObject.controls!=null) this.controls = pObject.controls;
        }

    }

    /**
     * @method
     */
    getID():string {
        return this.id;
    }

    getScannerID():string {
        return  this.scannerID;
    }

    /**
     *
     * @deprecated
     */
    getThreats():Threat[] {
        return this.globalThreats;
    }

    /**
     *
     * @deprecated
     */
    getCodeThreats():CodeThreat[] {
        const ths:CodeThreat[] = [];

        this.globalThreats.map( x => {
            if(x.isCodeCheckable()){
                if(x instanceof CodeThreat){
                    ths.push(x as CodeThreat);
                }else{
                    ths.push(new CodeThreat({
                        ...x,
                        signature: x.signature as CodeConstraint[]
                    }));
                }

            }
        });

        return ths;
    }

    /**
     *
     */
    getPrimaryAssets():Asset[] {
        return this.primaryAssets;
    }

    /**
     * Secondary assets are involved into transformations of primary assets
     *
     */
    getSecondaryAssets():Asset[] {
        return this.secondaryAssets;
    }

    load():void {
        return ;
    }

    /**
     * To check if the model is ready to be consumed by the scanner
     *
     * @return {boolean}
     * @method
     */
    isReady():boolean {
        return this._ready;
    }

    /**
     * To instanciate AssuranceModel from a poor object
     *
     * Default way to unserialize models stored into DB
     *
     * @param {any} pData Poor object
     * @return {AssuranceModel} Fresh instance
     * @method
     * @static
     */
    static fromJsonObject(pData:any):AssuranceModel {
        const o = new AssuranceModel(pData);



        if(pData.globalThreats!=null){
            pData.globalThreats.map( (x:any,i:number) => {
                o.globalThreats[i] = new Threat(x);
            });
        }

        if(pData.primaryAssets!=null){
            pData.primaryAssets.map( (x:any,i:number) => {
                o.primaryAssets[i] = new Asset(x);
            });
        }

        if(pData.secondaryAssets!=null){
            pData.secondaryAssets.map( (x:any,i:number) => {
                o.secondaryAssets[i] = new Asset(x);
            });
        }





        if(pData.controls!=null){
            pData.controls.map( (x:any,i:number) => {
                o.controls[i] = Control.fromJsonObject(x);
            });
        }

        if(pData.indicators!=null){
            pData.indicators.map( (x:any,i:number) => {
                o.indicators[i] = Indicator.fromJsonObject(x);
            });
        }



        //console.log("AssuranceModel from obj : ",o,pData.controls);
        return o;
    }

    /**
     * To prepare an instance to be serialized
     *
     * @return {any} Poor object with no cyclic references
     * @method
     */
    toJsonObject():any {
        const o:any = {};

        o.id = this.id;
        o.name = this.name;
        o.description = this.description;
        o.scannerID = this.scannerID;
        o.generic = this.generic;
        o.links = this.links;
        o.metadata = this.metadata;

        o.controls = [];
        this.controls.map( x => {
            o.controls.push(x.toJsonObject());
        });

        o.globalThreats = [];
        this.globalThreats.map( x => {
            o.globalThreats.push(x.toJsonObject());
        });
        o.primaryAssets = [];
        this.primaryAssets.map( x => {
            //o.primaryAssets.push(x.toJsonObject());//.toJsonObject());
        });
        o.secondaryAssets = [];
        this.secondaryAssets.map( x => {
            //o.secondaryAssets.push(x);//.toJsonObject());
        });

        return o;
    }

    isGeneric():boolean {
        return this.generic;
    }

    getMetadata():Metadata[] {
        return this.metadata;
    }

    getIndicators():Indicator[] {
        return this.indicators;
    }

    getTextualMetadata(pName:string):Nullable<string>{
        const meta = this.metadata.find(m => {
            return (m.type===MetadataType.TEXT)&&(m.key===pName);
        });

        if(meta!=null){
            return meta.value;
        }else{
            return null;
        }
    }

    /**
     *
     */
    getVersion():Nullable<string>{
        return this.getTextualMetadata("version")
    }

    getLinks():string[] {
        return this.metadata.filter(m => {
            return (m.type===MetadataType.URI);
        }).map(x => x.value);
    }


    getAuthor():Nullable<string> {
        return this.getTextualMetadata("author")
    }

    getRelease():Nullable<string> {
        return this.getTextualMetadata("release")
    }

    static destringifyAnalType(pAnalTypeName:string):AnalysisType {
        switch (pAnalTypeName){
            case "dast":
                return AnalysisType.DAST;
            case "iast":
                return AnalysisType.IAST;
            case "sast":
            default:
                return AnalysisType.SAST;
        }
    }

    static destringifyDataOpe(pOpe:string):DataOperation {
        switch (pOpe){
            case "sourcing":
                return DataOperation.SOURCING;
            case "storing":
                return DataOperation.STORING;
            case "sharing":
                return DataOperation.SHARING;
            case "decrypting":
                return DataOperation.DECRYPTING;
            case "encrypting":
                return DataOperation.ENCRYPTING;
            case "hashing":
                return DataOperation.HASHING;
            default:
            case "processing":
                return DataOperation.PROCESSING;
        }
    }

    static getDflowStep(pCtrl:Control|ControlAssessment):Nullable<DataOperation> {
        const ope = pCtrl.metadata.filter(x => {
            return (x.type===MetadataType.ANY) && (x.key===MetadataTopic.DFLOW_STEP);
        }).map(x => x.value);

        if(ope.length>0){
            return ope[0];
        }else{
            return null;
        }
    }

    /**
     * To search a control assessment by its properties
     *
     * @param pCtrl
     * @param pAnalTypeS
     *
     *
     * @param pFlowStep
     */
    searchAssessmentByPart(pCtrl:Control, pFlowStep:string, pAnalTypeS:string ):Nullable<ControlAssessment> {

        const a = AssuranceModel.fromAnalTypeString(pAnalTypeS);
        const f = AssuranceModel.fromDFlowString(pFlowStep);

        for(let i=0; i<pCtrl.assessments.length; i++ ){
            if(AssuranceModel.isControlAssessmentMatch(pCtrl.assessments[i], f, a)){
                return pCtrl.assessments[i];
            }
        }
        return null;
    }

    searchControlByCID(pCanonUID:string):any {
        const lvl = pCanonUID.split(".");

        let found:Nullable<Control|ControlAssessment> = null;
        let nodeID:string="" ;
        let ctrlSet:Control[]|ControlAssessment[] = this.controls as any;
        let npart:string[], isCtrlAss = false;
        let o:number = -1;
        let i=0;

        for( i=(lvl[0]=='*'?1:0); i<lvl.length; i++){

            nodeID = lvl[i];

            ctrlSet = ctrlSet.sort((a:any,b:any)=>{
                if(a.id!=null && b.id!=null){
                    return a.id.localeCompare(b.id);
                }

                return (a.id==null ? 1 : -1);
            });


            o = nodeID.indexOf(":");
            if(o>-1){
                nodeID = nodeID.slice(0,o);
            }

            found = null as any;

            for(let k=0; k<ctrlSet.length; k++){
                // control
                if( nodeID!==""){
                    /*if(lvl.length==1){
                        console.log(nodeID,ctrlSet[k].id, ctrlSet[k].id!=null && nodeID===ctrlSet[k].id,
                            ctrlSet[k].isControl(),ctrlSet[k] , (ctrlSet[k] as Control).hasAssessments() );
                    }*/
                    if(ctrlSet[k].id!=null && nodeID===ctrlSet[k].id){
                        found = ctrlSet[k];
                        break;
                    }
                }
            }

            if(found){
                // @ts-ignore
                if((found as IControl).isControl()){
                    if((found as Control).assessments!=null && (found as Control).assessments.length>0){
                        break;
                    }else if(i<lvl.length-1 && (found as Control).hasChildren()){
                        ctrlSet = (found as Control).children;
                    }else{
                        break;
                    }
                }
            }
        }

        if(found!=null){
            o = lvl[lvl.length-1].indexOf(":");
            if(lvl[lvl.length-1].startsWith(nodeID) && o>-1){
                npart = lvl[lvl.length-1].split(":");
                // should be a control with assessments
                const k = this.searchAssessmentByPart((found as Control), npart[1], npart[2]);
                //console.log("searchControlByCID > found > : ",pCanonUID,k);
                return k;
            }
            //console.log(pCanonUID, 'FOUND', found  )
        }else{
            //console.log(pCanonUID, 'NOT FOUND');
            return null;
        }

        //console.log("searchControlByCID > found : ",pCanonUID,(found as any));
        return found;
    }


    static stringifyDFlow(pType:DataOperation):string {
        switch (pType){
            case DataOperation.SOURCING:
                return "sourcing";
            case DataOperation.PROCESSING:
                return "processing";
            case DataOperation.STORING:
                return "storing";
            case DataOperation.SHARING:
                return "sharing";
            case DataOperation.ENCRYPTING:
                return "encrypting";
            case DataOperation.DECRYPTING:
                return "decrypting";
            case DataOperation.HASHING:
                return "hashing";
        }
    }

    static fromDFlowString(pType:string):any {
        switch (pType){
            case "sourcing":
                return DataOperation.SOURCING;
            case "processing":
                return DataOperation.PROCESSING;
            case "storing":
                return DataOperation.STORING;
            case "sharing":
                return DataOperation.SHARING;
            case "encrypting":
                return DataOperation.ENCRYPTING;
            case "decrypting":
                return DataOperation.DECRYPTING;
            case "hashing":
                return DataOperation.HASHING;
        }
    }

    static stringifyAnalType(pType:AnalysisType):string {
        switch (pType){
            case AnalysisType.SAST:
                return "sast";
            case AnalysisType.DAST:
                return "dast";
            case AnalysisType.IAST:
                return "iast";
        }
    }

    static fromAnalTypeString(pType:string):any {
        switch (pType){
            case "sast":
                return AnalysisType.SAST;
            case "dast":
                return AnalysisType.DAST;
            case "iast":
                return AnalysisType.IAST;
        }
    }

    /**
     *
     * @param pAssessment
     * @param pFlowStep
     * @param pAnalType
     */
    static isControlAssessmentMatch(pAssessment: ControlAssessment, pFlowStep: DataOperation, pAnalType: AnalysisType) {

        let flowOK = true, anaOK = true;

        if(pFlowStep!=null){
            flowOK = (pAssessment.metadata.find(x => (
                (x.key===MetadataTopic.DFLOW_STEP) && (x.value===pFlowStep)
            ))!=null);
            if(!flowOK) return false;
        }

        if(pAnalType!=null){
            anaOK = (pAssessment.analType===pAnalType);
        }

        return (anaOK && flowOK);
    }


    /**
     * To get a metadata by its name
     *
     * @param pKey
     */
    getMeta(pKey:string):Nullable<Metadata> {
        return this.metadata.find((vMeta)=>{ return (vMeta.key===pKey)});
    }

    /**
     * To set a meta data
     *
     * @param pType
     * @param pKey
     * @param pValue
     */
    setMeta(pType:MetadataType, pKey:string, pValue:any):void {
        const meta = this.getMeta(pKey);
        if(meta==null){
            this.metadata.push({
                type: pType,
                value: pValue,
                key: pKey
            })
        }else{
            meta.type = pType;
            meta.value = pValue;
        }
    }

    /**
     * To get the variant name
     * @method
     */
    getVariantName():Nullable<string> {
        const variant = this.getMeta('variant');
        if(variant==null) return null;

        return variant.value;
    }



    static getDflowIcon(pOpe:DataOperation):string{
        switch (pOpe){
            case DataOperation.SOURCING:
                return 'pi pi-user';
            case DataOperation.PROCESSING:
                return 'pi pi-cog';
            case DataOperation.STORING:
                return 'pi pi-database';
            case DataOperation.SHARING:
                return 'pi pi-cloud';
            case DataOperation.ENCRYPTING:
                return 'pi pi-lock';
            case DataOperation.DECRYPTING:
                return 'pi pi-lock-open';
            case DataOperation.HASHING:
                return 'pi pi-lock';
            default:
                return 'pi pi-question';
        }
    }

    static getDflowLabel(pOpe:DataOperation):string{
        switch (pOpe){
            case DataOperation.SOURCING:
                return 'sourcing';
            case DataOperation.PROCESSING:
                return 'processing';
            case DataOperation.STORING:
                return 'storing';
            case DataOperation.SHARING:
                return 'sharing';
            case DataOperation.ENCRYPTING:
                return 'encrypting';
            case DataOperation.DECRYPTING:
                return 'decrypting';
            case DataOperation.HASHING:
                return 'hashing';
            default:
                return 'none';
        }
    }

    static getDflowColor(pOpe:DataOperation, pMatch:boolean):string {
        if(pMatch===false){
            return '#b7c5c5';
        }

        switch (pOpe){
            case DataOperation.SOURCING:
                return '#da8c33';
            case DataOperation.PROCESSING:
                return '#0d90e4';
            case DataOperation.STORING:
                return '#da02cb';
            case DataOperation.SHARING:
                return '#fb0000';
            case DataOperation.ENCRYPTING:
                return '#44004e';
            case DataOperation.DECRYPTING:
                return '#eaa9a9';
            case DataOperation.HASHING:
                return '#58c100';
            default:
                return '#b7c5c5';
        }
    }

}