
import {ViewportView} from "../../cmp/ViewportView";
import {ViewportComponent} from "./viewport.component";
import {Nullable} from "../Nullable";
import {IStringIndex} from "../IStringIndex";
import {IControllerOptions} from "../controllers/IController.interface";


export interface ViewportControllerOptions extends IStringIndex<any> {
  parent?:any;
  id?:string;
  vp?: ViewportComponent;
}
export class ViewportController {

  // @ts-ignore
  parent: any;
  id:Nullable<string> = null;

  //tabTpl:
  views: ViewportView[] = [];
  vp: ViewportComponent;

  constructor(pConfig:ViewportControllerOptions) {
    this.configure(pConfig);
  }

  configure( pConfig:ViewportControllerOptions):void {
    for(let i in pConfig){
      (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }

  injectVP( pComp:any):void {
    this.vp = pComp;
  }

  getViews():ViewportView[]{
    return this.views;
  }

  createView( pView: any):void {
    this.vp.addTab(pView);
  }

  selectView( pViewUID: string):void {
    console.log("[VP CONRTOLLER] Select view UID="+pViewUID);
    this.vp.selectTabByUID2( pViewUID);
  }


  closeView( pView: any):void {
    //console.log('vp> close>',pView);
  }
}
