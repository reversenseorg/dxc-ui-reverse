import {
  ChangeDetectionStrategy,
  Component,EventEmitter,
  Input,
  OnInit, Output,
} from '@angular/core';
import {IconModel} from "../icon/IconModel";

/**
 * This class represents the button component.
 *
 * Inputs:
 *  - icon: the IconModel to display
 *  - label: the label to display
 *  - disable: if true, the button is disabled
 *  - borderless: if true, the button has no border
 *  - click: the event emitted when the button is clicked
 */
@Component({
  selector: 'dxc-btn',
  template: `
    <button [ngStyle]="styles" [ngClass]="{ 'disabled': disable, 'borderless':borderless }" class="dxc-frm-btn" (click)="click">
      <dxc-icon *ngIf="icon" [model]="icon"></dxc-icon>
      {{ label }}
    </button>
  `,
  styleUrls: ['../../forms.scss'],
  styles:[`
    .borderless, .borderless:hover {
      border: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DxcButtonComponent implements OnInit {

  @Input() icon:IconModel;
  @Input() borderless = false;
  @Input() disable:boolean = false;
  @Input() styles:any = {};
  @Input() label = "";
  @Output() click:EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

  }
}


/*
@Component({
  selector: 'dxc-btn2',
  template: `
    <div class="dxc-static">
      <fa-icon [icon]="['fas','sync-alt']" class="dxc-empty"></fa-icon>
    </div>
  `,
  styleUrls: ['../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Button2Component implements OnInit {

  @Input() icon = "sync-alt";

  constructor() { }

  ngOnInit(): void {

  }
}
*/
