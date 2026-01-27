import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CodeItem} from "../explorer-code/CodeItem";
import {CodeController} from "../ctrl/CodeController";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {CodeControllerService} from "../ctrl/code-controller.service";
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import ModelMethod from "../../../models/ModelMethod";
import {CODE_ICONS} from "../icons";
import {FlexViewport} from "../../../base/viewport/FlexViewport";
import * as ace from "ace-builds";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {HookService} from "../../hooks/ctrl/hook.service";
import Hook from "../../../models/Hook";
import {StageComponent} from "../../stage/stage.component";
import {DeobfuscationService} from "../../deobfuscation/ctrl/deobfuscation.service";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {ExpandableProvider} from "../../../base/expandable-list/expandable-provider";
import {from, Observable} from "rxjs";
import {AbstractHook} from "../../../models/AbstractHook";
import {Tag} from "../../../models/tags/Tag";
import {TagService} from "../../tag/ctrl/tag.service";
import {Nullable} from "../../../base/Nullable";
import {CodeSymbolTableComponent} from "../emulator/symbol-table.component";
import {CodeEmulatorComponent} from "../emulator/emulator.component";
import {CodeEmuLoggerComponent} from "../emulator/emu-logs.component";
import {NodeInternalType} from "../../../models/NodeInternalType";
import ModelCall from "../../../models/ModelCall";
import {SearchController} from "../../search/ctrl/SearchController";





