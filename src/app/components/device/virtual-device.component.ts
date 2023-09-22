import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";


@Component({
  selector: 'dxc-virtual-device-form',
  template: `
    <p class="dxc-text-std dxc-text-100 mb-0 pt-1">
      A virtual device is not able to execute code as a real device or a device emulator but it allows to use others components
    </p>
    <div class="row">
      <div class="col-6">
        <div class="dxc-frm-label">Model</div>
        <div><input type="text" [(ngModel)]="model" placeholder="Model name" class="dxc-input"/></div>
      </div>
      <div class="col-6">
        <div class="dxc-frm-label">Product</div>
        <div><input type="text" [(ngModel)]="product" placeholder="Product name" class="dxc-input"/></div>
      </div>

    </div>

    <div class="dxc-frm-label">
      Serial
    </div>
    <div>
      <input type="text" [(ngModel)]="product" placeholder="Product name" class="dxc-input mb-1"/>
    </div>
    <div class="dxc-frm-label">
      Plateform Version
    </div>
    <div>
      <dxc-platform-list [platform]="platform" (selectPlatform)="platformChange($event)"></dxc-platform-list>
    </div>
  `,
  styleUrls: ['./device.component.scss','../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualDeviceSettingsComponent {

  @Input() targetOs = "android";
  model:string;
  product:string;
  serial:string;

  platform:string;

  @Output() selectTarget:EventEmitter<string> = new EventEmitter<string>();


  targetChange(pEvent: any) {

    console.log("targetChange ",pEvent);
    this.selectTarget.emit(pEvent as string);
  }

  platformChange(pEvent: string) {
    this.platform = pEvent;
  }
}
