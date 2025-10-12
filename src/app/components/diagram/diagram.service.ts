
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
            }
        }, http, outputSvc);
    }

}