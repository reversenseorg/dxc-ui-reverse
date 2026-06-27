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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {Message} from "../../../cmp/Error";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {OutputService} from "../../output/ctrl/output.service";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {Nullable} from "../../../base/Nullable";
import {Tag} from "../../../models/tags/Tag";
import {TagService} from "../ctrl/tag.service";
import TagCategory from "../../../models/ModelTagCategory";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}


let gInstance:Nullable<ModalTagInfoComponent> = null;


@Component({
  selector: 'dxc-tag-info',
  templateUrl: './modal-tag-info.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss']
})
export class ModalTagInfoComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() tag:Nullable<Tag> = null;
  @Input() controller:any;

  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:Nullable<string> = "Tag Editor";

  @Input() message:Nullable<Message> = null;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  gIcons:any = GLOBAL_ICONS;

  item: any = null;

  private onStart:any = null;

  _:number = -1;
  name:string = "";
  catName: Nullable<string> = "";
  category: TagCategory;
  descr: any = "";
  txtColor: any = "";
  bgColor: any = "";
  label: any = "";

  description: any;

  constructor( private changeDetectorRef: ChangeDetectorRef,
               private _tagSvc:TagService,
               private outputSvc:OutputService,
               private kbSvc:KeyboardNavigationService) {
    super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);
    gInstance = this;
  }


  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }


  onOpen( pEvent:any){
    this.tag = pEvent.target.options;
    if(this.tag==null){
        this.close();
        return;
    }

    this.description = this.tag.descr;
  }

  close(){
    this.modal.hide('close');
  }
}
