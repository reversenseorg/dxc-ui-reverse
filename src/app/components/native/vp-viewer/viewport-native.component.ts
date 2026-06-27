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
    AfterViewInit, ChangeDetectorRef,
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
import {Nullable} from "../../../base/Nullable";
import ModelFile from "../../../models/ModelFile";
import {MerlinSearchRequest, OperationType} from "../../../models/search/MerlinSearchRequest";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {IconModelCollection} from "../../../base/icon/IconModel";





@Component({
  selector: 'dxc-viewport-native',
  templateUrl: './viewport-native.component.html',
  styleUrls: ['./viewport-native.component.scss']
})
export class ViewportNativeComponent implements OnInit, OnChanges, AfterViewInit {

  _HK_TYPE:any = HOOK_TARGET_TYPE;

  PRESET_HOOK = HookFragmentPresetType;

  @Input() item: any;
  @Input() data: Nullable<ModelFile>; //ModelFunction|ModelExecutableSection; // ModelMethod
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
  ctxMenuState:ContextMenuState = { subject: null };

  nIcons:IconModelCollection = NATIVE_ICONS;
  funcs: ModelFunction[] = [];

  constructor(private nativeSvc:NativeService,
              private hookSvc:HookService,
              private codeSvc:CodeControllerService,
              private searchSvc:SearchService,
              private chref:ChangeDetectorRef) {
  }

  ngOnInit(): void {
      console.log("Show native files",this.data);
  }


  ngOnChanges(changes: SimpleChanges) {

    let c:any = null;
    if(changes.hasOwnProperty('data')){
      this.data = (changes as any).data.currentValue;

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
    this.ctxMenuChildren.toArray().map((vMenu:any) => {     console.log(vMenu.name, vMenu);
      this.ctxMenu[vMenu.name] = vMenu;
      this.controller.registerCtxMenu(vMenu.name, this);
    });


    this.refresh();
  }

  refresh(){
      this.showFuncs();
  }



  configure( pData:ModelFile):void {
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
    let type:Nullable<string> = null;
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

  showFuncs():void {
      console.log("showFuncs : ",this.data);
      if(this.data == null || this.data._uid == null ) return;

      this.codeSvc.merlinSearch(new MerlinSearchRequest(
          NodeInternalType.FUNC,
          [{
              type:OperationType.SEARCH,
              args: {
                  pattern: "src._uid:"+this.data._uid,
              }
          }]
      )).subscribe((vRes:any)=>{


          console.log("Execute MERLIN Request (as native search : native) ",vRes);

          vRes.map((vSelf:any) => {
              vSelf._icon = this.nIcons['FUNC'];
          });

          this.funcs = vRes;
          this.chref.detectChanges();
      });
  }

  show(pPpt: string, pName:string) {
    this.activeTopLeft = pName;
    switch(pPpt) {
        case 'fn_list':
            this.showFuncs();
            break;
    }
  }

  showDetail(pType: string, pObj: any, pSubv:string):void {

    this.activeTopRight = pSubv;
    this.activeRight = pType;

    switch(pType) {
      case 'fn':
        this.selected.fn_off = pObj.addr
        this.activeObj = pObj.__s;
        this.chref.detectChanges();
        /*
        this.nativeSvc.disass(pObj.__s).subscribe( pFunc => {
          console.log(pFunc);
          if(pFunc!=null) {
            this.activeObj = pFunc;
            this.activeTopRight = pSubv;
          }
        });*/
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
