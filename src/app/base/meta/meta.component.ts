


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

