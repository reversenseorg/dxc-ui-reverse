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

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {DataSet, Network, Options} from 'vis-network/standalone';
import {Nullable} from "../../../base/Nullable";
import {
    GraphEdge,
    GraphMode,
    GraphNode,
    GraphNodeClickEvent,
    GraphSelection
} from "../../../base/viewer/graph-viewer.component";
import {IStringIndex} from "../../../base/IStringIndex";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {CodeControllerService} from "../ctrl/code-controller.service";
import ModelBasicBlock from "../../../models/ModelBasicBlock";
import ModelMethod from "../../../models/ModelMethod";
import {ModelFunction} from "../../../models/ModelFunction";
import ModelDataBlock from "../../../models/ModelDataBlock";

enum BbPurpose {
    OFFSET,
    FALSE_BRANCH,
    TRUE_BRANCH,
    GOTO,
    THROW,
    CATCH,
    COND,
    RET,
    DATA
}

export interface BbNodeID {
    uid:string,
    type:BbPurpose
}

const ctxNodeMapping:Record<string, Record<number, string>> = {
    code: {
        [NodeInternalType.PACKAGE]: 'pkg',
        [NodeInternalType.CLASS]: 'clazz',
        [NodeInternalType.METHOD]: 'meth',
        [NodeInternalType.FIELD]: 'fld',
        [NodeInternalType.FUNC]: 'fn',
        [NodeInternalType.HOOK_JAVA]: 'hk',
        [NodeInternalType.HOOK_NATIVE]: 'hk',
        [NodeInternalType.RUNTIME_EVENT]: 'msg'
    },
    device:{

    }
};

