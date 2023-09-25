import {ExplorerView} from "../../cmp/ExplorerView";
import {ExplorerTab} from "../../cmp/ExplorerTab";
import {Observable, Subject} from "rxjs";
import {IController} from "../controllers/IController.interface";
import {AppComponent} from "../../app.component";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {Nullable} from "../Nullable";
import {IconModelCollection} from "../icon/IconModel";

export abstract class SubExplorerComponent<T> {

  /*
    offset:number;
    label:string;
    icon: IconView;
    color:string;
   */

  id: string;

  app: Nullable<AppComponent>;

  parent: any;

  offset: number;

  controller: T;

  /**
   *
   */
  view: ExplorerView;

  /**
   *
   */
  tab: ExplorerTab;

  gIcons: IconModelCollection = GLOBAL_ICONS;

  icons: IconModelCollection = {};

  resize$: Subject<any>;

  getTab(): ExplorerTab {
    return this.tab;
  }

  //abstract onPanelResize(pEvent: any): void;

  initPanelResize(pResizeObs: Subject<any>):void{

    this.resize$ = pResizeObs;
    /*
    pObservable.subscribe( (pEvent) => {
      this.onPanelResize(pEvent);
    });*/
  }

  getID():string {
      return this.id;
  }

  getNavID():string {
    return this.id+'Nav';
  }

  beforeHide():void {
    return ;
  }

  afterHide():void {
    return ;
  }
}
