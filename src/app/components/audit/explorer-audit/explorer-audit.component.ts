import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {ExplorerView} from "../../../cmp/ExplorerView";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import {SubExplorerComponent} from "../../../base/explorer/subexplorer.component";
import {ExplorerTab} from "../../../cmp/ExplorerTab";
import {ProjectService} from "../../project/ctrl/project.service";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {ExpandableProvider} from "../../../base/expandable-list/expandable-provider";
import {
  ContextMenuComponent,
  ContextMenuList,
  ContextMenuState
} from "../../../base/context-menu/context-menu.component";
import {from, Observable} from "rxjs";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {ElectronService} from "../../../core/services";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {CodeControllerService, ContextMenuEvent} from "../../code/ctrl/code-controller.service";
import {AuditController} from "../ctrl/AuditController";
import {AuditService} from "../ctrl/audit.service";
import AssuranceModel from "../../../models/audit/common/AssuranceModel";
import ControlAssessment from "../../../models/audit/common/ControlAssessment";
import Control from "../../../models/audit/common/Control";
import {UIException} from "../../../base/error/UIException";
import {Nullable} from "../../../base/Nullable";
import {ICON_TYPE} from "../../../base/icon/IconModel";
export enum AUDIT_SUBVIEW {
  THREATS="threat",
  PII='pii',
  MODEL='model',
  REPORT='report'
}
@Component({
  selector: 'app-explorer-audit',
  templateUrl: './explorer-audit.component.html',
  styleUrls: ['./explorer-audit.component.scss'],
  providers: [NgbTooltipConfig]
})
export class ExplorerAuditComponent extends SubExplorerComponent<AuditController> implements OnInit, AfterViewInit, ExpandableProvider {


  @Input() override controller!:AuditController;
  @Input() override parent!:any;

  @ViewChild("explAuditRef", {read: ElementRef, static:true}) explRef!: ElementRef;
  @ViewChild("explAuditCtnRef", {read: ElementRef, static:true}) explCtnRef!: ElementRef;

  @ViewChildren(ContextMenuComponent) ctxMenuChildren!: QueryList<ContextMenuComponent>;

  override id = "explorerAudit";
  override app:any = null;

  override gIcons: any = GLOBAL_ICONS;

  override offset = 6;



  ctxMenu: ContextMenuList = {};

  ctxMenuState:ContextMenuState = { subject: null };

  activeItem: any = null;


  dataPool:{[name:string] :any[]} = {
    [AUDIT_SUBVIEW.MODEL]: [],
    [AUDIT_SUBVIEW.REPORT]: [],
  }

  activePool: any[] = [];

  selected = AUDIT_SUBVIEW.MODEL;


  private projectReady = false;



  /**
   *
   * @param {ProjectService} projectSvc
   * @constructor
   *
   */
  constructor( private auditSvc:AuditService,

               private codeSvc:CodeControllerService,
               private electronSvc:ElectronService,
               private projectSvc:ProjectService,

               ngbTooltipConfig:NgbTooltipConfig) {

    super();
    this.tab = new ExplorerTab({
      offset: 0,
      label: 'Audit',
      icon: GLOBAL_ICONS['FILE'],
      color: 'dxc-text-clear100'
    });

    this.view = new ExplorerView({
      nav: new NavbarSimpleView({
        selected: AUDIT_SUBVIEW.MODEL,
        icon: GLOBAL_ICONS['PACKAGE'],
        menu: new MenuView({
          items: [
            new MenuItem({
              id: AUDIT_SUBVIEW.MODEL,
              label:'Model',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['PACKAGE']
            }),
            new MenuItem({
              id: AUDIT_SUBVIEW.REPORT,
              label:'Report',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['FIND']
            })
          ]
        })
      })
    });
    this.view.id = this.id;
    ngbTooltipConfig.tooltipClass = "dxc-tooltip";
  }

