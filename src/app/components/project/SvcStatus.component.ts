import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ElectronService} from "../../core/services";
import {DexcaliburServerService} from "../../core/services/dexcalibur/dxc.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";




@Component({
  selector: 'dxc-svc-status',
  template: `
      <div class="splash-panel info">
        <div class="header">
          <h4>Status</h4>
        </div>
        <div class="body">
            <div class="row">
              <div class="col-6">Dexcalibur Server</div>
              <div class="col-6">
                <dxc-status [value]="dxcStatus"></dxc-status>
              </div>
            </div>
        </div>
      </div>
  `,
  styleUrls: ['./project.component.scss']
})
export class SvcStatusComponent implements OnInit {

  public readonly STOPPED = 0;
  public readonly RUNNING = 1;
  public readonly WAITING = 2;

  dxcStatus:Observable<number>;

  constructor( private activeRoute:ActivatedRoute,
               private electronService:ElectronService,
               private dxcSvrService:DexcaliburServerService) {

  }

  ngOnInit() {
    this.dxcStatus = this.dxcSvrService.getStatus().pipe(  map(pArgs=>{
      return (pArgs===this.RUNNING ? this.RUNNING : this.STOPPED);
    }));
  }
}
