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

import {HostListener, Injectable} from "@angular/core";
import {IKeyboardNavigable} from "./IKeyboardNavigable";
import {Nullable} from "../Nullable";



@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {

  _cmp:any = {};
  /**
   * Hold focus element which must handle keyboard event
   *
   *
   * @type {IKeyboardNavigable}
   * @field7
   */
  activeEl:Nullable<IKeyboardNavigable> = null;



  stack:IKeyboardNavigable[] = [];

  constructor() {}

  /**
   * To change active element.
   *
   * The active element, is the element handling event
   *
   * @param {IKeyboardNavigable} pElement
   * @method
   * @since 1.0.0
   */
  focus( pElement:IKeyboardNavigable):void{
    //console.log("Focusing :",pElement);
    this.stack.push(pElement);
    this.activeEl = pElement;
  }


  /**
   * To change active element.
   *
   * The active element, is the element handling event
   *
   * @param {IKeyboardNavigable} pElement
   * @method
   * @since 1.0.0
   */
  focusout( pElement:IKeyboardNavigable):void{
    if(pElement==null) {
      this.stack.pop();
    }
  }

  /**
   * To dispatch event captured at top level to the active element
   *
   * @param {any} pEvent Event data
   * @param {string} pSource Event source (keydown, keypress, ...)
   * @return {void}
   * @method
   * @since 1.0.0
   */
  dispatch( pEvent:KeyboardEvent):void {
    if(this.stack.length>0){
      let activ:IKeyboardNavigable = this.stack[this.stack.length-1];
        //activ.onKeyboardEvent.next({ e:pEvent, src:pSource });
        activ.onKeyPress(pEvent);
    }
  }

  /**
   * To register the component as navigable with keyboard
   *
   * The component must implements IKeyboardNavigable interface.
   *
   * @param pComponent
   */
  register( pComponent:IKeyboardNavigable):void {
    if(this._cmp[pComponent.getCUID()] == null){
      this._cmp[pComponent.getCUID()] = pComponent;
    }
  }
}
