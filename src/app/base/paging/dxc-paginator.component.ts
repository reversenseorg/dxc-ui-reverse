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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";




@Component({
  selector: 'dxc-paginator',
  template: `
  <div class="row">
    <div class="col-3" *ngIf="dropdownRowsPerPage">Items per page</div>
    <div class="col-3" *ngIf="dropdownRowsPerPage">
        <!--<div ngbDropdown [ngStyle]="_style" [ngClass]="_class">
            <button class="btn dxc-text-clear100" [id]="'dropdownBasic'+id" ngbDropdownToggle (click)="openMenu()">
                <dxc-icon *ngIf="trail" [model]="_trailIconNeg" [color1]="'trail-arrow-neg'"></dxc-icon>
                {{ label  }}
            </button>
            <div ngbDropdownMenu aria-labelledby="id" class="dxc-dropdown" #ddEl>
                <button *ngFor="let item of navbar.menu.items" [ngClass]="item.color" (click)="onMenuItemSelect(item)"  ngbDropdownItem>
                  <fa-icon class="dxc-icon" [icon]="[item.icon.type,item.icon.name]" [ngClass]="item.icon.color1"></fa-icon>
                  {{ item.label }}
                </button>
            </div>
        &nbsp;
        </div>-->
        &nbsp;
    </div>
    <div [class]="dropdownRowsPerPage? 'col-3':'col-6'" class="text-end">
      {{ range.offset}}&nbsp;-&nbsp;{{ range.offset+range.size}}&nbsp;<ng-container *ngIf="totalRecords>0">of&nbsp;{{totalRecords}}</ng-container>
    </div>
    <div [class]="dropdownRowsPerPage? 'col-3':'col-6'" class="text-start">
        <dxc-btn [borderless]="true" [icon]="gIcons['LEFT']" (click)="goTo('prev')"></dxc-btn>&nbsp;
        <dxc-btn [borderless]="true" [icon]="gIcons['RIGHT']" (click)="goTo('next')"></dxc-btn>
    </div>
</div>

  `,
  styleUrls: ['./dxc-paginator.component.scss','../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent implements OnInit {

  /**
   * Count of rows currently displayed
   * @type {number}
   */
  @Input() rows: number = -1;
  @Input() startAt: number = 0;
  @Input() page:number = 0;
  @Input() totalRecords: number = -1;
  @Input() dropdownRowsPerPage = false;
  @Input() pageSizes:number[] = [10,50,100];
  @Input() showMax:boolean = false;
  @Output() onPageChange:EventEmitter<any> = new EventEmitter();


  _style = null;
  _class = null;

  range = { offset:1, size:10 };

  gIcons:any = GLOBAL_ICONS;



  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    if(this.rows==-1){
      this.rows = this.pageSizes[0];
    }

    this.range = {
      offset: this.startAt,
      size: this.rows
    };

  }



  goTo(pDirection: "prev"|"next") {
    let range = {
      offset:0,
      size: this.rows
    };
    let page = this.page;

    if(pDirection === "prev"){
       page--;

       if(page<0)
         return;
       else
         range.offset = page*this.rows;
    }else{
       page++;
       range.offset = page*this.rows;

       if(this.totalRecords>-1){
         if(range.offset>this.totalRecords){
           return;
         }
         const d = this.totalRecords - range.offset;
         if(d<this.rows){
           range.size = d;
         }
       }else{
          range.size = this.rows;
       }
    }

    this.page = page;
    this.range = range;

    console.log("goTo > ",pDirection);
    this.onPageChange.emit(range);
    this.changeDetectorRef.detectChanges();
  }
}
