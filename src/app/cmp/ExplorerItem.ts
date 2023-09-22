import {Type} from "@angular/core";
import {IController} from "../base/controllers/IController.interface";


export class ExplorerItem
{
  constructor( public component: Type<any>, public controller:IController) {
  }

  getTab(){
    return this.component;
  }
}
