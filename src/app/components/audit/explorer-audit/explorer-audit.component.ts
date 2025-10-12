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
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {ExplorerView} from "../../../cmp/ExplorerView";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import {SubExplorerComponent} from "../../../base/explorer/subexplorer.component";
import {ExplorerTab} from "../../../cmp/ExplorerTab";
import {ProjectService} from "../../project/ctrl/project.service";
import {ExpandableProvider} from "../../../base/expandable-list/expandable-provider";
import {
  ContextMenuComponent, ContextMenuEvent,
  ContextMenuList,
  ContextMenuState
} from "../../../base/context-menu/context-menu.component";
import {from, Observable} from "rxjs";
import {ClipboardService} from "../../../core/services/clipboard.service";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import {AuditController} from "../ctrl/AuditController";
import {AuditService} from "../ctrl/audit.service";
import AssuranceModel from "../../../models/audit/common/AssuranceModel";
import ControlAssessment from "../../../models/audit/common/ControlAssessment";
import Control from "../../../models/audit/common/Control";
import {UIException} from "../../../base/error/UIException";
import {ICON_TYPE} from "../../../base/icon/IconModel";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {Nullable} from "../../../base/Nullable";

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
  providers: [NgbTooltipConfig],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerAuditComponent extends SubExplorerComponent<AuditController> implements OnInit, AfterViewInit, ExpandableProvider {


  _NODE = NodeInternalType;

  @Input() override controller!:AuditController;
  @Input() override parent!:any;

  @ViewChild("explAuditRef", {read: ElementRef, static:true}) explRef!: ElementRef;
  @ViewChild("explAuditCtnRef", {read: ElementRef, static:true}) explCtnRef!: ElementRef;

  @ViewChildren(ContextMenuComponent) ctxMenuChildren!: QueryList<ContextMenuComponent>;

  override id = "explorerAudit";
  override app:any = null;

  override gIcons: any = GLOBAL_ICONS;

  override offset = 5;

  ctxMenu: ContextMenuList = {};
  ctxMenuState:ContextMenuState = { subject: null };

  activeItem: any = null;


  dataPool:{[name:string] :any[]} = {
    [AUDIT_SUBVIEW.MODEL]: [],
    [AUDIT_SUBVIEW.REPORT]: [],
  }

  selected = AUDIT_SUBVIEW.MODEL;
  focus:Nullable<string> = null;

  /**
   *
   * @param {ProjectService} projectSvc
   * @constructor
   *
   */
  constructor( private auditSvc:AuditService,
               private outputSvc:OutputService,
               private codeSvc:CodeControllerService,
               private electronSvc:ClipboardService,
               private projectSvc:ProjectService,
               private changeDetectorRef:ChangeDetectorRef,
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

    this.auditSvc.displayCtxMenu$.subscribe( (pObs:ContextMenuEvent)=>{
      this.displayCtxMenu(pObs.event, pObs.type, pObs.obj);
    });

    this.onDisplay$.subscribe( (vEvent:any)=>{

      console.log("EXPL > Audit > onDisplay$ > ",vEvent);
      switch (vEvent.evt){
        default:
        case 'show':
          this.refresh(this.selected);
          break;
      }
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
    if (pSelected == null) {
      pSelected = AUDIT_SUBVIEW.MODEL;
    }

    console.log("REFRESH MODELS > selected > ",pSelected);

    let obs:Observable<any[]>;
    switch (pSelected) {
      case AUDIT_SUBVIEW.MODEL:
        obs = this.controller.service
          .getModels();
        break;
      case AUDIT_SUBVIEW.REPORT:
        obs = this.controller.service.getReports();
        break;
      default:
        return;
    }

    if(obs!=null){
      obs.subscribe((vObj) => {
        this.dataPool[pSelected] = vObj;
        console.log("REFRESH MODELS > selected > ",vObj);
        this.changeDetectorRef.detectChanges();
      });
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
      //data =  pItem.controls;
      return this.auditSvc.getControlsOf((pItem as AssuranceModel).getID());
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
    switch (pItem.__){
      case NodeInternalType.ASSURANCE_MODEL: this.focus = pItem.id; break;
      case NodeInternalType.ASSURANCE_REPORT: this.focus = pItem._uid; break;
    }

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

    const activeProject = this.projectSvc.getSelectedProject();

    //this.open(pModel)
    if(activeProject==null){
      this.outputSvc.alert( OutputMessage.newError({
        msg: "Scan cannot be ordered : you must select a project first."
      }));
      return;
    }
    this.auditSvc.newScanOrder( activeProject.getUID(), pModel.getID()).subscribe((vReport  )=>{
      console.log("Scan Order done", vReport );
    })
  }

    protected readonly ICON_TYPE = ICON_TYPE;

  showModel(pModel: any, pEvent:any) {
    //console.log()
    this.open(pModel)
  }
}
