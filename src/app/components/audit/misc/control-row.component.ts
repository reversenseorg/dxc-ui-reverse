import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import ControlAssessment from "../../../models/audit/common/ControlAssessment";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {ProjectService} from "../../project/ctrl/project.service";
import {OutputService} from "../../output/ctrl/output.service";
import {SearchService} from "../../search/ctrl/search.service";
import {Nullable} from "../../../base/Nullable";
import {DxcComponent} from "../../../base/DxcComponent";
import Control from "../../../models/audit/common/Control";

/**
 * Represent a Control point, it contains :
 * - a set of Control Assessments
 * - a set of sub Controls
 *
 * Every rules inside a Control Assessment share the same
 * test type (sast, dast, symbolic, emu, ..)
 *
 * @class
 */
@Component({
  selector: 'dxc-audit-control',
  template: `
    <div class="row g-0 dxc-text-100 dxc-text-std dxc-control-row" [ngStyle]="style" style="padding:0">
      <div class="col-12 dxc-text-100">
        {{ control.name }}
      </div>
    </div>
    <ng-container  *ngFor="let a of control.assessments">
      <dxc-audit-assessment *ngIf="a!=null" [assessement]="a" (onScanning)="onScanning.emit($event)"  (onDryRunSuccess)="onDryRunSuccess.emit($event)"></dxc-audit-assessment>
    </ng-container>
  `,
  styles:[`
    .dxc-control-row {
      font-weight: bold;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlRowComponent extends DxcComponent  {


  @Input() control:Control|any;
  @Input() style:Nullable<Record<string, any>> = null;

  @Input() collapsible = false;
  @Input() collapsed = false;

  @Output() onDryRunSuccess:EventEmitter<any> = new EventEmitter<any>();
  @Output() onDryRunFailed:EventEmitter<any> = new EventEmitter<any>();
  @Output() onScanning:EventEmitter<boolean> = new EventEmitter<boolean>();


  gIcons:any = GLOBAL_ICONS;

  constructor(
      private _projectSvc: ProjectService,
      private _outputSvc: OutputService,
      private _searchSvc: SearchService,
      private _changeDetector:ChangeDetectorRef
  ) {
    super();
  }

}

