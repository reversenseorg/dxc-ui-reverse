import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ExplorerTab} from "../../../cmp/ExplorerTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ExplorerView} from "../../../cmp/ExplorerView";
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {SubExplorerComponent} from "../../../base/explorer/subexplorer.component";
import {HookController} from "../ctrl/HookController";
import {ExpandableProvider} from "../../../base/expandable-list/expandable-provider";
import {empty, from, Observable} from "rxjs";
import {CodeItem} from "../../code/explorer-code/CodeItem";
import {HOOK_ICONS} from "../icons";
import Hook from "../../../models/Hook";
import {
  ContextMenuComponent, ContextMenuEvent,
  ContextMenuList,
  ContextMenuState
} from "../../../base/context-menu/context-menu.component";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import {ProjectService} from "../../project/ctrl/project.service";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {HOOK_TARGET_TYPE, HookFragmentPresetOptions, HookFragmentPresetType, HookService} from "../ctrl/hook.service";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {HOOK_SESSION_CMD, HookSession} from "../ctrl/HookSession";
import HookSet from "../../../models/HookSet";
import {ModalProjectAnalConfigComponent} from "../../project/modal-project-anal-config/modal-project-anal-config.component";
import {ModalHookJavaNewComponent} from "../modal-hook-java-new/modal-hook-java-new.component";
import KeyPoint from "../../../models/KeyPoint";
import {map} from "rxjs/operators";
import {AbstractHook} from "../../../models/AbstractHook";
import {ModalNewFragmentComponent} from "../modal-new-fragment/modal-new-fragment.component";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {Inspector} from "../../../models/Inspector";
import {InspectorService} from "../../inspector/ctrl/inspector.service";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {UIException} from "../../../base/error/UIException";
import {Nullable} from "../../../base/Nullable";
import NativeFunctionHook from "../../../models/NativeFunctionHook";
import JavaMethodHook from "../../../models/JavaMethodHook";


interface HookPoolFacets {
  [facet:string] :HookPool
}

interface HookPool  {
  [name:string] :HookSet[]
}



export interface HookPoolMap {
  hook: { app: (NativeFunctionHook | JavaMethodHook | AbstractHook)[] },
  keyp: { app: KeyPoint[] },
  inspector: { app: Inspector[] },
  sessions: { app: HookSession[] },
  thema: { app:any[] },
  process: { app:any[] },
  thread: { app:any[] }

};


export enum HOOK_VIEW {
  HOOK = 'hook',
  KP = 'keyp',
  THEMA = 'thema',
  PROCESS = 'process',
  THREAD = 'thread',
  INSPECTOR = 'inspector',
  SESSIONS = 'sessions',
}

@Component({
  selector: 'app-explorer-hooks',
  templateUrl: './explorer-hooks.component.html',
  styleUrls: ['./explorer-hooks.component.scss'],
  providers: [NgbTooltipConfig]
})
export class ExplorerHooksComponent extends SubExplorerComponent<HookController> implements OnInit, AfterViewInit, ExpandableProvider {



  @ViewChild("explHookRef", {read: ElementRef, static:true}) explHookRef: ElementRef;
  @ViewChild("explHookCtnRef", {read: ElementRef, static:true}) explHookCtnRef: ElementRef;

  @ViewChildren(ContextMenuComponent) ctxMenuChildren: QueryList<ContextMenuComponent>;


  PRESET_HOOK = HookFragmentPresetType;

  NODE_TYPES:any = NodeInternalType;

  override id:string = "explorerHook";

  override offset:number = 2;

  HOOK_JAVA = NodeInternalType.HOOK_JAVA;
  HOOK_NATIVE = NodeInternalType.HOOK_NATIVE;

  override icons: any = HOOK_ICONS;

  hookPoolsIcons:any =  {
    /*builtin: HOOK_ICONS['BUILTIN_HS'],
    onDemand: HOOK_ICONS['CUSTOM_HS'],
    native: HOOK_ICONS['NATIVE_HS'],
    dynamic: HOOK_ICONS['CUSTOM_HS'],*/
    thema: HOOK_ICONS['CUSTOM_HS'],
    keypoint: HOOK_ICONS['KEYPOINT'],
    process: HOOK_ICONS['PROCESS'],
    thread: HOOK_ICONS['THREAD'],
    sessions: GLOBAL_ICONS['HISTORY']
  };

