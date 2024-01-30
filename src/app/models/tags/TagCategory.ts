import {NodeInternalType} from "../NodeInternalType";
import {Tag} from "./Tag";
import {INode} from "../INode";
import {IStringIndex} from "../../base/IStringIndex";
import {Nullable} from "../../base/Nullable";

/**
 * Tag categories are conceptuals, and are only used to help to manage tags
 *
 * Tags are grouped by thema
 *
 * @class
 */
export default class TagCategory implements INode
{
    __:NodeInternalType = NodeInternalType.TAG_CATEGORY;

    _uid:Nullable<string> = null;
    /**
     * Category name
     */
    name:string;
    descr:Nullable<string> = null;
    tags:number[] = [];

    _tags:Tag[] = [];

    /**
     *
     * @param pConfig
     * @constructor
     */
    constructor(pConfig:any) {
        for(const i in pConfig){
            (this as IStringIndex<any>)[i] = pConfig[i];
        }
    }

    /*
    constructor(name:string, taglist:string[]){
        this.name = name;
        this.taglist = taglist;
    }

    addTag(tag:string){
        if(this.taglist.indexOf(tag)==-1)
            this.taglist.push(tag);
    }
    */

    /**
     * Add a tag to the category
     * @param pTag
     */
    addTag(pTag:Tag){
        if(this._tags.indexOf(pTag)==-1){
            pTag.setFQN(this.getUID()+'.'+pTag.name);
            pTag.category = this;
            this._tags.push(pTag);
        }
    }

    getTags():Tag[]{
        return this._tags;
    }

    toJsonObject():any{
        const o:any = new Object();
        o.name = this.name;
        o.descr = this.descr;
        o._tags = [];
        this._tags.map( (vTag:Tag) => {
            o._tags.push(vTag.toJsonObject());
        })
        return o;
    }

    /**
     *
     */
    getUID(): string {
        return this._uid as string;
    }
}
