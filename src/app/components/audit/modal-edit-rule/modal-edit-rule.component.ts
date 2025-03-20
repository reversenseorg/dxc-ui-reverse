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
import {AuditService, CheckEventState} from "../ctrl/audit.service";
import {OperatingSystem} from "../../../models/OperatingSystem";
import {UIException} from "../../../base/error/UIException";
import {
  MerlinSearchRequest,
  Operation,
  OperationDefinition,
  OperationRequirementType, OperationType,
  SupportedOperations
} from "../../../models/search/MerlinSearchRequest";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {ProjectService} from "../../project/ctrl/project.service";
import {NodeInternalType} from "../../../models/NodeInternalType";

export interface OperationChoice {
  value: string,
  label: string
}

export interface NodeChoice {
  value: string,
  label: string,
  type: NodeInternalType
}

@Component({
  selector: 'dxc-modal-edit-rule',
  templateUrl: './modal-edit-rule.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalEditRuleComponent extends AbstractKeyboardNavigable implements OnInit, AfterViewInit {

  @Input() tag:Nullable<Tag> = null;
  @Input() controller:any;

  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:Nullable<string> = "Rule Editor";

  @Input() message:Nullable<Message> = null;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  onDryRunEnd: EventEmitter<any> = new EventEmitter<any>();

  gIcons:any = GLOBAL_ICONS;

  item: any = null;

  private onStart:any = null;

  _:number = -1;
  name:string = "";

  os:OperatingSystem;
  descr: any = "";
  label: any = "";

  description: any;

  buildingRequest:Nullable<MerlinSearchRequest> = null;

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
  pattern: string;
  freshOpe: any;

  supportedOpe: OperationChoice[] = [
    { label: 'get by id', value:'get' },
    { label: 'search', value:'search all' },
    { label: 'validate', value:'validate' },
    { label: 'aggregate', value:'aggregate' },
    { label: 'union', value:'union' },
    { label: 'intersect', value:'intersect' },
    { label: 'filter', value:'filter' },
    { label: 'exclude', value:'exclude' },
    { label: 'select', value:'select' },
    { label: 'on', value:'on' }
  ];

  supportedNode: NodeChoice[] = [
    { value:"classes", label:"classes", type:NodeInternalType.CLASS },
    { value:"methods", label:"methods", type:NodeInternalType.METHOD },
    { value:"function", label:"function", type:NodeInternalType.FUNC },
    { value:"strings", label:"strings", type:NodeInternalType.STRING },
    { value:"packages", label:"packages", type:NodeInternalType.PACKAGE },
    { value:"calls", label:"calls", type:NodeInternalType.CALL },
    { value:"files", label:"files", type:NodeInternalType.FILE },
    { value:"field", label:"field", type:NodeInternalType.FIELD },
    { value:"syscalls", label:"syscall", type:NodeInternalType.SYSCALL },
    { value:"instr", label:"instruction", type:NodeInternalType.INSTRUCTION },
    { value:"ui", label:"ui", type:NodeInternalType.CLASS },
    { value:"activities", label:"activities", type:NodeInternalType.ANDROID_ACTIVITY },
    { value:"providers", label:"providers", type:NodeInternalType.ANDROID_PROVIDER },
    { value:"receivers", label:"receivers", type:NodeInternalType.ANDROID_RECEIVER },
    { value:"services", label:"services", type:NodeInternalType.ANDROID_SERVICE },
    { value:"events", label:"events", type:NodeInternalType.RUNTIME_EVENT },
    { value:"hooks", label:"java hooks", type:NodeInternalType.HOOK_JAVA },
    { value:"sessions", label:"runtime session", type:NodeInternalType.HOOK_SESSION }
  ];

  steps: Operation[] = [];
  newNode: Nullable<NodeChoice> = null;
  newOpe: Nullable<OperationDefinition> = null;
  options: any = {}; // SearchOptions;

  private nextField: OperationRequirementType = OperationRequirementType.NONE;
  newOpeType: any;
  newNodeType: any;

  constructor(
               public auditSvc:AuditService,
               private _projectSvc:ProjectService,
               private _outputSvc:OutputService,
               private _changeDetector:ChangeDetectorRef,
               private kbSvc:KeyboardNavigationService) {
    super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);

  }

  /**
   * To init component
   */
  ngAfterViewInit(): void {

    if(this.controller.app==null){
      throw UIException.APP_NOT_INITIALIZED;
    }


    this.auditSvc.openEditor$.subscribe((x)=>{
      this.modal.show();
    });

    this.searchCtrl = this.controller.app.getController('ctrl:search');
  }

  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }


  show(){
    this.modal.show();
    //this.kbSvc.focus()
  }

  onOpen( pEvent:any){
    const tag = pEvent.target.options;
    console.log("RULE EDITOR : ",tag);
    this.description = tag.descr;
  }

  close(){
    this.modal.hide('close');
  }

  onTargetOsChange(pOS: OperatingSystem) {

  }


  /**
   * To append a new operation
   */
  addOperation() {
    let ope:Operation;


    // get ope type
    const opeType = this.newOpe;

    // get node
    const opeSubject = this.newNode;

    //
    if(this.steps.length==0 && opeSubject!=null){
      this.buildingRequest = new MerlinSearchRequest(opeSubject.type, []);
    }else if(this.buildingRequest==null){
      throw new Error("Building request cannot be empty");
    }


    // get
    switch (opeType?.type){
      case OperationType.SEARCH:
        this.buildingRequest.search(this.pattern, this.options);
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
  private _buildCurrentOperation():Nullable<Operation> {
    let ope:Operation;
    let req:MerlinSearchRequest;

    if(this.newOpe==null || this.newNode==null){
      return null;
    }

    req = new MerlinSearchRequest(this.newNode.type, []);

    // get
    switch ((this.newOpe).type){
      case OperationType.SEARCH:
        req.search(this.pattern, this.options);
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

  resetNewOperation(){

    this.newOpe = null;
    this.newNode = null;
  }

  getSupportedOperations():OperationDefinition[] {
    return SupportedOperations;
  }

  getSupportedNodes():NodeChoice[] {
    return this.supportedNode;
  }


  private _getCurrentOperations():Operation[] {
    const opes:Operation[] = []

    const last = this._buildCurrentOperation()
    if(last!=null) opes.push(last);

    return opes;
  }
  /**
   * To execute the request in the line
   */
  execSingle() {
    if(!this._projectSvc.isProjectIsOpen()){
      this._outputSvc.alert(OutputMessage.newError({msg:"Open a project first"}));
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

    this.auditSvc.runRule(null,oneRule).subscribe((res)=>{
      console.log("Execute MERLIN Request",res);

      //this.idle = true;
      //this.onScanning.emit(this.idle);

      this._changeDetector.detectChanges();
      if(res.event.state==CheckEventState.SUCCESS){
        this.onDryRunEnd.emit({ success:true, res: res.results });
      }else{
        this.onDryRunEnd.emit({ success:false, res: [] });
      }
    });
  }


  isNodeSelectorRequired() {
     return (this.newOpe?.req==OperationRequirementType.NODE);
  }

  onOperationChange($event: any) {
    const ope = SupportedOperations.find(x => {
      return (x.id==$event);
    });

    if(ope == null) return;

    this.newOpe = ope;
    this._changeDetector.detectChanges();
  }

  onNodeTypeChange($event: any) {

    const node = this.supportedNode.find(x => {
      return (x.value==$event);
    });

    if(node == null) return;

    this.newNode = node;
    this._changeDetector.detectChanges();
  }

  isPatternRequired() {
    return ((this.newOpe?.req==OperationRequirementType.NODE)&&(this.newNode!=null))
        ||(this.newOpe?.req==OperationRequirementType.PATTERN);
  }

  getOperationString(pReq: any) {
    // MerlinSearchRequest
    return pReq.toSearchString();
  }
}
