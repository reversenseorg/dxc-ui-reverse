import {Observable, Subject} from "rxjs";
import {ComponentFactoryResolver} from "@angular/core";
import {ViewportComponent} from "../viewport/viewport.component";
import {AppComponent} from "../../app.component";
import {StageComponent} from "../../components/stage/stage.component";
import {Nullable} from "../Nullable";


export interface ViewCmpMap {
  main?:any,
  [name :string] :any;
}

export interface ExplorerCmpMap {
  [name :string] :any;
}

export interface TerminalCmpMap {
  [name :string] :any;
}

export interface IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:Nullable<string>;

  id: Nullable<string>;
  app: Nullable<StageComponent>; /* AppComponent */

  service: any;
  componentFactoryResolver: Nullable<ComponentFactoryResolver>;

  explorerCmp: any;
  viewCmp: ViewCmpMap;
  terminalCmp: any;
  modalCmp: any;

  openView: Observable<any>;
  closeView: Observable<any>;
  focusView: Observable<any>;

  open(pItem: any, pSrc:any): any;
  close(pItem: any, pSrc:any): any;
}
