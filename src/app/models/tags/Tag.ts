import {NodeInternalType} from "../NodeInternalType";
import TagCategory from "./TagCategory";
import {INode} from "../INode";
import {IStringIndex} from "../../base/IStringIndex";
import {Nullable} from "../../base/Nullable";


export interface TagMap {
    [hashCode:number] :Tag
}

/**
 * Tags are a way to attach properties to nodes at runtime
 *
 * @class
 */
export class Tag implements INode
{
    __:NodeInternalType = NodeInternalType.TAG;

    _:number;

    _uid:string;
    descr:string;
    label:string;
    styles:string

    private _fqn:string;

    /**
     * Could be used to tag a Tag object as experimental or customer defined
     *
     * @private
     */
    tags:number[] = [];

    name:string;
    category:Nullable<TagCategory> = null;

    child:Tag[]; // ??

    constructor(pConfig:any=null){
        if(pConfig!=null)
            for(const i in pConfig)
                (this as IStringIndex<any>)[i] = pConfig[i];

        if(this.name!=null && this.label==null){
            this.label = this.name;
        }
    }

    getFQN(){
        return this._uid;
    }

    setFQN( pFQN:string){
        this._uid = pFQN;
    }

    setUUID(pUUID:number){
        this._ = pUUID;
    }

    getUUID():number {
        return this._;
    }

    getCategory():Nullable<TagCategory> {
        return this.category;
    }

    appendTag( pTag:Tag):void {
        this.child[pTag.hashCode] = pTag;
    }

    getChildren():TagMap {
        return this.child;
    }

    get hashCode():number {
        return this._;
    }

    getUID(): string {
        return this._uid; //_uid;
    }

    /**
     * To check if the specified INode object has current tag
     *
     * @param {INode} vNode
     */
    match( vNode:INode):boolean{
        return (vNode.tags.indexOf(this.getUUID())>-1);
    }

    /**
     *
     */
    toJsonObject():any{
        const o:any = new Object();
        o.__ = this.__;
        o._ = this._;
        o._uid = this._uid;
        //o._fqn = this._fqn;
        o.name = this.name;
        o.label = this.label;
        o.descr = this.descr;
        o.category = (this.category!=null ? this.category.getUID() : null);


        return o;
    }


}
