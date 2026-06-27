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
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  ViewChild
} from '@angular/core';
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {Subject} from "rxjs";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TOPO_ICONS} from "../../topology/icons";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import ModelSyscall from "../../../models/ModelSyscall";
import {ClipboardService} from "../../../core/services/clipboard.service";
import {AuditController} from '../ctrl/AuditController';
import {AuditService} from "../ctrl/audit.service";
import AssuranceModel from "../../../models/audit/common/AssuranceModel";
import ControlAssessment from "../../../models/audit/common/ControlAssessment";
import {SearchService} from "../../search/ctrl/search.service";
import {ProjectService} from "../../project/ctrl/project.service";
import {SearchController} from "../../search/ctrl/SearchController";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";
import Control from "../../../models/audit/common/Control";
import {ContextMenuList, ContextMenuState} from "../../../base/context-menu/context-menu.component";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ScanOrder} from "../../../models/ScanOrder";


export const AUDIT_PANEL = {
  INFO : 'in',
  RULES : 'rl',
  RESULT: 'rs',
  ORDERS: 'or'
}

@Component({
  selector: 'app-viewport-audit',
  templateUrl: './viewport-audit.component.html',
  styleUrls: ['./viewport-audit.component.scss','../../../forms.scss',"../../../../../node_modules/flag-icons/css/flag-icons.min.css" ],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportAuditComponent implements AfterViewInit, IViewportContainer {


  @Input() item: any;
  @Input() uid: string;
  @Input() data: AssuranceModel;
  @Input() controller: AuditController;
  @Input() parent: ViewportComponent;
  @Input() height: number;
  @Input() width: number;

  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;

  searchCtrl: SearchController;
  id = -1;
  activeLeft =  AUDIT_PANEL.INFO;
  //activeRight:Nullable<string> = null;
  defaultWidth = 70;
  defaultWidths = {
    [AUDIT_PANEL.RULES]: 30,
    [AUDIT_PANEL.RESULT]: 30,
    [AUDIT_PANEL.INFO]: 100
  };
  activeWidth = 70;

/*
  topNav: NavbarSimpleView = new NavbarSimpleView({
    style: 'vp-navbar',
    entries: [
      new MenuItem({
        icon: GLOBAL_ICONS['JAVA'],
        label: "Implemented By"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS['FIND'],
        label: "Instances"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS['HOOKS'],
        label: "Permissions",
      })
    ]
  });

  leftNav: NavbarSimpleView =  new NavbarSimpleView({
    menu: new MenuView({
      label: "Filter",
      items: [
        new MenuItem({
          id: 'app',
          icon: GLOBAL_ICONS['WINDOW'],
          label: "Application"
        }),
        new MenuItem({
          id: 'api',
          icon: GLOBAL_ICONS['ANDROID'],
          label: "Android"
        })
      ]
    })
  });

  rightNav: NavbarSimpleView = new NavbarSimpleView({
    entries: [
      new MenuItem({
        icon: GLOBAL_ICONS['HOOKS'],
        label: "Hook logs"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS['LIBS'],
        label: "VM Out"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS['ANDROID'],
        label: "adb logs"
      })
    ]
  });
*/

  gIcons:any = GLOBAL_ICONS;
  tIcons:any = TOPO_ICONS;

  now:Date = new Date();



  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Audit',
      icon: GLOBAL_ICONS['DEFAULT'],
      color: 'dxc-text-clear100'
    })
  });

  resize$: Subject<any> = new Subject<any>();
  fridaPath: any;
  fridaTrans: any = "usb";
  fridaOK =  false;

  selectedSyscall:Nullable<ModelSyscall> = null;

  activeItem:any = null;
  selectedData: any = {}; /*Nullable<ControlAssessment|Control>*/
  execResults: any[] = []
  loadingLeft = false;
  selectedType: string = 'none';

  ctxMenu: ContextMenuList = {};
  ctxMenuState:ContextMenuState = {
    subject: null
  };
  selectedCtrl: any = {};
  checkedCtrls: any = {};
  safeHTML: Nullable<SafeHtml> = null;
  orders: ScanOrder[] = [];

  constructor(
    private auditService: AuditService,
    private projectService: ProjectService,
    private searchService: SearchService,
    private electronSvc:ClipboardService,
    private outputSvc:OutputService,
    private domSanitizer:DomSanitizer/*,
    private _changeRef:ChangeDetectorRef*/) {

    this.height = 300;
  }

  /**
   * To init component
   */
  ngAfterViewInit(): void {
    this.height = this.height-this.layout.topHeight;
    // this.metadataEl.nativeElement .getComputedStyle().height
    this.resize({ height:this.height})
    if(this.controller.app==null){
      throw UIException.APP_NOT_INITIALIZED;
    }
    this.searchCtrl = this.controller.app.getController('ctrl:search');
  }

  /**
   * To configure the viewport with data
   *
   * @param pData {any}
   * @method
   * @public
   */
  configure( pData:any, pFocus:any):void {

    console.log("Configure WP audit : ",pData);


    this.data = pData;


    this.view.tab.icon = this.gIcons['HOOKS'];
    this.view.tab.label = pData.id;
    this.view.tab.tip = pData.model;
    this.view.tab.color = 'dxc-text-blue font-weight-bold';


    if(pData.alias != null){
      this.view.tab.label = '@'+pData.alias;
      this.view.tab.color = 'text-warning';
    }

    if(pData.$ != null)
      this.showDetail(pData.$);
    else if(pData.profile == null)
      this.showDetail(AUDIT_PANEL.INFO);

    if(pFocus!=null){
      this.activeLeft = pFocus
      if(this.defaultWidths[pFocus] != null)
        this.activeWidth = this.defaultWidths[pFocus];
      else
        this.activeWidth = this.defaultWidth;
    }


  }

  private _retrieveShortForm(pItem:any):string {
    return "";
  }

  /**
   *
   * @param pEvent
   */
  onItemFocus( pEvent: any, pItem:any, pSrc:string): void{

    console.log(pEvent,pItem,pSrc);

    const o = {
      item:pItem,
      src:pSrc,
      el: pEvent.composedPath ? pEvent.composedPath()[0] : pEvent.path[0],
      oldBg: null
    };

    this.electronSvc
      .getSelectionManager()
      .selectNode(pItem, this._retrieveShortForm(pItem));

    if (this.activeItem != null){
      this.activeItem.el.style.backgroundColor = this.activeItem.oldBg; //'#444'
    }

    if(o.el.className.indexOf('col-')>-1){
      o.el = pEvent.composedPath ? pEvent.composedPath()[1] : pEvent.path[1];
    }

    o.oldBg = o.el.style.backgroundColor;
    o.el.style.backgroundColor = 'royalblue';
    this.activeItem = o;
  }

  showDetail(pType:string):any {

    this.selectedData = null;

    switch (pType){
      case AUDIT_PANEL.INFO:
        this.activeLeft = AUDIT_PANEL.INFO;
        this.activeWidth = 100;
        break;
      case AUDIT_PANEL.RESULT:
        this.activeLeft = AUDIT_PANEL.RESULT;
        this.activeWidth = 100;
        this.auditService.getReportOf(this.data.getID()).subscribe((vResults:any)=>{
            console.log(vResults);
        });
        break;
      case AUDIT_PANEL.ORDERS:
        this.activeLeft = AUDIT_PANEL.ORDERS;
        this.activeWidth = 100;
        const activeProject = this.projectService.getSelectedProject();


        if(activeProject==null){
          this.outputSvc.alert( OutputMessage.newError({
            msg: "Scan orders cannot be listed : you must select a project first."
          }));
          return;
        }

        this.auditService.listOrders(
            activeProject, this.data).subscribe((vResults:any)=>{
          console.log("LIST ORDERS > ",vResults);
            this.orders = vResults;
        });
        break;
      case AUDIT_PANEL.RULES:
        this.activeLeft = AUDIT_PANEL.RULES;
        this.activeWidth = 30;
        this.loadingLeft = true;
        this.auditService.getControlsOf(this.data.getID()).subscribe((vResults:any)=>{

          this.data.controls = vResults;
          this.loadingLeft = false;
          console.log("Audit > rules > ",vResults, this.data);
          //this._changeRef.detectChanges();
        });
        break;
      default:
        /*this.dmService.getProfile(this.data).subscribe((pProfile)=>{
          this.data.profile = pProfile;
          console.log(this.data);
          this.activeLeft = pType;
          this.activeRight = pType;

          switch (pType){
            case AUDIT_PANEL.USB:
            case AUDIT_PANEL.MOUNTS:
              this.activeWidth = 100;
              break;
            default:
              this.activeWidth = this.defaultWidth;
              break;
          }
        });*/
        break;
    }



    return true;
  }

  showSyscallInfo(pEl:any, pSyscall:ModelSyscall):void {
    this.selectedSyscall = pSyscall;
    this.onItemFocus(pEl, pSyscall, 'sc');
  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.height = pSize.height;
    //this.size = pSize;
  }

  /**
   *
   * @param pAssess
   */
  getScoreBg(pAssess: ControlAssessment):any{
    const size=pAssess.rules.length;
    if(size==0)
      return "#838383";
    else if(size<2)
      return "#F00";
    else if(size<5)
      return "#ffa700";
    else if(size>4)
      return "#259818";
  }

  getScoreColor(pAssess: ControlAssessment):any{
    const size=pAssess.rules.length;
    if(size==0)
      return "#FFF";
    else if(size<2)
      return "#FFF";
    else if(size<5)
      return "#000";
    else if(size>4)
      return "#FFF";
  }

  showControlAssessm(pAssess: ControlAssessment) {
    this.selectedData = pAssess;
    this.selectedType = "cass";
  }

  /**
   *
   * @param pControl
   * @param pEvent
   */
  showControl(pControl: any, pEvent: MouseEvent) {
    this.selectedData = pControl;
    this.safeHTML = this.domSanitizer.bypassSecurityTrustHtml(this.selectedData);
    this.selectedType = "control";
  }

  getTooltipFor(pValue: any) {

    if(typeof pValue==='string'){
      switch (pValue){
        case "iast":
          return "Interactive Testing";
        case "dast":
          return "Dynamic Testing";
        case "sast":
          return "Static Code Analysis";
      }
    }

    return "";
  }

  newControl(pParent: any = null) {
      this.auditService.openAssessEditor(new ControlAssessment({}));
  }

  newRule(pParent: any = null) {

  }

  /**
   * Add/remove tags for a selection of controls
   * 
   */
  updateTags() {
    console.log(this.checkedCtrls);
  }

  isSelectedCtrl(i: Control) {
    return (this.selectedCtrl.id==i.id);
  }

  onScanning(pEvent:any):void {

  }

  onDryRunSuccess(pEvent:any):void {
    // generated section
  }
}
