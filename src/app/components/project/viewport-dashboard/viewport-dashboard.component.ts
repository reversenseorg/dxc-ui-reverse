import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {Subject} from "rxjs";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {ProjectController} from "../ctrl/ProjectController";
import {ProjectService} from "../ctrl/project.service";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {InspectorService} from "../../inspector/ctrl/inspector.service";
import {Inspector} from "../../../models/Inspector";
import {HOOK_ICONS} from "../../hooks/icons";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {ContextMenuList, ContextMenuState} from "../../../base/context-menu/context-menu.component";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {ElectronService} from "../../../core/services";
import {HookService} from "../../hooks/ctrl/hook.service";
import Application from '../../../models/Application';
import {Nullable} from "../../../base/Nullable";
import {TopologyController} from "../../topology/ctrl/TopologyController";

enum INFO_TYPE {
  APP,
  PRJ,
  DEV,
  ANA,
  STR,
  TOP,
  OBF,
  RES,
  ENT,
  URL,
  BIN,
  NET,
  SEC
}

@Component({
  selector: 'app-viewport-project-dash',
  templateUrl: './viewport-dashboard.component.html',
  styleUrls: ['../../../base/expandable-list/expandable-list.component.scss', './viewport-dashboard.component.scss']
})
export class ViewportProjectDashboardComponent implements OnInit, IViewportContainer {

  NODE_TYPES:any = NodeInternalType;
  TOPIC = INFO_TYPE;

  @Input() controller: ProjectController;
  @Input() parent: ViewportComponent;


  id = -1;
  uid = '';
  size:any = {
    height: '150px'
  };

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Dashboard',
      icon: GLOBAL_ICONS['GLOBE'],
      color: 'dxc-text-clear100'
    })
  });


  gIcons:any = GLOBAL_ICONS;
  hIcons:any = HOOK_ICONS;
  ctxMenu: ContextMenuList = {};
  ctxMenuState:ContextMenuState = { subject: null };
  resize$: Subject<any> = new Subject<any>();


  data: any;
  inspectors:Inspector[] = [];
  app: Nullable<Application> = null;
  project: Nullable<DexcaliburProject> = null;

  activeTR: number = INFO_TYPE.TOP;
  activeTL: number = INFO_TYPE.APP;
  activeBR: number = INFO_TYPE.SEC;
  activeBL: number = INFO_TYPE.RES;

  activeItem:any = {
    TR:null,
    TL:null,
    BR:null,
    BL:null
  };

  constructor( private projectSvc:ProjectService,
               private eSvc:ElectronService,
               private hookSvc:HookService,
               private inspSvc:InspectorService ) {

  }

  ngOnInit(): void {
    this.project = this.projectSvc.getSelectedProject();
  }

  /**
   * To configure the component when the view is created and pushed into the viewport
   *
   * Called by internal Viewport component
   *
   * @param {any} pData
   * @method
   */
  configure( pData:any):void {
    this.data = pData;
  }


  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
  }

  /**
   * To show the specified info panel
   *
   * @param app
   */
  showInfo(pTopic: number) {
    switch (pTopic) {
      case INFO_TYPE.ANA:
        this.inspSvc.getAll().subscribe((pInspList:Inspector[])=>{
          this.inspectors = pInspList;
          this.activeTL = INFO_TYPE.ANA;
        });
        break;
      case INFO_TYPE.PRJ:
        this.project = this.projectSvc.getSelectedProject();
        console.log(this.project);
        this.activeTL = pTopic;
        break;
      case INFO_TYPE.APP:
        this.project = this.projectSvc.getSelectedProject();
        console.log(this.project);
        this.activeTL = pTopic;
        break;
      case INFO_TYPE.DEV:
        this.activeTL = pTopic;
        break;
      case INFO_TYPE.URL:
        this.activeBL = pTopic;
        break;
    }
  }

  private _retrieveShortForm( pEvent:any):string {
    if(pEvent.__ !=null){
      switch (pEvent.__) {
        case NodeInternalType.INSPECTOR:
          return pEvent.name;
          break;
      }
    }

    return "NULL";
  }

  onItemFocus( pSrc:string, pEvent:any):void{

    console.log(pEvent);
    this.eSvc
      .getSelectionManager()
      .selectNode(pEvent.item, this._retrieveShortForm(pEvent));

    if(this.activeItem[pSrc] != null){
      this.activeItem[pSrc].el.style.backgroundColor = "#444";
    }

    this.activeItem[pSrc] = pEvent;
    pEvent.el.style.backgroundColor = "royalblue";
  }

  onCollapse($event: any) {
    return null;

  }

  onExpand($event: any) {
    return null;
  }

  displayCtxMenu(pEvent:any, pType:string, pObject:any, pExtra:any = null):void{
    pEvent.preventDefault();

    this.ctxMenuState = {
      menu: this.ctxMenu[pType],
      subject: pObject
    };
    this.ctxMenu[pType].show(pEvent, pObject, pExtra);
  }

  getTopoController():TopologyController {
    return this.parent.parent.getController('ctrl:topo');
  }
}
