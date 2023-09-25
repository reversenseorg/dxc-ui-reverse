import {ViewportView} from "../../../cmp/ViewportView";
import {ExplorerCodeComponent} from "../../code/explorer-code/explorer-code.component";
import {IController, IControllerOptions, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Observable, Subject} from "rxjs";
import {ComponentFactoryResolver, EventEmitter} from "@angular/core";
import {StageComponent} from "../../stage/stage.component";
import {UiController} from "../../../base/controllers/UiController";
import {ViewerService} from "./viewer.service";
import {Nullable} from "../../../base/Nullable";



export class ViewerController extends UiController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'viewer';

  id:string = '';
  app: Nullable<StageComponent> = null;

  service: ViewerService;



  //explorer:ExplorerCodeComponent = null;
  rendered:any = [];

  openFile:EventEmitter<any> = new EventEmitter<any>();

  constructor(pConfig:IControllerOptions) {
    super();
    this.configure(pConfig);
    this.openFile.subscribe( pFile => {
      this.open(pFile, 'unk');
    })
  }



  close(pItem: any, pSrc:any): any {

    this.rendered = this.rendered.filter((vItem:any) => {
      return (vItem.path !== pItem.path);
    });


    this.closeView.next(pItem);
  }

  isAlreadyRendered(pItem:any):any {
    let f:any=null;

    this.rendered.map((pView:any) => {     console.log(pView);
      if((pView.local ===pItem.local) && (pView.p === pItem.p)){
        f = pView;
      }
    });

    return f;
  }

  open(pItem: any, pSrc:any): void{
    let existingRef = this.isAlreadyRendered(pItem);
    let vid: string = this.id+':v'+this.rendered.length;

    if(existingRef != null){
      console.log('item is already rendered>', existingRef,pItem,existingRef.uid);
      this.focusView.next( existingRef.uid);
      return;
    }else{
      console.log('rendering > ',pItem,vid);
      this.rendered.push({ item:pItem, uid:vid });
    }

    console.log(pItem);
    pItem._t = 'f';
//    pItem._icon = pItem._icon;
    this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:vid });
  }
}
