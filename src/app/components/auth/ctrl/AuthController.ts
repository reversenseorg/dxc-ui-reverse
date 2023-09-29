import {ViewportView} from "../../../cmp/ViewportView";
import {IController, IControllerOptions} from "../../../base/controllers/IController.interface";
import {Subject} from "rxjs";
import {ComponentFactoryResolver} from "@angular/core";
import {StageComponent} from "../../stage/stage.component";
import {ViewerController} from "../../viewer/ctrl/ViewerController";
import {AuthService} from "./auth.service";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";


export class AuthController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'auth';

  id:Nullable<string> = null;
  app: Nullable<StageComponent> = null;

  service: AuthService;

  explorerCmp: any = null;
  viewCmp: any = null;
  terminalCmp: any = null;
  modalCmp: any = null;

  views:ViewportView[] = [];

  componentFactoryResolver:Nullable<ComponentFactoryResolver> = null;

  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();

  //viewer: Nullable<ViewerController> = null;

  constructor(pConfig:IControllerOptions) {
    this.configure(pConfig);
  }

  configure( pConfig:any=null):void {
    if(pConfig==null) return;

    for(let i in pConfig){
       (this as IStringIndex<any>)[i] = pConfig[i];
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
