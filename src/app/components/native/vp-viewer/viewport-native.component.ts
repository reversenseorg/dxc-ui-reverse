import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit, QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {NATIVE_ICONS} from "../icons";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import ModelClass from "../../../models/ModelClass";
import ModelMethod from "../../../models/ModelMethod";
import {CODE_ICONS} from "../../code/icons";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import AndroidComponent from "../../../models/android/AndroidComponent";
import {IntentFilter} from "../../../models/android/IntentFilter";
import {IntentDataCriteria} from "../../../models/android/Intent";
import {NativeController} from "../ctrl/NativeController";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {ModelFunction, ModelFunctionList} from "../../../models/ModelFunction";
import {NativeService} from "../ctrl/native.service";
import {SearchService} from "../../search/ctrl/search.service";
import ModelExecutableSection from "../../../models/ModelExecutableSection";
import {
  ContextMenuComponent,
  ContextMenuList,
  ContextMenuState
} from "../../../base/context-menu/context-menu.component";
import {
  HOOK_TARGET_TYPE,
  HookFragmentPresetOptions,
  HookFragmentPresetType,
  HookService
} from "../../hooks/ctrl/hook.service";





@Component({
  selector: 'dxc-viewport-native',
  templateUrl: './viewport-native.component.html',
  styleUrls: ['./viewport-native.component.scss']
})
export class ViewportNativeComponent implements OnInit, OnChanges, AfterViewInit {

  _HK_TYPE:any = HOOK_TARGET_TYPE;

  PRESET_HOOK = HookFragmentPresetType;

  @Input() item: any;
  @Input() data: ModelFunction|ModelExecutableSection; // ModelMethod
  @Input() controller: NativeController;
  @Input() parent: ViewportComponent;

  @Input() height: number;
  @Input() width: number;

  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;
  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;


  /**
   * The list of contextual menu declared
   *
   * @type {QueryList<ContextMenuComponent>}
   * @field
   */
  @ViewChildren(ContextMenuComponent) ctxMenuChildren: QueryList<ContextMenuComponent>;

  gIcons: any = GLOBAL_ICONS;
  cIcons: any = CODE_ICONS;
  icons: any = NATIVE_ICONS;

  @Input() id: number = -1;


  ctr: number = 0;

  activeRight: string = "";

  activeTop: string;
  activeTopLeft: string = 'fl';
  activeTopRight: string = 'xr';
  activeItem:any = null;
  activeObj: any = null;

  sections:any[] = [];
  fn_list:any = {};
  selected:any = {
    sc_addr: null,
    fn_off: null
  };

  opstyle: any = {
    color: {
      cjmp: 'greenyellow',
      cmp: 'royalblue',
      store: 'deepskyblue',
      load: 'deepskyblue',
      mov: 'white',
      shl: 'orange',
      shr: 'orange',
      add: 'orange',
      call: 'greenyellow',
      ucall: 'greenyellow',
    },
    flags: {
      color: 'red'
    }
  };

  ctxMenu: ContextMenuList = {};
  ctxMenuState:ContextMenuState = null;

  constructor(private nativeSvc:NativeService,
              private hookSvc:HookService,
              private searchSvc:SearchService) {
  }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {

    let c:any = null;
    if(changes.hasOwnProperty('data')){
      this.data = changes.data.currentValue;

      console.log()

//      this.sections = this.data.__p.sections;
//      this.fn_list = this.data.__p.fn_list;


    }
  }

  ngAfterViewInit() {

    this.parent.resize$.subscribe( (pSize:any)=>{

      //console.log('Resize VP = ',pSize.height-this.metadataEl.nativeElement.offsetHeight,pSize.height,this.metadataEl.nativeElement.offsetHeight)
      this.layout.resize({
        height: pSize.height, //-this.metadataEl.nativeElement.offsetHeight,
        width: pSize.width
      });
    });

    //console.log('Resize VP = ',pSize.height-this.metadataEl.nativeElement.offsetHeight,pSize.height,this.metadataEl.nativeElement.offsetHeight)
    this.layout.resize({
      height: this.parent.size.height, // -this.metadataEl.nativeElement.offsetHeight,
      width: this.parent.size.width
    });


    this.ctxMenu = {};
    this.ctxMenuChildren.toArray().map( vMenu => {
      console.log(vMenu.name, vMenu);
      this.ctxMenu[vMenu.name] = vMenu;
      this.controller.registerCtxMenu(vMenu.name, this);
    });

  }



