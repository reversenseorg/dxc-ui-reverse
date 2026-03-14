import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {Subject} from "rxjs";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {RuntimeEventController} from "../ctrl/RuntimeEventController";
import {RuntimeEvent, RuntimeEventType} from "../../../models/hook/RuntimeEvent";
import {RTEVENT_ICONS} from "../icons";
import {IconModelCollection} from "../../../base/icon/IconModel";
import {DxApiResponse, IDxRefreshable} from "../../../base/common/common";
import HookSession from "../../../models/hook/HookSession";
import {Nullable} from "../../../base/Nullable";
import {ProjectService} from "../../project/ctrl/project.service";
import {HookService} from "../../hooks/ctrl/hook.service";
import {TagService} from "../../tag/ctrl/tag.service";
import {OutputService} from "../../output/ctrl/output.service";
import {UIException} from "../../../base/error/UIException";
import {IStringIndex} from "../../../base/IStringIndex";
import {RuntimeSession, RuntimeSessionUUID} from "../../../models/RuntimeSession";
import {Tag} from "../../../models/tags/Tag";
import {CODE_ICONS} from "../../code/icons";
import {RuntimeEventsService} from "../ctrl/events.service";

@Component({
  selector: 'app-viewport-events',
  template: `
      <div class="rtevent-ctn">
          <app-subnavbar [bar]="true" [parent]="this">
              <span class="nav-label pt-2" navLabel>Filter :</span>
              <ng-container main>
                  <ng-container *ngFor="let f of getFilters(session) | keyvalue">
                      <ng-container *ngIf="f.key=='msg'">
                          <app-subnavbar-btn *ngFor="let o of f.value.opts" [class]="'badge rounded-pill text-bg-danger'"  (click)="dropFilter(o,'msg')">{{ o.name }}</app-subnavbar-btn>
                      </ng-container>
                      <ng-container *ngIf="f.key=='hk'">
                          <app-subnavbar-btn *ngFor="let o of f.value.opts" [class]="'badge rounded-pill text-bg-danger'" (click)="dropFilter(o,'hk')">{{ o.name }}</app-subnavbar-btn>
                      </ng-container>
                      <ng-container *ngIf="f.key=='ev'">
                          <app-subnavbar-btn *ngFor="let o of f.value.opts" [class]="'badge rounded-pill text-bg-danger'" (click)="dropFilter(o,'ev')">{{ o.name }}</app-subnavbar-btn>
                      </ng-container>
                  </ng-container>
                  <app-subnavbar-menu [icon]="gIcons['PLUS']" [label]="'add filter'">
                      <ng-container entries>
                          <app-subnavbar-btn (click)="filter('hk')">Hook</app-subnavbar-btn>
                          <app-subnavbar-btn (click)="filter('ev')">Event</app-subnavbar-btn>
                          <app-subnavbar-btn (click)="filter('msg')">Message</app-subnavbar-btn>
                          <app-subnavbar-btn (click)="filter('dev')">Device</app-subnavbar-btn>
                          <app-subnavbar-btn (click)="filter('net')">Network</app-subnavbar-btn>
                      </ng-container>
                  </app-subnavbar-menu>
                  <app-subnavbar-input [placeholder]="'Pattern...'" [width]="'400px'" (enter)="addFilter($event)"></app-subnavbar-input>
                  <app-subnavbar-btn (click)="filter('dev')">Newest</app-subnavbar-btn>
                  <app-subnavbar-btn (click)="filter('dev')">Latest</app-subnavbar-btn>
                  <app-subnavbar-menu [label]="pageSize+''">
                      <ng-container entries>
                          <app-subnavbar-btn (click)="pageSize=100">100</app-subnavbar-btn>
                          <app-subnavbar-btn (click)="pageSize=1000">1000</app-subnavbar-btn>
                          <app-subnavbar-btn (click)="pageSize=10000">10000</app-subnavbar-btn>
                      </ng-container>
                  </app-subnavbar-menu>
              </ng-container>
          </app-subnavbar>

          <div #termHookCtn style="overflow-y:auto;">

              <ng-container *ngIf="session">
                  <div *ngFor="let msg of getMessages(); let index = index;" class="row no-gutters hmsg" (click)="hookMsgFocus(index)" [ngClass]="(_current_selected==index ? 'selected' : '')">
                      <div class="col-lg-1 col-msg">
                          <ng-container *ngIf="msg.rt_type" [ngSwitch]="msg.rt_type" >
                              <ng-container *ngSwitchCase="'h'">
                                  <dxc-meta [label]="'HOOK'" [ngClass]="'dxc-yellow dxc-text-black'"></dxc-meta>
                              </ng-container>
                              <ng-container *ngSwitchCase="'he'">
                                  <dxc-meta [label]="'ERROR'" [ngClass]="'dxc-salmon'"></dxc-meta>
                              </ng-container>
                              <ng-container *ngSwitchDefault>
                                  <dxc-meta [label]="'HOOK'" [ngClass]="'dxc-yellow dxc-text-black'"></dxc-meta>
                              </ng-container>
                          </ng-container>

                          <dxc-meta *ngIf="!msg.rt_type" [label]="'HOOK'" [ngClass]="'dxc-yellow dxc-text-black'"></dxc-meta>


                      </div>
                      <div class="col-lg-1 col-msg">
                          <dxc-meta *ngIf="msg.data.when==-1" [label]="'before'" [ngClass]="'text-info'"></dxc-meta>
                          <dxc-meta *ngIf="msg.data.when==1" [label]="'after'" [ngClass]="'dxc-azur  dxc-text-black'"></dxc-meta>
                          <dxc-meta *ngIf="msg.data.when==0" [label]="'replace'" [ngClass]="'dxc-pink'"></dxc-meta>
                          <!--<ng-container *ngFor="let t of msg.tags">
                            <dxc-meta [label]="t.text" [style]="{'backgroundColor':t.style,'font-size':'12px'}"></dxc-meta>
                          </ng-container>-->
                          <!--<span *ngFor="let t of msg.tags" class="badge rounded-pill " [ngStyle]="{'backgroundColor':t.style}">{{ t.text }}</span>-->
                      </div>
                      <div class="col-lg-3 col-msg">
                          <ng-container *ngFor="let n of msg.node">
                              <dxc-node-token [ref]="n" [cache]="true"></dxc-node-token>
                              <!--<ng-container *ngIf="n.__==NODE_TYPE.METHOD">
                  
                                <dxc-icon [model]="cIcons['CLASS']"></dxc-icon>&nbsp;<span (click)="open(n, NODE_TYPE.CLASS, 'enclosingClass')" class="actionable">{{ getProperty(n,'enclosingClass') }}</span>
                                .
                                <dxc-icon [model]="cIcons['METH']"></dxc-icon>&nbsp;<span (click)="open(n,NODE_TYPE.METHOD)" class="actionable">{{ getProperty(n,'name') }}</span>(...)
                              </ng-container>-->
                          </ng-container>
                      </div>
                      <div class="col-lg-1 col-msg">
                          <ng-container *ngIf="msg.interceptors">
                              <code class="dxc-text-yellow" *ngFor="let t of msg.interceptors">{{ t }}</code><br>
                          </ng-container>
                      </div>
                      <div class="col-lg-6 ppt">
                          <ng-container *ngIf="msg.isHookMessage()">
                              <ng-container *ngFor="let d of msg.getHookMessageData() | keyvalue">

                                  <!--<ng-container *ngIf="msg.isRootDetectionData(d.value)">
                                    <dxc-icon [model]="gIcons['WARNING']"></dxc-icon>&nbsp;
                                    <span class="text-warning">Root detection</span>
                                  </ng-container>-->

                                  <ng-container [ngSwitch]="getProperty(d.value,'__')">
                                      <ng-container *ngSwitchCase="NODE_TYPE.CLASS">
                                          <dxc-icon [model]="cIcons['CLASS']"></dxc-icon>&nbsp;<span (click)="open(d.value,NODE_TYPE.CLASS)" class="actionable">{{ getProperty(d.value,'fqcn') }}</span>
                                      </ng-container>
                                      <ng-container *ngSwitchCase="NODE_TYPE.METHOD">
                                          <dxc-icon [model]="cIcons['METH']"></dxc-icon>&nbsp;
                                          <span (click)="open(d,NODE_TYPE.METHOD)" class="actionable">{{ d.value!=null ? d.value : "null" }}</span>
                                      </ng-container>
                                      <ng-container *ngSwitchCase="NODE_TYPE.FILE">
                                          <dxc-icon [model]="cIcons['FILE']"></dxc-icon>&nbsp;<span (click)="open(d,NODE_TYPE.FILE)" class="actionable">{{ d.value.path }}</span>
                                      </ng-container>
                                      <ng-container *ngSwitchDefault>
                                          <div *ngIf="d.key[0]!='_'">
                                              <span>{{ d.key }}</span>&nbsp;:&nbsp;<span>{{ d.value!=null ? d.value : "null" }}</span>
                                          </div>
                                          <div *ngIf="d.key=='__class__'">
                                              <dxc-icon [model]="cIcons['CLASS']"></dxc-icon>&nbsp;<span (click)="open(d,NODE_TYPE.CLASS)" class="actionable">{{ d.value }}</span>
                                          </div>
                                          <div *ngIf="d.key=='__meth__'">
                                              <dxc-icon [model]="cIcons['METH']"></dxc-icon>&nbsp;<span (click)="open(d,NODE_TYPE.METHOD)" class="actionable">{{ d.value }}</span>
                                          </div>
                                          <div *ngIf="d.key=='__msg__'">
                                              {{ d.value }}
                                          </div>
                                          <div *ngIf="d.key=='__trace__'">
                                              <span (click)="openTrace(msg,d)" class="actionable"><dxc-icon [model]="cIcons['TRACE']"></dxc-icon>Trace</span>
                                          </div>
                                          <div *ngIf="d.key=='str'">
                                              <dxc-preview [length]="120" [data]="d.value"></dxc-preview>
                                          </div>
                                      </ng-container>

                                  </ng-container>

                              </ng-container>
                          </ng-container>

                      </div>
                  </div>
              </ng-container>
          </div>
      </div>
      
  `,
  styles: [`
    .rtevent-ctn {
      width:100%;
      font-size: 12px;

      .nav-label {
        margin: 0px 15px;
        line-height: 21px;
      }

      .term-ws-ctn {
        margin: 0px;
        overflow-y: auto;
      }


      div.row.hmsg {

        margin:0px;
        padding: 4px 0;
        border-bottom: 1px solid #666;
        color: var(--text-75);
        background-color: #333333;

        &:hover {
          background-color: #444;
          color: #bbb;
        }

        &.selected {
          background-color: rgba(65, 105, 225, 0.4);
          border-bottom: 1px solid rgba(65, 105, 225, 0.48);

          /*div {
            color:royalblue;
          }*/
        }

        div.col-msg {
          padding-left: 2em;
        }
        div.col-src {
          padding-right: 2em;
          text-align: right;
        }

        span.actionable {
          &:hover {
            text-decoration: underline;
            color: var(--warning);
          }
        }
      }
    }
  `]
  //styleUrls: ['./viewport-events.component.scss']
})
export class ViewportEventsComponent implements OnInit, OnDestroy, IViewportContainer, IDxRefreshable {


