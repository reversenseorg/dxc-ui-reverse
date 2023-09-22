


import {ChangeDetectionStrategy, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {DxcComponent} from "../DxcComponent";


let i = 0;

/**
 *
 */
@Component({
  selector: 'dxc-ref',
  template: `
    <span class="selt" [ngStyle]="style"><ng-content></ng-content></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefComponent extends DxcComponent implements OnInit {

  @Input() style:string = null;

  uid = -1;

  constructor( ) {
    super();
    this.uid = i++;
  }

  ngOnInit() {
  }


  //@HostListener('keydown.meta.c',['$event'])
  //@HostListener('keydown.control.c',['$event'])
  onCopy():any {
    alert(this.uid+" : "+window.getSelection().toString());
  }
}

