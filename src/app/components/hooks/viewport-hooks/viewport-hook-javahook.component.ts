import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {HookController} from "../ctrl/HookController";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportView} from "../../../cmp/ViewportView";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {HOOK_ICONS} from "../icons";
import {Subject} from "rxjs";
import * as ace from "ace-builds";
import {HookService} from "../ctrl/hook.service";
import ModelMethod from "../../../models/ModelMethod";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import JavaMethodHook from "../../../models/JavaMethodHook";
import {AbstractHook} from "../../../models/AbstractHook";
import {NodeInternalType} from "../../../models/NodeInternalType";
import NativeFunctionHook from "../../../models/NativeFunctionHook";
import {ElectronService} from "../../../core/services";
import {UIException} from "../../../base/error/UIException";
import {IStringIndex} from "../../../base/IStringIndex";
import HookTemplateFragment from "../../../models/hook/HookTemplateFragment";
import {Nullable} from "../../../base/Nullable";
import HookMessage from "../../../models/HookMessage";
import {RuntimeEvent} from "../../../models/hook/RuntimeEvent";


const FRAG_TYPE:IStringIndex<string> = {
  a: 'AFTER',
  b: 'BEFORE',
  r: 'REPLACE',
};
const FRAG_CSS:IStringIndex<string> = {
  a: 'dxc-herb',
  b: 'dxc-salmon',
  r: 'dxc-azue',
};

export interface FragmentItem {
  frag: HookTemplateFragment,
  position: string
}

// @ts-ignore
@Component({
  selector: 'app-viewport-hook-javahook',
  templateUrl: './viewport-hook-javahook.component.html',
  styleUrls: ['./viewport-hook.component.scss']
})
export class ViewportHookJavaComponent implements OnInit, AfterViewInit, IViewportContainer {


  @Input() controller: HookController;
  @Input() parent: ViewportComponent;
  @Input() data: any; // JavaMethodHook|NativeFunctionHook;
  @Input() height: any;


  @ViewChild('codeEditor') codeEditor:any;
  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;
  @ViewChild('editor',{ read:ElementRef, static:false}) editorEl:ElementRef;

  gIcons :any = GLOBAL_ICONS;
  icons :any = HOOK_ICONS;
  HOOK_JAVA = NodeInternalType.HOOK_JAVA;
  HOOK_NATIVE = NodeInternalType.HOOK_NATIVE;


  editingFrag = false;

