import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {IntentDataCriteria} from "../../../models/android/Intent";
import {OutputMessage} from "../../../cmp/OutputMessage";


@Component({
  selector: 'dxc-intent-criteria-data',
  template: `
    <ng-container *ngIf="inputMode; else tagMode">

      <span *ngIf="_f.scheme!=null">

        <span class="badge badge-secondary dxc-meta" style="line-height: 12px;">URI:</span>
        <input class="dxc-frm-input dxc-meta" style="line-height: 12px; padding: 2px 0 1px 1em;color:#ee8f4e; font-weight:800; font-family:'Courier New', Courier, monospace; font-size:11px; width:70%;"  [(ngModel)]="uri">
      </span>
    </ng-container>
    <ng-template #tagMode>
      <span *ngIf="_f.scheme!=null">

        <span class="badge badge-secondary dxc-meta">URI:</span>
        <span class="badge badge-info dxc-meta">{{ _f.scheme }}</span>
        <span class="badge badge-secondary dxc-meta">://</span>
        <span *ngIf="_f.host!=null">
          <span class="badge badge-info dxc-meta">{{ _f.host }}</span>
          <span class="badge badge-secondary dxc-meta" *ngIf="_f.port!=null">:</span>
          <span class="badge badge-info dxc-meta" *ngIf="_f.port!=null">{{ _f.port }}</span>
        </span>
        <span class="badge badge-secondary dxc-meta" *ngIf="_f.host==null">*</span>
        <span class="badge badge-secondary dxc-meta" *ngIf="_f.port!=null">/</span>
        <span *ngIf="_f.pathPattern!=null">
          <span class="badge badge-secondary dxc-meta">pathPattern:</span>
          <span class="badge badge-info dxc-meta">{{ _f.pathPattern }}</span>
        </span>
        <span *ngIf="_f.path!='*'">
          <span *ngIf="_f.pathPattern!=null" class="badge badge-warning dxc-meta">OR</span>
          <span class="badge badge-secondary dxc-meta">path:</span>
          <span class="badge badge-info dxc-meta">{{ _f.path }}</span>
        </span>
        <span *ngIf="_f.pathPrefix!=null">
          <span *ngIf="_f.path!=null || _f.pathPattern!=null" class="badge badge-warning dxc-meta">OR</span>
          <span class="badge badge-secondary dxc-meta">pathPrefix:</span>
          <span class="badge badge-info dxc-meta">{{ _f.pathPrefix }}</span>
        </span>

        <span class="badge badge-secondary dxc-meta" *ngIf="_f.port!=null">&nbsp;</span>
      </span>
    </ng-template>

    <span *ngIf="_f.mimeType!=null" class="ml-1">
      <span class="badge badge-secondary dxc-meta">MIME:</span>
      <span class="badge badge-info dxc-meta">{{ _f.mimeType }}</span>
    </span>
  `,
  styleUrls: ['../../../forms.scss']
})
export class IntentPatternComponent implements OnChanges{
  @Input() _f:IntentDataCriteria;
  @Input() inputMode:boolean = false;
  @Output() enter:EventEmitter<any> = new EventEmitter<any>()

  uri:string = null;
  prefix:string = null;
  pattern:string = null;

  constructor() {
  }

  ngOnChanges(pChanges: SimpleChanges): void {
    if(pChanges.hasOwnProperty('_f')){
      this.prepareURI(pChanges._f.currentValue);
    }
  }

  prepareURI( pData:IntentDataCriteria):string {
    if(pData.scheme==null){
      return null;
    }

    this.uri = pData.scheme;

    if(pData.host!=null){
      this.uri += '://'+pData.host;
      if(pData.port!='*'){
        this.uri += ':'+pData.port;
      }
    }

    if(pData.path!=null){
      this.uri += '/'+pData.path;
    }
    else if(pData.pathPattern!=null){
      this.uri += '/'+pData.pathPattern;
      this.pattern = pData.pathPattern;
    }
    else if(pData.pathPrefix!=null){
      this.uri += '/'+pData.pathPrefix;
      this.prefix = pData.pathPrefix;
    }


  }

}
