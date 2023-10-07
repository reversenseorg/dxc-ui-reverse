import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ExplorerView} from "../../../cmp/ExplorerView";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import {SubExplorerComponent} from "../../../base/explorer/subexplorer.component";
import {ExplorerTab} from "../../../cmp/ExplorerTab";
import {ActivatedRoute} from "@angular/router";
import {empty, Observable, Subject} from "rxjs";
import {ModelPackage} from "../../../cmp/ModelPackage";
import {map} from "rxjs/operators";
import {CODE_SUBVIEW} from "./explorer-code.const";
import {CodeItem} from "./CodeItem";
import {ExpandableProvider} from "../../../base/expandable-list/expandable-provider";
import {ModifierFormat} from "../../../models/AccessFlags";
import {
  ContextMenuComponent,
  ContextMenuList,
  ContextMenuState
} from "../../../base/context-menu/context-menu.component";
import {CodeController} from "../ctrl/CodeController";
import {CODE_ICONS} from "../icons";
import {ProjectService} from "../../project/ctrl/project.service";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {IKeyboardNavigable} from "../../../base/keyboard/IKeyboardNavigable";
import ModelMethod from "../../../models/ModelMethod";
import {CodeControllerService, ContextMenuEvent} from "../ctrl/code-controller.service";
import {HookFragmentPresetOptions, HookFragmentPresetType, HookService} from "../../hooks/ctrl/hook.service";
import {ElectronService} from "../../../core/services";
import ModelClass from "../../../models/ModelClass";
import {nextCUID} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {NativeService} from "../../native/ctrl/native.service";
import {TagService} from "../../tag/ctrl/tag.service";
import {SelectionUtils} from "../../../core/services/dexcalibur/SelectionUtils";
import {DxcSelectionType} from "../../../core/services/electron/SelectionManager";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {UIException} from "../../../base/error/UIException";
import {Nullable} from "../../../base/Nullable";
import {IconModelCollection} from "../../../base/icon/IconModel";
import {IStringIndex} from "../../../base/IStringIndex";

/*interface PackageSets {
  [name: nu] :ModelPackage[]
}*/



/**
 * This class controls events and content of 'code' tab into explorer area
 * (left vertical panel)
 *
 * @class
 * @since 1.0.0
 * @author Georges-Bastien MICHEL
 */
