import {Type} from "@angular/core";
import {IController} from "../base/controllers/IController.interface";


export class TerminalItem
{
  constructor( public component: Type<any>, public controller:IController) {
  }

}
