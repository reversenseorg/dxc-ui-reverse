import {AssetOptions} from "./Asset";
import ControlAssessment from "./ControlAssessment";
import {Metadata} from "./Metadata";
import {IStringIndex} from "../../../base/IStringIndex";

export interface ControlOptions {
    id?:string;
    name?:string;
    description?:string;
    links?:string[];
    children?:Control[];
    assessments?:ControlAssessment[];
    metadata?:Metadata[]
}


export interface TrackerCategory {
    name:string;
    occurences:number;
    styles?:any;
}

export enum ControlMetadataType {
    TEXT,
    ANY,
    URI
}

export interface ControlMetadata {
    key:string;
    type:ControlMetadataType;
    value:any;
}

/**
 * @class
 */
export default class Control {




    _meta:any = {}

    /**
     * Unique control ID
     * @type {string}
     * @field
     */
    id:string;

    /**
     * Control point name
     * @type {string}
     * @field
     */
    name:string;

    description:string;

    metadata:Metadata[] = [];

    category:string[] = []

    links:IStringIndex<any>;

    children:Control[] = [];

    country:any = null;

    assessments:ControlAssessment[] = []

    tags:number[] = [];

    _styles:Record<string, string> = {};


    // local
    verified = true;


    catTags:TrackerCategory[] = [];

    addDate:Date = (new Date(2023,4,15,2));

    constructor( pConfig:ControlOptions = {}) {
        this.update(pConfig);
    }

    private _loadStyles():void {
        this.metadata.map(x => {
            if(x.key.startsWith("styles.")){
                this._styles[x.key.substring(7)] = x.value;
            }
        });
    }

    hasStyle():boolean {
        return Object.keys(this._styles).length>0;
    }

    getStyle():Record<string, string> {
        return this._styles;
    }

    update(pConfig:any, pUpdateChildren = false):void {
        if(pConfig.id!=null) this.id = pConfig.id;
        if(pConfig.name!=null) this.name = pConfig.name;
        if(pConfig.description!=null) this.description = pConfig.description;
        if(pConfig.links!=null) this.links = pConfig.links;
        if(pConfig.metadata!=null) this.metadata = pConfig.metadata;
        if(pConfig.country!=null) this.country = pConfig.country;
        if(pConfig.category!=null) this.category = pConfig.category;



        this._meta = {};
        this.metadata.map(x => {
            this._meta[x.key] = x;
        });

        if(pUpdateChildren){
            if(pConfig.children!=null) this.children = pConfig.children;
            if(pConfig.assessments!=null) this.assessments = pConfig.assessments;
        }

        this._loadStyles();
    }

    hasChildren():boolean {
        return (this.children.length > 0);
    }

    hasAssessments():boolean {
        return (this.assessments.length > 0);
    }

    toJsonObject():any {
        let o:any = {
            id: this.id,
            name: this.name,
            description: this.description,
            links: this.links,
            children: [],
            assessments: [],
            metadata: this.metadata,
            category: this.category,
            country: this.country
        };


        if(this.hasChildren()){
            this.children.map(x => {

                if(x.toJsonObject!=null){
                    o.children.push(x.toJsonObject());
                }else{
                    o.children.push(x);
                }
            });
        }

        if(this.hasAssessments()){
            this.assessments.map(x => {
                if(x.toJsonObject!=null){
                    o.assessments.push(x.toJsonObject());
                }else{
                    o.assessments.push(x);
                }

            });
        }

        return o;
    }



    static fromJsonObject(pObject:any):Control {
        const control = new Control(pObject);
        control.update(pObject,true);

        if(control.hasChildren()){
            control.children.map((vChild,index)=>{
                control.children[index] = Control.fromJsonObject(vChild);
            });
        }

        if(control.hasAssessments()){
            control.assessments.map((vChild,index)=>{
                control.assessments[index] = ControlAssessment.fromJsonObject(vChild);
            });
        }

        return control;
    }

}