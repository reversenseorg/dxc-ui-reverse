import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {ExplorerView} from "../../../cmp/ExplorerView";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import {SubExplorerComponent} from "../../../base/explorer/subexplorer.component";
import {ExplorerTab} from "../../../cmp/ExplorerTab";
import {FileController} from "../ctrl/FileController";
import {ProjectService} from "../../project/ctrl/project.service";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {ExpandableProvider} from "../../../base/expandable-list/expandable-provider";
import {HookController} from "../../hooks/ctrl/HookController";
import {
  ContextMenuComponent,
  ContextMenuList,
  ContextMenuState
} from "../../../base/context-menu/context-menu.component";
import {FILE_ICONS} from "../icons";
import {Observable} from "rxjs";
import {Utils} from "../../../cmp/Utils";
import {FilesystemService} from "../ctrl/FilesystemService";
import {map} from "rxjs/operators";
import {IconModel, IconModelCollection} from "../../../base/icon/IconModel";
import ModelFile from "../../../models/ModelFile";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {ElectronService} from "../../../core/services";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {ContextMenuEvent} from "../../code/ctrl/code-controller.service";
import {UIException} from "../../../base/error/UIException";
import {Nullable} from "../../../base/Nullable";

export enum FS_SUBVIEW {
  PKG,
  APP,
  DEV,
  WS
}


@Component({
  selector: 'app-explorer-file',
  templateUrl: './explorer-file.component.html',
  styleUrls: ['./explorer-file.component.scss'],
  providers: [NgbTooltipConfig]
})
export class ExplorerFileComponent extends SubExplorerComponent<FileController> implements OnInit, AfterViewInit, ExpandableProvider {



  @ViewChild("explFileRef", {read: ElementRef, static:true}) explRef: ElementRef;
  @ViewChild("explFileCtnRef", {read: ElementRef, static:true}) explCtnRef: ElementRef;

  @ViewChildren(ContextMenuComponent) ctxMenuChildren: QueryList<ContextMenuComponent>;

  override id:string = "explorerFile";

  override icons:IconModelCollection = FILE_ICONS;

  override offset:number = 1;



  fsPools: any = {};

  activePool:any = [];
  activePoolID:FS_SUBVIEW = FS_SUBVIEW.PKG;

  ctxMenu: ContextMenuList = {};

  ctxMenuState:ContextMenuState = {
    subject: null
  };

  initialSize:any = null;
  privileged:boolean = false;
  activeItem: any = null;


  /**
   * Flag. TRUE if a project is loaded (ie. data are available), else FALSE
   *
   * @type {boolean}
   * @field
   * @since 1.0.0
   */
  projectReady:boolean = false;

  /**
   *
   * @param {ProjectService} projectSvc
   * @constructor
   *
   */
  constructor( private fsSvc:FilesystemService,
               private electronSvc:ElectronService,
               private projectSvc:ProjectService,

               ngbTooltipConfig:NgbTooltipConfig) {
    super();

    this.tab = new ExplorerTab({
      offset: 1,
      label: 'Data',
      icon: GLOBAL_ICONS['FILE'],
      color: 'dxc-text-clear100'
    });


    this.view = new ExplorerView({
      nav: new NavbarSimpleView({
        label: 'Package',
        icon: GLOBAL_ICONS['PACKAGE'],
        menu: new MenuView({
          items: [
            new MenuItem({
              id: FS_SUBVIEW.PKG,
              label:'App Package',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['PACKAGE']
            }),
            new MenuItem({
              id: FS_SUBVIEW.APP,
              label:'App device data',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['DEVICE']
            }),
            new MenuItem({
              id: FS_SUBVIEW.DEV,
              label:'Device FS',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['FILE']
            }),
            new MenuItem({
              id: FS_SUBVIEW.WS,
              label:'Workspace',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['FOLDER']
            }),
          ]
        })
      })
    });

    this.view.id = this.id;
    ngbTooltipConfig.tooltipClass = "dxc-tooltip";
  }

