


import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {ElectronService} from "../../core/services";
import {IStringIndex} from "../IStringIndex";

/**
 *
 */
@Component({
  selector: 'dxc-preview',
  template: `
    <ng-container *ngIf="inline">
      <div (mouseover)="extendPreview($event)" (click)="select()" (mouseout)="collapsePreview($event)" class="dxc-preview">
        <pre *ngIf="!expanded" class="text-white mb-0 mt-0 dxc-preview-noscroll">{{ preview }}</pre>
        <pre *ngIf="expanded" class="text-white mb-0 mt-0 dxc-preview-noscroll dxc-preview-exp">{{ data }}</pre>
      </div>
    </ng-container>
  `,
  styles: [`

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewerComponent implements OnInit, OnChanges {


  @Input() inline:boolean = true;
  @Input() data:any = null
  @Input() type:string = 's';
  @Input() length:number = 5;

  expanded:boolean = false;

  preview:string = '';

  constructor( private elecSvc:ElectronService) {

  }

  ngOnInit() {
  }

  ngOnChanges(pChanges: SimpleChanges) {
    if (pChanges.hasOwnProperty('type')) {
      this.type = pChanges['type'].currentValue;
    }
    if (pChanges.hasOwnProperty('length')) {
      this.length = pChanges['length'].currentValue;
    }

    if (pChanges.hasOwnProperty('data')) {
      //console.log("Change data", pChanges['data'].currentValue);
      this.data = pChanges['data'].currentValue;
      switch (this.type) {
        case 's':
            if(this.data.length>this.length){
              this.preview = this.data.substr(0,this.length)+'...';
            }else{
              this.preview = this.data;
            }
            break;
      }
    }

  }

  configure(pConfig:any=null) :void {
    if(pConfig != null){
      for(let i in pConfig)
        (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }

  /**
   * To add the current element to selection
   *
   * De-facto listener for click event
   *
   * @method
   */
  select(){
    this.elecSvc.getSelectionManager().selectText(this.data);
  }

  /**
   * To replace preview by full text
   * 
   * @param $event
   */
  extendPreview($event: any) {
    this.expanded = true;
  }

  collapsePreview($event: any) {
    this.expanded = false;
  }
}
