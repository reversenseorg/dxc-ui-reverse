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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {ContextMenuComponent} from "./context-menu.component";
import {IconModel} from "../icon/IconModel";
import {Nullable} from "../Nullable";

/**
 * Third column : shortcut
 */
@Component({
  selector: 'app-context-item',
  templateUrl: 'context-item.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextItemComponent implements OnInit {

  // @ts-ignore
  @Input() label:Nullable<string> = null;
  @Input() iconName: Nullable<string> = null;
  @Input() icon: Nullable<IconModel> = null;
  @Input() separator: boolean = false;
  @Input() disabled: boolean = false;
  @Input() checked: boolean = false;

  @Output() itemclick: EventEmitter<any> = new EventEmitter<any>();

  parent: Nullable<ContextMenuComponent> = null;
  border: string = '';
  target: any = null;
  rendered:boolean = false;


  constructor() {

  }

  ngOnInit(): void {

    if(this.icon == null){
      if(this.checked) {
        this.icon = GLOBAL_ICONS.CHECK
      } else {
        this.icon = null;
      }
    }


    if (this.iconName != null) {
      this.icon = GLOBAL_ICONS[this.iconName];
    }
  }


  onClick(pEvent:any):void {
      if(this.parent==null){

      }else{
        this.parent.hide(null);
      }

      this.itemclick.emit(pEvent);
  }
}