  ngOnInit(): void {
    this.projectSvc.onProjectReady.subscribe( (pProject:DexcaliburProject)=>{
      this.projectReady = true;
      this.fsSvc.listPackageContent().subscribe( (pFiles:any)=>{
        this.activePool = this.fsPools[FS_SUBVIEW.PKG] = this.sortFiles(pFiles);
      });
    });

    this.projectSvc.onProjectClose.subscribe( (pProject:DexcaliburProject)=>{
      this.projectReady = false;
    });


    this.fsSvc.displayCtxMenu$.subscribe( (pObs:ContextMenuEvent)=>{
      this.displayCtxMenu(pObs.event, pObs.type, pObs.obj);
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
    });

  }

  setPrivileged( pStatus:boolean):void {
    this.privileged = pStatus;
  }

  drawExplorer(pSize:any):void {

    const el = this.explRef.nativeElement; //document.getElementById('explorerCode');
    const ctn = this.explCtnRef.nativeElement; //document.getElementById('explorerCodeCtn');
    const navHeight:number = (this.view as any).nav.size.height;

    el.style.width = pSize.width+'px';
    el.style.maxWidth = pSize.width+'px';
    el.style.height = pSize.height+'px';
    el.style.maxHeight = pSize.height+'px';

    ctn.style.width = pSize.width+'px';
    ctn.style.maxWidth = pSize.width+'px';
    ctn.style.height = (pSize.height-navHeight)+'px';
    ctn.style.maxHeight = (pSize.height-navHeight)+'px';
  }

  expand( pItem:any, pType:string): Observable<any> {
    let data:any = null;

    console.log('Expanding > ',pItem);
    switch(this.activePoolID){
      case FS_SUBVIEW.APP:
        data = this.fsSvc.listDevicePath({
          path:pItem.p,
         // app:this.projectSvc.getPackageID(),
          type:(this.privileged? 'privileged':'user')
        });
        /*if(data!=null){
          data = data.pipe( map((pObs:any)=>{
            return this.sortFiles(pObs, pItem.dev);
          }));
        }*/
        break;
      case FS_SUBVIEW.PKG:
        data = this.fsSvc.listPackageContent(  pItem._r );
        break;
      case FS_SUBVIEW.DEV:
        data = this.fsSvc.listDevicePath( {
          path:encodeURIComponent(pItem.p),
          type:(this.privileged? 'privileged':'user')
        });
        break;
      case FS_SUBVIEW.WS:
        data = this.fsSvc.listWorkspace( pItem.p);
        break;
    }

    if(data!=null){
        data = data.pipe( map((pObs:any)=>{
          return this.sortFiles(pObs);
        }));
    }

    return data;
  }

  open( pItem:any): any {
    this.controller.open( { file:pItem, pool:this.activePoolID }, 'expl');
    return null;
  }

  isExpendable( pItem:any):boolean {
    return (pItem._t=='d' || pItem._t=='l');
  }


  itemHasChildren( pItem:any, pType='p'): boolean {
    return (pType=='d');
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


    this.electronSvc
      .getSelectionManager()
      .selectNode(pEvent.item, this._retrieveShortForm(pEvent));

    if(this.activeItem != null){
      this.activeItem.el.style.backgroundColor = "#444";
    }

    this.activeItem = pEvent;
    pEvent.el.style.backgroundColor = "royalblue";
  }

  sortFiles( pFiles:any): any{
    let t1:any = [],t2:any = [];
    pFiles.map( (vFile:any) => {
      if(vFile._t=='f'){
        t1.push(vFile);
      }else{
        //if(vFile.hasOwnProperty('children')==false)
         // vFile.children = [];
        t2.push(vFile);
        //if(vFile.hasOwnProperty('children')==false) vFile.children = [];
      }
    });
    return t2.concat(t1);
  }

