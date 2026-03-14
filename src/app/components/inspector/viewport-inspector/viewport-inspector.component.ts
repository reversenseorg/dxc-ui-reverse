import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DoCheck, Inject,
  Input, OnChanges,
  OnInit, SimpleChanges,
  ViewChild, ViewRef
} from '@angular/core';
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {ViewportView} from "../../../cmp/ViewportView";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {InspectorController} from "../ctrl/InspectorController";
import {Inspector} from "../../../models/Inspector";
import {HOOK_ICONS} from "../../hooks/icons";
import {INSP_ICONS} from "../icons";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {Subject} from "rxjs";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import * as ace from "ace-builds";
import {HelperService} from "../../helper/ctrl/HelperService";
import {InspectorInfo, InspectorService} from "../ctrl/inspector.service";
import {AbstractHook} from "../../../models/AbstractHook";
import HookStrategy from '../../../models/hook/HookStrategy';
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";
import InspectorFactory from "../../../models/InspectorFactory";
import HookStrategySelector from "../../../models/hook/HookStrategySelector";
import {MerlinSearchRequest, Operation} from "../../../models/search/MerlinSearchRequest";
import {HookService} from "../../hooks/ctrl/hook.service";
import HookTemplateFragment from "../../../models/hook/HookTemplateFragment";


enum FRAG_LOCATION {
  AFTER,
  BEFORE,
  REPLACE
}

