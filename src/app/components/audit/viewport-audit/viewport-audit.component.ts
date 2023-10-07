import {
  AfterContentInit, AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Input,
  OnInit,
  QueryList, ViewChild
} from '@angular/core';
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {Subject} from "rxjs";
import ModelClass from "../../../models/ModelClass";
import {CodeController} from "../../code/ctrl/CodeController";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {Device} from "../../../models/Device";
import {IconModel} from "../../../base/icon/IconModel";
import {TOPO_ICONS} from "../../topology/icons";
import {OutputService} from "../../output/ctrl/output.service";
import {HookService} from "../../hooks/ctrl/hook.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import ModelSyscall from "../../../models/ModelSyscall";
import {ElectronService} from "../../../core/services";
import { AuditController } from '../ctrl/AuditController';
import {AuditService} from "../ctrl/audit.service";
import AssuranceModel from "../../../models/audit/common/AssuranceModel";
import ControlAssessment from "../../../models/audit/common/ControlAssessment";
import {SearchService} from "../../search/ctrl/search.service";
import {ProjectService} from "../../project/ctrl/project.service";
import {SearchController} from "../../search/ctrl/SearchController";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";



export const AUDIT_PANEL = {
  INFO : 'in',
  RULES : 'rl',
  RESULT: 'rs',
}

@Component({
  selector: 'app-viewport-audit',
  templateUrl: './viewport-audit.component.html',
  styleUrls: ['./viewport-audit.component.scss','../../../forms.scss']
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
  activeLeft =  AUDIT_PANEL.RESULT;
  //activeRight:Nullable<string> = null;
  defaultWidth = 70;
  defaultWidths = {
    [AUDIT_PANEL.RULES]: 30,
    [AUDIT_PANEL.RESULT]: 30,
    [AUDIT_PANEL.INFO]: 30
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
  selectedData: Nullable<ControlAssessment> = null;
  execResults: any[] = []


  constructor(
    private auditService: AuditService,
    private projectService: ProjectService,
    private searchService: SearchService,
    private electronSvc:ElectronService,
    private outputSvc:OutputService) {

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
    this.data = pData;

    console.log('configure device viewport>',pData);

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
        break;
      case AUDIT_PANEL.RESULT:
        this.activeLeft = AUDIT_PANEL.RESULT;
        /*this.dmService.getSystemCalls(this.data).subscribe((pSyscalls)=>{
          this.data.syscalls = pSyscalls;
          console.log(pSyscalls);
          this.activeLeft = pType;
          this.activeRight = pType;
        });*/
        break;
      case AUDIT_PANEL.RULES:
        this.activeLeft = AUDIT_PANEL.RULES;
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
  }

  dryRunRule(pAssess: ControlAssessment, pRule: any) {
    if(!this.projectService.isProjectIsOpen()){
      this.outputSvc.alert(OutputMessage.newError({msg:"Open a project first"}));
      return;
    }else{
      this.searchService.executeRaw(pRule.__stringified.substring(1)).subscribe((res)=>{
        console.log("Execute MERLIN Request",res);
        if(res.success){
          this.execResults = res.data;
        }

      })
    }
  }
}
