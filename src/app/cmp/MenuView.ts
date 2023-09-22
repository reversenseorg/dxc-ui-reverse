/**
 *
 */
import {IconModel} from "../base/icon/IconModel";

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
  icon:IconModel = null;
  children:MenuItem<T>[] = [];
  listeners:MenuItemListeners = {};
  click:string = null;
  data:T[] = [];

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) this[i] = pConfig[i];
    }
  }
}

export class MenuView {

  items:MenuItem<any>[] = [];

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig)
        if(this.hasOwnProperty(i)) this[i] = pConfig[i];
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
