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

/**
 * Represent a Control Assessment (i.e. a test)
 *
 * @class
 */
@Component({
  selector: 'dxc-audit-assessment',
  template: `
    <div class="row g-0 dxc-text-100 dxc-rule-req" style="padding:0">
      <div class="col-11 dxc-text-75">
        <dxc-meta [label]="assessement.testType" [css]="'dxc-text-std dxc-salmon'" [ngbTooltip]="getTooltipFor(assessement.testType)"></dxc-meta>
        {{ assessement.name }}
        <b>[<span class="ml-2 dxc-text-yellow">{{ assessement.rules.length }}</span>]</b>
      </div>
      <div class="col-1 text-center" >
        <dxc-icon [model]="gIcons['PLAY']"></dxc-icon>
      </div>
    </div>
    <ng-container  *ngFor="let r of assessement.rules">
      <dxc-audit-rule *ngIf="r!=null" [rule]="r" [assessement]="assessement" (onDryRunSuccess)="onDryRunSuccess.emit($event)"></dxc-audit-rule>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentRowComponent extends DxcComponent  {


  @Input() assessement:ControlAssessment;
  @Input() style:Nullable<Record<string, any>> = null;

  @Output() onDryRunSuccess:EventEmitter<any> = new EventEmitter<any>();
  @Output() onDryRunFailed:EventEmitter<any> = new EventEmitter<any>();


  gIcons:any = GLOBAL_ICONS;

  constructor(
      private _projectSvc: ProjectService,
      private _outputSvc: OutputService,
      private _searchSvc: SearchService,
      private _changeDetector:ChangeDetectorRef
  ) {
    super();
  }

  /**
   * Should create mini-test plan according to ttype of test
   * @param pAssess
   * @param pRule
   */
  dryRunRule(pAssess: ControlAssessment, pRule: any) {

    console.log(pAssess);
    if(!this._projectSvc.isProjectIsOpen()){
      this._outputSvc.alert(OutputMessage.newError({msg:"Open a project first"}));
      return;
    }else{
      this._searchSvc.executeRaw(pRule.request.__stringified.substring(1)).subscribe((res)=>{
        console.log("Execute MERLIN Request",res);
        if(res.success){
          this.onDryRunSuccess.emit(res.data);
        }else{
          this.onDryRunFailed.emit(res.data);
        }
      })
    }
  }


  getTooltipFor(pValue: any) {

    if(typeof pValue==='string'){
      switch (pValue){
        case "iast":
          return "Interactive Testing";
        case "dast":
          return "Dynamic Testing";
        case "sast":
          return "Static Code Analysis";
      }
    }

    return "";
  }
}

