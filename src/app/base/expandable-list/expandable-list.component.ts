
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
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactory, ComponentFactoryResolver,
  ContentChildren,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ExpandableItemComponent} from "./expandable-item.component";
import {ExplorerItem} from "../../cmp/ExplorerItem";

export interface ExpandableItem<T> {
  cmp: ExpandableItemComponent<T>,
  item: T
}

@Component({
  selector: 'app-expandable-list',
  templateUrl: './expandable-list.component.html',
  styleUrls: ['./expandable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpandableListComponent<T> implements OnInit, AfterViewInit {


  @Input() parentItem:any;
  //@Input() pool:T[];
  @Input() hasChildren:Function;
  @Input() renderItem:Function;
  //@Input() getChildren:Function;
  @Input() getIcon:Function;

  @ViewChild("expandListRef", {read: ElementRef}) expandListRef:ElementRef;
  @ContentChildren(ExpandableItemComponent) items: QueryList<ExpandableItemComponent<T>>

  constructor(
    private changeDetectorRef:ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit():void {
    this.changeDetectorRef.detach();
  }


  r = 0;
  checkRendering(){
    this.r++;
    return '';
  }

  onExpand( pItem:ExpandableItem<T>):void {
    alert("ExpandableList (global) onExpand");
  }

  onCollapse( pItem:ExpandableItem<T>):void {
    alert("ExpandableList (global) onCollapse");
  }

}
