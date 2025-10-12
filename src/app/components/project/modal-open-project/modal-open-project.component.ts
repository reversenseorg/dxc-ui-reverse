import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Message} from "../../../cmp/Error";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ProjectService} from "../ctrl/project.service";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {AppIcon} from "../../../models/AppIcon";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {IconModelCollection} from "../../../base/icon/IconModel";
import {Nullable} from "../../../base/Nullable";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}

@Component({
  selector: 'dxc-modal-open-project',
  template: `
  <app-modal-base [name]="'openproj'" [closable]="closable" [width]="400" [height]="450" [mainController]="controller.app" (click)="kbSvc.focus(this)">
    <div head class="dxc-modal-header">
      Open project
    </div>
    <ng-container options>
      <span><dxc-icon [model]="gIcons['REFRESH']" (click)="refresh()"></dxc-icon></span>
    </ng-container>
    <div body class="dxc-modal-body">
        <div class="fullwidth-list" style="height:200px;">
          <ng-container *ngFor="let proj of projects; let index = index">
            <div class="row no-gutters" [ngClass]="focusEl==index?'focus':''" (click)="selectProject(proj, index)">
              <div class="col-lg-10 offset-1 dxc-noselect">{{ proj.uid }}</div>
              <div class="col-lg-1"><dxc-icon *ngIf="focusEl==index" [model]="gIcons['TRASH']" (click)="removeProject(proj)"></dxc-icon></div>
            </div>
          </ng-container>
        </div>
        <div class="text-center dxc-text-clear100" style="width:100%;overflow-x:auto;color:#bbb;border-top:1px solid #777;padding:1em;" *ngIf="selected==null">
          <i>Select a project to show details</i>
        </div>
        <div *ngIf="selected" style="width:100%;overflow-x:auto;color:#bbb;border-top:1px solid #777;padding:1em;">
             <ng-container *ngIf="selected.uid">
               <div class=" pl-1 dxc-text-clear75 text-capitalize"><i>Project :</i></div>
              <div class=" pl-3 dxc-text-clear100">{{ selected.uid }}</div>
            </ng-container>
  
            <ng-container *ngIf="selected.package">
              <div class=" mt-2 pl-1 dxc-text-clear75 text-capitalize"><i>Package </i></div>
              <div class=" pl-3 dxc-text-clear100 dxc-twrap">{{ selected.package }}</div>
            </ng-container>
  
            <ng-container *ngIf="selected.platform">
              <div class=" mt-2 pl-1 dxc-text-clear75 text-capitalize"><i>Platform </i></div>
              <div class=" pl-3 dxc-text-clear100 dxc-twrap">{{ selected.platform }}</div>
            </ng-container>
        </div>
    </div>
    <div footer>
        <button class="dxc-frm-btn" (click)="close()">Cancel</button>
        <button class="dxc-frm-btn default" (click)="openProject()">Open</button>
    </div>
  </app-modal-base>
  `,
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalOpenProjectComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() controller:any;
  @Input() closable = true;
  @Input() progress$:Observable<any> ;
  @Input() progressSrc:any = null;
  @Input() progress = 20;

  @Input() projects:DexcaliburProject[] = [];
  projectsCount = 0;

  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:Nullable<string> = null;

  @Input() message:Nullable<Message> = null;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  gIcons:IconModelCollection = GLOBAL_ICONS;
  project:Nullable<DexcaliburProject> = null;
  item: any = null;
  selected: Nullable<DexcaliburProject> = null;
  focusEl = -1;



  onKeyboardEvent:Subject<any> = new Subject<any>();

  constructor(
              private changeDetectorRef: ChangeDetectorRef,
              private projSvc:ProjectService,
              private outputSvc:OutputService,
              public kbSvc: KeyboardNavigationService ) {
    super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);
  }


  show():void{
    this.modal.show();

    this.refresh();


    //this.kbSvc.focus()
    console.log("[MODAL PROJECT OPEN] show()");
    this.changeDetectorRef.detectChanges();
  }

  close():void{
    this.modal.hide('close');
  }

  selectProject(proj: DexcaliburProject, pIndex = -1):void {
      this.focusEl = pIndex;
      this.projSvc.getProjectInfo(proj).subscribe( (pEvent)=>{
        console.log("selectProject ",pEvent);
        this.selected = pEvent;
        (this.selected as any).icon = pEvent.icon==null ? new AppIcon({ localPath:"/assets/icons/dexcalibur_32.png" }) : pEvent.icon;
      });
  }

  selectProjectByOffset(pOffset:number):void {
    if(this.projects.length>pOffset){
      this.focusEl = pOffset;
      this.projSvc.getProjectInfo(this.projects[pOffset]).subscribe( (pEvent)=>{
        this.selected = pEvent;
        (this.selected as any).icon = pEvent.icon==null ? new AppIcon({ localPath:"/assets/icons/dexcalibur_32.png" }) : pEvent.icon;
      });
    }
  }


  onKeyPress(pEvent: any):void {
    console.log("On key press catched by open project modal ",pEvent);

    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }

  /*
    @HostListener('window:keydown.arrowup', ['$event'])
    onPrevProject( pEvent: KeyboardEvent){
      console.log("Arrow UP", pEvent);
      if( (this.focusEl-1) > this.projects.length){
        this.selectProjectByOffset(this.focusEl-1);
      }
    }


    @HostListener('window:keydown.arrowdown', ['$event'])
    onNextProject( pEvent: KeyboardEvent){
      console.log("Arrow DOWN", pEvent);
      if( (this.focusEl+1) > this.projects.length){
        this.selectProjectByOffset(this.focusEl+1);
      }
    }
  */
  /**
   * To open the project selected, close modal, and send event
   */
  openProject():void {
    if(this.selected!=null){
      try{
        this.projSvc.openProject(this.selected).subscribe( (pResult)=>{
          if(pResult.success==true){
            this.close();
          }
        } );
      }catch(err:any){
        this.outputSvc.alert( new OutputMessage({ msg:err.message }));
      }

    }
  }

  /**
   * To remove selected project
   */
  removeProject(pProject:Nullable<DexcaliburProject> = null):void {
      let project:Nullable<DexcaliburProject>;
      try{
        project = (pProject==null ? this.selected : pProject);
        if(project==null){
          throw new Error("Cannot remove project");
        }
        this.projSvc.removeProject(project).subscribe( ()=>{
          this.refresh();
        });
      }catch(err:any){
        this.outputSvc.alert( new OutputMessage({ msg:err.message }));
      }

  }

  refresh():void {
    this.projSvc.listProjects2(0,500).subscribe((pProjects:DexcaliburProject[])=>{
      this.projects = pProjects;
      this.projectsCount = pProjects.length;

      if(this.projectsCount==0){
        this.selected = null;
      }

      this.changeDetectorRef.detectChanges();
    });
  }
}
