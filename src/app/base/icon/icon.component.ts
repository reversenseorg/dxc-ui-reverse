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
import {ICON_TYPE, IconModel} from "./IconModel";
import {Nullable} from "../Nullable";
import {IStringIndex} from "../IStringIndex";
import {IconName, IconPrefix} from "@fortawesome/fontawesome-common-types";
import {NodeInternalType} from "../../models/NodeInternalType";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgClass, NgStyle, NgSwitch, NgSwitchCase} from "@angular/common";


// [ngStyle]="{ '--fa-primary-color':color1, '--fa-secondary-color':color2 }"
/**
 *
 */
@Component({
  selector: 'dxc-icon',
  template: `
    <ng-container [ngSwitch]="iconType">
      <ng-container *ngSwitchCase="ICON_TYPE.ICON">
        <fa-icon [icon]="[type,name]" [spin]="spin" [ngClass]="color1" [fixedWidth]="fw" ></fa-icon>
      </ng-container>
      <ng-container *ngSwitchCase="ICON_TYPE.SVG">
        <img [src]="src" [ngClass]="color1" [ngStyle]="style"/>
      </ng-container>
      <ng-container *ngSwitchCase="ICON_TYPE.TEXT">
        <span [ngStyle]="style" [ngClass]="color1"><ng-content select="[before]"></ng-content>{{ label }}<ng-content select="[after]"></ng-content></span>
      </ng-container>
      <ng-container *ngSwitchCase="ICON_TYPE.NONE"></ng-container>
    </ng-container>
    <!--
      <ng-container *ngIf="iconType=='img';  then icon else text"></ng-container>
      <ng-template #icon>
        <fa-icon *ngIf="type=='fad'" [icon]="[type,name]" [spin]="spin" [ngClass]="color1" [fixedWidth]="fw" ></fa-icon>
        <fa-icon *ngIf="type!='fad'" [icon]="[type,name]" [spin]="spin" [ngClass]="color1" [fixedWidth]="fw" ></fa-icon>
        <img *ngIf="iconType==ICON_TYPE_SVG" [src]="src" [ngClass]="color1" [ngStyle]="style"/>
      </ng-template>
      <ng-template #text>
        <span [ngStyle]="style" [ngClass]="color1"><ng-content select="[before]"></ng-content>{{ label }}<ng-content select="[after]"></ng-content></span>
      </ng-template>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgSwitch,
    NgSwitchCase,
    NgClass,
    NgStyle
  ]
})
export class IconComponent implements OnInit, OnChanges {


  @Input() iconType: ICON_TYPE = ICON_TYPE.NONE;

  /**
   * Fixed Width
   * @type string
   */
  @Input() fw:boolean = false;

  /**
   * Icon source such as 'fas','fab',...
   * TODO : add support for others source (not only Font Awesome)
   * @type string
   */
  @Input() type:IconPrefix;

  /**
   * Icon name
   * @type string
   */
  @Input() name:IconName;

  /**
   * Icon primary color (class name)
   * @type string
   */
  @Input() color1:Nullable<string> = null;

  /**
   * Icon secondary color (class name)
   * @type string
   */
  @Input() color2:Nullable<string> = null;

  /**
   *
   * @type string
   */
  @Input() style:any = null;


  /**
   * Icon name
   * @type string
   */
  @Input() label:Nullable<string> = null;

  @Input() model: Nullable<IconModel> = null;

  @Input() spin: boolean = false;

  @Input() src: string = "";

  constructor() {

  }

  ngOnInit() {
  }

  ngOnChanges(pChanges: SimpleChanges) {
    if (pChanges.hasOwnProperty('model')) {
      this.configure(pChanges['model'].currentValue);
    }
    if (pChanges.hasOwnProperty('color1')) {
      this.color1 = pChanges['color1'].currentValue;
    }
  }

  configure(pConfig:any=null) :void {
    if(pConfig != null){
      for(let i in pConfig)
        (this as IStringIndex<any>)[i] = pConfig[i];
    }

    if(this.iconType==ICON_TYPE.ICON && (this.name==null || pConfig==null)){
      console.log("ICON NOT FOUND > ",pConfig,this);
      this.iconType = ICON_TYPE.NONE;
    }

  }

  protected readonly ICON_TYPE = ICON_TYPE;
  protected readonly NodeInternalType = NodeInternalType;
}
