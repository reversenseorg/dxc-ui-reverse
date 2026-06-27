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
          </div>
          <div class="col-lg-4 col-xl-4 ps-1 pe-1">
            <dxs-project-card *ngIf="selectedProject" [project]="selectedProject" [height]="200">
                <ng-container>
                  <div class="col-lg-4 g-0 offset-9 pt-2">
                    <dxc-btn (click)="openProject(selectedProject)" [label]="'Open'"></dxc-btn>
                  </div>
                </ng-container>    
            </dxs-project-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  }


  refresh(){

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
            }else{
              this.outputSvc.alert(new OutputMessage({ msg:pResult.msg.message }))
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
