/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef, Input,
  OnInit,
  QueryList,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'dxc-breadcrumb-item',
  template: `
    <div [ngClass]="fixed==true? 'dxc-static':'dxc-item'">
      <div class="dxc-item-label"><ng-content></ng-content></div>
      <div class="dxc-item-arrow">
        <ng-container *ngIf="fixed || end; then arrowBlock else arrowTxt"></ng-container>
        <ng-template #arrowBlock>
          <fa-icon [icon]="['fas','caret-right']" class="dxc-item-arrow" #arrow></fa-icon>
        </ng-template>
        <ng-template #arrowTxt>
          &gt;
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbItemComponent implements OnInit {

  @Input() label:string;
  @Input() fixed:boolean = false;
  @Input() end:boolean = false;
  @ViewChild('arrow', {read: ElementRef, static:false}) arrow:ElementRef;

  constructor() { }

  ngOnInit(): void {

  }

  switchColor(){

  }
}


@Component({
  selector: 'dxc-breadcrumb',
  template: `
    <div class="dxc-breadcrumbs">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, AfterContentInit {

  @ContentChildren(BreadcrumbItemComponent) items:QueryList<BreadcrumbItemComponent>;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
    this.items.first.fixed = true;
    this.items.last.end = true;
  }

}
