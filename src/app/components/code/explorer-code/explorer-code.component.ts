import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
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
import {empty, from, Observable, Subject} from "rxjs";
import {ModelPackage} from "../../../cmp/ModelPackage";
import {map} from "rxjs/operators";
import {CODE_SUBVIEW} from "./explorer-code.const";
import {CodeItem} from "./CodeItem";
import {ExpandableProvider} from "../../../base/expandable-list/expandable-provider";
import {ModifierFormat} from "../../../models/AccessFlags";
import {
    ContextMenuComponent,
    ContextMenuEvent,
    ContextMenuList,
    ContextMenuState
} from "../../../base/context-menu/context-menu.component";
import {CodeController} from "../ctrl/CodeController";
import {CODE_ICONS} from "../icons";
import {ProjectService} from "../../project/ctrl/project.service";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {IKeyboardNavigable} from "../../../base/keyboard/IKeyboardNavigable";
import ModelMethod from "../../../models/ModelMethod";
import {CodeControllerService} from "../ctrl/code-controller.service";
import {HookFragmentPresetOptions, HookFragmentPresetType, HookService} from "../../hooks/ctrl/hook.service";
import {ClipboardService} from "../../../core/services/clipboard.service";
import ModelClass from "../../../models/ModelClass";
import {nextCUID} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {NativeService} from "../../native/ctrl/native.service";
import {TagService} from "../../tag/ctrl/tag.service";
import {SelectionUtils} from "../../../core/services/dexcalibur/SelectionUtils";
import {DxcSelectionType} from "../../../core/services/SelectionManager";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {UIException} from "../../../base/error/UIException";
import {Nullable} from "../../../base/Nullable";
import {IconModelCollection} from "../../../base/icon/IconModel";
import {IStringIndex} from "../../../base/IStringIndex";
import ModelFile from "../../../models/ModelFile";
import {MerlinSearchRequest, OperationType} from "../../../models/search/MerlinSearchRequest";
import {NATIVE_ICONS} from "../../native/icons";
import {ModelFunction} from "../../../models/ModelFunction";

/*interface PackageSets {
  [name: nu] :ModelPackage[]
}*/


