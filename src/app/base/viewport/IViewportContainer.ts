import {ViewportView} from "../../cmp/ViewportView";
import {ViewportComponent} from "./viewport.component";
import {IconModel} from "../icon/IconModel";
import {Subject} from "rxjs";


export interface IViewportContainer {
  id:number;
  uid:string;
  parent:ViewportComponent;
  view: ViewportView;

  resize$: Subject<any>;

  onClose():boolean;
  resize(opts:any):void;
}
