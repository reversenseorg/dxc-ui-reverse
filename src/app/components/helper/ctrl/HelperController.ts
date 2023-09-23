import {IController, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Subject} from "rxjs";
import {ViewportView} from "../../../cmp/ViewportView";
import {ComponentFactoryResolver} from "@angular/core";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import {ExplorerCodeComponent} from "../../code/explorer-code/explorer-code.component";
import {AppComponent} from "../../../app.component";
import {HelperService} from "./HelperService";
import {StageComponent} from "../../stage/stage.component";


export class HelperController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'helper';

  id:string = null;
  app: StageComponent = null;

  service: HelperService = null;

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


  /**
   * To open help sheet by its name
   *
   * @param {string} pName Help sheet name
   */
  open(pName: any): void{
    alert('Openinf help for : '+pName);
  }

  /**
   * To open help of the given inspector
   *
   * @param {string} pName Inspector's name
   */
  openInspector(pName: any): void {
    alert('Open inspector help : '+pName);
  }
}
