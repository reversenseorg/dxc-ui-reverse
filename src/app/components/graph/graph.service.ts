
/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataSet, Node, Edge } from 'vis-network';
import {INodeRef, NodeInternalType} from 'src/app/models/NodeInternalType';
import {INode} from "../../models/INode";
import {DxcApiService} from "../../base/DxcApiService";
import {OutputService} from "../output/ctrl/output.service";
import {CodeControllerService} from "../code/ctrl/code-controller.service";
import ModelMethod from "../../models/ModelMethod";
import ModelBasicBlock from "../../models/ModelBasicBlock";

export interface GraphNodeData extends Node {
    nodeType: NodeInternalType;
    uid: string;
    originalData: INode;
    isLoaded?: boolean;
}

export interface GraphEdgeData extends Edge {
    relationType: string;
    weight?: number;
}

export interface GraphQuery {
    rootNodeId: string;
    nodeTypes: NodeInternalType[];
    maxDepth: number;
    includeIncoming?: boolean;
    includeOutgoing?: boolean;
    filters?: { [key: string]: any };
}

export interface GraphNodeData extends Node {
    nodeType: NodeInternalType;
    uid: string;
    originalData: INode;
    isLoaded?: boolean;
}

export interface GraphEdgeData extends Edge {
    relationType: string;
    weight?: number;
}

export interface GraphQuery {
    rootNodeId: string;
    nodeTypes: NodeInternalType[];
    maxDepth: number;
    includeIncoming?: boolean;
    includeOutgoing?: boolean;
    filters?: { [key: string]: any };
}

@Injectable({
    providedIn: 'root'
})
export class GraphDataService extends DxcApiService {

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

    // Subjects for component communication
    nodeSelected$ = new Subject<GraphNodeData>();
    graphUpdated$ = new Subject<{ nodes: DataSet<GraphNodeData>, edges: DataSet<GraphEdgeData> }>();

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

    /**
     * Fetch graph data from backend
     */
    fetchGraphData(query: GraphQuery): Observable<{ nodes: GraphNodeData[], edges: GraphEdgeData[] }> {


        return this._process(this.endpoints['graph']['adjacency'], query).pipe(
            map((response: any) => {
                if (!response.success) {
                    throw new Error(response.message || 'Failed to fetch graph data');
                }

                const nodes = response.data.nodes.map((node: any) => this.transformToVisNode(node));
                const edges = response.data.edges.map((edge: any) => this.transformToVisEdge(edge));

                return {nodes, edges};
            })
        );
    }

    /**
     * Fetch graph data from backend
     */
    fetchMethod(pRequest: string, pFilteredType:NodeInternalType[]): Observable<{ nodes: GraphNodeData[], edges: GraphEdgeData[] }> {

        return this.codeSvc.getMethod(pRequest, true).pipe(
            map((vMeth: any) => {
                if (vMeth==null) {
                    throw new Error('Failed to fetch graph data');
                }

                const edges: GraphEdgeData[] = [];
                const nodes = [this.transformToVisNode(vMeth)];

                const root = vMeth as ModelMethod;
                root.getBasicBlocks().map((node: ModelBasicBlock) =>{
                    nodes.push(this.transformToVisNode(node))
                    edges.push(this.transformToVisEdge({
                        id: `${vMeth.uid}_${node.offset}`,
                        from: vMeth.uid,
                        to: `${vMeth.uid}_${node.offset}`,
                        relationType: 'basic_block'
                    }));


                })
                // response.data.nodes.map((node: any) => this.transformToVisNode(node));
                //const edges = response.data.edges.map((edge: any) => this.transformToVisEdge(edge));

                return {nodes, edges};
            })
        );

    }

