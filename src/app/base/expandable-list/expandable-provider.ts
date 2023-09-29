import {Observable} from "rxjs";


export interface ExpandableProvider {

  expand( pItem:any, pType:string): Observable<any>;

  open( pItem:any): Observable<any>;

  itemHasChildren( pItem:any, pType?:string): boolean;

  itemHasLazyChildren( pItem:any, pType?:string): boolean;

  itemGetChildren(pItem:any, pType?:string):any[];
}
