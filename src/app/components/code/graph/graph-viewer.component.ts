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
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ElementRef,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Network, DataSet, Node, Edge, Options } from 'vis-network/standalone';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {IconComponent} from "../../../base/icon/icon.component";
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
import {Observable, Subject} from "rxjs";


/**
 * Node palette configuration for vis-network
 */
interface NodePaletteConfig {
    color: string | {
        background?: string;
        border?: string;
        highlight?: {
            background?: string;
            border?: string;
        };
        hover?: {
            background?: string;
            border?: string;
        };
    };
    label: string;
    shape?: 'ellipse' | 'circle' | 'database' | 'box' | 'text' | 'diamond' | 'dot' | 'star' | 'triangle' | 'triangleDown' | 'hexagon' | 'square';
    size?: number;
    borderWidth?: number;
    borderWidthSelected?: number;
    font?: {
        color?: string;
        size?: number;
        face?: string;
        background?: string;
        strokeWidth?: number;
        strokeColor?: string;
        align?: 'left' | 'center' | 'right';
    };
    shadow?: boolean | {
        enabled?: boolean;
        color?: string;
        size?: number;
        x?: number;
        y?: number;
    };
    opacity?: number;
    mass?: number;
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
    selector: 'dxc-code-graph-viewer',
    template: `
        <div class="model-graph-viewer">
            <div class="graph-toolbar" *ngIf="showToolbar">
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

            <div class="graph-legend" *ngIf="showLegend">
                <div class="legend-title">Legend</div>
                <div class="legend-item" *ngFor="let item of legendItems">
                    <div class="legend-color" [style.backgroundColor]="item.color"></div>
                    <span>{{ item.label }}&nbsp;({{ item.ctr }})</span>
                </div>
            </div>

            <div class="graph-container" #graphContainer></div>

            <div class="graph-details" *ngIf="selectedNodeData">
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

            <div class="graph-details" *ngIf="selectedEdgeData">
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
    styleUrls: ["./graph-viewer.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeGraphViewerComponent implements OnInit, OnChanges, AfterViewInit {


    /**
     * Array of Model* instances to visualize
     */
    @Input() data: any[] = [];

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

    legendItems:any[] = [];
    legendItemsProto:Record<number,any> = {};

    private nodeColors: IStringIndex<string> = {
        [NodeInternalType.PACKAGE]: '#4A90E2',
        [NodeInternalType.CLASS]: '#E24A4A',
        [NodeInternalType.METHOD]: '#4AE290',
        [NodeInternalType.FIELD]: '#E2904A',
        [NodeInternalType.FUNC]: '#904AE2',
        [NodeInternalType.SYSCALL]: '#87e24a',
        [NodeInternalType.FILE]: '#b9ca60',
        [NodeInternalType.ANDROID_ACTIVITY]: '#70e24a',
        [NodeInternalType.ANDROID_SERVICE]: '#70e24a',
        [NodeInternalType.ANDROID_PROVIDER]: '#70e24a',
        [NodeInternalType.ANDROID_RECEIVER]: '#70e24a',
        [NodeInternalType.STRING]: '#eec5ff',
        [NodeInternalType.HOOK_JAVA]: '#E2E24A',
        [NodeInternalType.HOOK_NATIVE]: '#E2E24A',
        [NodeInternalType.RUNTIME_EVENT]: '#4AE2E2'
    };

    /**
     * Node palette mapping for vis-network styling
     * Maps each NodeInternalType to its visual configuration
     */
    private palette: Map<NodeInternalType, NodePaletteConfig> = new Map([
        [NodeInternalType.PACKAGE, {
            color: {
                background: '#4A90E2',
                border: '#3670c0',
                highlight: { background: '#5AA0F2', border: '#4680d0' },
                hover: { background: '#5AA0F2', border: '#4680d0' }
            },
            label: 'Package',
            shape: 'box',
            size: 20,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 14, face: 'arial' },
            shadow: { enabled: true, color: 'rgba(74, 144, 226, 0.3)', size: 8, x: 2, y: 2 }
        }],
        [NodeInternalType.CLASS, {
            color: {
                background: '#E24A4A',
                border: '#c03030',
                highlight: { background: '#F25A5A', border: '#d04040' },
                hover: { background: '#F25A5A', border: '#d04040' }
            },
            label: 'Class',
            shape: 'ellipse',
            size: 18,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 14, face: 'arial', strokeWidth: 2, strokeColor: '#000000' },
            shadow: { enabled: true, color: 'rgba(226, 74, 74, 0.3)', size: 8, x: 2, y: 2 }
        }],
        [NodeInternalType.METHOD, {
            color: {
                background: '#4AE290',
                border: '#30c070',
                highlight: { background: '#5AF2A0', border: '#40d080' },
                hover: { background: '#5AF2A0', border: '#40d080' }
            },
            label: 'Method',
            shape: 'dot',
            size: 16,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 13, face: 'arial' },
            shadow: { enabled: true, color: 'rgba(74, 226, 144, 0.3)', size: 8, x: 2, y: 2 }
        }],
        [NodeInternalType.FIELD, {
            color: {
                background: '#E2904A',
                border: '#c07030',
                highlight: { background: '#F2A05A', border: '#d08040' },
                hover: { background: '#F2A05A', border: '#d08040' }
            },
            label: 'Field',
            shape: 'diamond',
            size: 14,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 12, face: 'arial' },
            shadow: { enabled: true, color: 'rgba(226, 144, 74, 0.3)', size: 6, x: 2, y: 2 }
        }],
        [NodeInternalType.FUNC, {
            color: {
                background: '#904AE2',
                border: '#7030c0',
                highlight: { background: '#A05AF2', border: '#8040d0' },
                hover: { background: '#A05AF2', border: '#8040d0' }
            },
            label: 'Function',
            shape: 'dot',
            size: 16,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 13, face: 'arial' },
            shadow: { enabled: true, color: 'rgba(144, 74, 226, 0.3)', size: 8, x: 2, y: 2 }
        }],
        [NodeInternalType.SYSCALL, {
            color: {
                background: '#87e24a',
                border: '#67c030',
                highlight: { background: '#97f25a', border: '#77d040' },
                hover: { background: '#97f25a', border: '#77d040' }
            },
            label: 'Syscall',
            shape: 'hexagon',
            size: 16,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 13, face: 'arial' },
            shadow: { enabled: true, color: 'rgba(135, 226, 74, 0.3)', size: 8, x: 2, y: 2 }
        }],
        [NodeInternalType.FILE, {
            color: {
                background: '#b9ca60',
                border: '#99aa40',
                highlight: { background: '#c9da70', border: '#a9ba50' },
                hover: { background: '#c9da70', border: '#a9ba50' }
            },
            label: 'File',
            shape: 'box',
            size: 18,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 13, face: 'arial' },
            shadow: { enabled: true, color: 'rgba(185, 202, 96, 0.3)', size: 8, x: 2, y: 2 }
        }],
        [NodeInternalType.ANDROID_ACTIVITY, {
            color: {
                background: '#70e24a',
                border: '#50c030',
                highlight: { background: '#80f25a', border: '#60d040' },
                hover: { background: '#80f25a', border: '#60d040' }
            },
            label: 'Activity',
            shape: 'star',
            size: 18,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 13, face: 'arial', strokeWidth: 2, strokeColor: '#000000' },
            shadow: { enabled: true, color: 'rgba(112, 226, 74, 0.4)', size: 10, x: 2, y: 2 }
        }],
        [NodeInternalType.ANDROID_SERVICE, {
            color: {
                background: '#70e24a',
                border: '#50c030',
                highlight: { background: '#80f25a', border: '#60d040' },
                hover: { background: '#80f25a', border: '#60d040' }
            },
            label: 'Service',
            shape: 'triangle',
            size: 18,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 13, face: 'arial' },
            shadow: { enabled: true, color: 'rgba(112, 226, 74, 0.4)', size: 10, x: 2, y: 2 }
        }],
        [NodeInternalType.ANDROID_PROVIDER, {
            color: {
                background: '#70e24a',
                border: '#50c030',
                highlight: { background: '#80f25a', border: '#60d040' },
                hover: { background: '#80f25a', border: '#60d040' }
            },
            label: 'Provider',
            shape: 'database',
            size: 18,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 13, face: 'arial' },
            shadow: { enabled: true, color: 'rgba(112, 226, 74, 0.4)', size: 10, x: 2, y: 2 }
        }],
        [NodeInternalType.ANDROID_RECEIVER, {
            color: {
                background: '#70e24a',
                border: '#50c030',
                highlight: { background: '#80f25a', border: '#60d040' },
                hover: { background: '#80f25a', border: '#60d040' }
            },
            label: 'Receiver',
            shape: 'triangleDown',
            size: 18,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 13, face: 'arial' },
            shadow: { enabled: true, color: 'rgba(112, 226, 74, 0.4)', size: 10, x: 2, y: 2 }
        }],
        [NodeInternalType.STRING, {
            color: {
                background: '#eec5ff',
                border: '#cea5df',
                highlight: { background: '#fed5ff', border: '#deb5ef' },
                hover: { background: '#fed5ff', border: '#deb5ef' }
            },
            label: 'String',
            shape: 'box',
            size: 14,
            borderWidth: 1,
            borderWidthSelected: 2,
            font: { color: '#333333', size: 12, face: 'monospace' },
            shadow: { enabled: true, color: 'rgba(238, 197, 255, 0.3)', size: 6, x: 2, y: 2 },
            opacity: 0.9
        }],
        [NodeInternalType.HOOK_JAVA, {
            color: {
                background: '#E2E24A',
                border: '#c0c030',
                highlight: { background: '#F2F25A', border: '#d0d040' },
                hover: { background: '#F2F25A', border: '#d0d040' }
            },
            label: 'Hook (Java)',
            shape: 'square',
            size: 16,
            borderWidth: 3,
            borderWidthSelected: 4,
            font: { color: '#333333', size: 13, face: 'arial', strokeWidth: 1, strokeColor: '#ffffff' },
            shadow: { enabled: true, color: 'rgba(226, 226, 74, 0.4)', size: 10, x: 2, y: 2 }
        }],
        [NodeInternalType.HOOK_NATIVE, {
            color: {
                background: '#E2E24A',
                border: '#c0c030',
                highlight: { background: '#F2F25A', border: '#d0d040' },
                hover: { background: '#F2F25A', border: '#d0d040' }
            },
            label: 'Hook (Native)',
            shape: 'square',
            size: 16,
            borderWidth: 3,
            borderWidthSelected: 4,
            font: { color: '#333333', size: 13, face: 'arial', strokeWidth: 1, strokeColor: '#ffffff' },
            shadow: { enabled: true, color: 'rgba(226, 226, 74, 0.4)', size: 10, x: 2, y: 2 }
        }],
        [NodeInternalType.RUNTIME_EVENT, {
            color: {
                background: '#4AE2E2',
                border: '#30c0c0',
                highlight: { background: '#5AF2F2', border: '#40d0d0' },
                hover: { background: '#5AF2F2', border: '#40d0d0' }
            },
            label: 'Runtime Message',
            shape: 'dot',
            size: 14,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 12, face: 'arial' },
            shadow: { enabled: true, color: 'rgba(74, 226, 226, 0.3)', size: 8, x: 2, y: 2 }
        }],
        [NodeInternalType.CALL, {
            color: {
                background: '#3670ff',
                border: '#1650df',
                highlight: { background: '#4680ff', border: '#2660ef' },
                hover: { background: '#4680ff', border: '#2660ef' }
            },
            label: 'Call',
            shape: 'dot',
            size: 12,
            borderWidth: 2,
            borderWidthSelected: 3,
            font: { color: '#ffffff', size: 11, face: 'arial' },
            shadow: { enabled: true, color: 'rgba(54, 112, 255, 0.3)', size: 6, x: 2, y: 2 }
        }]
    ]);


    private processedNodes: Set<string> = new Set();
    private nodeIdMap: Map<any, string> = new Map();

    action$:Subject<any> = new Subject();

    constructor(private codeSvc:CodeControllerService,
                private changeDetector: ChangeDetectorRef) {}

    ngOnInit(): void {
        // Initialization logic
        console.log("CFG viewer init : ",this);

        this.action$.subscribe(e=>{
            if(e.type=="rebuild"){
                if(e.nodes!=null && e.nodes.length>0){
                    this.data = e.nodes;
                    this.buildGraph();
                }
            }
        })
    }

    ngAfterViewInit(): void {
        this.initializeNetwork();
        console.log("CFG viewer after init : ",this);
        if (this.data && this.data.length > 0) {
            this.buildGraph();

            console.log("CFG viewer after build graph : ",this);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && !changes['data'].firstChange) {
            this.buildGraph();

            console.log("CFG viewer after data changes: ",this);
        }

        console.log("CFG viewer after changes : ",this,changes);
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
            //this.doubleClick.emit(params);

            console.log("Networks doubleClick : ",params);
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

        this.network.on('oncontext', (params:any) => {
            if(this.network==null) return;

            console.log("Networks oncontext : ",params,this);

            const nodeId = this.network.getNodeAt(params.pointer.DOM);

            if (nodeId!=null) {
                const node:any = this.nodesDataSet?.get(nodeId);
                console.log("Networks oncontext node : ",nodeId,node);
                if(node==null) return;

                switch (node.data.__){
                    case NodeInternalType.CLASS:
                    case NodeInternalType.METHOD:
                    case NodeInternalType.PACKAGE:
                    case NodeInternalType.FIELD:
                    case NodeInternalType.FUNC:
                        console.log("Networks oncontext node : ",ctxNodeMapping.code[node.data.__],node);
                        this.codeSvc.displayContextMenu(
                            params.event,
                            ctxNodeMapping.code[node.data.__],
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
        console.log("Building graph...",this.data);
        if (!this.data || this.data.length === 0) return;

        this.legendItemsProto = {};
        this.legendItems = [];
        this.nodes = [];
        this.edges = [];
        this.processedNodes.clear();
        this.nodeIdMap.clear();

        // Process each input object
        this.data.forEach(obj => {
            if(this.mode===GraphMode.XREF){
                if (obj.__ === NodeInternalType.CALL && this.svc!=null) {
                    const s = this.processNode(obj._caller, 0, true);
                    const t = this.processNode(obj._called, 0, true);

                    console.log("Adding edge from ",s," to ",t,obj);
                    this.addEdge(s, t, (obj as any).instr ? (obj as any).instr : "call" , obj);
                }
            }else{
                if (this.isModelNode(obj)) {
                    this.processNode(obj, 0);
                }
            }
        });

        // merge nodes/edges


        // Update datasets
        if (this.nodesDataSet && this.edgesDataSet) {
            this.nodesDataSet.clear();
            this.edgesDataSet.clear();
            this.nodesDataSet.add(this.nodes);
            this.edgesDataSet.add(this.edges);
        }

        this.legendItems = Object.values(this.legendItemsProto);
        console.log("Legend items : ",this.legendItems);
        this.changeDetector.detectChanges();
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
    private processNode(obj: any, pDepth: number, pOrphean = false): string {
        console.log("Processing node...",obj);
        if (pDepth > this.maxDepth) return '';

        const nodeId = this.getNodeId(obj);

        if (this.processedNodes.has(nodeId)) {
            return nodeId;
        }

        this.processedNodes.add(nodeId);
        this.nodeIdMap.set(obj, nodeId);

        const color = this.getNodeColor(obj.__);
        const palette = this.palette.get(obj.__);
        console.log("Processing node color...",obj,color);


        if(!this.legendItemsProto[obj.__]){
            this.legendItemsProto[obj.__] = {
                label: (palette!=null? ( palette.label || '?') : '?'),
                color: (typeof color==='string' ? color : ((color as any).background || "#999999")),
                ctr: 1
            };
        }else{
            this.legendItemsProto[obj.__].ctr++;
        }

        // Create graph node
        let graphNode: GraphNode;

        if(palette){
            graphNode = {
                id: nodeId,
                title: this.getNodeTooltip(obj),
                group: this.getNodeGroup(obj.__),
                nodeType: obj.__,
                data: obj,
                ...palette,
                label: this.getNodeLabel(obj),
            };
        }else{
            graphNode = {
                id: nodeId,
                label: this.getNodeLabel(obj),
                title: this.getNodeTooltip(obj),
                group: this.getNodeGroup(obj.__),
                color: color,
                nodeType: obj.__,
                data: obj
            };
        }



        this.nodes.push(graphNode);

        // Process relationships
        if (!pOrphean && pDepth < this.maxDepth) {
            this.processRelationships(obj, nodeId, pDepth);
        }

        return nodeId;
    }

    /**
     * Process relationships of a node
     */
    private processRelationships(obj: any, sourceId: string, depth: number): void {
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
        }
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
    private getNodeId(obj: any): string {
        if(obj.__!=null && obj._uid!=null){
            return obj.__+":"+obj._uid;
        }

        // Try to use existing UID methods
        if (typeof obj.getUID === 'function') {
            return obj.__+":"+obj.getUID();
        }
        if (typeof obj.signature === 'function') {
            return obj.__+":"+obj.signature();
        }
        if (obj.name) {
            return `${obj.__}:${obj.name}`;
        }
        if (obj.__signature__) {
            return `${obj.__}:${obj.__signature__}`;
        }

        // Fallback to object identity
        return `node-${obj.__}-${Date.now()}-${Math.random()}`;
    }

    /**
     * Get display label for a node
     */
    private getNodeLabel(obj: any): string {


        if (obj.alias) return "@"+obj.alias;

        switch(obj.__){
            case NodeInternalType.CLASS:
                return obj.simpleName;
            case NodeInternalType.PACKAGE:
                return obj.sname;

        }
        if (obj.name) return obj.name;
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
        const p =this.palette.get(nodeType);
        console.log("Getting node color for ",this.palette,nodeType, p);
        if(p==null || p.color==null) return '#999999';


        return p.color || (p.color as any).background || '#999999';
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