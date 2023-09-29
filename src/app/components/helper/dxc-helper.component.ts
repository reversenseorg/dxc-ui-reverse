import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {ICON_TYPE, IconModel} from "../../base/icon/IconModel";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {HelperBtnType, HelperService, HelperType} from "./ctrl/HelperService";


@Component({
  selector: 'dxc-helper-btn',
  template: `
    <ng-container *ngIf="fmt==helperSvc.BTN_BTN; then btnFmt else navFmt"></ng-container>
    <ng-template #btnFmt ><span class="btn-close" (click)="open()"><dxc-icon [model]="helpIcon"></dxc-icon></span></ng-template>
    <ng-template #navFmt ><app-subnavbar-btn (click)="open()" [icon]="helpIcon">Help</app-subnavbar-btn></ng-template>

  `,
  styleUrls: ['../../base/subnavbar/subnavbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DxcHelperBtnComponent  {


  @Input() docid = '';
  @Input() fmt: HelperBtnType;
  @Input() type: HelperType = HelperType.VIEWER;

  helpIcon:IconModel = GLOBAL_ICONS['HELPER'];

  constructor( public helperSvc:HelperService) {
    this.fmt = helperSvc.BTN_BTN;
  }

  open():void{
    this.helperSvc.openDoc(this.docid, this.type);
  }
}