  hookPools: HookPoolMap = {
    [HOOK_VIEW.KP]: { app:[] },
    [HOOK_VIEW.HOOK]: { app:[] },
    [HOOK_VIEW.THEMA]: { app:[] },
    [HOOK_VIEW.PROCESS]: { app:[] },
    [HOOK_VIEW.THREAD]: { app:[] },
    [HOOK_VIEW.INSPECTOR]: { app:[] },
    [HOOK_VIEW.SESSIONS]: { app:[] }
  };

  ctxMenu: ContextMenuList = {};

  ctxMenuState:ContextMenuState = { subject: null };


  selected:string = HOOK_VIEW.KP;



  activeItem: any = null;


  /**
   * Flag. TRUE if a project is loaded (ie. data are available), else FALSE
   *
   * @type {boolean}
   * @field
   * @since 1.0.0
   */
  projectReady:boolean = false;
  running:boolean = false;


  @ViewChild(ModalHookJavaNewComponent) modalJavaNew:ModalHookJavaNewComponent;
  @ViewChild(ModalNewFragmentComponent) modalFragEdit:ModalNewFragmentComponent;
  activePool: any = {};


  constructor( private projectSvc:ProjectService,
               private hookSvc:HookService,
               private inspSvc:InspectorService,
               private outputSvc:OutputService,

               ngbTooltipConfig:NgbTooltipConfig) {
    super();

    this.tab = new ExplorerTab({
      offset: 1,
      label: 'Hooks',
      icon: GLOBAL_ICONS['HOOKS'],
      color: 'dxc-text-clear100'
    });

    this.view = new ExplorerView({
      nav: new NavbarSimpleView({
        label: 'Key Points',
        icon: HOOK_ICONS['KEYPOINT'],
        color: 'dxc-text-clear100',
        menu: new MenuView({
          items: [
            new MenuItem({
              id:HOOK_VIEW.KP,
              label:'Key Points',
              color: 'dxc-text-clear75',
              icon: HOOK_ICONS['KEYPOINT']
            }),
            new MenuItem({
              id:HOOK_VIEW.HOOK,
              label:'Hooks',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['HOOKS']
            }),
            new MenuItem({
              id:HOOK_VIEW.INSPECTOR,
              label:'Inspectors',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['TOOLS']
            }),
            new MenuItem({
              id:HOOK_VIEW.THEMA,
              label:'Strategies',
              color: 'dxc-text-clear75',
              icon: HOOK_ICONS['CUSTOM_HS']
            }),
            new MenuItem({
              id:HOOK_VIEW.SESSIONS,
              label:'Sessions',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['HISTORY']
            }),
            new MenuItem({
              id:HOOK_VIEW.THREAD,
              label:'Thread',
              color: 'dxc-text-clear75',
              icon: HOOK_ICONS['THREAD']
            })
          ]
        })
      })
    });

    //this.hookPools['java'] = [];
    //this.hookPools['native'] = [];
    this.reset();
    this.view.id = this.id;
    ngbTooltipConfig.tooltipClass = "dxc-tooltip"
  }


