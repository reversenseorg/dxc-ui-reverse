


import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {DxcComponent} from "../DxcComponent";
import {Nullable} from "../Nullable";
import {NgClass, NgIf, NgStyle} from "@angular/common";

/**
 *
 */
@Component({
  selector: 'dxc-meta',
  template: `
      <span [ngClass]="gutters? 'badge dxc-no-gutters dxc-meta '+css:'badge dxc-gutters dxc-meta '+css" [ngStyle]="style">{{ label }}</span>
      <span *ngIf="value" [ngClass]="'badge dxc-no-gutters dxc-meta dxc-meta-value '+cssValue" [ngStyle]="styleValue">{{ value }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgIf,
    NgStyle
  ],
  standalone: true
})
export class MetaComponent extends DxcComponent  {


  @Input() style:Nullable<{ [klass:string]:any }> = null;

  @Input() styleValue:Nullable<{ [klass:string]:any }> = null;

  @Input() css:string = '';

  @Input() cssValue:string = '';

  @Input() label:any = null;

  @Input() value:any = null;

  @Input() gutters:boolean = true;

  constructor() {
    super();
  }

}

