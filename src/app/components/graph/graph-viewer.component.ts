
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
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import {GraphDataService, GraphEdgeData, GraphNodeData, GraphQuery} from "./graph.service";
import {NodeInternalType} from "../../models/NodeInternalType";
import {Nullable} from "../../base/Nullable";
import {GRAPH_ICONS} from "./icons";
import {INode} from "../../models/INode";
import ModelMethod from "../../models/ModelMethod";

@Component({
    selector: 'app-graph-explorer',
    templateUrl: './graph-viewer.component.html',
    styleUrls: []
})
export class GraphExplorerComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('networkContainer', { static: true }) networkContainer!: ElementRef;

    @Input() height: number = 600;
    @Input() initialQuery?: GraphQuery;

    @Input() viewType:string = "disassembly";
    @Input() from?: INode;

    @Output() nodeSelected = new EventEmitter<GraphNodeData>();
    @Output() nodesExpanded = new EventEmitter<{ original: GraphNodeData[], added: GraphNodeData[] }>();

    // Vis-network instances
    private network!: Network;
    private nodes!: DataSet<GraphNodeData>;
    private edges!: DataSet<GraphEdgeData>;

    // Component state
    private destroy$ = new Subject<void>();
    private searchSubject$ = new Subject<string>();

    selectedNodes = new Set<string>();
    selectedNodeTypes = new Set<NodeInternalType>();
    availableNodeTypes: { type: NodeInternalType, label: string, color: string }[] = [];

    searchQuery = '';
    selectedNodeInfo: GraphNodeData[] = [];
    isLoading = false;
    loadingMessage = '';

    networkStats: {
        nodeCount: number;
        edgeCount: number;
        performance?: number;
    } | null = null;

    // Icons pour la toolbar
    icons = GRAPH_ICONS;

    constructor(private graphDataService: GraphDataService) {
        // Configuration de la recherche avec debounce
        this.searchSubject$.pipe(
            debounceTime(300),
            takeUntil(this.destroy$)
        ).subscribe(query => {
            this.performSearch();
        });
    }

    ngOnInit() {
        // Initialiser les types de nœuds disponibles
        this.availableNodeTypes = this.graphDataService.getAvailableNodeTypes();

        // Sélectionner quelques types par défaut
        this.selectedNodeTypes.add(NodeInternalType.CLASS);
        this.selectedNodeTypes.add(NodeInternalType.METHOD);
        this.selectedNodeTypes.add(NodeInternalType.FIELD);
    }

    ngAfterViewInit() {
        this.initializeNetwork();

        if (this.initialQuery) {
            this.loadGraphData(this.initialQuery);
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

        if (this.network) {
            this.network.destroy();
        }
    }

    private initializeNetwork() {
        // Initialiser les DataSets
        this.nodes = new DataSet<GraphNodeData>();
        this.edges = new DataSet<GraphEdgeData>();

        // Configuration Vis-network optimisée pour de gros graphes
        const options:any = {
            nodes: {
                chosen: {
                    node: (values: any, id: string) => {
                        values.shadow = true;
                        values.shadowSize = 10;
                        values.shadowColor = 'rgba(0,0,0,0.3)';
                    }
                },
                font: {
                    strokeWidth: 2,
                    strokeColor: 'white'
                }
            },
            edges: {
                smooth: {
                    enabled: true,
                    type: 'continuous',
                    forceDirection: 'none'
                },
                arrows: {
                    to: {
                        enabled: true,
                        scaleFactor: 0.8
                    }
                }
            },
            physics: {
                enabled: true,
                solver: 'forceAtlas2Based',
                forceAtlas2Based: {
                    gravitationalConstant: -50,
                    centralGravity: 0.005,
                    springLength: 200,
                    springConstant: 0.18,
                    damping: 0.15,
                    avoidOverlap: 0.1
                },
                maxVelocity: 50,
                minVelocity: 0.1,
                timestep: 0.35,
                adaptiveTimestep: true,
                stabilization: {
                    enabled: true,
                    iterations: 100,
                    updateInterval: 25
                }
            },
            interaction: {
                hover: true,
                selectConnectedEdges: false,
                tooltipDelay: 200,
                dragNodes: true,
                dragView: true,
                zoomView: true,
                multiselect: true
            },
            layout: {
                improvedLayout: false, // Désactiver pour de meilleures performances
                clusterThreshold: 100
            }
        };

        // Créer le réseau
        this.network = new Network(
            this.networkContainer.nativeElement,
            { nodes: this.nodes, edges: this.edges },
            options
        );

        this.setupNetworkEvents();
    }

    private setupNetworkEvents() {
        // Gestion de la sélection
        this.network.on('select', (params) => {
            this.selectedNodes.clear();
            params.nodes.forEach((id: string) => this.selectedNodes.add(id));

            if (params.nodes.length === 1) {
                const nodeData = this.nodes.get(params.nodes[0]);
                if (nodeData) {
                    this.selectedNodeInfo = nodeData;
                    nodeData.map(n => { this.nodeSelected.emit(n); });

                }
            } else {
                this.selectedNodeInfo = [];
            }

            this.updateStats();
        });

        // Double-click pour expansion
        this.network.on('doubleClick', (params) => {
            if (params.nodes.length === 1) {
                const nodeData = this.nodes.get(params.nodes[0]);
                if (nodeData && nodeData.length > 0) {
                    this.expandFromNode(nodeData[0]);
                }
            }
        });

        // Performance monitoring
        this.network.on('stabilizationIterationsDone', () => {
            const start = performance.now();
            this.network.redraw();
            const end = performance.now();

            if (this.networkStats) {
                this.networkStats.performance = Math.round(end - start);
            }
        });

        // Hover effects
        this.network.on('hoverNode', (params) => {
            this.emphasizeNode(params.node);
        });

        this.network.on('blurNode', (params) => {
            this.deemphasizeNode(params.node);
        });
    }

    loadGraphDataFromNode(pMeth: ModelMethod) {
        this.isLoading = true;
        this.loadingMessage = 'Chargement du graphe...';

        this.graphDataService.fetchMethod(pMeth.getUID(), [])
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    this.nodes.clear();
                    this.edges.clear();

                    // Filtrer selon les types sélectionnés
                    const filteredNodes = data.nodes.filter(node =>
                        this.selectedNodeTypes.has(node.nodeType)
                    );

                    this.nodes.add(filteredNodes);
                    this.edges.add(data.edges);

                    this.updateStats();
                    this.fitToView();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Erreur lors du chargement:', error);
                    this.isLoading = false;
                    this.loadingMessage = '';
                }
            });
    }

    /**
     * Charge les données du graphe depuis le service
     */
    loadGraphData(query: GraphQuery) {
        this.isLoading = true;
        this.loadingMessage = 'Chargement du graphe...';

        this.graphDataService.fetchGraphData(query)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    this.nodes.clear();
                    this.edges.clear();

                    // Filtrer selon les types sélectionnés
                    const filteredNodes = data.nodes.filter(node =>
                        this.selectedNodeTypes.has(node.nodeType)
                    );

                    this.nodes.add(filteredNodes);
                    this.edges.add(data.edges);

                    this.updateStats();
                    this.fitToView();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Erreur lors du chargement:', error);
                    this.isLoading = false;
                    this.loadingMessage = '';
                }
            });
    }

    /**
     * Étend le graphe à partir d'un nœud
     */
    expandFromNode(node: GraphNodeData) {
        this.isLoading = true;
        this.loadingMessage = `Extension depuis ${node.label}...`;

        const selectedTypes = Array.from(this.selectedNodeTypes);
        const pFilter = /* depend of context */ [];
        this.graphDataService.expandFromNode({ _uid:node.uid, __:selectedTypes[0] }, selectedTypes)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    const existingNodeIds = new Set(this.nodes.getIds());
                    const newNodes = data.nodes.filter(n => !existingNodeIds.has(n.id as number));
                    const newEdges = data.edges.filter(e => !this.edges.get(e.id as number));

                    this.nodes.add(newNodes);
                    this.edges.add(newEdges);

                    // Highlight des nouveaux nœuds
                    newNodes.forEach(node => {
                        setTimeout(() => this.emphasizeNode(node.id as number), 100);
                    });

                    this.nodesExpanded.emit({ original: [node], added: newNodes });
                    this.updateStats();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Erreur lors de l\'expansion:', error);
                    this.isLoading = false;
                }
            });
    }

    /**
     * Toggle d'un type de nœud dans les filtres
     */
    toggleNodeType(nodeType: NodeInternalType, event: Event) {
        const target = event.target as HTMLInputElement;

        if (target.checked) {
            this.selectedNodeTypes.add(nodeType);
        } else {
            this.selectedNodeTypes.delete(nodeType);
        }

        this.applyNodeTypeFilters();
    }

    /**
     * Applique les filtres de types de nœuds
     */
    private applyNodeTypeFilters() {
        const allNodes = this.nodes.get();
        const filteredNodes = allNodes.filter(node =>
            this.selectedNodeTypes.has(node.nodeType)
        );

        // Mise à jour de la visibilité
        this.nodes.clear();
        this.nodes.add(filteredNodes);

        this.updateStats();
    }

    /**
     * Recherche dans le graphe
     */
    onSearchChange() {
        this.searchSubject$.next(this.searchQuery);
    }

    performSearch() {
        if (!this.searchQuery.trim()) {
            this.clearHighlights();
            return;
        }

        const searchTerm = this.searchQuery.toLowerCase();
        const matchingNodes: number[] = [];

        this.nodes.forEach(node => {
            const label = node.label?.toLowerCase() || '';
            const uid = node.uid.toLowerCase();

            if (label.includes(searchTerm) || uid.includes(searchTerm)) {
                if(node.id!=null){
                    matchingNodes.push(node.id as number);
                }
            }
        });

        if (matchingNodes.length > 0) {
            this.highlightNodes(matchingNodes);
            this.network.selectNodes(matchingNodes);
            this.network.focus(matchingNodes[0], { animation: true, scale: 1.5 });
        }
    }

    /**
     * Utilitaires pour l'interaction réseau
     */
    fitToView() {
        this.network.fit({ animation: true });
    }

    resetZoom() {
        this.network.moveTo({ scale: 1, animation: true });
    }

    focusOnNode(nodeId: string) {
        this.network.focus(nodeId, { animation: true, scale: 1.5 });
    }

    expandSelection() {
        if (this.selectedNodes.size === 0) return;

        const nodesToExpand = Array.from(this.selectedNodes)
            .map(id => this.nodes.get(id))
            .filter(node => node !== null);

        // Expand depuis chaque nœud sélectionné
        nodesToExpand.forEach(node => {
            if (node) this.expandFromNode(node);
        });
    }

    clearGraph() {
        this.nodes.clear();
        this.edges.clear();
        this.selectedNodes.clear();
        this.selectedNodeInfo = [];
        this.updateStats();
    }

    closeNodeInfo() {
        this.selectedNodeInfo = [];
    }

    /**
     * Utilitaires de style et highlighting
     */
    private emphasizeNode(nodeId: number) {
        this.nodes.update({
            id: nodeId,
            size: (this.nodes.get(nodeId)?.size || 25) * 1.3,
            borderWidth: 3
        });
    }

    private deemphasizeNode(nodeId: string) {
        const originalNode = this.nodes.get(nodeId);
        if (originalNode) {
            this.nodes.update({
                id: nodeId,
                size: this.graphDataService.getNodeSize?.(originalNode.nodeType) || 25,
                borderWidth: 1
            });
        }
    }

    private highlightNodes(nodeIds: number[]) {
        this.clearHighlights();

        nodeIds.forEach(id => {
            this.nodes.update({
                id: id,
                color: {
                    background: '#FFD700',
                    border: '#FF8C00'
                },
                borderWidth: 3
            });
        });
    }

    private clearHighlights() {
        // Restore original colors for all nodes
        this.nodes.forEach(node => {
            this.nodes.update({
                id: node.id,
                color: {
                    background: this.graphDataService.nodeColors?.get(node.nodeType) || '#E0E0E0',
                    border: '#333333'
                },
                borderWidth: 1
            });
        });
    }

    /**
     * Utilitaires d'information sur les nœuds
     */
    getNodeTypeLabel(nodeType: NodeInternalType): string {
        const typeInfo = this.availableNodeTypes.find(t => t.type === nodeType);
        return typeInfo?.label || `Type ${nodeType}`;
    }

    getNodeProperties(node: GraphNodeData): { key: string, value: string }[] {
        const properties: { key: string, value: string }[] = [
            { key: 'UID', value: node.uid },
            { key: 'Type', value: this.getNodeTypeLabel(node.nodeType) }
        ];

        // Ajouter des propriétés spécifiques selon le type
        if (node.originalData) {
            const data = node.originalData as any;

            switch (node.nodeType) {
                case NodeInternalType.METHOD:
                    if (data.signature) properties.push({ key: 'Signature', value: data.signature });
                    if (data.access) properties.push({ key: 'Accès', value: data.access });
                    break;
                case NodeInternalType.CLASS:
                    if (data.package) properties.push({ key: 'Package', value: data.package });
                    if (data.superclass) properties.push({ key: 'Superclasse', value: data.superclass });
                    break;
                case NodeInternalType.INSTRUCTION:
                    if (data.mnemonic) properties.push({ key: 'Mnémonic', value: data.mnemonic });
                    if (data.address) properties.push({ key: 'Adresse', value: `0x${data.address.toString(16)}` });
                    break;
            }

            if (data.tags && data.tags.length > 0) {
                properties.push({ key: 'Tags', value: data.tags.join(', ') });
            }
        }

        return properties;
    }

    private updateStats() {
        this.networkStats = {
            nodeCount: this.nodes.length,
            edgeCount: this.edges.length
        };
    }



    dissassemblyView(pMethodUid:string):void {
        const options = {
            manipulation: false,
            height: "90%",
            layout: {
                hierarchical: {
                    enabled: true,
                    levelSeparation: 300,
                },
            },
            physics: {
                hierarchicalRepulsion: {
                    nodeDistance: 300,
                },
            },
        };

        this.isLoading = true;
        this.loadingMessage = 'Loading view ...';

        this.graphDataService.fetchMethod(pMethodUid, [])
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    this.nodes.clear();
                    this.edges.clear();

                    // Filtrer selon les types sélectionnés
                    /*const filteredNodes = data.nodes.filter(node =>
                        this.selectedNodeTypes.has(node.nodeType)
                    );*/

                    data.nodes.map((vNode) => {
                        switch (vNode.nodeType) {
                            case NodeInternalType.INSTRUCTION:
                                break;
                            case NodeInternalType.BASIC_BLOCK:
                                console.log("disassemblyView => Transform BasicBlock",vNode);
                                //vNode.label =
                                break;
                        }
                    });

                    this.nodes.add(data.nodes);
                    this.edges.add(data.edges);

                    this.updateStats();
                    this.fitToView();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Erreur lors du chargement:', error);
                    this.isLoading = false;
                    this.loadingMessage = '';
                }
            });

        /*
        export const nodes = [
            {
                id: "cfg_0x00405a2e",
                size: 150,
                label:
                    "0x00405a2e:\nmov    DWORD PTR ss:[esp + 0x000000b0], 0x00000002\nmov    DWORD PTR ss:[ebp + 0x00], esi\ntest   bl, 0x02\nje     0x00405a49<<Insn>>\n",
                color: "#FFCFCF",
                shape: "box",
                font: { face: "monospace", align: "left" },
            },
            {
                id: "cfg_0x00405a49",
                size: 150,
                label: "0x00405a49:\ntest   bl, 0x01\nje     0x00405a62<<Insn>>\n",
                color: "#FFCFCF",
                shape: "box",
                font: { face: "monospace", align: "left" },
            },
            {
                id: "cfg_0x00405a55",
                size: 150,
                label:
                    "0x00405a55:\nmov    ecx, DWORD PTR ss:[esp + 0x1c]\npush   ecx\ncall   0x004095c6<<Func>>\n",
                color: "#FFCFCF",
                shape: "box",
                font: { face: "monospace", align: "left" },
            },
            {
                id: "cfg_0x00405a62",
                size: 150,
                label:
                    "0x00405a62:\nmov    eax, 0x00000002\nmov    ecx, DWORD PTR ss:[esp + 0x000000a8]\nmov    DWORD PTR fs:[0x00000000], ecx\npop    ecx\npop    esi\npop    ebp\npop    ebx\nadd    esp, 0x000000a4\nret\n",
                color: "#FFCFCF",
                shape: "box",
                font: { face: "monospace", align: "left" },
            },
            {
                id: "cfg_0x004095c6",
                size: 150,
                label:
                    "0x004095c6:\nmov    edi, edi\npush   ebp\nmov    ebp, esp\npop    ebp\njmp    0x00417563<<Func>>\n",
                color: "#FFCFCF",
                shape: "box",
                font: { face: "monospace", align: "left" },
            },
            {
                id: "cfg_0x00405a39",
                size: 150,
                label:
                    "0x00405a39:\nand    ebx, 0xfd<-0x03>\nlea    ecx, [esp + 0x34]\nmov    DWORD PTR ss:[esp + 0x10], ebx\ncall   0x00403450<<Func>>\n",
                color: "#FFCFCF",
                shape: "box",
                font: { face: "monospace", align: "left" },
            },
            {
                id: "cfg_0x00403450",
                size: 150,
                label:
                    "0x00403450:\npush   0xff<-0x01>\npush   0x0042fa64\nmov    eax, DWORD PTR fs:[0x00000000]\npush   eax\npush   ecx\npush   ebx\npush   ebp\npush   esi\npush   edi\nmov    eax, DWORD PTR ds:[0x0043dff0<.data+0x0ff0>]\nxor    eax, esp\npush   eax\nlea    eax, [esp + 0x18]\nmov    DWORD PTR fs:[0x00000000], eax\nmov    esi, ecx\nmov    DWORD PTR ss:[esp + 0x14], esi\npush   esi\nmov    DWORD PTR ss:[esp + 0x24], 0x00000004\ncall   0x0042f03f<<Func>>\n",
                color: "#FFCFCF",
                shape: "box",
                font: { face: "monospace", align: "left" },
            },
            {
                id: "cfg_0x00405a4e",
                size: 150,
                label:
                    "0x00405a4e:\ncmp    DWORD PTR ss:[esp + 0x30], 0x10\njb     0x00405a62<<Insn>>\n",
                color: "#FFCFCF",
                shape: "box",
                font: { face: "monospace", align: "left" },
            },
            {
                id: "cfg_0x00405a5f",
                size: 150,
                label: "0x00405a5f:\nadd    esp, 0x04\n",
                color: "#FFCFCF",
                shape: "box",
                font: { face: "monospace", align: "left" },
            },
        ];

//
// Note: there are a couple of node id's present here which do not exist
// - cfg_0x00417563
// - cfg_0x00403489
// - cfg_0x0042f03f
//
// The edges with these id's will not load into the Network instance.
//
        export const edges = [
            {
                from: "cfg_0x00405a2e",
                to: "cfg_0x00405a39",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00405a2e",
                to: "cfg_0x00405a49",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00405a49",
                to: "cfg_0x00405a4e",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00405a49",
                to: "cfg_0x00405a62",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00405a55",
                to: "cfg_0x00405a5f",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00405a55",
                to: "cfg_0x004095c6",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x004095c6",
                to: "cfg_0x00417563",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00405a39",
                to: "cfg_0x00403450",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00405a39",
                to: "cfg_0x00405a49",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00403450",
                to: "cfg_0x00403489",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00403450",
                to: "cfg_0x0042f03f",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00405a4e",
                to: "cfg_0x00405a55",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00405a4e",
                to: "cfg_0x00405a62",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
            {
                from: "cfg_0x00405a5f",
                to: "cfg_0x00405a62",
                arrows: "to",
                physics: false,
                smooth: { type: "cubicBezier" },
            },
        ];*/

    }
}