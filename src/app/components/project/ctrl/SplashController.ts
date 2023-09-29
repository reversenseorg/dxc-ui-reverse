import {ViewportView} from "../../../cmp/ViewportView";
import {ExplorerCodeComponent} from "../../code/explorer-code/explorer-code.component";
import {IController, IControllerOptions, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Observable, Subject} from "rxjs";
import {ComponentFactoryResolver} from "@angular/core";
import {ProjectService} from "./project.service";
import {StageComponent} from "../../stage/stage.component";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";



export class SplashController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'splash';

  id:Nullable<string> = null;
  app: Nullable<StageComponent> = null;

  service: ProjectService;

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

    this.rendered.map((pView:any) => {     if(pView.__signature__ === pItem.__signature__){
        f = pView;
      }
    });

    return f;
  }

  open(pItem: any, pSrc:any): void{

  }

  openProject( pName:string){

  }

  showSplashScreen():void {

    console.log('show splash ...', this.viewCmp.main);

    let existingRef = this.isAlreadyRendered('splash');
    let vid: string = this.id+':v'+this.rendered.length;

    if(existingRef != null){
      console.log('splash view is already rendered>', existingRef,existingRef.uid);
      this.focusView.next( existingRef.uid);
      return;
    }else{
      console.log('rendering > ',existingRef,vid);
      this.rendered.push({ item:'splash', uid:vid });
    }

    this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data: {}, uid:vid });
  }
}
