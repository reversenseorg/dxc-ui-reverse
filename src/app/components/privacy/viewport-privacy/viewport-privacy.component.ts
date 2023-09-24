import {Component, Input, OnInit} from '@angular/core';
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {Subject} from "rxjs";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {InspectorService} from "../../inspector/ctrl/inspector.service";
import {Inspector} from "../../../models/Inspector";
import {HOOK_ICONS} from "../../hooks/icons";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {ContextMenuList, ContextMenuState} from "../../../base/context-menu/context-menu.component";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {ElectronService} from "../../../core/services";
import Application from '../../../models/Application';
import {PrivacyService} from "../ctrl/privacy.service";
import {ProjectService} from '../../project/ctrl/project.service';
import {PrivacyController} from "../ctrl/PrivacyController";
import {PrivacyReport} from "../../../models/audit/privacy/PrivacyReport";
import {PrivacyFinding, PrivacyFindingType} from "../../../models/audit/privacy/PrivacyFinding";
import {TrackerInfo} from '../../../models/audit/privacy/TrackerInfo';
import {TopologyService} from "../../topology/ctrl/topology.service";

enum INFO_TYPE {
  NONE,
  TRK_DOM,
  TRK_LIB,
  PII_DATA,
  PII_FLI,
  PII_FLO,

WPTHR,
  WPPII
}

enum WP_TYPE {

}

@Component({
  selector: 'app-viewport-privacy-dash',
  templateUrl: './viewport-privacy.component.html',
  styleUrls: ['../../../base/expandable-list/expandable-list.component.scss', './viewport-privacy.component.scss']
})
export class ViewportPrivacyDashboardComponent implements OnInit, IViewportContainer {

  NODE_TYPES:any = NodeInternalType;
  TOPIC = INFO_TYPE;

  @Input() controller: PrivacyController;
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
  ctxMenuState:ContextMenuState = null;
  resize$: Subject<any> = new Subject<any>();


  data: any;
  inspectors:Inspector[] = [];
  app: Application = null;
  project: DexcaliburProject = null;

  activeTR: number = INFO_TYPE.TRK_DOM;
  activeTL: number = INFO_TYPE.PII_DATA;
  activeBR: number = INFO_TYPE.NONE;
  activeBL: number = INFO_TYPE.NONE;

  activeItem:any = {
    TR:null,
    TL:null,
    BR:null,
    BL:null
  };

  report:PrivacyReport;

  trackerLibs:PrivacyFinding<TrackerInfo>[] = [];
  trackerURI:PrivacyFinding<TrackerInfo>[] = [];

  constructor( private projectSvc:ProjectService,

               private topoSvc:TopologyService,
               private eSvc:ElectronService,
               private privSvc:PrivacyService) {

  }

  ngOnInit(): void {
    this.privSvc.getReports().subscribe((vReport)=>{
      if(vReport.length>0){
        this.report = vReport[vReport.length-1];
        console.log(this.report);
      }
    });


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
      case INFO_TYPE.TRK_LIB:
      case INFO_TYPE.TRK_DOM:
        console.log(this.project);
        this.activeTL = pTopic;
        break;
      case INFO_TYPE.PII_FLI:
      case INFO_TYPE.PII_FLO:
      case INFO_TYPE.PII_DATA:
        console.log(this.project);
        this.activeTR = pTopic;
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

  startScan() {
    this.privSvc.scan().subscribe((vReport)=>{
      this.report = vReport;
    })
  }
}