  ngOnInit(): void {


    this.hookSvc.displayCtxMenu$.subscribe( (pObs:ContextMenuEvent)=>{
      this.displayCtxMenu(pObs.event, pObs.type, pObs.obj);
    });


    this.hookSvc.refresh$.subscribe( pEvent => {
      this.refresh();
    });

    // refresh
    this.hookSvc.onHookEdit.subscribe( pEvent => {
      const OP = this.hookSvc.HKOP;
      switch (pEvent.ope) {
        case OP.REMOVED:
        case OP.CREATED:
          this.refresh();
          break;
      }
    })

    this.projectSvc.onProjectReady.subscribe( (pProject:DexcaliburProject)=>{
        this.projectReady = true;
        this.refresh();
    });

    this.projectSvc.onProjectClose.subscribe( (pProject:DexcaliburProject)=>{
      this.projectReady = false;
      this.reset();
    });

    this.hookSvc.onNewKp.subscribe( pEvent => {
      this.refresh();
    });

    this.hookSvc.onNewSession.subscribe( (pSession:any)=>{
      this.running = true;
    });

    this.hookSvc.onCreateHook.subscribe( (pOptions:any)=>{

      if(pOptions.target!=null){
        switch (pOptions.target.__){
          case NodeInternalType.METHOD:
          case NodeInternalType.FUNC:
            this.modalJavaNew.show(pOptions.type, pOptions.target, pOptions);
            break;
          case NodeInternalType.INSTR_CPU:
            this.modalJavaNew.show(pOptions.type, pOptions.target, pOptions);
            break;
          case NodeInternalType.SYSCALL:
            //this.modalInterruptorConfig.show();
            break;
        }
      }else{

      }
    });

    // change 'run' button state if an error occurs during hook session starting
    this.hookSvc.onHookError.subscribe( (pEvent)=>{
      switch(pEvent.msg.action){
        case HOOK_SESSION_CMD.START:
          this.running = false;
          break;
      }
    })

    this.hookSvc.onEditFragment.subscribe( (pOptions:any)=>{
      this.modalFragEdit.show(pOptions);
    })

    this.hookSvc.onMenuClick
      .subscribe( (pEvent: any) => {
        console.log("this.hookSvc.onMenuClick > ",pEvent);
        switch (pEvent.item){
          case HOOK_TARGET_TYPE.KP:
            this.parent.selectTab( this.offset);
            break;
        }
      });

    this.hookSvc.onKeyPointListChange.subscribe( (pKPs:KeyPoint[])=>{
      this._refreshKeyPointList(pKPs);
    });
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

  drawExplorer(pSize:any):void {

    const el = this.explHookRef.nativeElement; //document.getElementById('explorerCode');
    const ctn = this.explHookCtnRef.nativeElement; //document.getElementById('explorerCodeCtn');
    const navHeight:number = (this.view as any).nav.size.height;


    el.style.width = '100%';
//    el.style.width = pSize.width+'px';
//    el.style.maxWidth = pSize.width+'px';
    el.style.height = pSize.height+'px';
    el.style.maxHeight = pSize.height+'px';


    ctn.style.width = '100%';
//    ctn.style.width = pSize.width+'px';
//    ctn.style.maxWidth = pSize.width+'px';
    ctn.style.height = (pSize.height-navHeight)+'px';
    ctn.style.maxHeight = (pSize.height-navHeight)+'px';
  }

  expand( pItem:any, pType:string): Observable<any> {
    let data:any = null;

    console.log("Expand ...",pItem);
    if(pItem._t == 'kp'){
      return this.hookSvc.getHooksByKeyPoint( pItem).pipe( map( (pHooks:any)=>{
        console.log(pHooks);
        pItem.children = [{
          _t: 'kt',
          name: 'load',
          _icon : HOOK_ICONS['HK_LOAD'],
          children: []
        },{
          _t: 'kt',
          name: 'unload',
          _icon : HOOK_ICONS['HK_UNLOAD'],
          children: []

        }];
        pHooks.load.map((x:any) => {         x._t = 'h';
          x._icon = GLOBAL_ICONS['HOOKS'];
          x._kt = 'load';
          pItem.children[0].children.push(x);
        });
        pHooks.unload.map((x:any) => {         x._t = 'h';
          x._icon = GLOBAL_ICONS['HOOKS'];
          x._kt = 'unload';
          pItem.children[1].children.push(x);
        });

        console.log(pItem.children);

        return pItem.children;
      }));
    }else{
      return from([]);
    }
  }

  open( pItem:any): any {
    this.controller.open( pItem, 'expl');
    return null;
  }


  isExpendable( pItem:any):boolean {
    return (pItem.children !=null || pItem._t=='kp'); // && pItem.children.length>0);
  }

  itemHasChildren( pItem:any, pType='p'): boolean {
    return ['c','p','kp'].indexOf(pItem._t)>-1; //(pType=='c'||pType=='p'||pType=='kp');
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

    if(this.activeItem != null){
      this.activeItem.el.style.backgroundColor = "#444";
    }

    this.activeItem = pEvent;
    pEvent.el.style.backgroundColor = "royalblue";
  }

  /**
   * callback invoked when an entry is selected into main dropdown menu
   * from explorer navbar
   *
   * @param pEvent
   * @param pForce
   */
  onNavbarItemClick( pEvent:any, pForce:boolean = false):void{

    console.log(pEvent, this);

    if(!pForce)
      (this.view as any).nav.selectItem(pEvent.item);

    this.refresh(pEvent.item.id);
    this.selected = pEvent.item.id;
  }


  displayCtxMenu(pEvent:any, pType:string, pObject:any, pExtra:any = null):void{
    pEvent.preventDefault();

    this.ctxMenuState = {
      menu: this.ctxMenu[pType],
      subject: pObject
    };
    this.ctxMenu[pType].show(pEvent, pObject, pExtra);
  }

  hideCtxMenu():void{

    if(this.ctxMenuState==null){
      throw UIException.CTX_MENU_NOT_READY("explorer-hooks","hideCtxMenu");
    }
    if(this.ctxMenuState.menu!=null){
      this.ctxMenuState.menu.hide(this.ctxMenuState.subject);
    }
  }

  editKP(pKeyPoint:KeyPoint) {
    this.controller.open(pKeyPoint,'expl');
    //this.hookSvc.onCreateKeyPoint.next(pKeyPoint);
    //this.hookSvc.getKeyPointsFor()
  }

  deleteKP(pKeyPoint:KeyPoint) {
    this.hookSvc.deleteKeyPoint(pKeyPoint).subscribe( vRes => {
      console.log(vRes);
      if(vRes.success){
        this.refresh();
      }else{
        this.hookSvc.deleteKeyPoint(pKeyPoint, true).subscribe( vRes => {
          this.refresh();
        });
      }
    });
  }

  /**
   * To enable/disavble
   * @param pKeyPoint
   */
  enableKP(pKeyPoint:KeyPoint) {
    this.hookSvc.enableKeyPoint(pKeyPoint, pKeyPoint.enabled?false:true ).subscribe( vRes => {
      pKeyPoint.enabled = (pKeyPoint.enabled? false : true);
      (pKeyPoint as any)._icon = HOOK_ICONS['KEYPOINT_DOWN'];
      this.refresh();
    });
  }


  /**
   * To start or stop hooking
   *
   * @param pStatus
   */
  turnHooking( pStatus: boolean) {


    if (pStatus){


      if(this.controller.app==null){
        throw  UIException.APP_NOT_INITIALIZED();
      }

      const p = this.projectSvc.getSelectedProject();

      if(p==null){
        throw UIException.PROJECT_IS_NOT_READY("explorer-file","on menu click");
      }

      // TODO replace default Options by Hook settings
      this.hookSvc.startWebsocketHookSession(
        this.controller.app.ws,
        p,
        {
          // use default mode instead of spawn
          // type: "spawn-self"
        });

    }else{
      this.hookSvc.killApp().subscribe( (pData:any)=>{
        this.outputSvc.print(new OutputMessage({ msg:"Instrumentation has been stopped [Application killed]",  src:"Hook Manager" }));
        this.running = false;
      });
    }
  }

  /**
   * To reset the state of the explorer.
   *
   * The purpose of this method is to clean explorer state when the user
   * close the active project or switch to another project.
   *
   * @return {void}
   * @method
   */
  reset():void {
    this.hookPools = {
      /*builtin: { app:[] },
      onDemand: { app:[] },
      native: { app:[] },
      dynamic: { app:[] },*/
      [HOOK_VIEW.KP]: { app:[] },
      [HOOK_VIEW.INSPECTOR]: { app:[] },
      [HOOK_VIEW.HOOK]: { app:[] },
      [HOOK_VIEW.THEMA]: { app:[] },
      [HOOK_VIEW.PROCESS]: { app:[] },
      [HOOK_VIEW.THREAD]: { app:[] },
      [HOOK_VIEW.SESSIONS]: { app:[] },
    };
    this.running = false;
    this.ctxMenuState = {subject:null};
    this.selected = HOOK_VIEW.KP;
  }

  /**
   * To prepare a list of key points to be rendered
   *
   * The purpose of this method is to add some extra content
   * to keypoints object to customize its render
   *
   * @param pKPS {KeyPoint[]} List of keypoints
   * @return {void}
   * @private
   */
  private _refreshKeyPointList( pKPS:KeyPoint[]):void {
    console.log(pKPS);
    this.hookPools[HOOK_VIEW.KP].app = pKPS;
    this.activePool = this.hookPools[HOOK_VIEW.KP];
    this.hookPools[HOOK_VIEW.KP].app.map((x:any) => {     x._icon = HOOK_ICONS['KEYPOINT'];
      if(x.name == null){
        x.name = "core."+x.condition+(x.node.lengt>0 ? "."+x.node[0].uid : "");
      }

      if(x.condition != null){
        const conds = x.condition.split('_');
        switch (conds[0]) {
          case "pkgkp":
          case "clskp":
          case "mthkp":
          case "fldkp":
            x._decor = 'JAVA';
            break;
          case "flkp":
            x._decor = 'LIB';
            break;
          case "fnkp":
            x._decor = 'NATIVE';
            break;
        }
      }
      x._t = 'kp';
      if(x.children.length ==0) x.children = [{ _t:'wait' }];
    })
  }

  /**
   * To refresh the data and to displayed it into hook explorer
   *
   * @method
   */
  refresh( pSelected:Nullable<string> = null) {

    if(!this.projectReady){
      // cannot refresh until the project is ready
      return;
    }

    if(pSelected == null){
      pSelected = this.selected;
    }

    console.log(pSelected);
    switch(pSelected){
      case HOOK_VIEW.HOOK:
        this.controller.service
          .getAllHooks()
          .subscribe((hooks:AbstractHook[]) => {

            console.log("Hook Explorer > refresh > ",hooks);
            this.activePool = this.hookPools[HOOK_VIEW.HOOK] = { app:hooks };


              /*
              if(vHS.builtin)
                this.hookPools.builtin.app.push(vHS);
              else if(vHS.native)
                this.hookPools.native.app.push(vHS);
              else if(vHS.dynamic)
                this.hookPools.dynamic.app.push(vHS);
              else
                this.hookPools.onDemand.app.push(vHS);*/
          });
        break;
      case HOOK_VIEW.INSPECTOR:
        this.inspSvc.getAll(true).subscribe( (pInsps:Inspector[])=>{
          console.log(pInsps)
          this.hookPools[HOOK_VIEW.INSPECTOR].app = pInsps;
          this.activePool = this.hookPools[HOOK_VIEW.INSPECTOR];
        });
        break;
      case HOOK_VIEW.SESSIONS:
        this.hookSvc.getSessions().subscribe( (pSess:HookSession[])=>{
          this.hookPools[HOOK_VIEW.SESSIONS].app = pSess;
          this.activePool = this.hookPools[HOOK_VIEW.SESSIONS];
          console.log(this.activePool);
        });
        break;
      default:
      case HOOK_VIEW.KP:
        this.hookSvc.listKeyPoints().subscribe( (pKPs:KeyPoint[])=>{
          this._refreshKeyPointList(pKPs);
        });
        break;
    }



    /*
    this.controller.service
      .listHooks()
      .subscribe((hooks:HookSet[]) => {
        this.hookPools = {
          builtin: { app:[] },
          onDemand: { app:[] },
          native: { app:[] },
          dynamic: { app:[] },
          kp: { app:[] },
        };
        hooks.map((vHS:any) => {         if(vHS.builtin)
            this.hookPools.builtin.app.push(vHS);
          else if(vHS.native)
            this.hookPools.native.app.push(vHS);
          else if(vHS.dynamic)
            this.hookPools.dynamic.app.push(vHS);
          else
            this.hookPools.onDemand.app.push(vHS);
        })
      });*/
  }


  /**
   * To open final agent script into an editor
   */
  editScript( pMode:string){

    // replace icon by spinner

    this.hookSvc.buildAgentScript().subscribe( (vScript:string) => {
      // replace spinner by icon
      if(pMode=='dl'){
        // save / IPC / ...
      }else{
        this.controller.open({ _t:'s', script:vScript }, 'expl');
      }
    });
  }
}
