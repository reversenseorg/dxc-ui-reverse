import {
  AfterViewInit,
  Component, HostListener,
  Input, OnInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import {StageComponent} from "../../stage/stage.component";
import {ProjectService} from "../ctrl/project.service";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {
  ContextMenuComponent,
  ContextMenuList,
  ContextMenuState
} from "../../../base/context-menu/context-menu.component";
import {IconModelCollection} from "../../../base/icon/IconModel";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";


@Component({
  selector: 'dxc-modal-project-active',
  template: `
    <app-modal-base [name]="'active-projects'" [width]="400" [height]="300"  [closable]="true" [mainController]="mainController" class="project-modal active-project">
      <div head>
        <h4><fa-icon [icon]="['fas','circle-question']"></fa-icon>&nbsp;Select the project to display</h4>
      </div>
      <div body class="body">

        <div class="msg">
          <!--<div><fa-icon [icon]="['fas','question-circle']" class="ico"></fa-icon></div>-->
          <p class="dxc-text-clear100">{{ msg[mode] }}</p>
        </div>
        <div *ngFor="let proj of projects" class="choice" [ngClass]="'dxc-choice-'+mode" (click)="select(proj)"  (contextmenu)="displayCtxMenu($event,'actP',proj)">
            <div class="dxc-text-clear100">{{ proj.uid }}</div>
            <div><i class="text-warning">{{ proj.package }}</i></div>
        </div>
      </div>
    </app-modal-base>

    <app-context-menu [name]="'actP'">
      <app-context-item [label]="'Close'" [icon]="gIcons['ERROR']" (itemclick)="closeProject(ctxMenuState.subject)"></app-context-item>
    </app-context-menu>
  `,
  styleUrls: ['../project.component.scss']
})
export class ModalActiveProjectComponent extends AbstractKeyboardNavigable implements OnInit, AfterViewInit {

  @Input() mainController:StageComponent;
  @ViewChildren(ModalBaseComponent) modals:QueryList<ModalBaseComponent>;

  // contextuak menu
  @ViewChildren(ContextMenuComponent) ctxMenuChildren: QueryList<ContextMenuComponent>;
  ctxMenu: ContextMenuList = {};
  ctxMenuState:ContextMenuState = null;

  /**
   * Active project
   * @type {DexcaliburProject}
   * @field
   */
  project:DexcaliburProject = null;
  projects:DexcaliburProject[] = [];

  msg: any = {
    select: "Several projects are opened. So, you must select a project for the current window, else open another project.",
    close: "Several projects are opened. So, you must select the project to close.",
  };

  mode: string = 'select';

  gIcons: IconModelCollection = GLOBAL_ICONS;

  constructor( private projectSvc:ProjectService, private kbSvc:KeyboardNavigationService) {
    super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);
  }


  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modals.first.hide('close');
        break;
    }
  }

  ngAfterViewInit() {

    console.log(this.modals);
    this.projectSvc.getActiveProject().subscribe( (pProjects:DexcaliburProject[]) => {
      if(pProjects.length<1) return;
      if(pProjects.length==1) {
        this.project = pProjects[0];
        return;
      }

      this.projects = pProjects;

      this.mode = 'select';
      this.showActiveProjects();
    });

    // init contextual menus
    this.ctxMenu = {};
    this.ctxMenuChildren.toArray().map( vMenu => {
      this.ctxMenu[vMenu.name] = vMenu;
    });


    this.projectSvc.onMenuClick.subscribe( (pEvent:any)=>{
      if(pEvent.item=="active"){
        this.projectSvc.getActiveProject().subscribe( (pProjects:DexcaliburProject[]) => {
          this.projects = pProjects;


          this.mode = 'select';
          this.showActiveProjects();
        });
      }
      else if(pEvent.item=="close-project"){
        console.log('Closing project',this);
        if(this.project != null){
          this.closeProject(this.project);
        }else if(this.projects.length>0){
          this.mode = 'close';
          // Multiple project : select the project to close
          this.showActiveProjects();
        }
      }
    });

  }


  showActiveProjects():void {
    this.modals.first.show();
  }

  select( pProject:DexcaliburProject) {
    this.project = pProject;
    console.log(this.mode, pProject);
    if(this.mode=='select'){
      this.projectSvc.switchTo(pProject);
    }else{
      this.closeProject(pProject);
    }
    this.modals.first.hide();
  }

  closeProject(pProject:DexcaliburProject){
    this.projectSvc.closeProject(pProject).subscribe((pSuccess:any)=>{
      console.log(pSuccess);
      if(pSuccess){
        //if(this.projects.length-1>1){
          this.projectSvc.getActiveProject().subscribe( (pProjects:DexcaliburProject[]) => {
            if(pProjects.length<2) {
              this.projects = null;
              if(pProjects.length==1)
                this.projectSvc.switchTo(pProjects[0]);

              this.modals.first.hide();
            }else
              this.projects = pProjects;
          });
        /*}else{
          this.modals.first.hide();
        }*/
      }
    })
  }

  displayCtxMenu(pEvent:any, pType:string, pObject:any):void{
    pEvent.preventDefault();

    this.ctxMenuState = {
      menu: this.ctxMenu[pType],
      subject: pObject
    };
    this.ctxMenu[pType].show(pEvent, pObject);
  }

/*
  @HostListener('document:keydown.escape')
  onEscape(){
    this.modals.first.hide();
  }*/
}
