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
