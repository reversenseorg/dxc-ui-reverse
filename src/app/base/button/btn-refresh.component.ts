import {
  ChangeDetectionStrategy,
  Component,EventEmitter,
  Input,Output,
} from '@angular/core';
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {IconModelCollection} from "../icon/IconModel";

@Component({
  selector: 'dxc-refresh-btn',
  template: `
      <button class="btn btn-inline btn-sm" (click)="onClick($event)">
        <dxc-icon [model]="icons['REFRESH']"></dxc-icon><ng-content></ng-content>
      </button>
  `,
  styleUrls: ['../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonRefreshComponent  {

  icons:IconModelCollection = GLOBAL_ICONS;

  @Input() icon = "sync-alt";

  @Output() newClick:EventEmitter<any> = new EventEmitter<any>()

  onClick($event: MouseEvent) {
    this.newClick.next($event)
  }
}

