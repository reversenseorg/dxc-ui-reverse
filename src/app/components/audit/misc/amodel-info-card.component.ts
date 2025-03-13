import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnInit,
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
import AssuranceModel from "../../../models/audit/common/AssuranceModel";

/**
 * Represent a Merlin rule as a single row
 *
 * @class
 */
@Component({
  selector: 'dxc-audit-model-card',
  template: `
    <div class="card" style="width: 18rem;">
      <img *ngIf="logo" [src]="logo" class="card-img-top" [alt]="model.name">
      <div class="card-body">
        <h5 class="card-title">{{ model.id }}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">{{ model.name}}</h6>
        <p class="card-text">{{ shortDescription() }}</p>
        <!--<a href="#" class="card-link"><dxc-icon [model]="gIcons['MSG']" class="mr-2 dxc-text-darker"></dxc-icon>&nbsp;Contact</a>
        <a href="#" class="card-link"><dxc-icon [model]="gIcons['HELPER']" class="mr-2 dxc-text-darker"></dxc-icon>&nbsp;Help</a>-->
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">{{ author() }}</li>
        <li class="list-group-item">{{ version() }}</li>
        <li class="list-group-item"><i>Implemented by : {{ implementor() }}</i></li>
      </ul>
      <div class="card-body">
        <a href="#" class="card-link">
          <dxc-icon [model]="gIcons['DOWNLOAD']" class="mr-2 dxc-text-darker"></dxc-icon>&nbsp;Website
        </a>
        <a href="#" class="card-link">
          <dxc-icon [model]="gIcons['DOWNLOAD']" class="mr-2 dxc-text-darker"></dxc-icon>&nbsp;Download
        </a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssuranceModelInfoCardComponent extends DxcComponent implements OnInit {


  @Input() model:AssuranceModel;

  @Input() style:Nullable<Record<string, any>> = null;

  @Output() onDryRunSuccess:EventEmitter<any> = new EventEmitter<any>();
  @Output() onDryRunFailed:EventEmitter<any> = new EventEmitter<any>();

  idle = true;
  gIcons:any = GLOBAL_ICONS;

  logo:Nullable<URL> = null;

  constructor(
      private _projectSvc: ProjectService,
      private _outputSvc: OutputService,
      private _searchSvc: SearchService,
      private _changeDetector:ChangeDetectorRef
  ) {
    super();
  }


  ngOnInit(): void {
      if(this.model != null){

      }
  }



  /**
   *
   * @param pAssess
   * @param pRule
   */
  dryRunRule(pAssess: ControlAssessment, pRule: any) {
    console.log(pAssess);
    if(!this._projectSvc.isProjectIsOpen()){
      this._outputSvc.alert(OutputMessage.newError({msg:"Open a project first"}));
      return;
    }else{
      this.idle = false;
      this._changeDetector.detectChanges();
      this._searchSvc.executeRaw(pRule.request.__stringified.substring(1)).subscribe((res)=>{
        console.log("Execute MERLIN Request",res);
        this.idle = true;
        this._changeDetector.detectChanges();
        if(res.success){
          this.onDryRunSuccess.emit(res.data);
        }else{
          this.onDryRunFailed.emit(res.data);
        }
      })
    }
  }

  /**
   * To return a short form of the description truncated after `pLength` chars
   *
   * @param {number} pLength
   */
  shortDescription(pLength:number = -1):string {
    if(this.model.description==null){
      return "This assurance model has not description"
    }
    return "";
  }

  author():string  {
    return ""
  }

  version() {
    return "";
  }

  implementor() {
    return "";
  }
}

