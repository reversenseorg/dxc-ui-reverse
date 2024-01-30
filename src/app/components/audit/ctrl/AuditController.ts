import {IController, IControllerOptions, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Subject} from "rxjs";
import {ViewportView} from "../../../cmp/ViewportView";
import {ComponentFactoryResolver} from "@angular/core";
import {StageComponent} from "../../stage/stage.component";
import { AuditService } from "./audit.service";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {NodeInternalType} from "../../../models/NodeInternalType";


export class AuditController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name = 'privacy';

  id: Nullable<string> = null;
  app: Nullable<StageComponent> = null;

  service: AuditService;

  explorerCmp: any = null;
  viewCmp: ViewCmpMap = {};
  terminalCmp: any = null;
  modalCmp: any = null;

  componentFactoryResolver:Nullable<ComponentFactoryResolver> = null;

  views:ViewportView[] = [];
  explorer:any = null;
  rendered:any = [];


  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();

  constructor(pConfig:IControllerOptions) {
    this.configure(pConfig);
  }

  configure( pConfig:any=null):void {
    if(pConfig==null) return;

    for(let i in pConfig){
     (this as IStringIndex<any>)[i] = pConfig[i];
    }

    if(this.service==null && pConfig.service!=null){
      this.service = pConfig.service;
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

    this.rendered = this.rendered.filter( (vItem:any) => {
      return (vItem.id !== pItem.id);
    });


    this.closeView.next(pItem);
  }

  isAlreadyRendered(pItem:any):any {
    let f:any=null;

    this.rendered.map( (pView:any) => {
      console.log("AUDIT > isAlreadyRendered > ",pView.uid, pItem.uid)
      if(pView.uid === pItem.uid){
        f = pView;
      }
    });

    return f;
  }


  /**
   * To open a model in to a new tab or focus the tab is it is already rendered
   *
   * @param pItem
   * @param pSrc
   * @method
   */
  open(pItem: any, pSrc:any): void{
    console.log("Audit Controller > id  ", pItem, pSrc);

    let existingRef = this.isAlreadyRendered(pItem);

    if(existingRef != null){
      console.log('item is already rendered>', existingRef,pItem,existingRef.uid);
      this.focusView.next( existingRef.uid);
      return;
    }else{
      console.log('rendering > ',pItem,pItem.id);
      this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:pItem.id, focus:'in' });
    }
  }
}
