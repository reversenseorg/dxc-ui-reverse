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

import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CodeController} from "../ctrl/CodeController";
import {Message} from "../../../cmp/Error";
import {FormControl} from "@angular/forms";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {UIException} from "../../../base/error/UIException";


const BINDING:IStringIndex<any> = {
  [NodeInternalType.CLASS]:{type:'class',id:'name'},
  [NodeInternalType.METHOD]:{type:'method',id:'__signature__'},
  [NodeInternalType.FIELD]:{type:'field',id:'__signature__'},
  [NodeInternalType.PACKAGE]:{type:'package',id:'name'},
  [NodeInternalType.FILE]:{type:'file',id:'name'},
  [NodeInternalType.FUNC]:{type:'func',id:'__s'}
};

@Component({
  selector: 'app-modal-rename',
  templateUrl: './modal-rename.component.html',
  styleUrls: ['./modal-rename.component.scss']
})
export class ModalRenameComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() controller:CodeController;

  aliasControl = new FormControl('');
  error:Nullable<Message> = null;

  @ViewChild('msgBox', {read:ElementRef, static:false}) msgEl:ElementRef;
  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  message:Nullable<Message> = null;
  item: any = null;


  constructor(private changeDetectorRef: ChangeDetectorRef, private kbSvc:KeyboardNavigationService) {
    super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);
  }


  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }

  /**
   *
   */
  submitAlias(){
    let b:any = BINDING[this.item.__];

    if(this.controller.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    this.controller.service.rename(
      b.type,
      this.item[b.id],
      (this.aliasControl.value as string)
    ).subscribe( (vMsg:Message) => {
      if(vMsg.isSuccess()){
        this.item.alias = this.aliasControl.value;

        (this.controller.app as any).hideModal('rename-item',this.item);
        (this.controller.app as any).print( new OutputMessage({
          src: "RenameNode",
          msg: `The item '${this.item[b.id]}' has been renamed '${this.aliasControl.value}' `
        }));

        this.controller.service.renamed$.next(this.item);
      }else{
        this.error = vMsg;
        (this.controller.app as any).print( new OutputMessage({
          src: "RenameNode",
          msg: vMsg.msg
        }));
      }
    });
  }

  /**
   *
   */
  resetError(pEvent:any):void{
    // if differs from enter (avoid conflict with submit on enter)
    if(pEvent.keyCode != 13){
      this.error = null;
    }
  }

  /**
   * To initialize alias input when the modal is loaded
   *
   * TODO : param should be {ModelPackage|ModelClass|ModelField|ModelMethod} instead of event
   *
   * @param {any} pSubject
   * @method
   */
  onOpen(pSubject:any):void {
    let val:Nullable<string> = null;

    this.item = pSubject.target.options;

    console.log('opening rename modal >', pSubject);

    val = this.item.alias;

    if(val==null){
      switch(this.item.__){
        case NodeInternalType.CLASS:
          val = this.item.hasOwnProperty('sname')? this.item.sname : this.item.simpleName;
          break;
        case NodeInternalType.PACKAGE:
          val = this.item.sname;
          break;
        case NodeInternalType.FIELD:
          val = this.item.name;
          break;
        case NodeInternalType.METHOD:
          val = this.item.name;
          break;
        case NodeInternalType.FUNC:
          val = this.item.name;
          break;
        case NodeInternalType.FILE:
          val = this.item.name;
          break;
        default:
          val = '';
          break;
      }
    }

    this.aliasControl.setValue(val as string);
  }
}
