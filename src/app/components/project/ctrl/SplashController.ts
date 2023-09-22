import {ViewportView} from "../../../cmp/ViewportView";
import {ExplorerCodeComponent} from "../../code/explorer-code/explorer-code.component";
import {IController, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Observable, Subject} from "rxjs";
import {ComponentFactoryResolver} from "@angular/core";
import {ProjectService} from "./project.service";
import {StageComponent} from "../../stage/stage.component";



export class SplashController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'splash';

  id:string = null;
  app: StageComponent = null;

  service: ProjectService = null;

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
  //viewComp: ViewportCodeComponent = null;

  constructor(pConfig:any=null) {
    this.configure(pConfig);
  }

  configure( pConfig:any=null):void {
    if(pConfig==null) return;

    for(let i in pConfig){
      if(this.hasOwnProperty(i)) this[i] = pConfig[i];
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
      if(pView.__signature__ === pItem.__signature__){
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
