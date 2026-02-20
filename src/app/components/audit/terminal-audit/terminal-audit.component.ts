import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TerminalTab} from "../../../cmp/TerminalTab";
import {TerminalView} from "../../../cmp/TerminalView";
import {TerminalComponent} from "../../../base/terminal/terminal.component";
import {NavbarTabView} from "../../../cmp/NavbarTabView";
import {NavbarTab} from "../../../cmp/NavbarTab";
import {ITerminalContainer} from "../../../base/terminal/ITerminalContainer";
import {ProjectService} from "../../project/ctrl/project.service";
import {OutputService} from "../../output/ctrl/output.service";
import {SubnavbarComponent, TabItem} from "../../../base/subnavbar/subnavbar.component";
import {CODE_ICONS} from "../../code/icons";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {TagService} from "../../tag/ctrl/tag.service";
import {UIException} from "../../../base/error/UIException";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {RuntimeEvent} from "../../../models/hook/RuntimeEvent";
import {AuditController} from "../ctrl/AuditController";
import {HOOK_ICONS} from "../../hooks/icons";
import {SearchService} from "../../search/ctrl/search.service";
import {HookService} from "../../hooks/ctrl/hook.service";
import {AuditService, CheckEvent, CheckEventState, CheckResult, IResults, SearchResult} from "../ctrl/audit.service";
import {SearchController} from "../../search/ctrl/SearchController";


interface SelectedMessage {
  [sessionID:string] :number
}

const TAB_LABEL = 'Requests';


