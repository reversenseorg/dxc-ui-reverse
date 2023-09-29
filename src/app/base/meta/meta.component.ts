


import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {DxcComponent} from "../DxcComponent";
import {Nullable} from "../Nullable";

/**
 *
 */
@Component({
  selector: 'dxc-meta',
  template: `
      <span [ngClass]="gutters? 'badge dxc-no-gutters dxc-meta '+css:'badge dxc-gutters dxc-meta '+css" [ngStyle]="style">{{ label }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetaComponent extends DxcComponent implements OnInit, OnChanges {


  @Input() style:Nullable<{ [klass:string]:any }> = null;

  @Input() css:string = '';

  @Input() label:any = null

  @Input() gutters:boolean = true

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngOnChanges(pChanges: SimpleChanges) {


  }
}