  @Input() controller: RuntimeEventController;
  @Input() parent: ViewportComponent;

  @Input() session: Nullable<RuntimeSession> = null
  @Input() subscribe: boolean = true;


  NODE_TYPE = NodeInternalType;

  id: number = -1;
  uid: string = '';
  size:any = {
    height: '150px'
  };

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Events',
      icon: GLOBAL_ICONS['HOOKS'],
      color: 'dxc-text-clear100'
    })
  });

   tags:Record<string, Tag> = {};
  resize$: Subject<any> = new Subject<any>();

  icons:IconModelCollection = RTEVENT_ICONS;
  gIcons:IconModelCollection = GLOBAL_ICONS;
  cIcons:IconModelCollection = CODE_ICONS;

  data: any;

  ftMode = "none";
  ft:Record<RuntimeSessionUUID, any> = {};

    pageSize = 100;
    offset = 0;
    events: RuntimeEvent<any>[] = [];

    constructor(private prjSvc:ProjectService,
                private hookSvc:HookService,
                private evtSvc:RuntimeEventsService,
                private tagSvc:TagService,
                private outputSvc:OutputService) {



    }

    ngOnInit(): void {
        this.prjSvc.onProjectReady.subscribe(()=>{
            this.refreshTags();
        })

        if(this.subscribe){
            //this.session

            /*this.hookSvc.onNewSession.subscribe( (pSession:HookSession)=>{
                this._sessions.push(pSession);

                if(this._current != null)
                    this._current.active = false;

                this._current = pSession;
                (this._current as HookSession).active = true;

                pSession.initHttpPolling(this.hookSvc);

                this.navbar.checkForChanges();
                this.parent.selectTab(this);
            });*/
        }

        if(this.session!=null){
            this.loadEvents();
        }
    }

    onClose(): boolean {
        return true;
    }

    loadEvents(): any {
        if(this.session==null || this.session.getUID()==null) return false;
        const s = this.session.getUID();
        if(s==null) return false;

        this.evtSvc.listEvents(s, RuntimeEventType.ANY, this.offset, this.pageSize )
            .subscribe((pEvents:DxApiResponse<RuntimeEvent<any>[]>)=>{
                if(pEvents.success && pEvents.data!=null){
                    this.events = pEvents.data;
                }
        })
    }


    refreshTags(){
        this.tagSvc.listTags().subscribe(() => {
            this.tags = {
                HOOK: this.tagSvc.getTagByName('runtime.msg.hook'),
                FS: this.tagSvc.getTagByName('runtime.msg.fs'),
                MEM: this.tagSvc.getTagByName('runtime.msg.mem'),
                TEE: this.tagSvc.getTagByName('runtime.msg.tee'),
                CERT: this.tagSvc.getTagByName('runtime.msg.cert'),
                NETWORK: this.tagSvc.getTagByName('runtime.msg.net'),
                NFC: this.tagSvc.getTagByName('runtime.msg.nfc'),
                BT: this.tagSvc.getTagByName('runtime.msg.bluetooth'),
            };
        })
    }

    /**
     * Called automatically, when a tab panel is closed.
     * It happens before close.
     *
     * @param pItem
     */
    ngOnDestroy(): void {

        // send exit
        //this.activeSession.exit();

        /*
        console.log(pItem);

        // remove sessions
        let sess:any = [];
        this._sessions.map((x:any) => {       if(x.uid != pItem.uid) sess.push(x);
        })
        this._sessions = sess;

        // if there is another session, switch
        if(this._sessions.length>0){
            this.switchSession(this._sessions[0]);
        }else{
            // this.activeSession = null;
        }

        console.log('close tab > ',pItem);
        return true;*/
    }

    resize(pSize: any) {
        this.resize$.next(pSize);
        this.size = pSize;
    }


    hookMsgFocus(index: number) {
        /*if(this._current!=null){
            this._selected[this._current.getUID()] = index;
            this._current_selected = index;
        }*/
    }

    getProperty( d:any, pSubPpt:string ):string {
        if(d==null){
            return "";
        }else{
            return (d as IStringIndex<any>)[pSubPpt] as string;
        }
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
    openTrace(pMsg: RuntimeEvent<any>, pTrace: any) {

    }

    filter(pType: string) {

        const sesUID = this.session?.getUID();
        if(sesUID==null) return ;

        let ft = this.ft;
        if(ft==null){
            ft = this.ft = {
                [sesUID]: {
                    sess: this.session,
                    filters: {}
                }
            };
        }

        this.ftMode = pType;
        //ft.filters[pType] = { type: pType, opts: {} };
    }

    getFilterSuggest(pCurr:HookSession, pType: string):void {

    }

    addFilter(pEvent:any) {
        const u = this.session?.getUID();
        if(u==null) return ;

        const ft =this.ft[u];

        if(ft.filters[this.ftMode]==null)
            ft.filters[this.ftMode] = { type: this.ftMode, opts: pEvent };

        switch(this.ftMode){
            case 'hk':
                ft.filters.hk.opts.push(pEvent);
                break;
            case 'ev':
                ft.filters.ev.opts.push(pEvent);
                break;
            case 'msg':
                ft.filters.msg.opts.push(pEvent);
                break;
        }
    }

    getFilters(pCurr: Nullable<RuntimeSession>):Record<string, any> {
        if(pCurr==null) return {};
        const u = pCurr.getUID();
        if(u==null) return {};

        let ft = this.ft[u];
        if(ft!=null){
            return ft.filters;
        }else{
            return {};
        }
    }

    // pCurr: HookSession,
    _current_selected: number = -1;
    dropFilter( pType: string, pEvent:any) {
        /*const ft =this.ft[pCurr.getUID()];
        if(ft!=null){
            delete ft.filters[pType];
        }*/
    }

    getMessages():RuntimeEvent<any>[] {
        /*this.evtSvc.getEvents(pSesss, this.ft).subscribe((pMsgs:RuntimeEvent<any>[])=>{

        });*/

        return [];
    }

  configure( pData:any):void {
    this.data = pData;

    this.view.tab.icon = pData._icon;


    switch(pData.rt_type){
      case RuntimeEventType.HOOK:
        this.view.tab.label = "Hook Events";
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case RuntimeEventType.NETWORK:
        this.view.tab.label = "Network Events";
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case RuntimeEventType.FILESYSTEM:
        this.view.tab.label = "FS Events";
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case RuntimeEventType.MEMORY:
        this.view.tab.label = "Memory Events";
        this.view.tab.color = 'dxc-text-clear100';
        break;
      default:
        this.view.tab.label = "Runtime Events";
        this.view.tab.color = 'dxc-text-clear100';
        break;
    }
  }

  dxRefresh(){

  }
}