@Component({
  selector: 'app-explorer-code',
  templateUrl: './explorer-code.component.html',
 // providers: [ExplorerCodeService],
  styleUrls: ['./explorer-code.component.scss'],
  providers: [NgbTooltipConfig],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerCodeComponent extends SubExplorerComponent<CodeController>
    implements OnInit, AfterViewInit, ExpandableProvider, IKeyboardNavigable {

  _NODE = NodeInternalType;

  PRESET_HOOK = HookFragmentPresetType;

  NODE_TYPES:any = NodeInternalType;


  /**
   * The default controller associated to this UI component
   *
   * @type {CodeController}
   * @field
   */
  @Input() override controller: CodeController;

  /**
   * This field holds the parent component, here the main explorer component.
   *
   * @type {ExplorerComponent}
   * @field
   */
  @Input() override parent:any;

  /**
   * The reference to the DOM element containing this component
   *
   * @type {ElementRef}
   * @field
   */
  @ViewChild("explCodeRef", {read: ElementRef}) explCodeRef: ElementRef;

  /**
   * The reference to the DOM element containing the dynamic part (data)
   *
   * @type {ElementRef}
   * @field
   */
  @ViewChild("explCodeCtnRef", {read: ElementRef}) explCodeCtnRef: ElementRef;

  /**
   * The list of contextual menu declared
   *
   * @type {QueryList<ContextMenuComponent>}
   * @field
   */
  @ViewChildren(ContextMenuComponent) ctxMenuChildren: QueryList<ContextMenuComponent>;


//  @ViewChild(ModalMethodComponent) modalMethod: ModalMethodComponent;
  protected _cuid:number = -1;
  onKeyboardEvent:Subject<any> = new Subject<any>();

  override id = "explorerCode";

  ctxMenu: ContextMenuList = {};
  ctxMenuState:ContextMenuState = {
    subject: null
  };

  selected:any = CODE_SUBVIEW.ALL;
  activeItem: any = null;

  override icons:IconModelCollection = CODE_ICONS;
  override gIcons:IconModelCollection = GLOBAL_ICONS;

  override offset:number = 0;



  tags:any;

  packages:CodeItem[][] = [];

  projectReady:boolean = false;

  constructor( private projectService:ProjectService,
               private codeService:CodeControllerService,
               private electronSvc:ElectronService,
               private hookSvc:HookService,
               private tagSvc:TagService,
               private nativeSvc:NativeService,
               public kbSvc:KeyboardNavigationService,
               private route: ActivatedRoute,

               private changeDetectorRef:ChangeDetectorRef,

               ngbTooltipConfig:NgbTooltipConfig) {
    super();

    this.tab = new ExplorerTab({
      offset: 0,
      label: 'Code',
      icon: GLOBAL_ICONS['CODE'],
      color: 'dxc-text-clear100'
    });

    this.view = new ExplorerView({
      nav: new NavbarSimpleView({
        selected: this.selected,
        menu: new MenuView({
          items: [
            new MenuItem<CodeItem>({
              id:CODE_SUBVIEW.APP,
              label:'Application',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['WINDOW']
            }),
            new MenuItem<CodeItem>({
              id:CODE_SUBVIEW.ANDROID_API,
              label:'Android API',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['ANDROID']
            }),
            new MenuItem<CodeItem>({
              id:CODE_SUBVIEW.ANDROID_FWK,
              label:'Android Internals',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['ANDROID']
            }),
            new MenuItem<CodeItem>({
              id:CODE_SUBVIEW.VENDOR,
              label:'Vendor-specific',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['INTERNAL']
            }),

            new MenuItem<CodeItem>({
              id:CODE_SUBVIEW.ALL,
              label:'All',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['GLOBE']
            }),
          ]
        })
      })
    });

    this._cuid = nextCUID();

    this.reset();
    this.view.id = this.id;
    ngbTooltipConfig.tooltipClass = "dxc-tooltip";
    /*
    this.codeService.mapIcons(NODE_TYPE.CLASS, this.icons['CLASS']);
    this.codeService.mapIcons(NODE_TYPE.PACKAGE, this.icons['PKG']);
    this.codeService.mapIcons(NODE_TYPE.METHOD, this.icons['METH']);
    this.codeService.mapIcons(NODE_TYPE.FIELD, this.icons['FIELD']);
    this.codeService.mapIcons(NODE_TYPE.FILE, this.gIcons['BIN']);
    this.codeService.mapIcons('p-di', this.icons['PKG_INT']);
    this.codeService.mapIcons('p-mx', this.icons['PKG_MIXED']);*/



    this.codeService.mapIcons('c', this.icons['CLASS']);
    this.codeService.mapIcons('p', this.icons['PKG']);
    this.codeService.mapIcons('m', this.icons['METH']);
    this.codeService.mapIcons('f', this.icons['FIELD']);
    this.codeService.mapIcons('e', this.gIcons['BIN']);
    this.codeService.mapIcons('b', this.gIcons['BYTES']);
    this.codeService.mapIcons('p-di', this.icons['PKG_INT']);
    this.codeService.mapIcons('p-mx', this.icons['PKG_MIXED']);


  }

  r = 0;
  checkRendering(){
    this.r++;
    //console.log(this.r);
    return true;
  }

  ngOnInit(): void {
    this.kbSvc.register(this);

    this.projectService.onProjectReady
      .subscribe((pProject:DexcaliburProject) => {


        this.tags = {
          INTERNAL: this.tagSvc.getTagByName("discover.internal"),
          STATIC: this.tagSvc.getTagByName("discover.static"),
          DYNAMIC: this.tagSvc.getTagByName("discover.dynamic"),
          VENDOR: this.tagSvc.getTagByName("discover.vendor"),
        }

        console.log("Code Explorer : onProjectReady :",this.tags);


        this.projectReady = true;
        this.controller.service
          .listPackages(CODE_SUBVIEW.ALL)
          .subscribe((packages:any) => {
            const frames = Math.round(packages.length/1000);
            this.parent.selectTab( this.offset);
            this.packages[this.selected] = [];


            this.changeDetectorRef.detach();

            for(let i=0; i<frames; i++){

              console.log('update package');
              this.packages[this.selected] = this.packages[this.selected].concat(packages.slice(i*1000,(i*1000)+1000));
              this.changeDetectorRef.markForCheck();
              //console.log("mark for changes",i*1000);
            }
            if(packages.length%1000>0){
              console.log('add modulo slide');
              this.packages[this.selected] = this.packages[this.selected].concat(packages.slice(frames*1000,packages.length));
              this.changeDetectorRef.markForCheck();
              //console.log("mark for changes LAST");
            }
            //this.changeDetectorRef.detectChanges();

            this.changeDetectorRef.reattach();
            // console.log(this.packages[this.selected]);

          });
      });


    this.projectService.onProjectClose.subscribe( (pProject:DexcaliburProject)=>{
      this.projectReady = false;
      this.reset();
    });

    this.codeService.displayCtxMenu$.subscribe( (pObs:ContextMenuEvent)=>{
      this.displayCtxMenu(pObs.event, pObs.type, pObs.obj);
    });

      this.controller.openMethodModal.subscribe( (pMethod:ModelMethod|string) => {

        if(typeof  pMethod ==='string'){
          this.codeService.getModelMethod(pMethod)
            .subscribe((vMeth:Nullable<ModelMethod>)=> {

              if(vMeth==null) return;

                this.codeService.disassMethod(vMeth.__signature__ as string).subscribe((pCode: any) => {
                  //console.log(pCode);
       /*           let code: string = '';

                  pCode.disass.map(pBB => {
                    pBB.instr.map(pInstr => {
                      code += pInstr.value + `
    `;
                    })
                    code += `
    `;
                  })
                  vMeth.__view_code = code;*/
                  vMeth.__view_code = pCode.smali;


                  console.log(vMeth);
                  //this.modalMethod.open(vMeth);

                });


              });

        }else if(pMethod.__view_code==undefined){
          this.codeService.disassMethod(pMethod.__signature__ as string).subscribe( (pCode:Nullable<string>)=>{
            pMethod.__view_code = pCode;
            //this.modalMethod.open(pMethod);
          })
        }else{
          //this.modalMethod.open(pMethod);
        }
      });
  }

  getCUID(): number {
    return this._cuid;
  }

  onKeyPress(pEvent: any) {
    console.log("explorer code catch kb event : ",pEvent);
    switch(pEvent.code){
      case "Escape":
        break;
    }
  }


  ngAfterViewInit() {

    // subscribe to resize events
    this.resize$.subscribe( (pEvent:any)=>{
      this.drawExplorer(pEvent);
    });


    // init contextual menus
    this.ctxMenu = {};
    this.ctxMenuChildren.toArray().map((vMenu:any) => {     this.ctxMenu[vMenu.name] = vMenu;
      this.controller.registerCtxMenu(vMenu.name, this);
    });


  }

  private drawExplorer(pSize:any):void {

    const el = this.explCodeRef.nativeElement; //document.getElementById('explorerCode');
    const ctn = this.explCodeCtnRef.nativeElement; //document.getElementById('explorerCodeCtn');
    const navHeight:number = (this.view as any).nav.size.height;


    el.style.width = '100%';
    //el.style.width = pSize.width+'px';
    //el.style.maxWidth = pSize.width+'px';
    el.style.height = pSize.height+'px';
    el.style.maxHeight = pSize.height+'px';

    ctn.style.width = '100%';
    //ctn.style.width = pSize.width+'px';
    //ctn.style.maxWidth = pSize.width+'px';
    ctn.style.height = (pSize.height-navHeight)+'px';
    ctn.style.maxHeight = (pSize.height-navHeight)+'px';
  }

  isExpandable( pItem:any):boolean {
    return (pItem._t=='c' || pItem._t=='p' || pItem.__==NodeInternalType.FILE); //pItem.children.length>0;
  }

  expand( pItem:any, pType:string): Observable<CodeItem[]> {
    let data:any = null;


    switch(pType){
      case 'p':
        data = this.controller.service
          .listPackages( this.selected, '^'+pItem.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+'$')
          .pipe(
            map( (pObs:any)=>{
              pObs[0].children.map((vSelf:any) => {               vSelf._icon = this.codeService.getIconOf(vSelf._t);


                if(vSelf._t=="p" && this.tags.INTERNAL.match(vSelf)){
                  if(this.tags.STATIC.match(vSelf)){
                    vSelf._icon = this.icons['PKG_MIXED'];
                  }else{
                    vSelf._icon = this.icons['PKG_INT'];
                  }
                }

                //expandable
                vSelf._e = true;
              });

              const res = pObs[0].children.slice(0,1000);

              pItem.children = res;
              return res;
            })
          )
        break;
      case 'c':
        data = this.controller.service
          .getClass( pItem.name) // ' pItem.name.replace(/"/g, '\\$&')) ' removed because getClass() does not continues to use finder
          .pipe(
            map( (pObs:any)=>{
              let children:any=[];

              if(pObs.hasOwnProperty('data')==false || pObs.data==null) return;

              pObs.data._icon = this.icons['CLASS'];
              pObs.data.fields.map( (vField:any)=>{
                vField['_t'] = 'f';

                if(typeof vField.modifiers === 'number')
                  vField['mod'] = ModifierFormat.toJsonObject(vField.modifiers);
                else
                  vField['mod'] = vField.modifiers;

                vField._icon = this.icons['FIELD'];
                //expandable
                vField._e = false;
                children.push(vField);
              });

              pObs.data.methods.map( (vMeth:any)=>{
                vMeth['_t'] = 'm';
                if(typeof vMeth.modifiers === 'number')
                  vMeth['mod'] = ModifierFormat.toJsonObject(vMeth.modifiers);
                else
                  vMeth['mod'] = vMeth.modifiers;

                if(vMeth.mod.construct){
                  if(vMeth.mod.static) {
                    vMeth.mod._t = 'clinit';
                    vMeth._icon = this.icons['STATICB'];
                  }else {
                    vMeth.mod._t = 'new';
                    vMeth._icon = this.icons['NEW'];
                  }
                }else if(vMeth.mod.static){
                  vMeth._icon = this.icons['STATIC'];
                }else if(vMeth.mod.construct){
                  vMeth._icon = this.icons['CONSTRUCT'];
                }else if(vMeth.mod.native){
                  vMeth._icon = this.icons['NATIVE'];
                }else{
                  vMeth._icon = this.icons['METH'];
                }

                vMeth._e = false;
                children.push(vMeth);
              });

              //console.log('exploring class children>',children);

              pItem.children = children;

              return children;
            })
          )
        break;
      case 'e':
        break;
      default:
        data = empty();
        break;
    }

    return data;
  }

  open( pItem:any): any {
    this.controller.open( pItem, 'expl');
    return null;
  }

  sortPkg( pData:ModelPackage[]):any {
    let pkgTree:IStringIndex<ModelPackage> = {}, rest = [];
    pData.map( (pPkg)=>{

      if(pPkg.name==null) return;

      let fqn = pPkg.name.split('.');

      if(fqn.length==1){
        pkgTree[pPkg.name] = pPkg;
      }else {

      }
      if(pkgTree)
      if(pPkg.name.indexOf('.')>-1){

      }else{
        pkgTree[pPkg.name] = pPkg;
      }
    })
  }

  filterPkg( pData:CodeItem[], pKey:string, pValue:string):CodeItem[]{
    let field:string, cmpFn:Function, out:CodeItem[]=[] ;

    if(pKey[0]=='['){
      field = pKey.substr(1);
      cmpFn = ((aVal:any[]) => { return (aVal.indexOf(pValue)>-1); });
    }else{
      field = pKey;
      cmpFn = ((aVal:any) => { return (aVal === pValue); });
    }

    pData.map( (aPkg:CodeItem) => {
      if(cmpFn(aPkg)===true) out.push(aPkg);
    });

    return out;
  }

  itemHasChildren( pItem:any, pType='p'): boolean {
    return (pType=='c'||pType=='p'|| pItem.__==this._NODE.FILE);
  }

  itemHasLazyChildren( pItem:any, pType ='p'): boolean {
    return (pItem.children.length==1 && pItem.children[0]._t=="wait");
  }


  itemGetChildren( pItem:any):any{
    return pItem.children;
  }

  onExpand( pItem:any):void {
  }

  onCollapse( pItem:any):void {
  }

  onItemFocus( pEvent:any):void{

    // selected node must implement nav by up/down key
    // add item to the selection
    this.electronSvc
      .getSelectionManager()
      .selectNode(pEvent.item, SelectionUtils.retrieveShortForm(pEvent.item));

    if(this.activeItem != null){
      this.activeItem.el.style.backgroundColor = "#444";
    }

    this.activeItem = pEvent;
    pEvent.el.style.backgroundColor = "royalblue";
  }

  onMenuItemClick( pEvent:any, pForce = false):void{

    console.log(pEvent);

    if(!pForce)
      (this.view.nav as NavbarSimpleView).selectItem(pEvent.item);

    this.controller.service
      .listPackages(pEvent.item.id)
      .subscribe((packages:any) => {
        let c:any;
        let p=0;
        switch(pEvent.item.id){
          case CODE_SUBVIEW.APP:
            this.packages[CODE_SUBVIEW.APP] = [];
            packages.map( (pPkg:any,pIndex:number)=>{

                if(p>0 && (p%200===0)){
                  console.log("detect changes",p);
                  //this.changeDetectorRef.detectChanges();
                  //this.changeDetectorRef.markForCheck();
                }

                if( this.tags.STATIC.match(pPkg) || this.tags.DYNAMIC.match(pPkg)){

                  if(pPkg._t=='c'){
                    // it happens when a class is not contaiend into a package
                    pPkg._icon = this.icons['CLASS'];
                    this.packages[CODE_SUBVIEW.APP].push(pPkg);
                    p++;

                    return ;
                  }

                  c = [];
                  pPkg._icon = this.icons['PKG'];

                  pPkg.children.map( (vChild:any)=>{
                    if( this.tags.STATIC.match(vChild) || this.tags.DYNAMIC.match(vChild)){
                      if(vChild._t=='c'){
                        vChild._icon = this.icons['CLASS'];
                      }else{
                        vChild._icon = this.icons['PKG'];
                      }
                      vChild._e = true;
                      c.push(vChild);
                    }
                  });
                  pPkg.children = c;
                  this.packages[CODE_SUBVIEW.APP].push(pPkg);
                  p++;
                }
            });

            console.log("detect changes",p);
            //this.changeDetectorRef.detectChanges();

            break;
          case CODE_SUBVIEW.ANDROID_API:
          case CODE_SUBVIEW.ANDROID_FWK:
            this.packages[pEvent.item.id] = [];
            packages.map( (pPkg:any)=>{
              if(pPkg.tags.length==0 || this.tags.INTERNAL.match(pPkg)){
                c = [];
                pPkg.children.map( (vChild:any)=>{
                  if(pPkg._t=='c'){
                    pPkg._icon = this.icons['CLASS'];
                  }else{
                    pPkg._icon = this.icons['PKG_INT'];
                  }
                  if( this.tags.INTERNAL.match(vChild) ){
                    if(vChild._t=='c'){
                      vChild._icon = this.icons['CLASS'];
                    }else{
                      vChild._icon = this.icons['PKG'];
                    }
                    vChild._e = true;
                    c.push(vChild);
                  }
                });
                pPkg.children = c;
                this.packages[pEvent.item.id].push(pPkg);
              }
            });
            break;
          case CODE_SUBVIEW.VENDOR:
            break;
          case CODE_SUBVIEW.ALL:
              this.packages[CODE_SUBVIEW.ALL] = packages;
            //this.changeDetectorRef.markForCheck();
            break;
        }
      });

      this.selected = pEvent.item.id;
  }

  reset():void {
    this.packages[CODE_SUBVIEW.APP] = [];
    this.packages[CODE_SUBVIEW.ALL] = [];
    this.packages[CODE_SUBVIEW.VENDOR] = [];
    this.packages[CODE_SUBVIEW.ANDROID_FWK] = [];
    this.packages[CODE_SUBVIEW.ANDROID_API] = [];
    this.selected = null;
  }

  displayCtxMenu(pEvent:any, pType:string, pObject:any):void{
    let type:Nullable<string> = null;

    console.log(pEvent);
    pEvent.preventDefault();

    this.ctxMenuState = {
      menu: this.ctxMenu[pType],
      subject: pObject
    };
    this.ctxMenu[pType].show(pEvent, pObject);
  }

  hideCtxMenu():void{

    if(this.ctxMenuState==null){
      throw UIException.CTX_MENU_NOT_READY("explorer-code","hideCtxMenu");
    }
    if(this.ctxMenuState.menu!=null){
      this.ctxMenuState.menu.hide(this.ctxMenuState.subject);
    }
  }

  createHook(pMeth: any, pOptions:any = null) {
    this.hookSvc.onCreateHook.next({ type:HookFragmentPresetType.NONE, target:pMeth});
  }


  createNativeHook(pType: string, pTarget: any) {
    this.hookSvc.onCreateHook.next({
      type:HookFragmentPresetType.NONE, target:pTarget
    });
  }


  /**
   * To copy the value of a specific attribute from a node to the clipboard
   *
   * TODO : add more info (node, attr name)
   *
   * @param subject
   * @param n
   */
  copyAttr(subject: any, n: Nullable<string> = null) {
    console.log(subject);//, subject[n]);

    if(n !== null)
      this.electronSvc.writeToClipboard(subject[n]);
    else
      this.electronSvc.writeToClipboard(subject);
  }

  copyObj( pObject:any, n: string, pOpts:any = null){
    this.electronSvc.pinToClipboard({
      type: DxcSelectionType.NODE,
      el:pObject,
      short: pObject[n]
    });
  }

  copy(pObject: any, pFmt: string) {
    switch(pObject._t){
      case 'm':
        this.electronSvc.writeToClipboard(pObject.name);
        break;
      case 'f':
        this.electronSvc.writeToClipboard(pObject.name);
        break;
      case 'c':
        const s = (pObject as ModelClass).simpleName;
        this.electronSvc.writeToClipboard(s==null ? "":s);
        break;
      case 'p':
        this.electronSvc.writeToClipboard(pObject.name);
        break;
    }
  }

  refresh(){
    this.onMenuItemClick({ item:{id:this.selected}}, true);
  }

  search(){
    this.codeService.onMenuClick.next({ item:"search" });
  }



  itemIdentify( pIndex:number, pItem:any):string {
    return pItem._t+':'+pItem.__signature__;
  }

  runNativeAnalysis(pItem:any):void {
    console.log("File analysis start : ",pItem);
    this.nativeSvc.startFileAnalysis(pItem).subscribe( (pRes:any)=>{
      // trigger component update
      (pItem as any).$r = true;
      pItem.__p = pRes.__p;
      console.log("File analysis success : ",pRes);
    });
  }

  newKP(pSubject: any, pOptions:any = null) {
    this.hookSvc.createKeyPoint(pSubject, pOptions);
  }

  trackValueOf( pItem:any, pOptions: HookFragmentPresetOptions) {

    console.log(pItem)
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
    }
  }

  /**
   * To add to bookmarck
   *
   * @param subject
   */
  addBookmark(subject: any) {

  }

}
