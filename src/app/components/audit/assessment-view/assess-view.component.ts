import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TOPO_ICONS} from "../../topology/icons";
import {OutputService} from "../../output/ctrl/output.service";
import {AuditController} from '../ctrl/AuditController';
import {AuditService} from "../ctrl/audit.service";
import {UIException} from "../../../base/error/UIException";
import {DomSanitizer} from "@angular/platform-browser";
import ControlAssessment, {AnalysisType, TestType} from "../../../models/audit/common/ControlAssessment";
import {MerlinPrimitive} from "../../../models/search/Merlin";


@Component({
  selector: 'dxe-audit-assess-view',
  templateUrl: './assess-view.component.html',
  styleUrls: ['../audit.scss','../../../forms.scss',"../../../../../node_modules/flag-icons/css/flag-icons.min.css" ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessViewComponent implements AfterViewInit {


  @Input() assess: ControlAssessment;
  @Input() controller: AuditController;
  @Input() level:number = 0;
  @Input() offset: number;
  @Input() parentNum: string;
  @Input() numType: string = "num";

  @Input() dryrunResults: Record<string, any> = {};

  gIcons:any = GLOBAL_ICONS;
  tIcons:any = TOPO_ICONS;

  /**
   *
   */
  searchCtrl: any;


  constructor(
    private auditService: AuditService,
    private outputSvc:OutputService,
    private domSanitizer:DomSanitizer,
    private _changeRef:ChangeDetectorRef) {

  }

  /**
   * To init component
   */
  ngAfterViewInit(): void {

    if(this.controller.app==null){
      throw UIException.APP_NOT_INITIALIZED;
    }

    this.searchCtrl = this.controller.app.getController('ctrl:search');
  }

  getOffset() {
    switch (this.numType){
      case "num":
        return this.offset;
      case "alpha":
        // 0x41 = A, 0x5A = Z
        let offset = this.offset;
        let num = this.offset % (0x5A-0x41);
        let n = String.fromCharCode(0x41+this.offset);
        if(num == offset){
          return n;
        }

        // todoo
        return "XX"+n;

        // (this.offset-num)/(0x5A-0x41)

        break;
      default:
        return this.offset;
    }
  }

  calcPadding() {
    return "0";
  }


  hasProfiles():boolean {
    for(let k in (this.assess as any)._meta){
      if(k.startsWith("profile.")) return  true;
    }
    return false;
  }

  getProfileTags():any[] {
    const profiles:any[] = [];
    for(let k in (this.assess as any)._meta){
      if(k.startsWith("profile.")) profiles.push(((this.assess as any)._meta[k]));
    }
    return profiles;
  }

  onScanning($event: boolean) {
    
  }

  onDryRunSuccess( pIndex:any, $event: any) {
    this.dryrunResults[pIndex] = $event;
    console.log("onDryRunSuccess > ",pIndex, $event);
  }


  calcStyles(pWhere:string):any{
    switch (pWhere){
      case 'title':
        return {
          fontSize: 2*((1+(0.5*this.level))/(this.level+1))+"em",
          fontWeight: 'bold',
          //  paddingLeft: this.level+"em"
        };
        break;
      case 'subtitle':
        return {
          fontSize: "1.3em",
          fontStyle: 'italic'
          //  paddingLeft: this.level+"em"
        };
        break;
      default:
        return {};
    }
  }

  getAnalyzerType() {
    switch (this.assess.analType){
      case AnalysisType.DAST:
        return "DAST";
      case AnalysisType.SAST:
        return "SAST";
      case AnalysisType.IAST:
        return "IAST";
    }
    return "";
  }

  getTestType() {
    switch (this.assess.testType){
      case TestType.VT:
        return "Verification Testing";
      case TestType.PT:
        return "Penetration Testing";
    }
    return "";
  }

  getAnalyzerStyle() {
    switch (this.assess.analType){
      case AnalysisType.DAST:
        return "dxc-salmon";
      case AnalysisType.SAST:
        return "dxc-salmon dxc-text-black";
      case AnalysisType.IAST:
        return "dxc-azur";
    }
    return "";
  }

  hasDryResults(pRule: any) {
    return (this.dryrunResults[pRule.id]!=null)
  }

}
