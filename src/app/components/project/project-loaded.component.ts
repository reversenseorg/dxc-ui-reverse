import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {ProjectService} from "./ctrl/project.service";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgIf} from "@angular/common";
import {DxcBaseModule} from "../../base/dxc-base.module";

@Component({
  selector: 'dxs-project-status',
  template: `
    <ng-container *ngIf="ready;else addpdown">
      <app-subnavbar-btn [color]="'status'">
        <fa-icon [icon]="['fas','circle']" class="running"></fa-icon>&nbsp;AppDB Ready
      </app-subnavbar-btn>
    </ng-container>
    <ng-template #addpdown>
      <app-subnavbar-btn [color]="'status'">
        <fa-icon [icon]="['fas','circle']" [class]="unknown?'unknown':'stopped'"></fa-icon>&nbsp;AppDB Down
      </app-subnavbar-btn>
    </ng-template>
  `,
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgIf,
    DxcBaseModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectStatusComponent implements OnInit {

  unknown:boolean = false;
  ready = false;

  constructor( private _prjSvc: ProjectService,
               private _chRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    const puid = sessionStorage.getItem('puid');
    if(puid==null){
      this.unknown = true;
      this._chRef.detectChanges();
    }else{
      this._prjSvc.getProject(puid).subscribe( (pEvent)=>{
        this.ready = pEvent.loaded;
        this._chRef.detectChanges();
      });
    }
  }
}