@Component({
    selector: 'dxc-code-ast-viewer',
    template: `
        <div class="model-ast-viewer">
            <div class="ast-toolbar" *ngIf="showToolbar">
                <div class="toolbar-group">
                    <button class="btn btn-sm btn-primary" (click)="fitToView()">
                        <i class="fas fa-compress"></i> Fit
                    </button>
                    <button class="btn btn-sm btn-secondary" (click)="resetZoom()">
                        <i class="fas fa-search-minus"></i> Reset Zoom
                    </button>
                    <button class="btn btn-sm btn-secondary" (click)="togglePhysics()">
                        <i class="fas" [ngClass]="physicsEnabled ? 'fa-pause' : 'fa-play'"></i>
                        {{ physicsEnabled ? 'Stop' : 'Start' }} Physics
                    </button>
                </div>
                <div class="toolbar-group">
                    <label class="toolbar-label">
                        <input type="checkbox" [(ngModel)]="showLabels" (change)="updateLabelsVisibility()">
                        Show Labels
                    </label>
                </div>
                <div class="toolbar-info">
                    <span *ngIf="nodes">Nodes: {{ nodes.length || 0 }}</span>
                    <span *ngIf="edges">Edges: {{ edges.length || 0 }}</span>
                    <span *ngIf="selection && selection.nodes.length > 0">
                        Selected: {{ selection.nodes.length }}
                    </span>
                </div>
            </div>

            <div class="ast-legend" *ngIf="showLegend">
                <div class="legend-title">Legend</div>
                <div class="legend-item" *ngFor="let item of legendItems">
                    <div class="legend-color" [style.backgroundColor]="item.color"></div>
                    <span>{{ item.label }}</span>
                </div>
            </div>

            <div class="ast-container" #graphContainer></div>

            <div class="ast-details" *ngIf="selectedNodeData">
                <div class="details-header">
                    <dxc-node-token *ngIf="!isNodeRef(selectedNodeData); else noderef" [item]="selectedNodeData.data"></dxc-node-token>
                    <ng-template #noderef>
                        <dxc-node-token [ref]="selectedNodeData.data"></dxc-node-token>
                    </ng-template>
                    <button class="btn-close" (click)="clearSelection()">×</button>
                </div>
                <div class="details-body">
                    <div class="detail-row">
                        <span class="detail-label">Type:</span>
                        <span class="detail-value">{{ getNodeTypeName(selectedNodeData.nodeType) }}</span>
                    </div>
                    <div class="detail-row" *ngIf="selectedNodeData.data">
                        <span class="detail-label">Details:</span>
                        <pre class="detail-value">{{ formatNodeData(selectedNodeData.data) }}</pre>
                    </div>
                </div>
            </div>

            <div class="ast-details" *ngIf="selectedEdgeData">
                <div class="details-header">
                    <fa-icon *ngIf="selectedEdgeData.extra?.__===51" [icon]="['fas','arrow-right-from-bracket']" [ngStyle]="{'color':'yellow'}"></fa-icon>&nbsp;
                    <h4>{{ prepareEdgeLabel(selectedEdgeData) }}</h4>
                    <button class="btn-close" (click)="clearSelection()">×</button>
                </div>
                <div class="details-body">
                    <div class="detail-row" *ngIf="selectedEdgeData.extra">
                        <span class="detail-label">Details:</span>
                        <pre class="detail-value">{{ formatEdgeData(selectedEdgeData) }}</pre>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ["./ast-viewer.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeAstViewerComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() method: Nullable<ModelMethod> = null;
    @Input() func: Nullable<ModelFunction> = null;
    @Input() bbs: ModelBasicBlock[] = [];

    /**
     * Show toolbar
     */
    @Input() showToolbar: boolean = true;

    /**
     * Show legend
     */
    @Input() showLegend: boolean = true;

    /**
     * Initial physics enabled state
     */
    @Input() physicsEnabled: boolean = true;

    /**
     * Show node labels
     */
    @Input() showLabels: boolean = true;

    /**
     * Maximum depth for relationship traversal
     */
    @Input() maxDepth: number = 2;

    @Input() hidden: number[] = [];
    @Input() only: string[] = [];

    @Input() mode: string = GraphMode.ANY;

    /**
     * Auto-fit graph to view on load
     */
    @Input() autoFit: boolean = true;

    @Input() svc:CodeControllerService|null = null;
    @Output() nodeClick = new EventEmitter<GraphNodeClickEvent>();
    @Output() edgeClick = new EventEmitter<any>();
    @Output() selectionChange = new EventEmitter<GraphSelection>();
    @Output() doubleClick = new EventEmitter<any>();

    @ViewChild('graphContainer', { read: ElementRef }) graphContainer: ElementRef;

    private network: Nullable<Network> = null;
    private nodesDataSet: Nullable<DataSet<GraphNode>> = null;
    private edgesDataSet: Nullable<DataSet<GraphEdge>> = null;

    nodes: GraphNode[] = [];
    edges: GraphEdge[] = [];
    selection: Nullable<GraphSelection> = null;
    selectedNodeData: Nullable<GraphNode> = null;
    selectedEdgeData: Nullable<GraphEdge> = null;

    legendItems = [
        { color: '#4A90E2', label: 'Package' },
        { color: '#E24A4A', label: 'Class' },
        { color: '#4AE290', label: 'Method' },
        { color: '#E2904A', label: 'Field' },
        { color: '#904AE2', label: 'Function' },
        { color: '#E2E24A', label: 'Hook' },
        { color: '#3670ff', label: 'Call' },
        { color: '#4AE2E2', label: 'Runtime Message' }
    ];

    private nodeColors: IStringIndex<string> = {
        [NodeInternalType.PACKAGE]: '#4A90E2',
        [NodeInternalType.CLASS]: '#E24A4A',
        [NodeInternalType.METHOD]: '#4AE290',
        [NodeInternalType.FIELD]: '#E2904A',
        [NodeInternalType.FUNC]: '#904AE2',
        [NodeInternalType.HOOK_JAVA]: '#E2E24A',
        [NodeInternalType.HOOK_NATIVE]: '#E2E24A',
        [NodeInternalType.RUNTIME_EVENT]: '#4AE2E2'
    };

    private processedNodes: Set<string> = new Set();
    private nodeIdMap: Map<any, string> = new Map();

    constructor(private codeSvc:CodeControllerService,
                private changeDetector: ChangeDetectorRef) {}

    ngOnInit(): void {
        // Initialization logic
        console.log("AST viewer init : ",this);
    }

    ngAfterViewInit(): void {
        this.initializeNetwork();
        console.log("AST viewer after init : ",this);
        if (this.bbs && this.bbs.length > 0) {
            this.buildGraph();

            console.log("AST viewer after build graph : ",this);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && !changes['data'].firstChange) {
            this.buildGraph();

            console.log("AST viewer after data changes : ",this);
        }
    }

    private _loadBB(){
        if(this.method!=null){
            if(this.method.instr.length>0){
                this.bbs = this.method.instr;
                this.update();
                return;
            }else{
                this.codeSvc.instr({ __:NodeInternalType.METHOD, _uid:this.method.getUID() }).subscribe((vBbs:ModelBasicBlock[])=>{
                    this.bbs = vBbs;
                    this.update();
                });
            }

        }else if(this.func!=null){

        }
    }

    update():void {

    }

    /**
     * Initialize vis-network
     */
    private initializeNetwork(): void {
        this.nodesDataSet = new DataSet<GraphNode>();
        this.edgesDataSet = new DataSet<GraphEdge>();

        const options: Options = {
            nodes: {
                shape: 'dot',
                size: 16,
                font: {
                    size: 14,
                    color: '#ffffff',
                    background: 'rgba(0,0,0,0.7)',
                    strokeWidth: 2,
                    strokeColor: '#000000'
                },
                borderWidth: 2,
                borderWidthSelected: 4,
                shadow: {
                    enabled: true,
                    color: 'rgba(0,0,0,0.3)',
                    size: 10,
                    x: 2,
                    y: 2
                }
            },
            edges: {
                width: 2,
                color: {
                    color: '#848484',
                    highlight: '#4A90E2',
                    hover: '#4A90E2'
                },
                arrows: {
                    to: {
                        enabled: true,
                        scaleFactor: 0.8
                    }
                },
                smooth: {
                    enabled: true,
                    type: 'continuous',
                    roundness: 0.5
                },
                font: {
                    size: 11,
                    color: '#999999',
                    background: 'rgba(255,255,255,0.8)',
                    strokeWidth: 0
                }
            },
            physics: {
                enabled: this.physicsEnabled,
                solver: 'forceAtlas2Based',
                forceAtlas2Based: {
                    gravitationalConstant: -50,
                    centralGravity: 0.01,
                    springLength: 150,
                    springConstant: 0.08,
                    damping: 0.4,
                    avoidOverlap: 0.5
                },
                stabilization: {
                    enabled: true,
                    iterations: 200,
                    updateInterval: 25
                }
            },
            interaction: {
                hover: true,
                selectConnectedEdges: true,
                tooltipDelay: 300,
                navigationButtons: true,
                keyboard: true
            },
            layout: {
                improvedLayout: true,
                hierarchical: false
            }
        };

        this.network = new Network(
            this.graphContainer.nativeElement,
            {
                nodes: this.nodesDataSet,
                edges: this.edgesDataSet
            },
            options
        );

        this.setupNetworkEvents();
    }

    /**
     * Setup network event handlers
     */
    private setupNetworkEvents(): void {
        if (!this.network) return;

        this.network.on('click', (params:any) => {
            console.log("Networks click : ",params);
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const node = this.nodesDataSet?.get(nodeId);
                if (node) {
                    this.selectedNodeData = node as any;
                    this.nodeClick.emit({ node: node as any, event: params.event });
                    this.changeDetector.markForCheck();
                }
            }
            else if (params.edges.length > 0) {
                const edge = this.edgesDataSet?.get(params.edges[0]);
                if (edge) {
                    this.selectedEdgeData = edge as any;
                    //this.nodeClick.emit({ node: node as any, event: params.event });
                    this.changeDetector.markForCheck();
                }
            }
        });

        this.network.on('doubleClick', (params:any) => {
            this.doubleClick.emit(params);
        });

        this.network.on('oncontext', (params:any) => {
            console.log("Networks oncontext : ",params);
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const node = this.nodesDataSet?.get(nodeId);
                if(node==null || node?.length==0 || node[0].data==null) return;

                switch (node[0].data.__){
                    case NodeInternalType.CLASS:
                    case NodeInternalType.METHOD:
                    case NodeInternalType.PACKAGE:
                    case NodeInternalType.FIELD:
                    case NodeInternalType.FUNC:
                        this.codeSvc.displayContextMenu(
                            {},
                            ctxNodeMapping.code[node[0].data.__],
                            (node as any).data
                        );
                        break;
                }
            }
        });

        this.network.on('selectNode', (params:any) => {
            this.selection = {
                nodes: params.nodes,
                edges: params.edges
            };
            this.selectionChange.emit(this.selection);
        });

        this.network.on('deselectNode', () => {
            this.selection = null;
            this.selectedNodeData = null;
            this.selectedEdgeData = null;
            this.selectionChange.emit({ nodes: [], edges: [] });
            this.changeDetector.markForCheck();
        });

        this.network.on('stabilizationIterationsDone', () => {
            if (this.autoFit) {
                this.fitToView();
            }
        });
    }

    /**
     * Build graph from data
     */
    private buildGraph(): void {
        console.log("Building graph...",this.bbs);
        if (!this.bbs || this.bbs.length === 0) return;

        this.nodes = [];
        this.edges = [];
        this.processedNodes.clear();
        this.nodeIdMap.clear();

        // Process each input object
        this.bbs.forEach(obj => {

            const s = this.processNode(obj, 0);

            //console.log("Adding edge from ",s," to ",t,obj);
            //this.addEdge(s, t, (obj as any).instr ? (obj as any).instr : "call" , obj);

        });

        // merge nodes/edges


        // Update datasets
        if (this.nodesDataSet && this.edgesDataSet) {
            this.nodesDataSet.clear();
            this.edgesDataSet.clear();
            this.nodesDataSet.add(this.nodes);
            this.edgesDataSet.add(this.edges);
        }

        this.changeDetector.markForCheck();
    }


    /**
     * Check if object is a Model node (has __ property of type NodeInternalType)
     */
    private isModelNode(obj: any): boolean {

        return obj && typeof obj === 'object' &&
            obj.hasOwnProperty('__') &&
            typeof obj.__ === 'number' &&
            this.hidden.indexOf(obj.__) === -1;

        /**
        if(!f) return false;

        if(this.mode===GraphMode.CFG){
            return f &&
                [
                    NodeInternalType.METHOD,
                    NodeInternalType.FUNC,
                ].indexOf(obj.__) > -1 ;
        }else if(this.mode===GraphMode.XREF){
            return f &&
                [
                    NodeInternalType.METHOD,
                    NodeInternalType.FUNC,
                    NodeInternalType.CLASS,
                    NodeInternalType.STRING,
                    NodeInternalType.FIELD,
                    NodeInternalType.CALL
                ].indexOf(obj.__) > -1 ;
        }else{
            return f && this.hidden.indexOf(obj.__) === -1 ;
        }**/
    }

    /**
     * Process a node and its relationships
     */
    private processNode(obj: any, pDepth: number, pOrphean = false): BbNodeID[] {
        console.log("Processing node...",obj);
        if (pDepth > this.maxDepth) return [];

        const nodeIds = this.getNodeId(obj);

        if (this.processedNodes.has(nodeIds[0].uid)) {
            return nodeIds;
        }

        this.processedNodes.add(nodeIds[0].uid);
        this.nodeIdMap.set(obj, nodeIds[0].uid);

        // Create graph node
        const graphNode: GraphNode = {
            id: nodeIds[0].uid,
            label: this.getNodeLabel(obj),
            title: this.getNodeTooltip(obj),
            group: this.getNodeGroup(obj.__),
            color: this.getNodeColor(obj.__),
            nodeType: obj.__,
            data: obj
        };

        this.nodes.push(graphNode);

        // Process relationships
        if (!pOrphean && pDepth < this.maxDepth) {
            this.processRelationships(obj, nodeIds, pDepth);
        }

        return nodeIds;
    }

    /**
     * Process relationships of a node
     */
    private processRelationships(pObj: ModelBasicBlock, sourceId: BbNodeID[], depth: number): void {

        if(pObj.__ ===NodeInternalType.DATA_BLOCK){
            return;
        }

        /*
        for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            if(this.only.length>0 && this.only.indexOf(key)===-1) continue;

            const value = obj[key];

            // Skip private/internal properties
            // key.startsWith('_') ||
            if (key.startsWith('$')) continue;

            if(this.mode===GraphMode.XREF){
                if(key!="_caller" && key!="_called"){
                    if (this.isModelNode(value)) {
                        const targetId = this.processNode(value, depth + 1);
                        if (targetId) {
                            this.addEdge(sourceId, targetId, key, obj);
                        }
                        continue;
                    }
                }
            }

            // Handle single related object
            if (this.isModelNode(value)) {
                const targetId = this.processNode(value, depth + 1);
                if (targetId) {
                    this.addEdge(sourceId, targetId, key, obj);
                }
            }
            // Handle array of related objects
            else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (this.isModelNode(item)) {
                        const targetId = this.processNode(item, depth + 1);
                        if (targetId) {
                            this.addEdge(sourceId, targetId, `${key}[${index}]`);
                        }
                    }
                });
            }
        }*/
    }

    /**
     * Add an edge between two nodes
     */
    private addEdge(from: string, to: string, propertyName: string, pExtra = null): void {
        const edgeId = `${from}-${to}-${propertyName}`;

        // Avoid duplicate edges
        if (this.edges.find(e => e.id === edgeId)) return;

        const edge: GraphEdge = {
            id: edgeId,
            from,
            to,
            label: this.showLabels ? propertyName : undefined,
            arrows: 'to',
            propertyName,
            extra: pExtra
        };

        this.edges.push(edge);
    }

    /**
     * Get unique ID for a node
     */
    private getNodeId(obj: any): BbNodeID[] {
        const uids:BbNodeID[] = [];
        switch (obj.__){
            case NodeInternalType.BASIC_BLOCK:
                uids.push({
                    uid:`bb:0x${(obj as ModelBasicBlock).offset.toString(16).padStart(8, '0')}`,
                    type: BbPurpose.OFFSET
                });
                if((obj as ModelBasicBlock).catch_name!=null){
                    uids.push({
                        uid:`bb:${(obj as ModelBasicBlock).catch_name}`,
                        type: BbPurpose.CATCH
                    });
                }
                if((obj as ModelBasicBlock).cond_name!=null){
                    uids.push({
                        uid:`bb:${(obj as ModelBasicBlock).cond_name}`,
                        type: BbPurpose.COND
                    });
                }
                if((obj as ModelBasicBlock).goto_name!=null){
                    uids.push({
                        uid:`bb:${(obj as ModelBasicBlock).goto_name}`,
                        type: BbPurpose.GOTO
                    });
                }
                break;
            case NodeInternalType.DATA_BLOCK:
                uids.push({
                    uid: `db:0x${(obj as ModelDataBlock).offset.toString(16).padStart(8, '0')}`,
                    type: BbPurpose.OFFSET
                });
                break;
        }


        // Fallback to object identity
        return uids;
    }

    /**
     * Get display label for a node
     */
    private getNodeLabel(obj: any): string {
        if (obj.name) return obj.name;
        if (obj.alias) return obj.alias;
        if (obj.label) return obj.label;
        if (obj.simpleName) return obj.simpleName;
        if (obj._uid) return obj._uid;


        return this.getNodeTypeName(obj.__);
    }

    /**
     * Get tooltip for a node
     */
    private getNodeTooltip(obj: any): string {
        let tooltip = `Type: ${this.getNodeTypeName(obj.__)}\n`;

        if (obj.name) tooltip += `Name: ${obj.name}\n`;
        if (obj.signature && typeof obj.signature === 'function') {
            tooltip += `Signature: ${obj.signature()}\n`;
        }

        return tooltip;
    }

    /**
     * Get group name for a node type
     */
    private getNodeGroup(nodeType: NodeInternalType): string {
        return NodeInternalType[nodeType] || 'unknown';
    }

    /**
     * Get color for a node type
     */
    private getNodeColor(nodeType: NodeInternalType): string {
        return this.nodeColors[nodeType] || '#999999';
    }

    /**
     * Get human-readable node type name
     */
    getNodeTypeName(nodeType: NodeInternalType): string {
        return NodeInternalType[nodeType] || 'Unknown';
    }

    /**
     * Format node data for display
     */
    formatNodeData(data: any): string {
        const formatted: any = {};

        for (const key in data) {
            if (!key.startsWith('_') && !key.startsWith('$') &&
                typeof data[key] !== 'function' && typeof data[key] !== 'object') {
                formatted[key] = data[key];
            }
        }

        return JSON.stringify(formatted, null, 2);
    }

    /**
     * Fit graph to view
     */
    fitToView(): void {
        if (this.network) {
            this.network.fit({
                animation: {
                    duration: 500,
                    easingFunction: 'easeInOutQuad'
                }
            });
        }
    }

    /**
     * Reset zoom to 100%
     */
    resetZoom(): void {
        if (this.network) {
            this.network.moveTo({
                scale: 1.0,
                animation: {
                    duration: 500,
                    easingFunction: 'easeInOutQuad'
                }
            });
        }
    }

    /**
     * Toggle physics simulation
     */
    togglePhysics(): void {
        this.physicsEnabled = !this.physicsEnabled;
        if (this.network) {
            this.network.setOptions({
                physics: {
                    enabled: this.physicsEnabled
                }
            });
        }
        this.changeDetector.markForCheck();
    }

    /**
     * Update labels visibility
     */
    updateLabelsVisibility(): void {
        if (this.edgesDataSet) {
            const edges = this.edgesDataSet.get();
            edges.forEach((edge:any) => {
                edge.label = this.showLabels ? edge.propertyName : undefined;
            });
            this.edgesDataSet.update(edges);
        }
    }

    /**
     * Clear selection
     */
    clearSelection(): void {
        if (this.network) {
            this.network.unselectAll();
        }
        this.selectedNodeData = null;
        this.selectedEdgeData = null;
        this.selection = null;
        this.changeDetector.markForCheck();
    }

    /**
     * Public method to refresh graph
     */
    refresh(): void {
        this.buildGraph();
    }

    /**
     * Public method to add nodes dynamically
     */
    addNodes(nodes: any[]): void {
        nodes.forEach(node => {
            if (this.isModelNode(node)) {
                this.processNode(node, 0);
            }
        });

        if (this.nodesDataSet && this.edgesDataSet) {
            this.nodesDataSet.update(this.nodes);
            this.edgesDataSet.update(this.edges);
        }

        this.changeDetector.markForCheck();
    }

    /**
     * Public method to clear graph
     */
    clear(): void {
        this.nodes = [];
        this.edges = [];
        this.processedNodes.clear();
        this.nodeIdMap.clear();

        if (this.nodesDataSet && this.edgesDataSet) {
            this.nodesDataSet.clear();
            this.edgesDataSet.clear();
        }

        this.selectedNodeData = null;
        this.selectedEdgeData = null;
        this.selection = null;
        this.changeDetector.markForCheck();
    }

    prepareLabel(pNode: any) {
        console.log("prepareLabel",pNode);
        return pNode.label;
    }

    prepareEdgeLabel(pEdge: GraphEdge) {
        if(pEdge.extra && pEdge.extra.instr){
            return pEdge.extra.instr;
        }else{
            return pEdge.label ?? "";
        }
    }

    formatEdgeData(pData: any) {
        return pData.extra;
    }

    isNodeRef(pNode: GraphNode) {
        return (pNode!=null)
            && (pNode.data!=null)
            && (pNode.data.__!=null)
            && (pNode.data._uid!=null);
    }
}