  id: number = -1;
  uid: string = '';
  size:any = {
    height: '150px'
  };

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Hooks',
      icon: GLOBAL_ICONS['HOOKS'],
      color: 'dxc-text-clear100'
    })
  });

  states:any = {
    sc: '',
    fr: ''
  };

  editorHeight: number = 0;
  resize$: Subject<any> = new Subject<any>();
  activeWidth: number = 60;

  activeFrag:any = null;
  activeFragCss:string = '';
  activeLeft: string = 'sc';
  activeRight: string = 'fr';

  addr:string = "0x?";
  events: RuntimeEvent<any>[] = [];

  constructor( private hookSvc:HookService,
               private electronSvc:ElectronService,
               private codeSvc:CodeControllerService) {

  }

  ngOnInit(): void {
    // update fragments when a fragment have been edited
    this.hookSvc.onFragmentUpdate.subscribe( (pOptions:any)=>{
      const uid = (pOptions.hook as JavaMethodHook).getGUID();

      if((uid!=null) && (this.data.getGUID() === uid)){

        this.hookSvc.getHook(uid).subscribe((vHook:any)=>{
          this.data.setBefore(vHook._before);
          this.data.setAfter(vHook._after);
          this.data.setReplace(vHook._replace);
          this.states.sc = this.data.script =decodeURIComponent(atob(vHook.script));
        });
      }
    });

    this.hookSvc.onHookEdit.subscribe( (pEvent:any)=>{
      if(pEvent.hook !== this.data.id) return;

      const OPE = this.hookSvc.HKOP;
      switch (pEvent.ope) {
        case OPE.REMOVED:
          //console.log("[JAVA HOOK VIEWPORT][onHookEdit][close] ",this.data);
          ((this.parent as ViewportComponent).parent as any).close(null, this.parent);
          break;
      }
    })
  }



  configure( pData:any):void {
    this.data = pData;
    this.view.tab.icon = pData._icon;

    if(pData.alias != null){
      this.view.tab.label = '@'+pData.alias;
      this.view.tab.color = 'text-warning';
    }
  }

  ngAfterViewInit() {


    if(this.data.__==NodeInternalType.HOOK_NATIVE){
      //this.view.tab.label = (this.data as any).file;
      this.addr = "0x"+ (this.data as any).func.addr.toString(16);
    }

    // init editor
    this.editorHeight = this.height - this.metadataEl.nativeElement.offsetHeight;

    this.metadataEl.nativeElement.style.height = this.editorHeight;

    //ace.config.set('basePath','//localhost:4200/assets/ace');
    ace.config.set('basePath','assets/ace');
    let editor:any = this.codeEditor.getEditor();




    editor.setOptions({
      showLineNumbers: true,
      tabSize: 2
    });

    editor.container.style.height = this.editorHeight+'px';
    editor.container.style.minHeight = this.editorHeight+'px';
    editor.container.style.maxHeight = this.editorHeight+'px';

    this.codeEditor.mode = 'javascript';
    /*
    if(this.data.code.before!=null) {
      this.codeEditor.value += "// Before \n";
      this.codeEditor.value = atob(this.data.code.before);
    }

    if(this.data.code.replace!=null) {
      this.codeEditor.value += "// Replace \n";
      this.codeEditor.value = atob(this.data.code.replace);
    }

    if(this.data.code.after!=null) {
      this.codeEditor.value += "// After \n";
      this.codeEditor.value = atob(this.data.code.after);
    }*/

    // todo : replace by 1st fragments
    this.codeEditor.value = this.states.sc = decodeURIComponent(atob(this.data.script));


    editor.resize();

    // init resize handler

    this.parent.resize$.subscribe( (pSize:any)=>{

      this.editorHeight = pSize.height - this.metadataEl.nativeElement.offsetHeight;

      editor.container.style.height = this.editorHeight+'px';
      editor.container.style.minHeight = this.editorHeight+'px';
      editor.container.style.maxHeight = this.editorHeight+'px';

      editor.resize();
    });

  }

  displayExtMenu($event: MouseEvent, pType: string, pObj:any) {
    this.codeSvc.displayCtxMenu$.next({ event:$event, type:pType, obj:pObj});
  }

  onClose(): boolean {
    console.log('closing ...',this);
    this.controller.close(this,'vp');
    return true;
  }

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
  }

  /**
   * To tuem on/off hook
   */
  switchHook() {

  }

  startApp( pActivity:any = null) {

  }





  /*
   * To save hook
   */
  /*
  saveHook() {

    this.hookSvc.saveHook( this.data, this.codeEditor.value.split("\n")).subscribe( pRes => {
      if(pRes.success){
        this.data.script = this.codeEditor.value;
      }
    });
//    this.hookSvc.saveHook();
  }*/

  restartApp() {

  }

  /**
   *
   * @param pMethod
   */
  /*openMethod(pHook: any) {

    if(this.controller.app==null){
      throw UIException.APP_NOT_INITIALIZED;
    }
    // ask to Code module to display Method bytecode into a modal
    if(this.data.__ == NodeInternalType.HOOK_JAVA){
      this.controller.app.getController('ctrl:code-main').open( pHook.method, 'vp');
    }
    else if(this.data.__ == NodeInternalType.HOOK_NATIVE){
      this.controller.app.getController('ctrl:native-main').open( pHook.func, 'vp');
    }
  }*/


  showLatestCatch() {
    this.activeRight = 'ct';

    console.log(this);
    this.hookSvc.getAllMessagesForNode(this.data.method).subscribe((x)=>{
      this.events = x as any;
    })
  }

  showMeta() {
      this.activeRight = 'ds';
  }

  showJavaContext(number: number) {

  }

  showHookOutput(number: number) {

  }

  openEditorMenu($event: MouseEvent) {

  }

  showFragments() {
    this.activeRight = 'fr';
  }

  /**
   * To retrieve the first fragement from the list of fragments
   * built from the concatenation of before + replace + after lists
   *
   *
   * @method
   */
  getFirstFragment():Nullable<HookTemplateFragment> {
    if(this.data._before!=null && this.data._before.length>0) return this.data._before[0];
    if(this.data._replace!=null && this.data._replace.length>0) return this.data._replace[0];
    if(this.data._after!=null && this.data._after.length>0) return this.data._after[0];

    return null;
  }

  editFragment( pType:string, pOffset:number, pFragment:any, pEvent:any = null) {

    console.log(pFragment);

    if(this.activeLeft=='sc'){
      // save editor state
      this.states.sc =  this.codeEditor.value;
    }

    if(this.activeFrag !=null){
      if(this.activeFrag.cmp!=null){
        this.activeFrag.cmp.focusOut();
      }
    }

    this.editingFrag = true;
    this.activeFrag = {_t:FRAG_TYPE[pType], o:pOffset, f:pFragment, cmp:(pEvent!=null?pEvent.cmp:null)};
    this.activeFragCss = FRAG_CSS[pType];
    this.activeLeft = 'fr';


    this.codeEditor.value = pFragment.tpl;


    //editor.resize();
  }

  showHistory() {
    this.activeRight = 'ss';
  }

  showScript() {
    if(this.activeLeft=='fr'){
      // save editor state
      this.states.fr =  this.codeEditor.value;
    }

    this.activeLeft = 'sc';
    // revert state
    this.codeEditor.value = this.states.sc;
  }

  showFragmentTpl() {

    if(this.activeLeft=='sc'){
      // update editor state
      this.states.sc =  this.codeEditor.value;
    }

    this.activeLeft = 'fr';
    this.codeEditor.value = this.states.fr;

  }

  saveChanges() {
    // detect what is edited : script or fragment
    if(this.activeLeft == 'fr' && this.activeFrag != null){
      console.log(this);
      // fragment
      this.hookSvc.editHookFragment(
        this.data,
        this.activeFrag.f._uid,
        { code:this.codeEditor.value }
      ).subscribe((vHook:AbstractHook)=>{ })
    }else{
      // global script
      /*this.hookSvc.up(
        this.data,
        this.activeFrag.getUID(),
        { tpl:this.codeEditor.value }
      ).subscribe((vHook:AbstractHook)=>{ })*/
    }
  }

  /**
   * To create a new fragment, to add custom code in a non-breaking way
   *
   */
  addNewFragment() {
    this.controller.service.onEditFragment.next( this.data)
    //this.controller.app.showModal('newHookFrag', this.data);
  }

  deleteHook() {
    this.hookSvc.removeHook(this.data).subscribe(()=>{
      // close panel
    })
  }

  /**
   *
   */
  onEditorFocus() {
    const sm = this.electronSvc.getSelectionManager();

  }

  insertSnippet(pSnippetName: string):void {

  }

  addTransVar() {

  }

  addCondition() {

  }

  addKeyPoint() {

  }

  startSingle() {

  }
}