@Component({
  selector: 'app-viewport-inspector',
  templateUrl: './viewport-inspector.component.html',
  styleUrls: ['./viewport-inspector.component.scss','../../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportInspectorComponent implements DoCheck, AfterViewInit, IViewportContainer {

  NODE_TYPES:any = NodeInternalType;
  FRAG = FRAG_LOCATION;

  private _viewRef:ViewRef;
  @Input() controller: InspectorController;
  @Input() parent: ViewportComponent;

  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;
  @ViewChild('frTplEditor') fragEditor:any;
  @ViewChild('hookStrategyEl') hookStrategyEl:any;


  id = -1;
  uid = '';
  size:any = {
    height: '150px'
  };

  resize$: Subject<any> = new Subject<any>();

  activeLeft = 'in';
  activeRight:number = -1;
  activeItem:any = null;
  activeWidth = 45;
  activeFrag: any = null;

  gIcons:any = GLOBAL_ICONS;
  hIcons:any = HOOK_ICONS;
  icons:any = INSP_ICONS;

  editorHeight = 400;
  editorReady = {
    frag: false
  };

  view: ViewportView ;

  data: InspectorInfo;

  editMode = false;

  evt:any[] = [];

  activeStrat:Nullable<HookStrategy> = null;
  activeFilter:any;

  constructor( @Inject(ChangeDetectorRef) viewRef: ViewRef,
               private codeSvc:CodeControllerService,
               private inspSvc:InspectorService,
               private hkSvc:HookService,
               public helpSvc:HelperService,
               private chref:ChangeDetectorRef) {

    this._viewRef = viewRef;

    this.view = new ViewportView({
      tab: new ViewportTab({
        label: 'Inspector',
        icon: GLOBAL_ICONS['HOOKS'],
        color: 'dxc-text-clear100'
      })
    });
  }


  /*ngOnChanges(changes: SimpleChanges) {
    if(changes.hasOwnProperty('activeViewID')){
      console.log("[CHANGE] activeViewID : ",changes.activeViewID);
      if(changes.activeViewID){

      }
    }
  }*/

  private _initEditor(){
    console.log("[VP SCRIPT] ngAfterViewInit ",this.data);

    //ace.config.set('basePath','//localhost:4200/assets/ace');
    ace.config.set('basePath','assets/ace');
    const editor:any = this.fragEditor.getEditor();

    editor.setOptions({
      showLineNumbers: true,
      tabSize: 2
    });

    editor.container.style.height = this.editorHeight+'px';
    editor.container.style.minHeight = this.editorHeight+'px';
    editor.container.style.maxHeight = this.editorHeight+'px';

    this.fragEditor.mode = 'javascript';


    editor.resize();

    // init resize handler

    this.parent.resize$.subscribe( (pSize:any)=>{

      /*this.editorHeight = pSize.height-20;

      editor.container.style.height = this.editorHeight+'px';
      editor.container.style.minHeight = this.editorHeight+'px';
      editor.container.style.maxHeight = this.editorHeight+'px';*/

      editor.resize();
    });
  }


  hiddenForce = true;
  hooks: any;
  deletable = false;
    cancelable = false;
    emitOn: string = "auto";

  ngDoCheck() {
    // to hide currently displayed view,
    this.hiddenForce = (this.parent.activeCtn!=null) && !(this.parent.activeCtn.id == this.id);
    this._viewRef.detectChanges();
  }

  ngAfterViewInit() {
    this.resize( this.size);
    this.showInfo(45);
  }

  configure( pData: InspectorInfo):void {
    this.data = pData;
    if(pData.state.id !=null){
      this.view.tab.label = pData.state.id;
    }else{
      this.view.tab.label = pData.state.name as string;
    }

    console.log("View Inspector > ",this.data);
  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  resize( pSize:any):void{
    this.size = pSize;
    this.resize$.next(pSize);

    //console.log(pSize, this.layout);
    if(this.layout != null){
      this.layout.resize({
        height: this.size.height
      });
    }
  }

  performExtra( pActionName:string):void {
    //
  }

  showHooks(pWidth:number, pHide = false):void{
    this.activeRight = NodeInternalType.HOOK_SET;
    this.inspSvc.getHooksFrom(this.data.state).subscribe((hooks:AbstractHook[])=>{
      this.hooks=hooks;
      if(!pHide){
        this.activeLeft = 'hk';
        this.activeWidth = pWidth;
      }

    })
  }

  showEventsRegistered(pWidth:number):void{
    this.activeLeft = 'er';
    this.activeWidth = pWidth;

    console.log("Inspector Data : ",this.data);
  }

  showDatabase(pWidth:number):void{
    this.activeLeft = 'db';
    this.activeWidth = pWidth;

    console.log("Inspector Data : ",this.data);
  }


  showActions(pWidth: number) {
    this.activeLeft = 'ac';
    this.activeWidth = pWidth;

    console.log("Inspector Data : ",this.data);
  }

  showStrategy(pWidth:number, pStrat:Nullable<HookStrategy> = null) {
    if(pStrat!=null){
      this.activeItem = pStrat;
      this.deletable = true;
      this.activeRight = NodeInternalType.HOOK_STRATEGY;
      console.log(pStrat);
    }

    this.activeLeft = 'st';
    this.activeWidth = pWidth;
  }

  showInfo(pWidth:number){
    this._retrieveEmittedEvents();
    this.activeWidth = pWidth;
    this.activeLeft = 'in';
    this.chref.detectChanges();
  }
  /**
   *
   * @param pNodeType
   * @param pItem
   */
  showDetail(pNodeType: NodeInternalType, pItem: any) :void {

    if(pItem==null) return;

    switch (pNodeType){
      case NodeInternalType.HOOK_STRATEGY:
        console.log(pItem);
        console.log(this.hookStrategyEl);
        this.activeRight = NodeInternalType.HOOK_STRATEGY;
        this.activeStrat = pItem as HookStrategy;

        if(this.activeStrat.search!=null){
            if(this.activeStrat.search.hasOwnProperty('req')
                && !Array.isArray(this.activeStrat.search.req)){
                this.activeStrat.search.req = [this.activeStrat.search.req] as any;
            }
            if(this.activeStrat.search.hasOwnProperty('uid')
                && !Array.isArray(this.activeStrat.search.uid)){
                this.activeStrat.search.uid = [this.activeStrat.search.uid];
            }
        }


        // refresh editor ref before to populate it
        this._viewRef.detectChanges();

        if(this.activeStrat.before!=null){
          this.showFrag(this.FRAG.BEFORE, this.activeStrat.before);
        }
        else if(this.activeStrat.after!=null){
          this.showFrag(this.FRAG.AFTER, this.activeStrat.after );
        }
        else if(this.activeStrat.replace!=null){
          this.showFrag(this.FRAG.REPLACE, this.activeStrat.replace);
        }

        // refresh editor ref before to populate it
        this._viewRef.detectChanges();


        break;
    }
  }


    newDetail(pNodeType: string) :void {
      switch (pNodeType){
          case 'strat':
              this.activeRight = NodeInternalType.HOOK_STRATEGY;
              this.activeStrat = new HookStrategy({
                  autoEmit: false
              });
              this.deletable = false;
              this.cancelable = true;
              this.editMode = true;
              break;
          case 'filter':
              this.activeRight = NodeInternalType.HOOK_STRATEGY;
              this.activeFilter = new HookStrategy({});
              this.deletable = false;
              this.cancelable = true;
              this.editMode = true;
              break;
      }
    }

  openNode(pUID: any, pNodeType:number) {

    if(this.controller.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    switch (pNodeType) {
      case NodeInternalType.HOOK_JAVA:
      case NodeInternalType.HOOK_NATIVE:
        this.controller.app.getController('ctrl:hook-main')._show(pUID);
        break;
      default:
        this.controller.app.getController('ctrl:code-main').openNode(pUID, pNodeType);
        break;
    }
  }

  /**
   *
   * @param pType
   * @param pFrag
   */
  showFrag(pType: FRAG_LOCATION, pFrag:any) {
    // load into code editor

    this.activeFrag = pType;

    if(!this.editorReady.frag){
      this._initEditor();
      this.editorReady.frag = true;
      //this.fragEditor.value = this.states.sc = this.data.script;
    }

    console.log("Frag >",pFrag);
    this.fragEditor.value = pFrag.tpl;
    this.fragEditor.getEditor().resize();
  }

  dropEl(){

  }
    cancel(){
        this.activeItem = null;
        this.activeStrat = null;
        this.activeFilter = null;
        this.cancelable = false;
        this.deletable = false;
        this.editMode = false;
        this.chref.detectChanges();
    }

    addEl(){

    }

    save() {

    }

    showEvent(e: HookStrategy) {
        
    }

    private _retrieveEmittedEvents():boolean {

        if(this.data.state.hookset==null){
            this.evt = [];
            return false;
        }


        const e:any[] = [];

        this.data.state.hookset.strats.filter(s => {
            return (s.before!=null && s.before.autoEmit)
                || (s.after!=null && s.after.autoEmit)
                || (s.replace!=null && s.replace.autoEmit) ;
        }).map((s:any) => {
            ['before', 'after', 'replace'].forEach(f => {
                if(s[f]!=null){
                    e.push({  e:s[f].emitEvent, s:s.name, auto:s[f].autoEmit });
                }
            });
        });

        this.evt = e;

        console.log("getEmittedEvents ",this.data, this.evt);

        return (this.evt.length>0);
    }

    showFilter(pFilter: any) {
      this.activeItem = pFilter;
      this.activeRight = NodeInternalType.RUNTIME_EVENT;

    }

    dropEvent(pStrat: HookStrategy) {
        pStrat.autoEmit = false;
        pStrat.emitEvent = null;
    }

    newRule(pStrat: HookStrategy) {
        pStrat.search = HookStrategySelector.from({
            type: 'all',
            req: [],
            uid: []
        });
    }

    getSearchType(pStrat: HookStrategy):'merlin'|'req'|'uid'|'none' {
        if(pStrat.search==null) return "none";

        if(pStrat.search.hasOwnProperty('req')){
            if(typeof pStrat.search.req == 'string'){
                return 'req';
            }else{
                return 'merlin'
            }
        }
        else if(pStrat.search.hasOwnProperty('uid')
            && Array.isArray(pStrat.search.uid)
            && pStrat.search.uid.length>0){
            return 'uid';
        }else{
            return "none";
        }
    }

    stringifyReq(pOps: any) {
        return MerlinSearchRequest.stringify(pOps);
    }

    createRequest(pStrat: HookStrategy) {
        this.codeSvc.onMenuClick.next({
            item: 'search-mql',
            win: null,
            opts: {
                save: true,
                onSave: (pReq:MerlinSearchRequest)=>{
                    console.log("createRequest > onSAve : ",pReq);
                    if(pStrat.search){
                        pStrat.search.req = pReq.getOperations();
                    }
                    return true;
                }
            }
        });
    }

    dropRequest(pStrat: HookStrategy) {
        pStrat.search = HookStrategySelector.from({
            req: null,
            type: 'none'
        });
    }

    addFrag(pStrat: HookStrategy) {
        this.hkSvc.onEditFragment.next( {
            onSave: (pFrag:any):boolean=>{
                switch (pFrag.pos){
                    case 'before':
                        pStrat.before = new HookTemplateFragment({
                            tpl: pFrag.tpl,
                            autoEmit: false
                        });
                        break;
                }
                return true;
            }
        })
    }
}