const DEFAULT_REASON = "No matches found";

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
  nIcons:IconModelCollection = NATIVE_ICONS;
  override gIcons:IconModelCollection = GLOBAL_ICONS;

  override offset:number = 0;


    /**
     * No package reason
     */
    reason: string =  DEFAULT_REASON;



  tags:any;

  packages:CodeItem[][] = [];

  projectReady:boolean = false;
    opts:any = {
        alias: true
    };

  constructor( private projectService:ProjectService,
               private codeService:CodeControllerService,
               private electronSvc:ClipboardService,
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
          selected: 5,
          items: [
            new MenuItem<CodeItem>({
              id:CODE_SUBVIEW.APP,
              label:'Application',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['WINDOW'],
              //click: ()=>{ this.showApplicationCode(); }
            }),
            new MenuItem<CodeItem>({
              id:CODE_SUBVIEW.APP_LIBS,
              label:'Application Libs',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['WINDOW'],
              //click: ()=>{ this.showApplicationLibs(); }
            }),
            new MenuItem<CodeItem>({
              id:CODE_SUBVIEW.ANDROID_API,
              label:'Android API',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['ANDROID'],
              //click: ()=>{ this.showOsApi(); }
            }),
            new MenuItem<CodeItem>({
              id:CODE_SUBVIEW.ANDROID_FWK,
              label:'Android Internals',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['ANDROID'],
              //click: ()=>{ this.showOsApi(); }
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

    this.codeService.mapIcons('c', this.icons['CLASS']);
    this.codeService.mapIcons('p', this.icons['PKG']);
    this.codeService.mapIcons('m', this.icons['METH']);
    this.codeService.mapIcons('f', this.icons['FIELD']);
    this.codeService.mapIcons('e', this.gIcons['BIN']);
    this.codeService.mapIcons('b', this.gIcons['BYTES']);
    this.codeService.mapIcons('p-di', this.icons['PKG_INT']);
    this.codeService.mapIcons('p-mx', this.icons['PKG_MIXED']);



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
        this.projectReady = true;
        this.switchView( CODE_SUBVIEW.ALL);
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

                this.codeService.disassMethod({
                  __: NodeInternalType.METHOD,
                  _uid: vMeth.__signature__
                }).subscribe((pCode: any) => {
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
          this.codeService.disassMethod({
            __: NodeInternalType.METHOD,
            _uid: pMethod.__signature__ as string
          }).subscribe( (pCode:Nullable<any>)=>{
            pMethod.__view_code = pCode.smali;
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
    return (pItem._t=='c' || pItem._t=='p' || pItem.__==NodeInternalType.FILE || pItem.___!=null); //pItem.children.length>0;
  }


  private _expandFakeCat( pItem:any, pType:string): Observable<CodeItem[]> {
      switch(pItem.___){
          case "funcs":
              return this.codeService.merlinSearch(new MerlinSearchRequest(
                  NodeInternalType.FUNC,
                  [{
                      type:OperationType.SEARCH,
                      args: {
                          pattern: "src._uid:"+pItem._obj._uid,
                      }
                  }]
              )).pipe(map((vRes:any)=>{
                  console.log("Execute MERLIN Request (as code search : file content) ",vRes);

                  vRes = vRes.filter((f:any) => {
                      if(!f.name.startsWith("sym.imp.")){
                          f._style = {
                              color: (f.name.startsWith("sym.")? "#00e7ff" : "#777" )
                          };
                          f._icon = this.nIcons['FUNC'];
                          return true;
                      }else{
                          return false;
                      }
                  });

                  pItem.children = vRes;
              })) as  Observable<any>;
              break;
          case "exp":
              return this.codeService.merlinSearch(new MerlinSearchRequest(
                  NodeInternalType.FUNC,
                  [{
                      type:OperationType.SEARCH,
                      args: {
                          pattern: "src._uid:"+pItem._obj._uid,
                      }
                  }]
              )).pipe(map((vRes:any)=>{
                  console.log("Execute MERLIN Request (as code search : file content) ",vRes);

                  vRes.map((vSelf:any) => {
                      vSelf._icon = this.nIcons['FUNC'];
                  });


                  pItem.children = vRes;
              })) as  Observable<any>;
              break;
          case "imp":
              return this.codeService.merlinSearch(new MerlinSearchRequest(
                  NodeInternalType.FUNC,
                  [{
                      type:OperationType.SEARCH,
                      args: {
                          pattern: "src._uid:"+pItem._obj._uid
                      }
                  },{
                      type:OperationType.FILTER,
                      args: {
                          pattern: "name:/^sym\.imp\./"
                      }
                  }]
              )).pipe(map((vRes:any)=>{
                  console.log("Execute MERLIN Request (as code search : imported func) ",vRes);

                  vRes.map((vSelf:any) => {
                      vSelf._icon = this.nIcons['FUNC'];
                      vSelf.name = vSelf.name.substring(8);
                  });

                  pItem.children = vRes;
              })) as  Observable<any>;
              break;
          case "sect":
              console.log("List sections : ",pItem._obj);
              (pItem._obj as any).sections.map((s: any) => {
                  s.__ = NodeInternalType.EXEC_SECTION;
              });
              pItem.children = (pItem._obj as any).sections;

              return from([
                  (pItem._obj as any).sections
              ]);
              break;
          case "strings":
              return this.codeService.merlinSearch(new MerlinSearchRequest(
                  NodeInternalType.STRING,
                  [{
                      type:OperationType.SEARCH,
                      args: {
                          pattern: [{
                              field: "src._uid",
                              pattern: pItem._obj._uid,
                              regexp: false
                          },{
                              field: "src.__",
                              pattern: NodeInternalType.FILE,
                              regexp: false

                          }]
                      }
                  }]
              )).pipe(map((vRes:any)=>{
                  console.log("Execute MERLIN Request (as code search : strings) ",vRes);

                  pItem.children = vRes;
              })) as  Observable<any>;
              break;
          case "syscalls":
              return this.codeService.merlinSearch(new MerlinSearchRequest(
                  NodeInternalType.CALL,
                  [{
                      type:OperationType.SEARCH,
                      args: {
                          pattern: [{
                              field: "_called.__",
                              pattern: NodeInternalType.SYSCALL,
                              regexp: false
                          },{
                              field: "_caller.__",
                              pattern: NodeInternalType.FILE,
                              regexp: false
                          },{
                              field: "_caller._uid",
                              pattern: pItem._obj._uid,
                              regexp: false
                          }]
                      }
                  }]
              )).pipe(map((vRes:any)=>{
                  console.log("Execute MERLIN Request (as code search : strings) ",vRes);

                  pItem.children = vRes;
              })) as  Observable<any>;
              break;
          default:
              return from([ ]);
              break;

      }
  }
  /**
   * Callback from expandable
   * @param pItem
   * @param pType
   */
  expand( pItem:any, pType:string): Observable<CodeItem[]> {
    let data:any = null;

    console.log("Code explorer : expand : ",pItem, pType);

    if(pItem.___!=null){
        return this._expandFakeCat(pItem,pType);
    }

    switch (pItem.__) {
        case NodeInternalType.FILE:
            pItem.children = [
                { _icon: this.nIcons['FUNC'],  ___:'funcs', _obj: pItem, children:[] },
                { _icon: this.nIcons['SECTIONS'],  ___:'sect', _obj: pItem, children:[] },
                { _icon: this.nIcons['IMPORTS'],  ___:'imp', _obj: pItem, children:[] },
                { _icon: this.nIcons['EXPORTS'],  ___:'exp', _obj: pItem, children:[] },
                { _icon: this.icons['STR'],  ___:'strings', _obj: pItem, children:[] },
                { _icon: this.nIcons['SYSCALL'],  ___:'syscalls', _obj: pItem, children:[] },
            ]

            return from([pItem.children as CodeItem[]]);

    }

    switch(pType){
      case 'p':
        data = this.controller.service
          .listPackages( this.selected, '^'+pItem.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+'$')
          .pipe(
            map( (pObs:any)=>{

              pObs[0].children.map((vSelf:any) => {
                vSelf._icon = this.codeService.getIconOf(vSelf._t);


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
      switch (pItem.__) {
          case NodeInternalType.FUNC:
          case NodeInternalType.FILE:
              this.controller.showItem(pItem);
              break;
          default:
              this.controller.open( pItem, 'expl');
              break;

      }
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
      //this.activeItem.el.style.backgroundColor = "#444";
      this.activeItem.el.classList.remove("exp-item-focus");
    }

    this.activeItem = pEvent;
    pEvent.el.classList.add("exp-item-focus");
//    pEvent.el.style.backgroundColor = "#3a4f8e";
  }

  onMenuItemClick( pEvent:any, pForce = false):void{
    // console.log("Code > on menu item click > ",pEvent);
    if(!pForce) (this.view.nav as NavbarSimpleView).selectItem(pEvent.item);
    this.switchView( pEvent.item.id, pForce);
  }


      switchView( pCode:CODE_SUBVIEW, pForce = false):void{

          switch(pCode){
              case CODE_SUBVIEW.APP:
                  this.showApplicationCode();
                  break;
              case CODE_SUBVIEW.APP_LIBS:
                  this.showApplicationLibs();
                  break;
              case CODE_SUBVIEW.ANDROID_API:
              case CODE_SUBVIEW.ANDROID_FWK:
                  this.showOsApi();
                  break;
              case CODE_SUBVIEW.VENDOR:
                  this.showVendorCode();
                  break;
              case CODE_SUBVIEW.ALL:
                  this.showAll();
                  break;
          }

          this.selected = pCode;
      }

    showAll():void{
        this.controller.service
            .listPackages(CODE_SUBVIEW.ALL)
            .subscribe((packages:any) => {
                const frames = Math.round(packages.length/1000);
                this.parent.selectTab( this.offset);
                this.packages[this.selected] = [];


                this.changeDetectorRef.detach();

                let t1 = (new Date()).getTime();


                for(let i=0; i<frames; i++){

                    //console.log('update package');
                    this.packages[this.selected] = this.packages[this.selected].concat(packages.slice(i*1000,(i*1000)+1000));


                    this.changeDetectorRef.markForCheck();
                    //console.log("mark for changes",i*1000);
                }
                if(packages.length%1000>0){
                    //console.log('add modulo slide');
                    this.packages[this.selected] = this.packages[this.selected].concat(packages.slice(frames*1000,packages.length));
                    //this.changeDetectorRef.markForCheck();
                    //console.log("mark for changes LAST");
                }
                this.changeDetectorRef.detectChanges();

                //console.log("ExplorerCode : Rendering : ",((new Date()).getTime()-t1)/1000,"s ");
                //this.changeDetectorRef.detectChanges();

                this.changeDetectorRef.reattach();
                // console.log(this.packages[this.selected]);

            });
    }


    showVendorCode():void{
        this.controller.service
            .listPackages(CODE_SUBVIEW.VENDOR)
            .subscribe((packages:any) => {
                const frames = Math.round(packages.length/1000);
                this.parent.selectTab( this.offset);
                this.packages[this.selected] = [];


                this.changeDetectorRef.detach();

                let t1 = (new Date()).getTime();


                for(let i=0; i<frames; i++){

                    console.log('update package');
                    this.packages[this.selected] = this.packages[this.selected].concat(packages.slice(i*1000,(i*1000)+1000));


                    this.changeDetectorRef.markForCheck();
                    //console.log("mark for changes",i*1000);
                }
                if(packages.length%1000>0){
                    console.log('add modulo slide');
                    this.packages[this.selected] = this.packages[this.selected].concat(packages.slice(frames*1000,packages.length));
                    //this.changeDetectorRef.markForCheck();
                    //console.log("mark for changes LAST");
                }
                this.changeDetectorRef.detectChanges();

                console.log("ExplorerCode : Rendering : ",((new Date()).getTime()-t1)/1000,"s ");
                //this.changeDetectorRef.detectChanges();

                this.changeDetectorRef.reattach();
                // console.log(this.packages[this.selected]);

            });
    }



    showOsApi():void{

        this.codeService
            .merlinSearch(MerlinSearchRequest.fromCondition(
                NodeInternalType.PACKAGE,{  name: "/^[^.]+$/"  }, { not:false }
            ).filter("@discover.internal"))
            .subscribe((packages:any) => {
              let c: any;
              let p = 0;

              const pkgList:CodeItem[] = [];


              packages.map((pPkg: any) => {



                if( !this.tags.INTERNAL.match(pPkg) && (pPkg._t!=null) ){
                  pPkg._icon = this.codeService.getIconOf(pPkg._t);
                }

                ///

                if (pPkg.tags.length == 0 || this.tags.INTERNAL.match(pPkg)) {

                  if(this.tags.STATIC.match(pPkg)){
                    pPkg._icon = this.codeService.getIconOf('p-mx');
                  }else{
                    pPkg._icon = this.codeService.getIconOf('p-di');
                  }

                  c = [];
                  pPkg.children.map((vChild: any) => {
                    if (pPkg._t == 'c') {
                      pPkg._icon = this.icons['CLASS'];
                    } else {
                      pPkg._icon = this.icons['PKG_INT'];
                    }
                    if (this.tags.INTERNAL.match(vChild)) {
                      if (vChild._t == 'c') {
                        vChild._icon = this.icons['CLASS'];
                      } else {
                        vChild._icon = this.icons['PKG'];
                      }
                      vChild._e = true;
                      c.push(vChild);
                    }
                  });
                  pPkg.children = c;
                  pkgList.push(pPkg);
                }
              });

                if(pkgList.length==0){
                    this.reason = "No API/OS code available";
                }

              this.packages[CODE_SUBVIEW.ANDROID_API] = pkgList;
              this.selected = CODE_SUBVIEW.ANDROID_API;
              this.changeDetectorRef.detectChanges();
            });
  }


  showApplicationCode():void{

    this.controller.service
        .listPackages(CODE_SUBVIEW.APP)
        .subscribe((packages:any) => {
          let c: any;
          let p = 0;

          this.packages[CODE_SUBVIEW.APP] = [];

            if(packages.length==0){
                this.reason = "No app code found";
            }

          packages.map((pPkg: any, pIndex: number) => {


            if (p > 0 && (p % 200 === 0)) {
              console.log("detect changes", p);
              //this.changeDetectorRef.detectChanges();
              //this.changeDetectorRef.markForCheck();
            }

            if (this.tags.STATIC.match(pPkg) || this.tags.DYNAMIC.match(pPkg)) {

              if (pPkg._t == 'c') {
                // it happens when a class is not contaiend into a package
                pPkg._icon = this.icons['CLASS'];
                this.packages[CODE_SUBVIEW.APP].push(pPkg);
                p++;

                return;
              }

              c = [];
              pPkg._icon = this.icons['PKG'];

              pPkg.children.map((vChild: any) => {
                if (this.tags.STATIC.match(vChild) || this.tags.DYNAMIC.match(vChild)) {
                  if (vChild._t == 'c') {
                    vChild._icon = this.icons['CLASS'];
                  } else {
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

          console.log("detect changes", p);
          this.changeDetectorRef.detectChanges();

        });
  }

  showApplicationLibs():void {
    this.controller.service
        .listNativeLibraries()
        .subscribe((vLibs:ModelFile[]) => {

          vLibs.map((vFile:any)=>{
            vFile._icon = this.codeService.getIconOf('e');
            vFile.$r = true;
            /*
            if(vFile.__p!=null){
              if(!vFile.__p.hasOwnProperty('f_list')){
                vFile.$r = false;
              }else{
                vFile.children = Object.values(vFile.__p.f_list);
                vFile.children.map((vSelf:any) => {
                  vSelf._icon = this.codeService.getIconOf('m');
                  vSelf.__ = NodeInternalType.FUNC;
                  vSelf._e = true;
                });
              }
            }*/
          });

          this.packages[CODE_SUBVIEW.APP_LIBS] = vLibs as any[];
          this.selected = CODE_SUBVIEW.APP_LIBS;

          if(vLibs.length==0){
              this.reason = "No native libraries found";
          }
          this.changeDetectorRef.detectChanges();
      });
  }
  reset():void {
    this.packages[CODE_SUBVIEW.APP] = [];
    this.packages[CODE_SUBVIEW.APP_LIBS] = [];
    this.packages[CODE_SUBVIEW.ALL] = [];
    this.packages[CODE_SUBVIEW.VENDOR] = [];
    this.packages[CODE_SUBVIEW.ANDROID_FWK] = [];
    this.packages[CODE_SUBVIEW.ANDROID_API] = [];
    this.selected = null; //CODE_SUBVIEW.APP;
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
    //this.onMenuItemClick({ item:{id:this.selected}}, true);
    if(this.selected!=null){
        this.switchView(this.selected);
    }
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

  doSmartRename(pSubject: any) {
    
  }

  /**
   * To add
   *
   * @param subject
   * @param param2
   */
  taint(pSubject: any, pStep: string) {

  }

    checkOpt(pAlias: string, pVal:any = null) {
          this.opts[pAlias] = pVal;
    }

    startEmu(pFn: any) {
        this.nativeSvc.emulate(pFn.__s).subscribe( (pRes:any)=>{
            console.log("EMULATOR CONFIG :",pRes);
        })
    }
}
