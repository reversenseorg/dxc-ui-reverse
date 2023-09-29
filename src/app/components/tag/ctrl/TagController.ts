import {ViewportView} from "../../../cmp/ViewportView";
import {ExplorerCodeComponent} from "../../code/explorer-code/explorer-code.component";
import {IController, IControllerOptions, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Observable, Subject} from "rxjs";
import {ComponentFactoryResolver} from "@angular/core";
import {StageComponent} from "../../stage/stage.component";
import {TagService} from "./tag.service";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";



export class TagController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'tag';

  id:Nullable<string> = null;
  app: Nullable<StageComponent> = null;

  service: TagService;

  explorerCmp: any = null;
  viewCmp: ViewCmpMap = {};
  terminalCmp: any = null;
  modalCmp: any = null;

  componentFactoryResolver:Nullable<ComponentFactoryResolver> = null;

  views:ViewportView[] = [];
  explorer:Nullable<ExplorerCodeComponent>;
  rendered:any = [];

  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();
  //viewComp: ViewportCodeComponent = null;

  constructor(pConfig:IControllerOptions) {
    this.configure(pConfig);
  }

  configure( pConfig:IControllerOptions):void {
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
    // nothing to do
  }

  isAlreadyRendered(pItem:any):any {
    // nothing to do
  }

  open(pItem: any, pSrc:any): void{
    // nothing to do
  }
}
