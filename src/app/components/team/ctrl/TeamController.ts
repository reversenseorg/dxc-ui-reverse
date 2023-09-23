import {ViewportView} from "../../../cmp/ViewportView";
import {IController} from "../../../base/controllers/IController.interface";
import {Subject} from "rxjs";
import {ComponentFactoryResolver} from "@angular/core";
import {StageComponent} from "../../stage/stage.component";
import {ViewerController} from "../../viewer/ctrl/ViewerController";
import {TeamService} from "./team.service";


export class TeamController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'team';

  id:string = null;
  app: StageComponent = null;

  service: TeamService = null;

  explorerCmp: any = null;
  viewCmp: any = null;
  terminalCmp: any = null;
  modalCmp: any = null;

  views:ViewportView[] = [];

  componentFactoryResolver:ComponentFactoryResolver = null;

  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();

  viewer: ViewerController = null;
  //viewComp: ViewportCodeComponent = null;

  constructor(pConfig:any=null) {
    this.configure(pConfig);
  }

  configure( pConfig:any=null):void {
    if(pConfig==null) return;

    for(let i in pConfig){
      if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }

  getExplorerCmp():any {
    return this.explorerCmp.main;
  }

  getViews():ViewportView[]{
    return this.views;
  }

  close(pItem: any, pSrc:any): any {

  }

  open(pItem: any, pSrc:any): any{


  }
}
