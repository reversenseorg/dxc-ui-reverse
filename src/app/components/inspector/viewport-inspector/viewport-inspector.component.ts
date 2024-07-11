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
import {InspectorService} from "../ctrl/inspector.service";
import {AbstractHook} from "../../../models/AbstractHook";
import HookStrategy from '../../../models/hook/HookStrategy';
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";


enum FRAG_LOCATION {
  AFTER,
  BEFORE,
  REPLACE
}

@Component({
  selector: 'app-viewport-inspector',
  templateUrl: './viewport-inspector.component.html',
  styleUrls: ['./viewport-inspector.component.scss'],
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
  activeWidth = 30;
  activeFrag: any = null;

  gIcons:any = GLOBAL_ICONS;
  hIcons:any = HOOK_ICONS;
  icons:any = INSP_ICONS;

  editorHeight = 400;
  editorReady = {
    frag: false
  };

  view: ViewportView ;

  data: Inspector;

  constructor( @Inject(ChangeDetectorRef) viewRef: ViewRef,
               private codeSvc:CodeControllerService,
               private inspSvc:InspectorService,
               public helpSvc:HelperService) {

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

  ngDoCheck() {
    // to hide currently displayed view,
    this.hiddenForce = (this.parent.activeCtn!=null) && !(this.parent.activeCtn.id == this.id);
    this._viewRef.detectChanges();
  }

  ngAfterViewInit() {
    this.resize( this.size);
  }

  configure( pData:Inspector):void {
    this.data = pData;
    if(pData.id !=null){
      this.view.tab.label = pData.id;
    }else{
      this.view.tab.label = pData.name as string;
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
    this.inspSvc.getHooksFrom(this.data).subscribe((hooks:AbstractHook[])=>{
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
      this.activeRight = NodeInternalType.HOOK_STRATEGY;
      console.log(pStrat);
    }

    this.activeLeft = 'st';
    this.activeWidth = pWidth;
  }

  showInfo(pWidth:number){
    this.activeLeft = 'in';
    this.activeWidth = pWidth;
  }
  /**
   *
   * @param pNodeType
   * @param pItem
   */
  showDetail(pNodeType: NodeInternalType, pItem: any) :void {

    switch (pNodeType){
      case NodeInternalType.HOOK_STRATEGY:
        console.log(pItem);
        console.log(this.hookStrategyEl);
        this.activeRight = NodeInternalType.HOOK_STRATEGY;
        this.activeItem = pItem;

        if(this.activeItem.search.hasOwnProperty('req')
            && !Array.isArray(this.activeItem.search.req)){
          this.activeItem.search.req = [this.activeItem.search.req];
        }
        if(this.activeItem.search.hasOwnProperty('uid')
          && !Array.isArray(this.activeItem.search.uid)){
          this.activeItem.search.uid = [this.activeItem.search.uid];
        }

        // refresh editor ref before to populate it
        this._viewRef.detectChanges();

        if(this.activeItem.before!=null){
          this.showFrag(this.FRAG.BEFORE, this.activeItem.before);
        }
        else if(this.activeItem.after!=null){
          this.showFrag(this.FRAG.AFTER, this.activeItem.after );
        }
        else if(this.activeItem.replace!=null){
          this.showFrag(this.FRAG.REPLACE, this.activeItem.replace);
        }

        // refresh editor ref before to populate it
        this._viewRef.detectChanges();


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

    console.log(pFrag);
    this.fragEditor.value = pFrag.tpl;
    this.fragEditor.getEditor().resize();
  }

}
