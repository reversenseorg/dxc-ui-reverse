import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import Platform from "../../models/Platform";
import {PlatformService} from "../platform/ctrl/platform.service";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";


@Component({
  selector: 'dxc-platform-list',
  template: `
    <div class="row no-gutters">
      <div class="col-10">
        <select [(ngModel)]="platform"  (ngModelChange)="pltChange($event)"  class="dxc-input">
          <option value="none">None</option>
          <option value="min">Minimal version supported</option>
          <option value="target">Target version from manifest</option>
          <optgroup label="Installed">
            <ng-container *ngFor="let plt of platforms">
              <option *ngIf="plt.installed" [value]="plt.uid">{{ plt.vendor | titlecase }}&nbsp;{{ plt.source | uppercase }}&nbsp;{{ plt.name }}&nbsp;{{ plt.version }}</option>
            </ng-container>
          </optgroup>
          <optgroup label="Available  (Internet required)">
            <ng-container *ngFor="let plt of platforms">
              <option *ngIf="!plt.installed" [value]="plt.uid">{{ plt.vendor | titlecase }}&nbsp;{{ plt.source | uppercase }}&nbsp;{{ plt.name }}&nbsp;{{ plt.version }}</option>
            </ng-container>
          </optgroup>
        </select>
      </div>
      <div class="col-2 pl-2">
        <dxc-refresh-btn (newClick)="refresh()"></dxc-refresh-btn>
      </div>
    </div>


  `,
  styleUrls: ['./device.component.scss','../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformListComponent implements OnInit{

  gIcons:any = GLOBAL_ICONS;
  @Input() platform:string;
  @Input() platforms:Platform[];
  @Output() selectPlatform:EventEmitter<string> = new EventEmitter<string>();

  constructor(  private platformSvc:PlatformService) {
  }

  ngOnInit(){
    this.refresh();
  }

  refresh():void {
    const subs = this.platformSvc.list().subscribe(( pPlatforms)=>{
      this.platforms = pPlatforms;
      subs.unsubscribe();
    });
  }

  pltChange(pEvent: any) {
    console.log("pltChange ",pEvent);
    this.selectPlatform.emit(pEvent as string);
  }
}
