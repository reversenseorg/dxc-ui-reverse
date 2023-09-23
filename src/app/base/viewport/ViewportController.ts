
import {ViewportView} from "../../cmp/ViewportView";
import {ViewportComponent} from "./viewport.component";


export class ViewportController {

  // @ts-ignore
  parent: any;
  id: string = null;

  //tabTpl:
  views: ViewportView[] = [];
  vp: ViewportComponent;

  constructor(pConfig:any = null) {
    this.configure(pConfig);
  }

  configure( pConfig:any):void {
    for(let i in pConfig){
      if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
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
