import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";


@Component({
  selector: 'dxc-target-os-list',
  template: `
    <select [(ngModel)]="targetOs" (ngModelChange)="targetChange($event)" class="dxc-input">
      <option value="android">Android</option>
      <option value="ios">iOS</option>
      <option value="tizen">Tizen</option>
      <option value="linux">Linux</option>
      <option value="macos">MacOS</option>
      <option value="fw">Firmware</option>
    </select>
  `,
  styleUrls: ['./device.component.scss','../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetOsListComponent {

  @Input() targetOs = "android";

  @Output() selectTarget:EventEmitter<string> = new EventEmitter<string>();


  targetChange(pEvent: any) {

    console.log("targetChange ",pEvent);
    this.selectTarget.emit(pEvent as string);
  }
}
