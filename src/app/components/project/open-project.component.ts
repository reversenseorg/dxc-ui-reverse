import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "./ctrl/project.service";
import DexcaliburProject from "../../models/DexcaliburProject";
import {OutputMessage} from "../../cmp/OutputMessage";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {OutputService} from "../output/ctrl/output.service";
import {AppIcon} from "../../models/AppIcon";
import {AuthService} from "../auth/ctrl/auth.service";
import {Observable} from "rxjs";
import {Nullable} from "../../base/Nullable";


@Component({
  selector: 'dxc-project-open',
  template: `
    <div class="splash-panel openproject">
      <div class="container-fluid body">
        <h5>Workspace</h5>
        <div class="row ml-0 mr-0 g-0">
          <div class="col-lg-8 col-xl-8">
            <dxs-projects-list [height]="300" [pagignation]="true" (dblclickOne)="openProject($event)" (selectOne)="selectedProject = $event" (refreshed)="updateRender()"></dxs-projects-list>
            <!--
            <div class=" row project-menu">
              <div class="col-lg-8">
                {{ projectsCount }} projects found.
              </div>
              <div class="col-4"><button class="btn dxc-text-clear100">
              </button></div>
            </div>
            <div class="project-list">
              <ng-container *ngFor="let proj of projects; let i = index;">
                <div class="row project" [ngClass]="{ 'selected': (selectedUid==proj.uid) }" (click)="showProjectInfo(proj)" (dblclick)="openProject(proj)">
                  
                  <div class="col-8 label">
                    <h4 class="dxc-noselect">{{ proj.uid }}</h4>
                  </div>
                  
                  <div class="col-2 label">
                    {{ proj.meta.lastOpenDate | date:'dd/MM/yyyy HH:mm:ss'}} 
                  </div>
                  <div class="col-2 opts">
                    <fa-icon *ngIf="proj.os=='android'" [icon]="['fab','android']" class="text-success"></fa-icon>
                  </div>
                </div>
              </ng-container>
            </div>-->
          </div>
          <div class="col-lg-4 col-xl-4 ps-1 pe-1">
            <dxs-project-card *ngIf="selectedProject" [project]="selectedProject" [height]="200">
                <ng-container>
                  <div class="col-lg-4 g-0 offset-9">
                    <dxc-btn (click)="openProject(selectedProject)" [label]="'Open'"></dxc-btn>
                  </div>
                </ng-container>    
            </dxs-project-card>
            <!--
            <div *ngIf="selectedProject != null" class="project-details">
              <img height="32" [src]="selectedProject.icon.localPath" style="user-select:none"/>
                <div class="label">
                  <div class="selt"><b><dxc-ref>{{ selectedProject.uid }}</dxc-ref></b></div>
                  <div *ngIf="selectedProject.package!=null" >App name : <dxc-ref>{{ selectedProject.package }}</dxc-ref></div>
                  <div *ngIf="selectedProject.platform && selectedProject.platform.indexOf('android')>-1" class="text-success">
                    <fa-icon [icon]="['fab','android']"></fa-icon>&nbsp;{{ selectedProject.platform }}
                  </div>
                  <div class="dxc-text-clear100"><fa-icon [icon]="['fas','mobile']"></fa-icon>&nbsp;Device : <span class="badge rounded-pill badge-sm text-bg-info selt">{{ selectedProject.device }}</span></div>
                </div>

              <div class="row mt-2">
                <div class="col-6 offset-6">
                  <button class="btn btn-sm btn-secondary mr-2" (click)="deleteProject()">delete</button>
                  <button class="btn btn-sm btn-success" (click)="openProject()">
                    open
                  </button>
                </div>
              </div>
            </div>-->
          </div>
        </div>


      </div>
    </div>
  `,
  styleUrls: ['./project.component.scss']
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenProjectComponent implements OnInit {


  projectsCount:number = 0;
  projects:DexcaliburProject[] = [];
  selectedUid:Nullable<string> = null;

  selectedProject:any = null;

  gIcons:any = GLOBAL_ICONS;

  prjList:Observable<DexcaliburProject[]>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private activeRoute:ActivatedRoute,
    private outputSvc:OutputService,
    private projectService:ProjectService,
    private authSvc:AuthService) {

  }

  ngOnInit(){
    this.projectService.onRefreshAll.subscribe( (pProjects:DexcaliburProject[])=>{
      this._updateProjectList(pProjects);
    });
  }

  private _updateProjectList(pProjects:DexcaliburProject[]):void {

    // sort project by time by default
    this.projects = pProjects.sort((vProjA, vProjB)=>{
        return (vProjA.meta.lastOpenDate > vProjB.meta.lastOpenDate)? 1 : -1;
    });

    console.log(pProjects);

    this.projectsCount = pProjects.length;
    if (this.projectsCount == 0) {
      this.selectedProject = null;
    }
    this.changeDetectorRef.detectChanges();
  }

  refresh(){
    this.projectService.listProjects2().subscribe( (pProjects:DexcaliburProject[])=>{
      this._updateProjectList(pProjects);
    });
  }

  openProject(pProj: Nullable<DexcaliburProject>=null) {

      let p:DexcaliburProject;
      if(pProj!=null){
        p = pProj;
      }else{
        p = this.selectedProject;
      }

      if(p!=null){
        try{
          this.projectService.openProject(p).subscribe( (pResult)=>{
            if(pResult.success==true){
              //this.close();
            }
          });
        }catch (err:any) {
          this.outputSvc.alert(new OutputMessage({ msg:err.message }))
        }
      }
  }

  deleteProject(pProj: Nullable<DexcaliburProject> = null) {
    let p:DexcaliburProject;
    if(pProj!=null){
      p = pProj;
    }else{
      p = this.selectedProject;
    }

    if(p!=null){
      try{
        this.projectService.removeProject(p).subscribe( (pResult)=>{
          if(pResult.remove==true){
            this.outputSvc.print( OutputMessage.newSuccess({ src:"Project Manager", msg:`Project "${p.uid}" has been removed.`}));
            this.refresh();
          }
        });
      }catch (err:any) {
        this.outputSvc.alert(new OutputMessage({ msg:err.message }))
      }
    }
  }

  showProjectInfo(pProj: DexcaliburProject) {
    this.projectService.getProjectInfo(pProj).subscribe( (pEvent)=>{
      this.selectedUid  = pEvent.uid;
      this.selectedProject = pEvent;
      this.selectedProject.icon = pEvent.icon==null ? new AppIcon({ localPath:"/assets/icons/dexcalibur_32.png" }) : pEvent.icon;
    });
  }

  updateRender() {
    this.changeDetectorRef.detectChanges();
  }
}
