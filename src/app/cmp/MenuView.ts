/**
 *
 */
import {IconModel} from "../base/icon/IconModel";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";

interface MenuItemListeners {
  [eventName:string] :Function
}

/**
 *
 */
export class MenuItem<T> {

  id = "";
  label = "";
  color = "";
  icon:Nullable<IconModel> = null;
  children:MenuItem<T>[] = [];
  listeners:MenuItemListeners = {};
  click:Nullable<string> = null;
  data:T[] = [];

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }
}


export interface MenuViewOptions extends IStringIndex<any> {
  items?:MenuItem<any>[];
}
export class MenuView {

  selected = -1;

  items:MenuItem<any>[] = [];

  constructor(pConfig:MenuViewOptions={}) {
    if(pConfig != null){
      for(let i in pConfig)
        (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }

  getItemByID( pName:any):MenuItem<any> {
    let o:any = null;
    this.items.map((pItem)=>{
      if(pItem.id === pName) o = pItem;
    });
    return o;
  }
}
