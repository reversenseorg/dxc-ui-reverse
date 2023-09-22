import {Subject} from "rxjs";
import {AfterViewInit} from "@angular/core";
import {ViewportComponent} from "./viewport.component";
import {ViewportView} from "../../cmp/ViewportView";


export abstract class FlexViewport {


  id:number;

  uid:string;

  parent:ViewportComponent;

  view: ViewportView;

  resize$: Subject<any> = new Subject<any>();

  resize( pSize:any):void {
    this.resize$.next(pSize);
  }

  abstract onClose():boolean;
}
