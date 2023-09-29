import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, NavigationStart} from "@angular/router";
import {ProjectService} from "./ctrl/project.service";
import DexcaliburProject from "../../models/DexcaliburProject";
import {AuthService} from "../auth/ctrl/auth.service";


@Component({
  selector: 'dxc-project-latest',
  template: `
    <div class="splash-panel latest">
        <div class="header">
          <h4>Recents projects</h4>
        </div>
        <div class="body row">
          <ng-container *ngFor="let proj of projects; let i = index;">
            <div class="col-3 project">
              <div class="card">
                <ng-template *ngIf="proj != null; else emptyBlock ">
                    <img class="card-img" src="/assets/icon/dexcaalibur_64.png"/>
                    <div>{{ proj.uid }}</div>
                    <div>{{ proj.pkg }}</div>
                    <!--<div class="flags">
                      <fa-icon [icon]="" *ngIf="proj.platform"></fa-icon>
                      <fa-icon [icon]="" *ngIf="proj.platform"></fa-icon>
                    </div>-->
                </ng-template>
                <ng-template #emptyBlock>
                  <div *ngIf="(i==0 || (projects[i-1] != null))" class="new" [routerLink]="['..','new']">
                    <fa-icon [icon]="['fal','plus']"  ></fa-icon><br>new
                  </div>
                  &nbsp;
                </ng-template>
               </div>
            </div>
          </ng-container>
        </div>
    </div>
  `,
  styleUrls: ['./project.component.scss']
})
export class LatestProjectComponent implements OnInit {

  projects: DexcaliburProject[] = [];

  constructor(
    private activeRoute:ActivatedRoute,
    private projectService:ProjectService) {

  }

  ngOnInit() {
    this.projectService.listProjects().subscribe( (pEvent:any)=>{

    });


  }

}
