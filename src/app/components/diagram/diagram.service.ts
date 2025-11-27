
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataSet, Node, Edge } from 'vis-network/standalone/esm/vis-network';
import {INodeRef, NodeInternalType} from 'src/app/models/NodeInternalType';
import {INode} from "../../models/INode";
import {DxcApiService} from "../../base/DxcApiService";
import {OutputService} from "../output/ctrl/output.service";
import {CodeControllerService} from "../code/ctrl/code-controller.service";
import ModelMethod from "../../models/ModelMethod";
import ModelBasicBlock from "../../models/ModelBasicBlock";
import {DxcApiToken} from "../../base/DxcApiToken";
import ModelClass from "../../models/ModelClass";
import {OutputMessage} from "../../cmp/OutputMessage";
import {DexcaliburProjectUUID} from "../../models/DexcaliburProject";
import {DxApiResponse} from "../../base/common/common";
import {Nullable} from "../../base/Nullable";
import ModelField from "../../models/ModelField";
import {ModelFunction} from "../../models/ModelFunction";
import ModelStringValue from "../../models/ModelStringValue";
import ModelPackage from "../../models/ModelPackage";
import ModelFile from "../../models/ModelFile";


@Injectable({
    providedIn: 'root'
})
export class DiagramService extends DxcApiService {

    nodeColors = new Map<NodeInternalType, string>([
        [NodeInternalType.METHOD, '#4ECDC4'],
        [NodeInternalType.CLASS, '#FF6B6B'],
        [NodeInternalType.FIELD, '#45B7D1'],
        [NodeInternalType.FILE, '#96CEB4'],
        [NodeInternalType.PACKAGE, '#FFEAA7'],
        [NodeInternalType.INSTRUCTION, '#DDA0DD'],
        [NodeInternalType.INSTR_CPU, '#FFB6C1'],
        [NodeInternalType.BASIC_BLOCK, '#98FB98'],
        [NodeInternalType.FUNC, '#F0E68C'],
        [NodeInternalType.TAG, '#FFE4B5'],
        [NodeInternalType.BOOKMARK, '#87CEEB'],
        [NodeInternalType.HOOK_JAVA, '#FF7F50'],
        [NodeInternalType.HOOK_NATIVE, '#DA70D6']
    ]);

    nodeShapes = new Map<NodeInternalType, string>([
        [NodeInternalType.METHOD, 'box'],
        [NodeInternalType.CLASS, 'ellipse'],
        [NodeInternalType.FIELD, 'diamond'],
        [NodeInternalType.FILE, 'square'],
        [NodeInternalType.PACKAGE, 'triangle'],
        [NodeInternalType.INSTRUCTION, 'dot'],
        [NodeInternalType.INSTR_CPU, 'star'],
        [NodeInternalType.BASIC_BLOCK, 'box'],
        [NodeInternalType.FUNC, 'circle'],
        [NodeInternalType.TAG, 'hexagon'],
        [NodeInternalType.BOOKMARK, 'database']
    ]);

    constructor(
                http: HttpClient,
                private codeSvc: CodeControllerService,
                outputSvc: OutputService) {
        super({
            graph: {
                fetch: {method: 'POST', url: '/graph/fetch', format: 'json', auth: false, puid: true},
                expand: {method: 'POST', url: '/graph/expand/:nodeId', format: 'json', auth: false, puid: true},
                search: {method: 'POST', url: '/graph/search', format: 'json', auth: false, puid: true}
            },
            direct: {
                // puid MUST be FALSE
                disass: { method:'POST', url:'/code/direct/:puid/:nodetype/disass', format:'json', auth:false, puid:false },
                search: { method:'POST', url:'/code/direct/:puid/:nodetype/search', format:'json', auth:false, puid:false },
            },
            code: {
                fetch: {method: 'POST', url: '/graph/fetch', format: 'json', auth: false, puid: true},
                cls: {method: 'GET', url: '/code/class/:id', format: 'json', auth:false /* removed */, puid: true}
            }
        }, http, outputSvc);
    }


    retrieveNode<T>(pProjectUID: DexcaliburProjectUUID, pRef:INodeRef):Observable<DxApiResponse<Nullable<T>>> {
        return this._process(
            this.endpoints.direct.search,
            {puid: pProjectUID, nodetype: pRef.__, nodeuid: pRef._uid}
        ).pipe(
            map(vRes => {

                if (!vRes.success) {
                    return {success: false, msg: (vRes.msg != null ? vRes.msg : ""), data: null};
                }

                return {
                    success: vRes.success,
                    msg: (vRes.msg != null ? vRes.msg : ""),
                    data: (vRes.data != null ? this.createNodeFromRef<T>(pRef, vRes.data) : null)
                };
            })
        );
    }

    getClass( pQuery:string, pDirect = false):Observable<any> {

        if(pDirect){
            const p = DxcApiToken.getInstance("puid");
            return this.retrieveNode<ModelClass>(
                (p!=null ? p.getToken() : ""),
                {
                    __: NodeInternalType.CLASS,
                    _uid: pQuery
                }
            );
        }else{
            return this._process(
                this.endpoints['code']['cls'],
                {
                    'id': pQuery
                }
            ).pipe(map((pRes:any)=>{
                if(pRes.err){
                    return null;
                }else{
                    return pRes;
                }

            }));
        }

    }

    /**
     *
     * @param pRef
     * @param pRaw
     */
    createNodeFromRef<T>(pRef:INodeRef, pRaw:any):Nullable<T> {

        let node:any = null;
        let type = (typeof pRef.__==="string"? parseInt(pRef.__,10):pRef.__);

        switch(type){
            case NodeInternalType.METHOD:
                node = new ModelMethod(pRaw);
                break;
            case NodeInternalType.CLASS:
                node = new ModelClass(pRaw);
                break;
            case NodeInternalType.FIELD:
                node = new ModelField(pRaw);
                break;
            case NodeInternalType.FUNC:
                node = new ModelFunction(pRaw);
                break;
            case NodeInternalType.STRING:
                node = new ModelStringValue(pRaw);
                break;
            case NodeInternalType.PACKAGE:
                node = new ModelPackage(pRaw);
                break;
            case NodeInternalType.FILE:
                node = new ModelFile(pRaw);
                break;
        }



        return node;
    }
}