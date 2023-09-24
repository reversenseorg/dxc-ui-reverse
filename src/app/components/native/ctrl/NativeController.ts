import {IController} from "../../../base/controllers/IController.interface";
import {Observable, Subject} from "rxjs";
import {ViewportView} from "../../../cmp/ViewportView";
import {ComponentFactoryResolver} from "@angular/core";
import {map} from "rxjs/operators";
import {NativeService} from "./native.service";
import {StageComponent} from "../../stage/stage.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import ModelFile from "../../../models/ModelFile";
import {NodeType} from "../../../models/NodeType";
import {FILE_ICONS} from "../../file/icons";
import {UiController} from "../../../base/controllers/UiController";
import {NodeInternalType} from "../../../models/NodeInternalType";


export class NativeController extends UiController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'native-main';

  id:Nullable<string> = null;
  app: StageComponent = null;

  service: NativeService = null;

  explorerCmp: any = null;
  viewCmp: any = null;
  terminalCmp: any = null;
  modalCmp: any = null;

  views:ViewportView[] = [];

  componentFactoryResolver:ComponentFactoryResolver = null;

  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();


  rendered:any = [];
  gIcons:any = GLOBAL_ICONS;

  // -- data --

  constructor(pConfig:any=null) {
    super();

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


  /**
   * To intercept viewport closing.
   *
   * It can be used to detected unsaved hook code
   * and prevent viewport closing.
   *
   * @param pItem
   * @param pSrc
   */
  close(pItem: any, pSrc:any): any {

  }

  /**
   * To show a hook
   *
   * @param pItem
   * @param pSrc
   */
  open(pItem: any, pSrc:any): any{

    console.log("[NATIVE CONTROLLER][open]", pItem);
    switch (pItem.__){
      case NodeInternalType.FUNC:
        this._show( pItem, 'lib');
        break;
      case NodeInternalType.FILE:
      default:
        this._show( pItem, 'lib');
        break;
    }
  }


  isAlreadyRendered(pItem:ModelFile):any {
    let f:any=null;

    this.rendered.map( vItem => {
      if(vItem._uid === pItem._uid){
        f = vItem;
      }
    });

    return f;
  }





  _show( pItem:ModelFile, pType:string):void {

    let existingRef = this.isAlreadyRendered(pItem);
    let vid: string = this.id+':v'+this.rendered.length;

    if(existingRef != null){
      console.log('item is already rendered>', existingRef,pItem,existingRef.uid);
      this.focusView.next( existingRef.uid);
      return;
    }

    pItem._icon = FILE_ICONS['BIN'];
    this.rendered.push({ item:pItem, uid:vid });
    this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:vid });
    /*
    switch(pItem._t){
      case NodeType.FILE:

        pItem._icon = GLOBAL_ICONS['FILE'];
        this.rendered.push({ item:pItem, uid:vid });
        this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:vid });
        /*
        this.service.getLibrary(pItem.getUID()).subscribe( (pData:data)=>{
          pItem._icon = GLOBAL_ICONS['FILE'];
          this.rendered.push({ item:pItem, uid:vid });
          this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:vid });
        });
        break;
    }*/
  }

}