  configure( pData:any):void {
    this.data = pData;

//    this.sections = this.data.__p.sections;
//    this.fn_list = this.data.__p.fn_list;

    this.data.__p.fn = {};
    this.data.__p.imp = {};

    console.log(this.data);
    let x:any;
    for(const off in this.data.__p.f_list){
      x = this.data.__p.f_list[off];
      console.log(x);
      if(x.name.startsWith('sym.')){
        if(x.name.startsWith('sym.imp.')){
          x.sym = x.name.substring(8);
          this.data.__p.imp[x.addr] = x;
        }else{
          x.sym = x.name.substring(4);
          this.data.__p.fn[x.addr] = x;
        }
      }
    }

  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  isIntentFilterExpandable(pItem:any, pSrc:any):boolean{
    return (pItem.data!=null && pItem.data.length>0);
  }

  isExpandable(pItem:any, pSrc:any):boolean{
    return (pItem.children!=null && pItem.children.length>0);
  }


  displayCtxMenu(pEvent:any, pType:string, pObject:any):void{
    let type:string = null;
    pEvent.preventDefault();

    if(pType.indexOf('inst')>-1){
      this.activeItem = pObject;
    }

    this.ctxMenuState = {
      menu: this.ctxMenu[pType],
      subject: pObject
    };
    this.ctxMenu[pType].show(pEvent, pObject);
  }

  selectRightTab(pView: string) {
    this.activeTopRight = pView;
  }

  show(pPpt: string, pName:string) {
    this.activeTopLeft = pName;
  }

  showDetail(pType: string, pObj: any, pSubv:string):void {

    this.activeTopRight = pSubv;
    this.activeRight = pType;

    switch(pType) {
      case 'fn':
        this.selected.fn_off = pObj.addr;
        this.nativeSvc.disass(pObj.__s).subscribe( pFunc => {
          console.log(pFunc);
          if(pFunc!=null) {
            this.activeObj = pFunc;
            this.activeTopRight = pSubv;
          }
        });
        break;
      case 'sc':
        this.selected.sc_addr = pObj.paddr;
        this.activeTopRight = pSubv;
        /*this.nativeSvc.executeRaw()pObj.signature()).subscribe( pFunc => {
          this.selectedO =
        });*/
        break;
    }
  }

  disassAt( pAddr:number, pSize:number):void {

  }

  disassFunc(pFunc:ModelFunction) {
    this.nativeSvc.disass(pFunc.signature())
  }


  getStyleForInstr(ins: any, offset: number):string {
    if(this.activeItem !=null && ins.offset==this.activeItem.offset){
      return 'active-item';
    }else {
      return "";
    }
  }

  goHook(pType: string, pSubject: any) {
    if(pType=='fn'){
      this.hookSvc.probeNativeFunc(pSubject).subscribe( (pHookFn)=> {
        console.log(pHookFn);
      });
    }

  }

  dumpSection(pSection:any):void {

  }


  addBookmark(pObj:any):void {

  }

  findInRight() {
    // todo native:findInRight
  }

  createHook(subject: any) {
    console.log(subject);
    this.hookSvc.onCreateHook.next({
      type: HOOK_TARGET_TYPE.FUNC,
      target:subject
    });
  }

  trackValueOf( pItem:any, pOptions: HookFragmentPresetOptions) {

    switch(pOptions.type){
      case HookFragmentPresetType.TRACK_PARAM:
      case HookFragmentPresetType.TRACK_RET:
      case HookFragmentPresetType.TRACK:
        this.hookSvc.onCreateHook.next({ type:HookFragmentPresetType.TRACK, target:pItem });
        break;
      case HookFragmentPresetType.TAMPER_RET:
        this.hookSvc.onCreateHook.next({ type:HookFragmentPresetType.TAMPER_PARAM, tplOpts:"ret", target:pItem  });
        break;
      case HookFragmentPresetType.TAMPER_PARAM:
        this.hookSvc.onCreateHook.next({ type:HookFragmentPresetType.TAMPER_RET,  tplOpts:"params",target:pItem });
        break;
      case HookFragmentPresetType.TRACK_JAVA_NEW_INST:
        this.hookSvc.onCreateHook.next({ type:HookFragmentPresetType.TRACK_JAVA_NEW_INST,  tplOpts:"obj",target:pItem });
        break;
      case HookFragmentPresetType.NONE:
        this.hookSvc.onCreateHook.next({ type:HookFragmentPresetType.NONE, target:pItem });
        break;
    }
  }

  createInsnHook(fn: string, subject: any, xf: string) {
    //
  }
}