@Component({
  selector: 'app-viewport-code-meth',
  templateUrl: './viewport-code-meth.component.html',
  styleUrls: ['./viewport-code.component.scss','../../../forms.scss']
})
export class ViewportCodeMethComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() item: any;
  @Input() data: any; // ModelMethod
  @Input() controller: CodeController;
  @Input() parent: ViewportComponent;
  @Input() height: number;
  @Input() width: number;
  @Input() direct = false;
  @ViewChild('codeEditor') codeEditor:any;
  //@ViewChild('vmEditor') vmEditor:any;

  @ViewChild(CodeSymbolTableComponent) symbolTableCmp!:Nullable<CodeSymbolTableComponent>;
  @ViewChild(CodeEmulatorComponent) emuCmp!:Nullable<CodeEmulatorComponent>;
  @ViewChild(CodeEmuLoggerComponent) emuLogsCmp!:Nullable<CodeEmuLoggerComponent>;


  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;
  @ViewChild('editor',{ read:ElementRef, static:false}) editorEl:ElementRef;
  //@ViewChild('vm',{ read:ElementRef, static:false}) vmEl:ElementRef;
  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;
  @ViewChild('topNav',{ read:ElementRef, static:false}) topNavEl:ElementRef;

  gIcons: any = GLOBAL_ICONS;
  icons: any = CODE_ICONS;


  activeRight: string = "hk";
  activeLeft: string = "bc";


  vmedHeight: number = 0;

  editorHeight: number = 0;

  id: number = -1;

  hook:Nullable<AbstractHook> = null;
  hooks:any[] = [];
  hooksMsg:any[] = [];

  vm:any = {
    events: [],
    instr: [],
    tags: [],
    error: null
  };

  ctr: number = 0;
  activeTop: string = 'bc';
  activeBottom:Nullable<string> = null;
  hooksLen: number = -1;
  vmLog: any = [];
  tags:Tag[];

  /**
   * ft : Field Type
   * fi : Field Input
   * _t : type
   * _c : Child type
   * _i : Icon Model
   */
  ddvmOpts: any[] = [{
    _t: 'c',
    _c: 'p',
    _i: GLOBAL_ICONS['EDIT'],
    label: 'Parameters',
    children: []
  },{
    _t: 'c',
    _c: 's',
    _i: GLOBAL_ICONS['INTERNAL'],
    label: 'Context',
    children: [{
      _t: 'o',
      label: 'Load parent class',
      ft: 'c',
      v: false,
      name: 'clinit'
    }]
  },{
    _t: 'c',
    _c: 'o',
    _i: GLOBAL_ICONS['LIST'],
    label: 'Options',
    children: [{
      _t: 'o',
      label: 'Call stack limit (infinite=-1)',
      ft: 'n',
      v: 0,
      name: 'depth'
    }]
  }];

  xrefTo:ModelCall[] = [];
  xrefFrom:ModelCall[] = [];

    searchCtrl:SearchController;

  constructor( private codeSvc:CodeControllerService,
               private hookSvc:HookService,
               private tagSvc:TagService,
               private deobfSvc:DeobfuscationService,
               private outputSvc:OutputService) {
  }

  ngOnInit(): void {

      this.controller.app.getController('ctrl:search');

    this.hookSvc.onHookEdit.subscribe((pEvtHook)=>{
      if(pEvtHook.hook != null){
        if((pEvtHook.hook as any).method==this.data.__signature__){
          this.hooks.push(pEvtHook.hook);
        }
      }
    })

    this.vmedHeight = this.height;
  }


  ngOnChanges(changes: SimpleChanges) {
    /*
    if(changes.hasOwnProperty('height') && this.ctr>0){
      this.ctr++;
      this.editorHeight = this.height - this.metadataEl.nativeElement.offsetHeight;
      this.metadataEl.nativeElement.style.height = this.editorHeight;
      let editor:any = this.codeEditor.getEditor();
      editor.container.style.height = this.editorHeight+'px';
      editor.resize();
    }*/

    if(changes.hasOwnProperty('data')){
      this.controller.service.getClass((changes as any).data.currentValue.enclosingClass, this.direct).subscribe( (vClass:any) => {

        console.log(vClass);

        this.data.enclosingClass = vClass.data;
        // mark arguments as class

        const tags:Tag[] = [];
        this.data.tags.map((uuid:any) => {         tags.push(this.tagSvc.getTagByUUID(uuid));
        });
        this.tags = tags;

        this.data.args.map((vArg:any, vOffset:number) => {
          vArg._t = 'c';
        })
      });
    }
  }

  ngAfterViewInit() {

    let editor:any = this.codeEditor.getEditor();
    //let vmEditor:any = this.vmEditor.getEditor();

    // listener for splitted layout resize
    this.layout.onLayoutResize.subscribe( (vSizes:any) => {

//      ace.config.set('basePath','//localhost:4200/assets/ace');
      ace.config.set('basePath','assets/ace');

      console.log(vSizes,this.topNavEl.nativeElement.offsetHeight, this);
      this.editorHeight = vSizes.top.height-this.topNavEl.nativeElement.offsetHeight;

      // code editor
      editor.setOptions({
        showLineNumbers: true,
        tabSize: 2
      });

      editor.container.style.height = this.editorHeight+'px';
      editor.container.style.minHeight = this.editorHeight+'px';
      editor.container.style.maxHeight = this.editorHeight+'px';

      this.codeEditor.mode = 'smali';
      this.codeEditor.value = this.data.__view_code;

      editor.resize();

      // vm editor
      /*vmEditor.setOptions({
        showLineNumbers: true,
        tabSize: 2
      });*/


      this.vmedHeight = vSizes.bottom.height-this.topNavEl.nativeElement.offsetHeight;
/*
      vmEditor.container.style.height = this.vmedHeight+'px';
      vmEditor.container.style.minHeight = this.vmedHeight+'px';
      vmEditor.container.style.maxHeight = this.vmedHeight+'px';

      this.vmEditor.mode = 'javascript';
      this.vmEditor.value = "Ready for emulation";

      vmEditor.resize();*/
    })

    // init layout
    this.layout.resize({
      width: this.width,
      height: this.height-this.metadataEl.nativeElement.offsetHeight
    });

    this.showHooks();

    // listener for parent resize
    this.parent.resize$.subscribe( (pSize:any)=>{

      // layout height = vp height - metadata height

      //console.log("Resizing layout : ",pSize.height,this.metadataEl.nativeElement.offsetHeight);
      this.layout.resize({
        width: pSize.width,
        height: pSize.height-this.metadataEl.nativeElement.offsetHeight
      });

      this.editorHeight = pSize.height - this.metadataEl.nativeElement.offsetHeight;

      editor.container.style.height = this.editorHeight+'px';
      editor.container.style.minHeight = this.editorHeight+'px';
      editor.container.style.maxHeight = this.editorHeight+'px';

      editor.resize();
    });
  }

  configure( pData:any):void {
    this.data = pData;

  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  openEditorMenu($event: MouseEvent) {
    console.log($event, this.codeEditor);
  }


  showHooks() {
    this.hookSvc.getHooksForMeth(this.data.__signature__).subscribe( (pHooks:any) => {
      if(pHooks.length>0){
        this.hooks = pHooks;
      }else{
        this.hooks = [];
      }
      this.hooksLen = this.hooks.length;
      this.activeBottom = 'hk';
    });
  }

  showXrefTo() {
    this.codeSvc.getXref( NodeInternalType.METHOD, this.data.__signature__, 'to')
        .subscribe( (pData:ModelCall[])=>{
            this.xrefTo = pData;
            this.activeBottom = 'xt';

            console.log('showXrefTo', this.xrefTo);
        });
  }


  showXrefFrom() {
      this.codeSvc.getXref( NodeInternalType.METHOD, this.data.__signature__, 'from')
          .subscribe( (pData:ModelCall[])=>{
              this.xrefFrom = pData;
              this.activeBottom = 'xf';
              console.log('showXrefFrom', this.xrefFrom);
          });
  }

  openMethod(pMeth: string|ModelMethod) {
    if(typeof pMeth==='string'){
        this.controller.open( new ModelMethod({ __signature__:pMeth }), 'vp');
    }else{
        this.controller.open( pMeth, 'vp');
    }
  }

  showHooksLogs() {
    this.hookSvc.getHooksMsgForMeth(this.data.__signature__).subscribe( (pHooks:any) => {
      console.log(pHooks);
      this.hooksMsg = pHooks.data;
      this.activeBottom = 'hm';
    });
  }

  showVmLogs( pRes:any = null):void{
    this.activeBottom = 'vml';
    this.vmLog = pRes;
  }

  showVmSym( pRes:any = null):void{
    this.activeBottom = 'sym';
  }

  removeNOP() {

  }

  simplifyCFG() {

  }

  openPackage(pPkg: any) {

  }

  addProbe() {
    this.hookSvc.probe(this.data).subscribe( (vRes)=>{
        this.data.probing = true;
        this.data.hooked = true;
        this.showHooks();
    });
  }

  /**
   *
   * @param pRemove
   */
  removeHooking(pRemove:boolean = false):void {
    this.hooks.map( (pHookset:any)=>{
      pHookset.children.map( (pHook:AbstractHook)=>{
        this.hookSvc.removeHook(pHook).subscribe( (vHk:any) => {
          console.log("Remove hook : ", vHk);
        });
      })
    })
  }


  /**
   *
   * @param pRemove
   */
  stopHooking(pRemove:boolean = false):void {
    this.hooks.map( (pHookset:any)=>{
      pHookset.children.map( (pHook:AbstractHook)=>{
        this.hookSvc.enableHook(pHook, false).subscribe( (vHk:any) => {
          //console.log("Disable hook : ", vHk);
        });
      })
    })
  }

  openHook(pHook:AbstractHook) {
    (this.parent as any).parent.getController('ctrl:hook-main').open(pHook);
  }

  switchHook(pHook: AbstractHook) {
    this.hookSvc.enableHook( pHook, pHook.isEnable()).subscribe( (pSuccess:any)=>{
      //pHook.enable = pHook.enabled
    });
  }

  getStyleForTag(t: any) {
    switch(t){
      case "ds":
        return "text-bg-warning";
      default:
        return "text-bg-secondary";
    }
  }

  doDeobfuscationTask(pName:string):void {
    switch (pName) {
      case 'rename':
        this.deobfSvc.doAutoRename( this.data.__signature__ ).subscribe( (pRes:any)=> {
          this.showBytecode();
        });
        break;
      case 'rm_nop':
        this.deobfSvc.doNOPClean( this.data.__signature__ ).subscribe( (pRes:any)=> {
          console.log(pRes);
          this.outputSvc.print( OutputMessage.newSuccess({ msg:pRes.nop+" NOP instrcution have been removed from [ "+this.data.__signature__+" ]", src:"Deobfuscation Svc"}));
          this.showBytecode();
        });
        break;
      case 'count_nop':
        this.deobfSvc.doNOPCount( this.data.__signature__ ).subscribe( (pRes:any)=> {
          this.outputSvc.print( OutputMessage.newSuccess({ msg:"There is "+Math.round((100*pRes.nop)/pRes.any)+"% of NOP ( "+pRes.nop+" / "+pRes.any+" )"}));
        });
        break;
    }
  }

  showBytecode() {
    this.codeSvc.disassMethod({
      __: NodeInternalType.METHOD,
      _uid: this.data.__signature__
    }).subscribe((pRes:any)=> {
      console.log(pRes);
      this.codeEditor.mode = 'smali';
      this.codeEditor.value = pRes.smali; //this.data.__view_code;
      this.codeEditor.getEditor().resize();
      this.activeTop = 'bc';
    });
  }


  showDxcVM() {

    /*
    if((this.data.hasOwnProperty('__vm_code')) && this.data.__vm_code!=null){
      this.vmEditor.mode = 'javascript';
      this.vmEditor.value = this.data.__vm_code; //this.data.__view_code;
      this.vmEditor.getEditor().resize();
    }*/


    if(this.ddvmOpts[0].children.length==0){

      if(this.data.args.length>0){
        this.data.args.map((vArg:any, vOffset:number) => {
          console.log(vArg,this.ddvmOpts[0]);
          this.ddvmOpts[0].children.push({
            _t: 'p',
            label: 'Arg_'+vOffset,
            arg: vArg,
            val: '',
            ft: 'i',
            sym: true
          });
        })
      }else{
        this.ddvmOpts[0].children.push({
          _t: 'e',
          _i: GLOBAL_ICONS['WARNING'],
          label: 'This methods has not parameters'
        });
      }
    }

    if(this.emuCmp!=null){
      if(this.symbolTableCmp!=null){
        this.emuCmp.addSymbolTableView(this.symbolTableCmp);
      }

      if(this.emuLogsCmp!=null){
        this.emuCmp.addLogOutput(this.emuLogsCmp);
      }

    }



    //this.symbolTable

    this.activeTop = 'vm';
    this.activeBottom = 'vml';
  }

  openVmMenu($event: MouseEvent) {

  }


  performExtra(name: any) {
    // todo extends
  }

  ddvmItemHasChildren(pItem:any):boolean {
    return (pItem.hasOwnProperty('children')
      && Array.isArray(pItem.children));
  }

  ddvmOnItemFocus($event: any) {

  }

  ddvmOnCollapse($event: any) {

  }


  itemHasChildren(pItem: any, pType: string): boolean {
    return this.ddvmItemHasChildren(pItem);
  }

  open(pItem: any): Observable<any> {
    return from([]);
  }

  prepareDDVMOptions():any {
    let ops:any = {

    };

    this.ddvmOpts[1].children.map((vPar:any) => {     ops[vPar.name] = vPar.v;
    });

    this.ddvmOpts[2].children.map((vPar:any) => {     ops[vPar.name] = vPar.v;
    });

    ops.params = [];
    this.ddvmOpts[0].children.map((vPar:any) => {      console.log(vPar);

      ops.params.push({
        notset: vPar.sym,
        val: (vPar.sym? null : vPar.val)
      });
    });

    ops.level = 0;

    return ops;
  }


  /**
   * To get CSS class of modifiers
   *
   * @param {string} pKey the modifier name
   * @return {string}
   */
  getModifiersStyles(pKey: any) {
    let cls = "";

    switch (pKey){
      case "private":
        cls = "text-danger";
        break;
      case "private":
        cls = "text-primary";
        break;
      default:
        cls = "";
        break;
    }

    return cls;
  }

  /**
   * Navigate to the item
   *
   * @param {INode} pItem
   */
  goTo(pItem:any = null){

    console.log("Go To (2)",pItem);
    this.codeSvc.displayNode$.next({
      node: (pItem!=null? pItem : this.item)
    });
  }

  showGraph(pType:string) {
        switch (pType){
          case 'disassembly':
            this.activeBottom = 'cfg';
            break;
        }
    }
}