  ngOnInit(): void {

    this.auditSvc.getModels().subscribe( (pModels)=>{
      this.dataPool[AUDIT_SUBVIEW.MODEL] = pModels;
      return ;
    });

    this.projectSvc.onProjectReady.subscribe( (pProject:DexcaliburProject)=>{
      this.projectReady = true;

      this.auditSvc.getModels().subscribe( (pModels)=>{
        this.dataPool[AUDIT_SUBVIEW.MODEL] = pModels;
        return ;
      });

      this.auditSvc.getReports().subscribe( (pReports)=>{
        this.dataPool[AUDIT_SUBVIEW.REPORT] = pReports;
        return ;
      });



      this.refresh();
    });

    this.projectSvc.onProjectClose.subscribe( (pProject:DexcaliburProject)=>{
      this.projectReady = false;
    });


    this.auditSvc.displayCtxMenu$.subscribe( (pObs:ContextMenuEvent)=>{
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
    this.ctxMenuChildren.toArray().map( (vMenu:ContextMenuComponent) => {
      if(vMenu.name!=null){
        this.ctxMenu[vMenu.name] = vMenu;
      }

    });

  }



  /**
   * To refresh the data and to displayed it into hook explorer
   */
  refresh( pSelected:any = AUDIT_SUBVIEW.MODEL) {

    if (pSelected == null) {
      pSelected = this.selected;
    }


    switch (pSelected) {
      case AUDIT_SUBVIEW.MODEL:
        this.controller.service
          .getModels()
          .subscribe((vModel) => {
            this.dataPool[AUDIT_SUBVIEW.MODEL] = vModel;
          });
        break;
      case AUDIT_SUBVIEW.REPORT:
        this.controller.service
          .getReports()
          .subscribe((vModel) => {
            this.dataPool[AUDIT_SUBVIEW.REPORT] = vModel;
          });
        break;
    }
  }

  drawExplorer(pSize:any):void {

    const el = this.explRef.nativeElement; //document.getElementById('explorerCode');
    const ctn = this.explCtnRef.nativeElement; //document.getElementById('explorerCodeCtn');
    const navHeight:number = (this.view.nav as NavbarSimpleView).size.height;


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

    if(pItem instanceof AssuranceModel){
      console.log("audit > assurance model");
      data =  pItem.controls;
    }
    else if(pItem instanceof Control){
      console.log("audit > control");
      // @ts-ignore
      data =  [].concat(pItem.children).concat(pItem.assessments);
    }
    else if(pItem instanceof ControlAssessment){
      console.log("audit > ControlAssessment");
      data =  pItem.rules;
    }
    else{
      console.log("audit > ???");
      data =  [];
    }



    return from( [data]);
  }

  open( pItem:any): any {

    console.log('Audit > OPEN > ',pItem);
    this.controller.open( pItem , 'expl');
    return null;
  }

  isExpendable( pItem:any):boolean {
    if(pItem instanceof AssuranceModel){
      return true;
    }
    else if(pItem instanceof Control){
      return (pItem.children.length>0)||(pItem.assessments.length>0);
    }
    else if(pItem instanceof ControlAssessment){
      return (pItem.rules.length>0);
    }

    return false;
  }


  itemHasChildren( pItem:any, pType ='p'): boolean {
    return (pItem.controls!=null)||(pItem.children!=null);
  }

  itemHasLazyChildren( pItem:any, pType ='p'): boolean {
    let children:any[] = [];

    if(pItem.controls!=null)
      children = pItem.controls;
    else if(pItem.children!=null)
      children= pItem.children;
    else
      return false;

    return (children.length==1 && children[0]._t=="wait");
  }


  itemGetChildren( pItem:any):any[]{

    if(pItem instanceof AssuranceModel){
      return pItem.controls;
    }
    else if(pItem instanceof Control){
      // @ts-ignore
      return  [].concat(pItem.children).concat(pItem.assessments);
    }
    else if(pItem instanceof ControlAssessment){
      return pItem.rules;
    }
    else{
      return [];
    }
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

  onMenuItemClick( pEvent:any):void{
    this.refresh(pEvent.item.id);
    this.selected = pEvent.item.id;
    (this.view.nav as NavbarSimpleView).selectItem(pEvent.item);
  }

  displayCtxMenu(pEvent:any, pType:string, pObject:any):void{
    pEvent.preventDefault();

    try{
      this.ctxMenuState = {
        menu: this.ctxMenu[pType],
        subject: pObject
      };
      this.ctxMenu[pType].show(pEvent, pObject);
    }catch(e:any){
      console.error(e.message)
    }

  }

  hideCtxMenu():void{

    if(this.ctxMenuState==null){
      throw UIException.CTX_MENU_NOT_READY("explorer-audit","hideCtxMenu");
    }
    if(this.ctxMenuState.menu!=null){
      this.ctxMenuState.menu.hide(this.ctxMenuState.subject);
    }
  }


  private _retrieveShortForm( pEl:any):string {
    return "";
  }


  scanModel( pModel:AssuranceModel) {
    this.open(pModel)
  }

    protected readonly ICON_TYPE = ICON_TYPE;
}