  onMenuItemClick( pEvent:any):void{

    (this.view as any).nav.selectItem(pEvent.item);

    this.activePool = this.fsPools[pEvent.item.id];
    this.activePoolID = pEvent.item.id;
    switch(pEvent.item.id){
      case FS_SUBVIEW.APP:

        const p = this.projectSvc.getSelectedProject();

        if(p==null){
          throw UIException.PROJECT_IS_NOT_READY("explorer-file","on menu click");
        }
        this.fsSvc.listDevicePath({
          app:p.package, //.getPackageID(),
          type:(this.privileged? 'privileged':'user')
        }).subscribe( (pFiles:any)=>{
          this.activePool = this.fsPools[FS_SUBVIEW.APP] = this.sortFiles(pFiles);
        });
        break;
      case FS_SUBVIEW.PKG:
        this.fsSvc.listPackageContent().subscribe( (pFiles:any)=>{
          this.activePool = this.fsPools[FS_SUBVIEW.PKG] = this.sortFiles(pFiles);
        });
        break;
      case FS_SUBVIEW.DEV:
        this.fsSvc.listDevicePath( {
          type:(this.privileged? 'privileged':'user')
        }).subscribe( (pFiles:any)=>{
          this.activePool = this.fsPools[FS_SUBVIEW.DEV] = this.sortFiles(pFiles);
        });
        break;
      case FS_SUBVIEW.WS:
        this.fsSvc.listWorkspace().subscribe( (pFiles:any)=>{
          this.activePool = this.fsPools[FS_SUBVIEW.WS] = this.sortFiles(pFiles);
        });
        break;
    }

  }

  displayCtxMenu(pEvent:any, pType:string, pObject:any):void{
    let type:string = pType;
    pEvent.preventDefault();

    try{
      if([FS_SUBVIEW.DEV,FS_SUBVIEW.APP].indexOf(this.activePoolID)>-1 ){
        type = (pType=='dir' ? 'ddir' : 'dir');
      }

      this.ctxMenuState = {
        menu: this.ctxMenu[pType],
        subject: pObject
      };
      this.ctxMenu[pType].show(pEvent, pObject);
    }catch(e:any){
      console.error(e.message())
    }

  }

  hideCtxMenu():void{

    if(this.ctxMenuState==null){
      throw UIException.CTX_MENU_NOT_READY("explorer-file","hideCtxMenu");
    }
    if(this.ctxMenuState.menu!=null){
      this.ctxMenuState.menu.hide(this.ctxMenuState.subject);
    }
  }

  refresh() {

  }

  getIconForType(pType: any):IconModel {
    switch (pType.t) {
      case 'XML':
        return this.icons['XML'];
      case 'PNG':
        return this.icons['PNG'];
      case 'ELF':
        return this.icons['BIN'];
      default:
        return this.icons['FILE'];
    }
  }

  fileIdentify( pIndex:number, pItem:any):string {
    //console.log(pItem);
    return pItem.p;
  }


  private _retrieveShortForm( pEl:any):string {

    switch(pEl.item._t){
      case "dev":
        return pEl.item.model+" [id="+pEl.item.id+"]";
        break;
      case "apkg":
        return pEl.item.packageIdentifier;
        break;
      case "p":
        return pEl.item.PID; //+" "+pEl.item.USER+" "+pEl.item.NAME;
        break;
      case "d":
        return pEl.item._r;
        break;
      default:
        if(pEl.item.__ == NodeInternalType.FILE){
          return pEl.item.p;
        }else{
          return "";
        }
        break;
    }
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
    console.log(subject,n);
    if(n !== null) {
      if(n.indexOf('.')==-1){
        this.electronSvc.writeToClipboard(subject[n]);
      }else{
        console.log(subject,n);
        //this.electronSvc.writeToClipboard(subject[n]);
      }
    }else
      this.electronSvc.writeToClipboard(subject);
  }

  /**
   * To do an action on a folder from the device
   *
   * @param subject
   * @param rm
   */
  doDeviceDir(subject: any, rm: string) {
    return null;
  }
}
