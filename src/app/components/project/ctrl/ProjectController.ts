import {ViewportView} from "../../../cmp/ViewportView";
import {ExplorerCodeComponent} from "../../code/explorer-code/explorer-code.component";
import {IController, IControllerOptions, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Observable, Subject} from "rxjs";
import {ComponentFactoryResolver} from "@angular/core";
import {ProjectService} from "./project.service";
import {StageComponent} from "../../stage/stage.component";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";



export class ProjectController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'project';

  id:Nullable<string> = null;
  app: Nullable<StageComponent> = null;

  service: ProjectService ;

  explorerCmp: any = null;
  viewCmp: ViewCmpMap = {};
  terminalCmp: any = null;
  modalCmp: any = null;

  componentFactoryResolver:Nullable<ComponentFactoryResolver> = null;

  views:ViewportView[] = [];
  explorer:Nullable<ExplorerCodeComponent> = null;
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

  /**
   * To check if a view is already rendered
   * @param pItem
   */
  isAlreadyRendered(pItem:any):any {
    let f:any=null;

    if(typeof (pItem.item)==='string'){
      this.rendered.map((pView:any) => {       console.log(pView);
        if(pView.item === pItem){
          f = pView;
        }
      });
    }

    return f;
  }

  open(pItem: any, pSrc:any): void{

  }

  openProject( pName:string){

  }

  showDashboard( ){

    console.log('[PROJECT CTRL] show dashboard ...', this.viewCmp.main);

    const existingRef = this.isAlreadyRendered('dashboard');
    const vid: string = this.id+':v'+this.rendered.length;

    if(existingRef != null){
      console.log('[PROJECT CTRL] dashboard view is already rendered>', existingRef,existingRef.uid);
      this.focusView.next( existingRef.uid);
      return;
    }else{
      console.log('[PROJECT CTRL] rendering > ',existingRef,vid);
      this.rendered.push({ item:'dashboard', uid:vid });
    }

    this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data: {}, uid:vid });
  }

}
