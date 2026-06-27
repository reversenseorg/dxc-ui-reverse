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
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {SubExplorerComponent} from "../explorer/subexplorer.component";
import {Nullable} from "../Nullable";
import {IconComponent} from "../icon/icon.component";
import {DxcDropdownComponent} from "../common/dropdown";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-explorer-navbar',
  template: `
    <div class="row m-0 dxc-explorer-vpnav expl-navbar" #snavRef>
      <div class="col-lg-6 text-left nav">
        <dxc-dropdown *ngIf="explorer.view.nav !=null && explorer.view.nav.hasDropDown()"
                      [menu]="explorer.view.nav.menu"
                      (itemClick)="onItemSelect($event)"
        >
          <ng-content select="[menu]"></ng-content>
        </dxc-dropdown>
        <!--<div *ngIf="false && explorer.view.nav !=null && explorer.view.nav.hasDropDown()" ngbDropdown class="d-inline-block nav-menu">
          <button [ngClass]="explorer.view.nav.color" class="btn dxc-text-clear100" [id]="'dropdownBasic'+explorer.offset" ngbDropdownToggle>
            <dxc-icon *ngIf="explorer.view.nav.icon" [model]="explorer.view.nav.icon"></dxc-icon>
            {{ explorer.view.nav.label  }}
          </button>
          <div ngbDropdownMenu aria-labelledby="dropdownBasic1" >
            <button *ngFor="let item of explorer.view.nav.menu.items" [ngClass]="item.color" (click)="onItemSelect(item,$event)"  ngbDropdownItem>
              <dxc-icon *ngIf="item.icon" [model]="item.icon"></dxc-icon>
              {{ item.label }}
            </button>
          </div>
        </div>-->
        <div class="nav-title" *ngIf="explorer.view.nav!=null && explorer.view.nav.hasDropDown()==false">
          <dxc-icon [model]="explorer.view.nav.icon"></dxc-icon> {{ explorer.view.nav.label }}
        </div>
      </div>
      <div class="col-lg-6 text-right nav-options">
        <ng-content select="[opts]"></ng-content>
      </div>
    </div>

  `,
  styleUrls: ['./explorer-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    IconComponent,
    DxcDropdownComponent,
  ]
})
export class ExplorerNavbarComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() explorer:SubExplorerComponent<any>;
  @Input() id:Nullable<string> = null;

  @Output() menuItemClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("snavRef", {read: ElementRef}) snavRef: ElementRef;

  selectedItem:string = '';

  constructor(
      private changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    //this.explorer.parent.resizeSrc.subscribe(this.onPanelResize);
  }

  ngOnChanges(pChanges: SimpleChanges) {
    if(pChanges.explorer!=null){
      console.log("Detecting change in app-explorer-navbar");
      this.changeDetectionRef.detectChanges();
    }
  }

  ngAfterViewInit():void {
    (this.explorer.view.nav as any).size.height = parseFloat(window.getComputedStyle(this.snavRef.nativeElement).height);
  }

  onItemSelect( pItem:any):void{
      console.log("NAVBAR> onItemSelect: ",pItem.click,pItem);
    if(pItem.click!=null){
      pItem.click.call(null, pItem);
    }else{
      this.menuItemClick.emit({ item:pItem });
    }
  }



  onPanelResize(pEvent:any):void {
    if(this.id == null) return;

    let el = document.getElementById(this.id);
    if(el!=null)
      el.style.width = pEvent.dim.width+'px';
  }
}
