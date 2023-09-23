import {IController, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Subject} from "rxjs";
import {ViewportView} from "../../../cmp/ViewportView";
import {ComponentFactoryResolver} from "@angular/core";
import {ExplorerCodeComponent} from "../../code/explorer-code/explorer-code.component";
import {OutputService} from "./output.service";
import {StageComponent} from "../../stage/stage.component";


export class OutputController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'out';

  id:string = null;
  app: StageComponent = null;

  service: OutputService = null;

  explorerCmp: any = null;
  viewCmp: ViewCmpMap = {};
  terminalCmp: any = null;
  modalCmp: any = null;

  componentFactoryResolver:ComponentFactoryResolver = null;

  views:ViewportView[] = [];
  explorer:ExplorerCodeComponent = null;
  rendered:any = [];


  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();

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

    this.rendered = this.rendered.filter( vItem => {
      return (vItem.__signature__ !== pItem.__signature__);
    });


    this.closeView.next(pItem);
  }

  isAlreadyRendered(pItem:any):any {
    let f:any=null;

    this.rendered.map( pView => {
      console.log(pView);
      if(pView.__signature__ === pItem.__signature__){
        f = pView;
      }
    });

    return f;
  }

  open(pItem: any, pSrc:any): void{

  }
}
