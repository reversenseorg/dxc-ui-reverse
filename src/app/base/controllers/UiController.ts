import {ViewCmpMap} from "./IController.interface";
import {Subject} from "rxjs";
import {ViewportView} from "../../cmp/ViewportView";


export class UiController {


  explorerCmp: any = null;
  viewCmp: ViewCmpMap = {};
  terminalCmp: any = null;
  modalCmp: any = null;


  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();


  views:ViewportView[] = [];

  configure( pConfig:any=null):void {
    if(pConfig==null) return;

    for(let i in pConfig){
      if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }


  getExplorerCmp():any {
    return this.explorerCmp.main;
  }

  // Contextual menu shared between sub component
  protected _ctxMenu:any = {};

  registerCtxMenu( pName:string, pCmp:any):void {
    this._ctxMenu[pName] = pCmp;
  }

  displayCtxMenu(pEvent:any, pType:string, pObject:any):void{
    console.log(pEvent);
    if(this._ctxMenu.hasOwnProperty(pType)){
      this._ctxMenu[pType].displayCtxMenu(pEvent, pType, pObject);
    }
  }

  getViews():ViewportView[]{
    return this.views;
  }
}