// @ts-ignore
@Component({
  selector: 'app-terminal-audit',
  templateUrl: './terminal-audit.component.html',
  styleUrls: ['./terminal-audit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalAuditComponent implements OnInit, AfterViewInit, ITerminalContainer {

  static LABEL = TAB_LABEL;
  id:number;

  @Input() parent: TerminalComponent;
  @Input() controller: AuditController;

  tab:TerminalTab = new TerminalTab({
    offset: 0,
    label: TAB_LABEL,
    icon: GLOBAL_ICONS['HOOKS'],
    color: 'dxc-text-clear100'
  });

  NODE_TYPE:any = NodeInternalType;

  gIcons: any = GLOBAL_ICONS;
  cIcons: any = CODE_ICONS;
  icons: any = HOOK_ICONS;

  view:TerminalView = new TerminalView({
    navtab: new NavbarTabView({
      label: 'Audit',
      tab: new NavbarTab({
        offset: 0,
        label: 'Scan Results',
        closable:true,
        icon: GLOBAL_ICONS['HOOKS'],
        iconColor: 'dxc-text-clear100',
        color: 'dxc-text-clear100'
      })
    })
  });

  _current_selected:string = "";
  activeTerm: any = null;

  @ViewChild('termRes', { static: true, read:ElementRef  }) termHelp: ElementRef;
  @ViewChild('termResCtn', { static: true, read:ElementRef  }) termCtn: ElementRef;
  @ViewChild('termResNav', { static: true, read:ElementRef  }) termNav: ElementRef;
  @ViewChild(SubnavbarComponent) navbar: SubnavbarComponent;

  size:any = {
    height: '150px'
  };

  tags:any = {};
  searchCtrl:SearchController;

  _active:string = "";
  _tabStack:string[] = [];
  _resultsTabs: Record<string, TabItem<CheckResult|SearchResult>> = {};

  constructor(private prjSvc:ProjectService,
              private hookSvc:HookService,
              private auditSvc:AuditService,
              private searchSvc:SearchService,
              private tagSvc:TagService,
              private outputSvc:OutputService,
              private changeRef:ChangeDetectorRef) {



  }

  ngOnInit(): void {
    this.auditSvc.onCheckAction$.subscribe((vRes:CheckResult|SearchResult)=>{
      if(this.controller.app != null){
        // focus "Audit results" tab
        this.controller.app.terminalCmp.selectTabByLabel(TAB_LABEL);
      }

      if((vRes as any).event!=null){
          switch ((vRes as any).event.state){
              case CheckEventState.NEW:
                  this.newTab(vRes as any);
                  break;
              case CheckEventState.FAIL:
              case CheckEventState.SUCCESS:
                  this.updateTab(vRes as any);
                  break;
          }
      }else if((vRes as any).search!=null){
          this.newSearchTab(vRes as any);
      }

    });

  }

  /**
   * To init component
   */
  ngAfterViewInit(): void {
    if(this.controller.app==null){
      throw UIException.APP_NOT_INITIALIZED;
    }
    this.searchCtrl = this.controller.app.getController('ctrl:search');
  }



  isTabActive( pItem:any):boolean {
    return (this.activeTerm!=null && this.activeTerm.id != pItem.id)
  }


  /**
   * Called automatically, when a tab panel is closed.
   * It happens before close.
   *
   * @param pItem
   */
  onResultClose(pItem: any /*TabItem<CheckResult*/): boolean {

      Object.keys(this._resultsTabs).indexOf(pItem.uid)

      console.log('close tab search > ',pItem,this);
      console.log('close tab search term > ',
          this.termCtn,
          Object.keys(this._resultsTabs).indexOf(pItem.uid));


      delete this._resultsTabs[pItem.uid]

      const tabOffset = this._tabStack.indexOf(pItem.uid);
      let nextTab:string;

      if(this._tabStack.length>1){

        delete this._resultsTabs[pItem.uid];

        if(tabOffset != 0){
          // check if tab is not the first element
          nextTab = this._tabStack[tabOffset-1];
        }else{
          // else, if it is the 1st tab and if there is more than 1 tab
          nextTab = this._tabStack[tabOffset+1];
        }

        this.switchResults(this._resultsTabs[nextTab])
      }else{
        // nothing to do
        this.changeRef.detectChanges();
      }

      this._tabStack = this._tabStack.filter(x => (x!=pItem.uid));
      return true;
  }

  resize(pSize: any) {

    this.size = pSize;
      if(this.termCtn!=null){
          this.termCtn.nativeElement.style.height = (pSize.height - (this.navbar!=null ? this.navbar.getHeight() : 0)) + 'px';
          this.termCtn.nativeElement.style.width = pSize.width + 'px';
      }else{
          console.log("[AUDIT][TERMINAL] resize : termCtn is null");
      }

  }

  /**
   * To switch from an hook session to another into tab bar
   *
   * @param {HookSession} pSession
   */
  switchResults(pRes: any /*TabItem<CheckResult>*/) {
    console.log("switchResults > ",pRes);
    if(pRes.data==null) return;

    if(this._active!=null && this._resultsTabs[this._active]!=null){
      this._resultsTabs[this._active].active = false;
    }

    this._active = pRes.uid;
    this._resultsTabs[this._active].active = true;
    this.changeRef.detectChanges();
  }

  getUIDfromEvent(pEvent:CheckEvent):string {
    const uid =  `${(pEvent.assessment!=null?pEvent.assessment.id:'a')}:${pEvent.rule!=null?pEvent.rule.request.__stringified:'r'}:${pEvent.startTime}`
    console.log("getUIDfromEvent > ",uid);
    return uid;
  }

  getUIDfromSearch(pEvent:any):string {
      console.log("getUIDfromSearch > ",pEvent.query);
      return pEvent.query;
  }

  newTab(pResult:CheckResult) {

    if(this.controller.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    const tabUID = this.getUIDfromEvent(pResult.event);

    if(this._resultsTabs[tabUID]!=null){
      // fail safe, this case should be never reached
      this.updateTab(pResult);
      return;
    }

    if(this._active!=null && this._resultsTabs[this._active]!=null){
      this._resultsTabs[this._active].active = false;
    }

    this._active = tabUID;
    this._tabStack.push(tabUID);
    this._resultsTabs[tabUID] = {
      uid: tabUID,
      icon: null,
      label: pResult.event.rule.request.__stringified,
      active: true,
      data: pResult
    };
    console.log(this._resultsTabs);
    this.changeRef.detectChanges();
  }



    newSearchTab(pResult:SearchResult) {

        if(this.controller.app==null){
            throw  UIException.APP_NOT_INITIALIZED();
        }

        const tabUID = this.getUIDfromSearch(pResult.search);

        if(this._resultsTabs[tabUID]!=null){
            // fail safe, this case should be never reached
            //this.updateTab(pResult);
            return;
        }

        if(this._active!=null && this._resultsTabs[this._active]!=null){
            this._resultsTabs[this._active].active = false;
        }

        this._active = tabUID;
        this._tabStack.push(tabUID);
        this._resultsTabs[tabUID] = {
            uid: tabUID,
            icon: null,
            label: pResult.search.query,
            active: true,
            data: pResult
        };

        this.changeRef.detectChanges();
    }

  getTabItems():TabItem<any>[] {
    return Object.values(this._resultsTabs);
  }

  /**
   * Update tab data and re-focus
   *
   * @param pResult
   */
  updateTab(pResult:CheckResult):void {
    const tabUID = this.getUIDfromEvent(pResult.event);
    // update data
    this._resultsTabs[tabUID].data = pResult;
    // switch to updated tab
    this.switchResults(this._resultsTabs[tabUID]);
  }

  open(pObj: any, pNodeType:number, pSubPpt:Nullable<string>=null) {
    if(this.controller.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    let d = pObj;
    if(pSubPpt!=null){
      d = pObj[pSubPpt];
    }

    console.log("[HOOK MESSAGE] open ",d,pNodeType);
      switch(pNodeType){
        case NodeInternalType.METHOD:
          this.controller.app.getController('ctrl:code-main').open(d);
          break;
        case NodeInternalType.CLASS:
          this.controller.app.getController('ctrl:code-main').open(d);
          break;
        case NodeInternalType.FIELD:
          this.controller.app.getController('ctrl:code-main').open(d);
          break;
      }
  }



  save() {

  }

  /**
   * To display stack trace of the method hooked
   *
   * @param pMsg
   * @param pTrace
   */
  openTrace(pMsg: RuntimeEvent<any>, pTrace: IStringIndex<any>[]) {

  }

  isDisplayed(pItem: TabItem<CheckResult|SearchResult>):("block"|"none") {
    if(pItem.data==null) return "none";

    if(pItem.uid==this._active){
      return "block";
    }else{
      return "none";
    }
  }
}
