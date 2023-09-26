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
import {HookSession} from "../ctrl/HookSession";
import {ProjectService} from "../../project/ctrl/project.service";
import {UIException} from "../../../base/error/UIException";


const FRAG_TYPE = {
  a: 'AFTER',
  b: 'BEFORE',
  r: 'REPLACE',
};
const FRAG_CSS = {
  a: 'dxc-herb',
  b: 'dxc-salmon',
  r: 'dxc-azue',
};

const EDITOR_MARGIN_BOTTOM = 15;

// @ts-ignore
@Component({
  selector: 'app-viewport-hook-script',
  templateUrl: './viewport-hook-script.component.html',
  styleUrls: ['./viewport-hook.component.scss']
})
export class ViewportHookScriptComponent implements OnInit, AfterViewInit, IViewportContainer {


  @Input() controller: HookController;
  @Input() parent: ViewportComponent;
  @Input() data: any;
  @Input() height: any;


  @ViewChild('scriptEditor') codeEditor:any;
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
      label: 'Agent script',
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
  activeWidth: number = 90;

  activeFrag:any = null;
  activeLeft: string = 'sc';
  activeRight: string = 'ds';

  addr:string = "0x?";

  constructor( private prjSvc:ProjectService,
               private hookSvc:HookService,
               private codeSvc:CodeControllerService) {

  }

  ngOnInit(): void {
    // update script when a fragment have been edited
    this.hookSvc.onFragmentUpdate.subscribe( (pOptions:any)=>{
      // add notifiction : need refresh ?
    });

    this.hookSvc.onHookEdit.subscribe( (pEvent:any)=>{
      // add notifiction : need refresh ?
    })
  }

  configure( pData:any):void {
    console.log("[VP SCRIPT] configure ",pData);
    this.data = pData;
    this.view.tab.icon = pData._icon;

    if(pData.alias != null){
      this.view.tab.label = '@'+pData.alias;
      this.view.tab.color = 'text-warning';
    }
  }

  ngAfterViewInit() {

    console.log("[VP SCRIPT] ngAfterViewInit ",this.data);
    // init editor
    this.editorHeight = this.height-EDITOR_MARGIN_BOTTOM;


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
    this.codeEditor.value = this.states.sc = this.data.script;


    editor.resize();

    // init resize handler

    this.parent.resize$.subscribe( (pSize:any)=>{

      this.editorHeight = pSize.height-EDITOR_MARGIN_BOTTOM;

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
    //this.controller.close(this,'vp');
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

  restartApp() {

  }

  showHookOutput(number: number) {

  }

  openEditorMenu($event: MouseEvent) {

  }

  saveChanges() {

  }

  remove() {

  }

  /**
   * To start hooking with editor content
   *
   * @method
   */
  startHooking() {
    //console.log(this.prjSvc.getSelectedProject(),this.codeEditor.value);

    if(this.controller.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    const proj = this.prjSvc.getSelectedProject();

    if(proj==null){
      throw UIException.WEBSOCKET_CHANNEL_IS_NOT_READY("startHooking","viewport-hook")
    }


    let session:HookSession = this.hookSvc.startWebsocketHookSession(
      this.controller.app.ws,
      proj,
      {
         type: this.hookSvc.getHookMode(),
         script: this.codeEditor.value
      });

  }
}
