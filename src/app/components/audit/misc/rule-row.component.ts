import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output,} from "@angular/core";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import ControlAssessment from "../../../models/audit/common/ControlAssessment";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {ProjectService} from "../../project/ctrl/project.service";
import {OutputService} from "../../output/ctrl/output.service";
import {SearchService} from "../../search/ctrl/search.service";
import {Nullable} from "../../../base/Nullable";
import {DxcComponent} from "../../../base/DxcComponent";
import {AuditService, CheckEventState} from "../ctrl/audit.service";

/**
 * Represent a Merlin rule as a single row
 *
 * @class
 */
@Component({
  selector: 'dxc-audit-rule',
  template: `
    <div class="row g-0 dxc-text-100 dxc-rule-req" style="padding:0" [ngStyle]="style" (click)="dryRunRule(assessement,rule)">
      <div class="col-1">&nbsp;</div>
      <div class="col-10 dxc-text-75">
        <dxc-meta [label]="rule.o.targetOS" [css]="'dxc-text-std dxc-herb'"></dxc-meta>
        <dxc-meta *ngIf="rule.emulate" [label]="'emulation allowed'" [css]="'dxc-text-std dxc-yellow'"></dxc-meta>
        <span *ngIf="rule.request!=null">{{ rule.request.__stringified }}</span> 
      </div>
      <div class="col-1 text-center" >
        <dxc-icon *ngIf="idle; else running" [model]="gIcons['PLAY']"></dxc-icon>
        <ng-template #running>
          <dxc-icon [model]="gIcons['SPINNER']"></dxc-icon>
          <!-- todo: ADD TIMER -->
        </ng-template>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RuleRowComponent extends DxcComponent  {


  @Input() assessement:ControlAssessment;

  @Input() rule:any;

  @Input() style:Nullable<Record<string, any>> = null;

  @Input() gutters:boolean = true;

  @Output() onDryRunSuccess:EventEmitter<any> = new EventEmitter<any>();
  @Output() onDryRunFailed:EventEmitter<any> = new EventEmitter<any>();
  @Output() onScanning:EventEmitter<boolean> = new EventEmitter<boolean>();

  idle = true;

  gIcons:any = GLOBAL_ICONS;

  constructor(
      private _projectSvc: ProjectService,
      private _auditSvc: AuditService,
      private _outputSvc: OutputService,
      private _searchSvc: SearchService,
      private _changeDetector:ChangeDetectorRef
  ) {
    super();
  }

  /**
   *
   * @param pAssess
   * @param pRule
   */
  dryRunRule(pAssess: ControlAssessment, pRule: any) {

    if(!this._projectSvc.isProjectIsOpen()){
      this._outputSvc.alert(OutputMessage.newError({msg:"Open a project first"}));
      return;
    }

    this.idle = false;
    this.onScanning.emit(this.idle);
    this._changeDetector.detectChanges();

    this._auditSvc.runRule(pAssess,pRule).subscribe((res)=>{
      console.log("Execute MERLIN Request",res);

      this.idle = true;
      this.onScanning.emit(this.idle);

      this._changeDetector.detectChanges();
      if(res.event.state==CheckEventState.SUCCESS){
        this.onDryRunSuccess.emit(res.results);
      }else{
        this.onDryRunFailed.emit(null);
      }
    });
  }
}

