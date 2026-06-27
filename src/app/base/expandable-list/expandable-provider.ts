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

import {Observable} from "rxjs";


/**
 * This interface must be implemented by a any class/componenentdeclared as
 * data provide of an expandable components.
 *
 * @interface
 */
export interface ExpandableProvider {

  /**
   * Implementation of expand, this function istrigged when a user click
   * on an expandable-item
   *
   * Important : this method must update 'children' array of pItem, or have a
   * behavior compatible with "itemGetChildren".
   *
   * @param {any} pItem Expandable item where the user clicked
   * @param {string} pType An item type
   * @return {Observable<DeviceItem[]>} An array of item renderable into ExplorerDevice view
   * @method
   */
  expand( pItem:any, pType:string): Observable<any>;

  open( pItem:any): Observable<any>;

  /**
   * This method is called every time the expandable list need to check
   * is a given item as children ready to be rendered or not.
   *
   * If there is not children to render immediately, the list checks
   * the method "itemHasLazyChildren()"
   *
   * @param {any} pItem Expandable item where the user clicked
   * @param {string} pType An item type
   * @method
   */
  itemHasChildren( pItem:any, pType?:string): boolean;

  itemHasLazyChildren( pItem:any, pType?:string): boolean;

  itemGetChildren(pItem:any, pType?:string):any[];
}
