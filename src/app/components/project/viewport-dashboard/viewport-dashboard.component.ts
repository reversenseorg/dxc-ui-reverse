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
import {ClipboardService} from "../../../core/services/clipboard.service";
import {HookService} from "../../hooks/ctrl/hook.service";
import Application from '../../../models/Application';
import {Nullable} from "../../../base/Nullable";
import {TopologyController} from "../../topology/ctrl/TopologyController";
import {ProjectResolver} from "../ctrl/project-resolver.service";

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
  template: `
    <div [class.dxc-hidden]="(parent.activeCtn==null) || (id!=parent.activeCtn.id)"  class="container-fluid viewport-dbd">
      <app-viewport-splitted [type]="'1:2'" [flex]="false" [controller]="controller" [parent]="this" [leftWidth]="50">
        <ng-container body-left>
          <app-viewport-splitted [type]="'2:1'" [flex]="false" [controller]="controller" [heightPct]="90"  [parent]="this" [topHeight]="50">
            <ng-container nav-top>
              <app-subnavbar>
                <ng-container main>
                  <app-subnavbar-btn [active]="true"  (click)="showInfo(TOPIC.PRJ)">Project</app-subnavbar-btn>
                </ng-container>
              </app-subnavbar>
            </ng-container>
            <ng-container body-top>


              <div class="container-fluid" class="p-1" *ngIf="project">
                <div class="row no-gutters"><div class="col-2 datapair-key">Project ID :</div><div class="col-8 datapair-val"><dxc-ref>{{ project.uid }}</dxc-ref></div></div>
                <div class="row no-gutters"><div class="col-2 datapair-key">Workspace :</div><div class="col-8 datapair-val"><dxc-ref>{{ project.uid}}</dxc-ref></div></div>
                <div class="row no-gutters">
                  <div class="col-2 datapair-key">Default device :</div>
                  <div class="col-8 datapair-val" *ngIf="project.device!=null"><dxc-ref>{{ project.device.model }}</dxc-ref></div>
                </div>
              </div>


              <!--
              <app-expandable-list>
  
                <ng-template #expCodeItem let-itemObj="item" >
  
                  <span *ngIf="NODE_TYPES.INSPECTOR==itemObj.__" (contextmenu)="displayExtMenu($event,'inspector',itemObj)">
                    <dxc-icon [model]="itemObj.running ? hIcons['UP'] : hIcons['DOWN']"></dxc-icon>
                    <span>{{ itemObj.name }}</span>
                    <span *ngIf="itemObj.hookset && itemObj.hookset.strats.length>0" class="text-warning">&nbsp;[hook]</span>
                    <span *ngIf="itemObj.listener.length>0" class="text-info">&nbsp;[rules]</span>
                  </span>
  
  
                </ng-template>
  
                <ng-container *ngFor="let insp of inspectors">
                  <app-expandable-item
                    [itemTpl]="expCodeItem"
                    [item]="insp"
                    [provider]="this"
                    [itemType]="insp.__"
                    (itemFocus)="onItemFocus('TL',$event)"
                    (collapse)="onCollapse($event)"
                    (expand)="onExpand($event)"
                  >
                  </app-expandable-item>
                </ng-container>
              </app-expandable-list>
              -->


            </ng-container>
            <ng-container nav-bottom>
              <app-subnavbar>
                <ng-container main>
                  <app-subnavbar-btn [active]="activeBL==TOPIC.RES"  (click)="showInfo(TOPIC.RES)">Ressources</app-subnavbar-btn>
                  <app-subnavbar-btn [active]="activeBL==TOPIC.URL"  (click)="showInfo(TOPIC.URL)">URL</app-subnavbar-btn>
                  <app-subnavbar-btn [active]="activeBL==TOPIC.BIN"  (click)="showInfo(TOPIC.BIN)">Binaries</app-subnavbar-btn>
                </ng-container>
              </app-subnavbar>
            </ng-container>
            <ng-container body-bottom>


              <ng-container *ngIf="activeBL==TOPIC.URL">

                <!--
                <app-expandable-list>
    
                  <ng-template #expCodeItem let-itemObj="item" >
    
                    <span *ngIf="NODE_TYPES.INSPECTOR==itemObj.__" (contextmenu)="displayExtMenu($event,'inspector',itemObj)">
                      <dxc-icon [model]="itemObj.running ? hIcons['UP'] : hIcons['DOWN']"></dxc-icon>
                      <span>{{ itemObj.name }}</span>
                      <span *ngIf="itemObj.hookset && itemObj.hookset.strats.length>0" class="text-warning">&nbsp;[hook]</span>
                      <span *ngIf="itemObj.listener.length>0" class="text-info">&nbsp;[rules]</span>
                    </span>
    
    
                  </ng-template>
    
                  <ng-container *ngFor="let insp of inspectors">
                    <app-expandable-item
                            [itemTpl]="expCodeItem"
                            [item]="insp"
                            [provider]="this"
                            [itemType]="insp.__"
                            (itemFocus)="onItemFocus('TL',$event)"
                            (collapse)="onCollapse($event)"
                            (expand)="onExpand($event)"
                    >
                    </app-expandable-item>
                  </ng-container>
                </app-expandable-list>-->
              </ng-container>


            </ng-container>
          </app-viewport-splitted>
        </ng-container>
        <ng-container body-right>
          <app-viewport-splitted [type]="'2:1'" [flex]="false" [controller]="controller" [heightPct]="90"  [parent]="this" [topHeight]="50">

            <ng-container nav-top>
              <app-subnavbar>
                <ng-container main>
                  <app-subnavbar-btn [active]="activeTR==TOPIC.TOP"  (click)="showInfo(TOPIC.TOP)">Topology</app-subnavbar-btn>
                  <app-subnavbar-btn [active]="activeTR==TOPIC.ENT"  (click)="showInfo(TOPIC.ENT)">Entropy</app-subnavbar-btn>
                </ng-container>
              </app-subnavbar>
            </ng-container>

            <ng-container body-top>
                
                <ng-container *ngIf="activeTR==TOPIC.TOP">
                    <dxc-topo-map [project]="project"></dxc-topo-map>
                </ng-container>

                
              <!--<ng-container *ngIf="data._t=='taa'">
                <app-viewport-topo-activity [data]="data" [width]="size.width" [height]="size.height" [parent]="this.parent" [controller]="this.getTopoController()"></app-viewport-topo-activity>
              </ng-container>

              <ng-container *ngIf="data._t=='tas'">
                <app-viewport-topo-service [data]="data" [width]="size.width" [height]="size.height" [parent]="this.parent" [controller]="this.getTopoController()"></app-viewport-topo-service>
              </ng-container>

              <ng-container *ngIf="data._t=='tap'">
                <app-viewport-topo-provider [data]="data" [width]="size.width" [height]="size.height" [parent]="this.parent" [controller]="this.getTopoController()"></app-viewport-topo-provider>
              </ng-container>

              <ng-container *ngIf="data._t=='tar'">
                <app-viewport-topo-receiver [data]="data" [width]="size.width" [height]="size.height" [parent]="this.parent" [controller]="this.getTopoController()"></app-viewport-topo-receiver>
              </ng-container>-->

            </ng-container>

            <ng-container nav-bottom>
              <app-subnavbar>
                <ng-container main>
                  <app-subnavbar-btn [active]="activeBR==TOPIC.SEC"  (click)="showInfo(TOPIC.SEC)">Security</app-subnavbar-btn>
                  <app-subnavbar-btn [active]="activeBR==TOPIC.STR"  (click)="showInfo(TOPIC.STR)">Strings</app-subnavbar-btn>
                  <app-subnavbar-btn [active]="activeBR==TOPIC.NET"  (click)="showInfo(TOPIC.NET)">Network</app-subnavbar-btn>
                </ng-container>
              </app-subnavbar>
            </ng-container>
            <ng-container body-bottom>

                <ng-container *ngIf="activeBR==TOPIC.SEC">
                    <dxc-search-result-list [hFull]="true"></dxc-search-result-list>
                </ng-container>
                
            </ng-container>
          </app-viewport-splitted>
        </ng-container>
      </app-viewport-splitted>
    </div>
  `,
  styleUrls: ['../../../base/expandable-list/expandable-list.component.scss', './viewport-dashboard.component.scss'],
  providers: [ProjectResolver]
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

  activeTR: number = this.TOPIC.TOP;
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
               private eSvc:ClipboardService,
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
