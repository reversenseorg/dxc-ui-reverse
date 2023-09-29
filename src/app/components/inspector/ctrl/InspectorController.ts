import {ViewportView} from "../../../cmp/ViewportView";
import {IController, IControllerOptions, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Observable, Subject} from "rxjs";
import {ComponentFactoryResolver} from "@angular/core";
import {AppComponent} from "../../../app.component";
import {InspectorService} from "./inspector.service";
import {Inspector} from "../../../models/Inspector";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {StageComponent} from "../../stage/stage.component";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {UIException} from "../../../base/error/UIException";



export class InspectorController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'inspector';

  /**
   * unique id
   */
  id:Nullable<string> = null;

  /**
   * Main stage
   */
  app: Nullable<StageComponent> = null;

  service: InspectorService;

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

    this.rendered = this.rendered.filter( (vItem:any) => {
      return (vItem.__signature__ !== pItem.__signature__);
    });


    this.closeView.next(pItem);
  }

  isAlreadyRendered(pItem:any):any {
    let f:any=null;

    this.rendered.map((pView:any) => {      console.log(pView, pItem, pView.item.name === pItem.name);
      if(pView.item.name === pItem.name){
        f = pView;
      }
    });

    return f;
  }


  _show( pItem:Inspector):void {


    if(this.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    const existingRef = this.isAlreadyRendered(pItem);
    const vid: string = this.id+':v'+this.rendered.length;

    if(existingRef != null){
      console.log('item is already rendered>', existingRef,pItem,existingRef.uid);
      this.focusView.next( existingRef.uid);
      return;
    }

    console.log('getting inspector > ', pItem.name);

    if(pItem.id == null){
      throw new UIException("Inspector ID is null",-1);
    }


    this.service.getInspectorByID(pItem.id as string).subscribe( (pInspector:any)=>{
      console.log(pInspector);
      if(pInspector==null) return;
      pInspector._icon = GLOBAL_ICONS['FIND'];
      pInspector = (this.app as any).getController('ctrl:hook-main').bindInspector(pInspector);
      this.rendered.push({ item:pItem, uid:vid });
      this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pInspector, uid:vid });
    });
  }

  open(pItem: any, pSrc: any): any {
    this._show({ name: pItem} as Inspector);
  }

  showByName( pName:string){
    this._show({ name: pName} as Inspector);
  }

  show( pInspector:Inspector):void{
    if(pInspector.__!==NodeInternalType.INSPECTOR){
        throw new UIException("Inspector cannot be displayec : this is not an inspector",-1);
    }else{
      this._show(pInspector);
    }
  }
}
