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
    EventEmitter,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {Message} from "../../../cmp/Error";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {OutputService} from "../../output/ctrl/output.service";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {Nullable} from "../../../base/Nullable";
import {Tag} from "../../../models/tags/Tag";
import {AuditService, CheckEventState, SearchResult} from "../ctrl/audit.service";
import {OperatingSystem} from "../../../models/OperatingSystem";
import {UIException} from "../../../base/error/UIException";
import {
    MerlinSearchRequest,
    Operation,
    OperationDefinition,
    OperationRequirementType,
    OperationType,
    SupportedOperations
} from "../../../models/search/MerlinSearchRequest";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {ProjectService} from "../../project/ctrl/project.service";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";

export interface OperationChoice {
    value: string,
    label: string
}

export interface NodeChoice {
    value: string,
    label: string,
    type: NodeInternalType
}

interface NodePropertyInfo {
    name: string,
    schema: any,
    node?: NodeInternalType
}

interface ParentNodeInfo {
    //pptName: string,
    ppt: NodePropertyInfo,
    //type?: NodeInternalType,
    alt: NodePropertyInfo[]
}

@Component({
    selector: 'dxc-modal-edit-rule',
    templateUrl: './modal-edit-rule.component.html',
    styleUrls: ['../../../modal.scss', '../../../forms.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalEditRuleComponent extends AbstractKeyboardNavigable implements OnInit, AfterViewInit {


    @Input() tag: Nullable<Tag> = null;
    @Input() controller: any;

    /**
     * Modal title
     *
     * Let empty to remove header
     *
     * @field
     * @type {string}
     */
    @Input() title: Nullable<string> = "Rule Editor";

    @Input() message: Nullable<Message> = null;

    @Input() chooseOs = true;
    @Input() auditMode = true;

    @ViewChild(ModalBaseComponent) modal: ModalBaseComponent;

    onDryRunEnd: EventEmitter<any> = new EventEmitter<any>();

    /**
     * History of executed rule or request
     * History should be stored in the local storage
     */
    history: { req:MerlinSearchRequest, len:number }[] = [];

    gIcons: any = GLOBAL_ICONS;


    item: any = null;

    private onStart: any = null;

    _: number = -1;
    name: string = "";

    os: OperatingSystem;
    descr: any = "";
    label: any = "";

    description: any;

    buildingRequest: Nullable<MerlinSearchRequest> = null;

    targetOs: OperatingSystem = OperatingSystem.ANDROID;
    supportedOs: OperatingSystem[] = [
        OperatingSystem.ANDROID,
        OperatingSystem.IOS,
        OperatingSystem.DARWIN,
        OperatingSystem.LINUX,
        OperatingSystem.TIZEN,
        OperatingSystem.MACOS,
        OperatingSystem.WINNT
    ];
    dryrunResults: any[];
    searchCtrl: any;
    pattern: any;
    freshOpe: any;

    supportedOpe: OperationChoice[] = [
        {label: 'get by id', value: 'get'},
        {label: 'search', value: 'search all'},
        {label: 'validate', value: 'validate'},
        {label: 'aggregate', value: 'aggregate'},
        {label: 'union', value: 'union'},
        {label: 'intersect', value: 'intersect'},
        {label: 'filter', value: 'filter'},
        {label: 'exclude', value: 'exclude'},
        {label: 'select', value: 'select'},
        {label: 'on', value: 'on'}
    ];

    tpl:Record<string, OperationChoice[]> =  {
        begin: [
            {label: 'search', value: 'search all'},
            {label: 'validate', value: 'validate'},
            {label: 'aggregate', value: 'aggregate'},
        ]
    };

    supportedNode: NodeChoice[] = [
        {value: "classes", label: "Classes", type: NodeInternalType.CLASS},
        {value: "methods", label: "Methods", type: NodeInternalType.METHOD},
        {value: "function", label: "Function", type: NodeInternalType.FUNC},
        {value: "strings", label: "Strings", type: NodeInternalType.STRING},
        {value: "packages", label: "Packages", type: NodeInternalType.PACKAGE},
        {value: "calls", label: "Calls", type: NodeInternalType.CALL},
        {value: "files", label: "Files", type: NodeInternalType.FILE},
        {value: "field", label: "Field", type: NodeInternalType.FIELD},
        {value: "syscalls", label: "Syscall", type: NodeInternalType.SYSCALL},
        {value: "instr", label: "Instruction", type: NodeInternalType.INSTRUCTION},
        {value: "ui", label: "UI", type: NodeInternalType.UI_CMP},
        {value: "activities", label: "Activities", type: NodeInternalType.ANDROID_ACTIVITY},
        {value: "providers", label: "Providers", type: NodeInternalType.ANDROID_PROVIDER},
        {value: "receivers", label: "Receivers", type: NodeInternalType.ANDROID_RECEIVER},
        {value: "services", label: "Services", type: NodeInternalType.ANDROID_SERVICE},
        {value: "events", label: "Runtime Events", type: NodeInternalType.RUNTIME_EVENT},
        {value: "hooks", label: "Hooks", type: NodeInternalType.HOOK_JAVA},
        {value: "resources", label: "Resources", type: NodeInternalType.RESOURCE},
        {value: "sessions", label: "Hook Session", type: NodeInternalType.HOOK_SESSION},
        {value: "devices", label: "Devices", type: NodeInternalType.DEVICE}
    ];

    steps: Operation[] = [];
    newNode: Nullable<NodeChoice> = null;
    newOpe: Nullable<OperationDefinition> = null;
    options: any = {}; // SearchOptions;

    private nextField: OperationRequirementType = OperationRequirementType.NONE;

    newOpeType: any;
    newNodeType: any;
    _nodePpts:NodePropertyInfo[] = [];
    nodePpts: { ppts:NodePropertyInfo[], rel:NodePropertyInfo[], extra:NodePropertyInfo[] } = {
        ppts: [], rel: [], extra: []
    };
    parentNodes: ParentNodeInfo[] = [];
    newNodePpt: Nullable<string> = null;
    /**
     * Type of input for the condition field.
     */
    condInputType: string = "none";
    /**
     * A flag to indi            this.nodePpts = tree; //pRes;cate if Regular Expression is enabled for the pattern
     */
    reEnabled: boolean = false;

    saveBtn = false;
    onSave: Nullable<(vReq:MerlinSearchRequest)=>boolean> = null;

    constructor(
        public auditSvc: AuditService,
        private _projectSvc: ProjectService,
        private _codeSvc: CodeControllerService,
        private _outputSvc: OutputService,
        private _changeDetector: ChangeDetectorRef,
        private kbSvc: KeyboardNavigationService) {
        super();
    }

    ngOnInit(): void {
        this.kbSvc.register(this);

    }

    /**
     * To init component
     */
    ngAfterViewInit(): void {

        if (this.controller.app == null) {
            throw UIException.APP_NOT_INITIALIZED;
        }

        this.auditSvc.openEditor$.subscribe((x) => {
            this.modal.show();
        });

        this._codeSvc.onMenuClick.subscribe((x) => {
            if(x.item=="search-mql"){

                this.auditMode = false;
                const prj = this._projectSvc.getSelectedProject();
                if(prj!=null){
                    this.chooseOs = false;
                    this.targetOs = prj.os as OperatingSystem;
                }

                if(x.opts!=null){
                    this.saveBtn = x.opts.save;
                    this.onSave = x.opts.onSave;
                }
                this.modal.show();
            }
        });

        this.searchCtrl = this.controller.app.getController('ctrl:search');
    }

    onKeyPress(pEvent: any) {
        switch (pEvent.code) {
            case "Escape":
                this.modal.hide('close');
                break;
        }
    }


    show() {
        this.modal.show();
    }

    onOpen(pEvent: any) {
        const tag = pEvent.target.options;
        console.log("RULE EDITOR : ", tag);
        if (tag != null && tag.descr != null) this.description = tag.descr;
    }

    close() {
        this.modal.hide('close');
    }

    save(){
        if(this.onSave){
            const req = new MerlinSearchRequest(
                (this.newNode as NodeChoice).type,
                this._getCurrentOperations()
            );

            console.log("Rule editor : on Save", req, this);
            if(req!=null){
                if(this.onSave.apply(null, [req])){
                    this.saveBtn = false;
                    this.onSave = null;
                    this.modal.hide('close');
                }
            }
        }
    }

    onTargetOsChange(pOS: OperatingSystem) {

    }


    /**
     * To append a new operation
     */
    addOperation() {
        let ope: Operation;


        // get ope type
        const opeType = this.newOpe;

        // get node
        const opeSubject = this.newNode;

        //
        if (this.steps.length == 0 && opeSubject != null) {
            this.buildingRequest = new MerlinSearchRequest(opeSubject.type, []);
        } else if (this.buildingRequest == null) {
            throw new Error("Building request cannot be empty");
        }


        const targetField =  (this.parentNodes.length>0 ? this.parentNodes.map(x => x.ppt.name).join('.')+'.':'')+this.newNodePpt

        // get
        switch (opeType?.type) {
            case OperationType.SEARCH:
                //this.buildingRequest.search(this.pattern, this.options);
                this.buildingRequest.searchObj({
                    pattern: this.pattern,
                    field: targetField,
                    regexp: this.reEnabled,
                    raw: targetField + ":" + this.pattern
                }, this.options);
                break;
            case OperationType.FILTER:
                this.buildingRequest.filter(this.pattern);
                break;
            case OperationType.UNION:
                //this.buildingRequest.union(this.pattern);
                break;
            case OperationType.JOIN:
                //this.buildingRequest.union(this.pattern);
                break;
            /*case OperationType.TIME:
              this.buildingRequest.before(this.pattern);
              break;*/
            case OperationType.SELECT:
                this.buildingRequest.select(this.pattern);
                break;
        }

        this.steps.push(this.buildingRequest.getLatestOperation());

        // reset
        this.resetNewOperation();

        console.log(this.buildingRequest);
    }


    /**
     * To append a new operation
     */
    private _buildCurrentOperation(): Nullable<Operation> {
        let ope: Operation;
        let req: MerlinSearchRequest;

        if (this.newOpe == null || this.newNode == null) {
            return null;
        }

        req = new MerlinSearchRequest(this.newNode.type, []);

        const targetField =  (this.parentNodes.length>0 ? this.parentNodes.map(x => x.ppt.name).join('.')+'.':'')+this.newNodePpt
        // get
        switch ((this.newOpe).type) {
            case OperationType.SEARCH:
                //req.search(this.pattern, this.options);
                if(targetField==="tags"){
                    req.searchObj({
                        tagKey: this.pattern,
                        field: "tags",
                        regexp: false,
                        raw: "@" + this.pattern
                    }, this.options);
                }else{
                    req.searchObj({
                        pattern: this.pattern,
                        field: targetField,
                        regexp: this.reEnabled,
                        raw: targetField + ":" + this.pattern
                    }, this.options);
                }

                break;
            case OperationType.FILTER:
                req.filter(this.pattern);
                break;
            case OperationType.UNION:
                //this.buildingRequest.union(this.pattern);
                break;
            case OperationType.JOIN:
                //this.buildingRequest.union(this.pattern);
                break;
            /*case OperationType.TIME:
              this.buildingRequest.before(this.pattern);
              break;*/
            case OperationType.SELECT:
                req.select(this.pattern);
                break;
        }

        return req.getLatestOperation()
    }

    resetNewOperation() {

        this.newOpe = null;
        this.newNode = null;
        this.newNodePpt = null;
        this._nodePpts = [];
        this.nodePpts = { ppts: [], rel: [], extra: []};
        this.parentNodes = [];
    }

    getSupportedOperations(): OperationDefinition[] {
        return MerlinSearchRequest.getFirstOperationsDef(); //SupportedOperations;
    }

    getSupportedNodes(): NodeChoice[] {
        return this.supportedNode;
    }


    private _getCurrentOperations(): Operation[] {
        const opes: Operation[] = []

        const last = this._buildCurrentOperation()
        if (last != null) opes.push(last);

        return opes;
    }

    /**
     * To execute the request in the line
     */
    execSingle() {
        if (!this._projectSvc.isProjectIsOpen()) {
            this._outputSvc.alert(OutputMessage.newError({msg: "Open a project first"}));
            return;
        }

        //this.idle = false;
        //this.onScanning.emit(this.idle);
        this._changeDetector.detectChanges();

        const oneRule = {
            request: new MerlinSearchRequest(
                (this.newNode as NodeChoice).type,
                this._getCurrentOperations()
            )
        }

        this.auditSvc.runRule(null, oneRule).subscribe((res) => {
            console.log("Execute MERLIN Request (as rule)", res);

            //this.idle = true;
            //this.onScanning.emit(this.idle);

            this._changeDetector.detectChanges();
            if (res.event.state == CheckEventState.SUCCESS) {
                this.onDryRunEnd.emit({success: true, res: res.results});
            } else {
                this.onDryRunEnd.emit({success: false, res: []});
            }
        });
    }

    /**
     * To execute as a simple Search
     */
    execAsSearch() {
        if (!this._projectSvc.isProjectIsOpen()) {
            this._outputSvc.alert(OutputMessage.newError({msg: "Open a project first"}));
            return;
        }

        const req = new MerlinSearchRequest(
            (this.newNode as NodeChoice).type,
            this._getCurrentOperations()
        );

        this._codeSvc.merlinSearch(req).subscribe((pRes: any) => {
            console.log("Execute MERLIN Request (as code search)", pRes);
            if(pRes == null) pRes = [];

            let r: SearchResult = {
                search: {
                    query: `Search-${this.history.length} (${pRes.length})`
                },
                results: pRes
            };

            this.history.push({ req:req, len:pRes.length });
            this.auditSvc.onCheckAction$.next(r);
        });
    }


    isNodeSelectorRequired() {
        return (this.newOpe?.req == OperationRequirementType.NODE);
    }

    onOperationChange($event: any) {
        const ope = SupportedOperations.find(x => {
            return (x.id == $event);
        });

        if (ope == null) return;

        this.newOpe = ope;
        this._changeDetector.detectChanges();
    }


    setNodePptChoices(pDef:NodePropertyInfo[]){
        this._nodePpts = pDef;
        this.nodePpts = {
            ppts: [],
            rel: [],
            extra: []
        };

        pDef.map((x:any)=>{
            if(x.node!=null){
                this.nodePpts.rel.push(x);
                return;
            }
            if(x.name!="tags"){
                this.nodePpts.ppts.push(x);
                return;
            }
            this.nodePpts.extra.push(x);
        });
    }

    onNodeTypeChange($event: any) {

        const node = this.supportedNode.find(x => {
            return (x.value == $event);
        });

        if (node == null) return;

        this._codeSvc.getNodeProperties(node.type).subscribe((pRes: any) => {
            this.setNodePptChoices(pRes);
            this.newNode = node;
            this.newNodePpt = null;
            this.parentNodes = [];
            this._changeDetector.detectChanges();
        });

    }

    onNodePptChange(pEvent: any) {
        const sel = this._nodePpts.find(x => x.name == pEvent);

        if(sel==null) return;

        if(sel.node!=null){
            this.parentNodes.push({
                //pptName:sel.name,
                ppt: sel,
                //type:sel.type,
                alt: JSON.parse(JSON.stringify(this.nodePpts))
            });

            this._codeSvc.getNodeProperties(sel.node).subscribe((pRes: any) => {
                this.setNodePptChoices(pRes);
                this.newNodePpt = pRes[0].name;
                this._changeDetector.detectChanges();
            });
            return;
        }

        this.condInputType = (sel.schema!=null ? sel.schema.type : "string");
        this.newNodePpt = pEvent;
    }

    onNodeParentChange( pEvent:any, pBefore:ParentNodeInfo, pIndex:number){

        const sel = this.parentNodes[pIndex].alt.find(x=> (x.name==pEvent.target.value))

        let top=this.parentNodes.length;
        while(top>pIndex+1){
            this.parentNodes.pop();
            top--;
        }
        if(sel==null) return;

        if(sel.node!=null){
            this._codeSvc.getNodeProperties(sel.node).subscribe((pRes: any) => {
                this.setNodePptChoices(pRes);
                this.newNodePpt = pRes[0].name;
                this._changeDetector.detectChanges();
            });
        }else{
            const curr = this.parentNodes.pop();
            if(curr!=null){

                this.setNodePptChoices(curr.alt);
                this.newNodePpt = pEvent.target.value;
            }
            this.condInputType = (sel.schema!=null ? sel.schema.type : "string");
        }


        this._changeDetector.detectChanges();
    }


    isPatternRequired() {
        return this.condInputType == "string";
        //return ((this.newOpe?.req == OperationRequirementType.NODE) && (this.newNode != null)) || (this.newOpe?.req == OperationRequirementType.PATTERN);
    }

    getOperationString(pOperType: OperationType) {
        switch (pOperType){
            case OperationType.SEARCH: return "Search";
            case OperationType.FILTER: return "Filter";
            case OperationType.UNION: return "Union";
            case OperationType.JOIN: return "Join";
            case OperationType.TIME: return "Time";
            case OperationType.SELECT: return "Select";
            case OperationType.AGGR : return "Aggregate";
            case OperationType.INNERJOIN: return "Inner Join";
            case OperationType.INTERSECT: return "Intersect";
            case OperationType.SIZE: return "Size";
            case OperationType.VALIDATE: return "Validate";
            case OperationType.TAINT_SINK: return "Taint Sink";
            case OperationType.TAINT_SRC: return "Taint Source";
            case OperationType.TAINT_STEP: return "Taint Step";
            default: return "";
        }
    }

    getAsString(pOperArgs:any) {
        return JSON.stringify(pOperArgs);
    }

    doStep(pStep: Operation, pOffset:number, pAction:string) {
        switch (pAction) {
            case 'edit':
                //this.newOpeType = pStep.type;
                //this
                break;
            case 'drop':
                while(this.steps.length>pOffset) this.steps.pop();
                break;
        }
    }

    protected readonly OperationType = OperationType;
}
