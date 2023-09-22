import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'dxc-btn',
  template: `
    <div class="dxc-static">
      <fa-icon [icon]="['fas','sync-alt']" class="dxc-empty"></fa-icon>
    </div>
  `,
  styleUrls: ['../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit {

  @Input() icon = "sync-alt";

  constructor() { }

  ngOnInit(): void {

  }
}

