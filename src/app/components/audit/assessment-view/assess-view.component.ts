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