    /**
     * Expand graph from a specific node
     */
    expandFromNode(pNodeId: INodeRef, pFilterType: NodeInternalType[]): Observable<{
        nodes: GraphNodeData[],
        edges: GraphEdgeData[]
    }> {
        return this._process(
            this.endpoints['graph']['expand'],
            {
                filterType: pFilterType,
                node: pNodeId
            }
        ).pipe(
            map((response: any) => {
                if (!response.success) {
                    throw new Error(response.message || 'Failed to expand graph');
                }

                return {
                    nodes: response.data.nodes.map((n: any) => this.transformToVisNode(n)),
                    edges: response.data.edges.map((e: any) => this.transformToVisEdge(e))
                };
            })
        );
    }

    /**
     * Transform backend node data to Vis-network format
     */
    transformToVisNode(nodeData: any): GraphNodeData {
        const nodeType = nodeData.__ as NodeInternalType;

        return {
            id: nodeData.uid,
            label: this.generateNodeLabel(nodeData),
            color: {
                background: this.nodeColors.get(nodeType) || '#E0E0E0',
                border: '#333333',
                highlight: {
                    background: '#FFD700',
                    border: '#FF8C00'
                }
            },
            shape: this.nodeShapes.get(nodeType) || 'dot',
            font: {
                size: this.getNodeFontSize(nodeType),
                color: '#333333'
            },
            size: this.getNodeSize(nodeType),
            nodeType,
            uid: nodeData.uid,
            originalData: nodeData,
            isLoaded: true
        };
    }

    /**
     * Transform backend edge data to Vis-network format
     */
    transformToVisEdge(edgeData: any): GraphEdgeData {
        return {
            id: edgeData.id || `${edgeData.from}_${edgeData.to}`,
            from: edgeData.from,
            to: edgeData.to,
            label: edgeData.label || edgeData.relationType,
            arrows: 'to',
            color: {
                color: this.getEdgeColor(edgeData.relationType),
                highlight: '#FF8C00'
            },
            width: edgeData.weight ? Math.min(Math.max(edgeData.weight, 1), 5) : 1,
            relationType: edgeData.relationType
        };
    }

    generateNodeLabel(nodeData: any): string {
        const nodeType = nodeData.__;

        switch (nodeType) {
            case NodeInternalType.METHOD:
                return nodeData.simpleName || nodeData.name || 'Method';
            case NodeInternalType.CLASS:
                return nodeData.simpleName || nodeData.name?.split('.').pop() || 'Class';
            case NodeInternalType.FIELD:
                return nodeData.name || 'Field';
            case NodeInternalType.INSTRUCTION:
            case NodeInternalType.INSTR_CPU:
                return nodeData.mnemonic || nodeData.opcode || 'Instruction';
            case NodeInternalType.PACKAGE:
                return nodeData.name?.split('.').pop() || 'Package';
            case NodeInternalType.FILE:
                return nodeData.name?.split('/').pop() || 'File';
            default:
                return nodeData.name || nodeData.uid || `Node_${nodeType}`;
        }
    }

    getNodeSize(nodeType: NodeInternalType): number {
        const sizeMap = new Map([
            [NodeInternalType.CLASS, 40],
            [NodeInternalType.METHOD, 35],
            [NodeInternalType.PACKAGE, 45],
            [NodeInternalType.FILE, 30],
            [NodeInternalType.FIELD, 25],
            [NodeInternalType.INSTRUCTION, 20],
            [NodeInternalType.INSTR_CPU, 20]
        ]);

        return sizeMap.get(nodeType) || 25;
    }

    getNodeFontSize(nodeType: NodeInternalType): number {
        const fontSizeMap = new Map([
            [NodeInternalType.CLASS, 16],
            [NodeInternalType.METHOD, 14],
            [NodeInternalType.PACKAGE, 18],
            [NodeInternalType.FILE, 12],
            [NodeInternalType.INSTRUCTION, 10]
        ]);

        return fontSizeMap.get(nodeType) || 12;
    }

    getEdgeColor(pRelationType:any) {
        return "#FF8C00";
    }

    getAvailableNodeTypes() {

        const av:any[]= [];
        for(let node in this.nodeColors){
            av.push({
                type: node,
                label: node,
                color: ( this.nodeColors as any)[node]
            });
        }

        return av;
    }


}