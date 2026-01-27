
import ModelFile from "./ModelFile.js";
import ModelStringValue from "./ModelStringValue.js";
import {INodeRef, NodeInternalType} from "./NodeInternalType";
import {Nullable} from "../base/Nullable";
import {DataLocation, DataLocationFileSource, DataLocationType} from "./DataLocation";

export interface ResourceOpts {
    _uid?:string;
    location?:DataLocation;
    value?:any;
    name?:string;
    ppts?:Record<string,any>;
    tags?:number[];
}
/**
 * Represent a string from anywhere, captured statically or dynamically
 *
 *
 *
 * Replace ModelStringValue
 *
 * @class
 */
export default class ModelResource<T>
{
    __:NodeInternalType = NodeInternalType.RESOURCE;
    _uid:string = "";
    location:Nullable<DataLocation> = null;
    value:Nullable<T> = null;
    name:string;
    ppts:Record<string,any> = {}
    tags:number[] = [];

    stringNodes:ModelStringValue[] = [];

    constructor(pConfig:Nullable<ResourceOpts> = null) {

        if(pConfig != null){
            for(const i in pConfig)
                (this as any)[i] = (pConfig as any)[i] ;
        }
    }

    getUID(): string {
        return this._uid;
    }


    toJsonObject(pOption?: any): any {
        const o:any = {
            value: this.value,
            __: this.__,
            _uid: this._uid,
            name: this.name,
            ppts: this.ppts,
            tags: this.tags,
            location: null
        };

        if(this.location != null){
            o.location = this.location.toJsonObject();
        }

        return o;
    }

    getFile():Nullable<ModelFile|INodeRef> {
        if(this.location!=null && this.location.type==DataLocationType.FILE){
            const l = (this.location.source as DataLocationFileSource);
            if(l.file!=null)
                return l.file;
            else if(l.ref!=null)
                return l.ref;
            else
                return null;
        }else{
            return null;
        }
    }

    /**
     *
     * @param pName
     * @param pValue
     */
    getProperty(pName: string):any {
        return this.ppts[pName];
    }


    /**
     *
     * @param pName
     * @param pValue
     */
    setProperty(pName: string, pValue: any):void {
        this.ppts[pName] = pValue;
    }

    /**
     * To check if the resource value point to a node (plain node or INodeRef)
     */
    hasNodeValue():boolean {
        return (this.value!=null && (this.value as any).__!=null && (this.value as any)._uid!=null);
    }

    /**
     * To automatically create a hashmap and add the key / value pair
     *
     * @param pPptName
     * @param pValue
     * @param pValue
     */
    appendProperty(pPptName: string, pKey: string, pValue: any):void {
        if(this.ppts[pPptName]==null){
            this.ppts[pPptName] = {};
        }

        this.ppts[pPptName][pKey] = pValue;
    }
}