
import HookTemplateFragment from "./hook/HookTemplateFragment.js";

import {INode} from "./INode.js";
import ModelFile from "./ModelFile.js";
import {INodeRef, NodeInternalType} from "./NodeInternalType";
import {AbstractHook} from "./AbstractHook";
import {Nullable} from "../base/Nullable";

export enum DataLocationType {
    FILE,
    BYTECODE,
    HOOK,
    MEMORY,
    COMM,
    LOGICAL_ANAL,
    CHIP_DUMP,
    JTAG
}

export interface DataLocationNodeRef {
    ref?: INodeRef
}
export interface DataLocationFileSource extends DataLocationNodeRef {
    file?:ModelFile|INodeRef;
    fileUID?:any;

    offset:number;
}

export interface DataLocationFsSource  extends DataLocationNodeRef {
    path:string;
    offset:number;
}


export interface DataLocationBytecodeSource  extends DataLocationNodeRef {
    nodeType:NodeInternalType;
    node:INode;
    bbOffset:number;
    insOffset:number;
}

export interface DataLocationHookSource  extends DataLocationNodeRef {
    hook:AbstractHook;
    frag:HookTemplateFragment;
}

export interface DataLocationMemorySource  extends DataLocationNodeRef {
    range:any;
    offset:number;
}

export interface DataLocationCommSource  extends DataLocationNodeRef {
    protocol:any;
    request:number;
    time?:number;
}

export type DataLocationSource =
    DataLocationFileSource
    | DataLocationBytecodeSource
    | DataLocationHookSource
    | DataLocationCommSource
    | DataLocationFsSource
    | DataLocationMemorySource;

export class DataLocation  {
    _uid:Nullable<string> = null;
    type: DataLocationType;
    source: DataLocationSource;


    constructor(pConfig:any) {
        if(pConfig !== null)
            for(const i in pConfig)
                (this as any)[i] = pConfig[i];
    }

    getUID():string{
        if(this._uid == null){
            let source:any = null;
            this._uid = this.type+':';
            switch (this.type){
                case DataLocationType.BYTECODE:
                    source = (this.source as DataLocationBytecodeSource);
                    this._uid += source.nodeType+':'+source.node.getUID()+':'+source.bbOffset+':'+source.insOffset;
                    break;
            }
        }

        return this._uid;
    }

    toJsonObject(pOption?: any): any {
        const o:any = {
            _uid: this._uid,
            type: this.type,
            source: null
        };

        if(this.source !=null){
            switch (this.type){
                case DataLocationType.FILE:
                    const s = (this.source as DataLocationFileSource);
                    o.source = {
                        offset: s.offset,
                        ref: s.ref
                    };

                    break;
                case DataLocationType.HOOK:
                    o.source = {
                        hook: (this.source as DataLocationHookSource).hook?.getGUID(),
                        frag: (this.source as DataLocationHookSource).frag?.getUID()
                    }
                    break;
                case DataLocationType.BYTECODE:
                    if((this.source as DataLocationBytecodeSource).ref!=null){
                        o.source = {
                            ref:(this.source as DataLocationBytecodeSource).ref,
                            bbOffset:(this.source as DataLocationBytecodeSource).bbOffset,
                            insOffset:(this.source as DataLocationBytecodeSource).insOffset
                        }
                    }else{
                        o.source = {
                            // todo : deprecated : retrrocompatibility
                            nodeType:(this.source as DataLocationBytecodeSource).nodeType,
                            node:(this.source as DataLocationBytecodeSource).node.getUID(),
                            bbOffset:(this.source as DataLocationBytecodeSource).bbOffset,
                            insOffset:(this.source as DataLocationBytecodeSource).insOffset
                        }
                    }

                    break;
                default:
                    o.source = this.source;
                    break;
            }
        }

        return o;
    }
}