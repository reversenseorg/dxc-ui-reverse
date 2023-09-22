import {IController, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Subject} from "rxjs";
import {ViewportView} from "../../../cmp/ViewportView";
import {ComponentFactoryResolver} from "@angular/core";
import {StageComponent} from "../../stage/stage.component";
import { AuditService } from "./audit.service";


export class AuditController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name = 'privacy';

  id:string = null;
  app: StageComponent = null;

  service: AuditService = null;

  explorerCmp: any = null;
  viewCmp: ViewCmpMap = {};
  terminalCmp: any = null;
  modalCmp: any = null;

  componentFactoryResolver:ComponentFactoryResolver = null;

  views:ViewportView[] = [];
  explorer:any = null;
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
      if(this.hasOwnProperty(i)) this[i] = pConfig[i];
    }

    this.service.onScanDone$.subscribe((vReport)=>{
      this.open( vReport, "privacy-svc");
    });
  }

  getExplorerCmp():any {
    return null; //this.explorerCmp.main;
  }

  getViews():ViewportView[]{
    return this.views;
  }

  close(pItem: any, pSrc:any): any {

    this.rendered = this.rendered.filter( vItem => {
      return (vItem.id !== pItem.id);
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
    this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:pItem.time, focus:'rl' });
  }
}
