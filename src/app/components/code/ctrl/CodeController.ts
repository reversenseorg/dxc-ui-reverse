import {ViewportView} from "../../../cmp/ViewportView";
import {ExplorerCodeComponent} from "../explorer-code/explorer-code.component";
import {IController, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {Observable, Subject} from "rxjs";
import {CodeItem} from "../explorer-code/CodeItem";
import {ViewportCodeComponent} from "../viewport-code/viewport-code.component";
import {ComponentFactoryResolver} from "@angular/core";
import {CodeControllerService} from "./code-controller.service";
import {AppComponent} from "../../../app.component";
import {CODE_ICONS} from "../icons";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {StageComponent} from "../../stage/stage.component";
import {UiController} from "../../../base/controllers/UiController";
import ModelMethod from "../../../models/ModelMethod";
import ModelField from "../../../models/ModelField";
import ModelFile from "../../../models/ModelFile";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {NodeInternalType} from "../../../models/NodeInternalType";
import ModelInstruction from "../../../models/ModelInstruction";



export class CodeController extends UiController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name :string = 'code-main';

  id:string = '';
  app: StageComponent = null;

  lIcons: any = CODE_ICONS;
  gIcons: any = GLOBAL_ICONS;

  service: CodeControllerService = null;




  componentFactoryResolver:ComponentFactoryResolver = null;

  views:ViewportView[] = [];
  explorer:ExplorerCodeComponent = null;
  rendered:any = [];

  error: Error = null;

  //viewComp: ViewportCodeComponent = null;

  constructor(pConfig:any=null) {
    super();
    this.configure(pConfig);
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

   //console.log("[HOOK CONTROLLER][isRendered?] ",pItem)
    this.rendered.map( vItem => {
      if(vItem.item == null){
        //console.log(vItem);
        return;
      }
      //console.log("[CODE CONTROLLER][isRendered?] ",pItem.__,vItem.item);

      //if(vItem.item._t !== pItem._t) return null;
      if(pItem!=null && (vItem.item.__ != pItem.__)) return null;
      switch(vItem.item._t){
        case 'p':
        case 'c':
          //console.log(vItem.item.name === pItem.name,vItem, pItem);
          if(vItem.item.name === pItem.name){
            f = vItem;
          }
          break;
        case 'f':
        case 'm':
          //console.log(vItem.item.__signature__ === pItem.__signature__,vItem.item.__signature__, pItem.__signature__);
          if(vItem.item.__signature__ === pItem.__signature__){
            f = vItem;
          }
          break;
      }
    });

    return f;
  }

  private _

  /**
   * To open a method and focus a region
   *
   * @param pMethod
   * @param pInstruction
   * @param pOptions
   */
  openMethodAt( pMethod:ModelMethod|string, pInstruction:ModelInstruction = null, pOptions:any = null){
    let target:ModelMethod;

    if(typeof (pMethod)=='string'){
      target = new ModelMethod({ __signature__: pMethod, _icon: this.gIcons['METHOD'] });
    }else{
      target = pMethod;
    }

    this.service.getMethod(target.__signature__,true).subscribe( (pObs:any)=>{
      console.log(pObs);
      pObs._t = 'm';
      pObs._icon = ((target as any)._icon != null)? (target as any)._icon : this.gIcons['METHOD'];

      if(pInstruction != null){
        pObs.focus = pInstruction;
      }


      this.service.disassMethod(target.__signature__).subscribe( (pCode:any)=>{
        let code = '';

        pCode.disass.map( pBB => {
          pBB.instr.map( pInstr => {
            code += pInstr.value+`
`;
          })
          code += `
`;
        })
        pObs.__view_code = code;


        this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pObs, uid:pOptions.vid });
      });
    });

  }


  /**
   * To open an item into viewport
   *
   * Item can be : package, class, field, method, structure, etc..
   *
   * @param pItem
   * @param {string} pSrc Component type which trigged the action
   * @method
   * @since 1.0.0
   */
  open(pItem: any, pSrc:any = 'vp', pInstruction:ModelInstruction = null): void{

    let existingRef = this.isAlreadyRendered(pItem);
    let vid: string = this.id+':v'+this.rendered.length;

    if(existingRef != null){
      console.log('item is already rendered>', existingRef,pItem,existingRef.uid);
      //this.focusView.next( existingRef.uid);
      this.app.focusView(existingRef.uid);
      return;
    }else{
      console.log('rendering > ',pItem,vid);
      this.rendered.push({ item:pItem, uid:vid });
    }

    if(pItem.hasOwnProperty('__')==false){
      pItem.__ = this.getNodeTypeFrom(pItem);
    }

    let uid:Nullable<string> = null;
    switch(pItem.__){
      case NodeInternalType.METHOD:
        this.openMethodAt(pItem,pInstruction, { vid:vid });
        break;
      case NodeInternalType.CLASS:
        this.service.getClass(pItem.name).subscribe( (pObs:any)=>{
          pObs.data._t = 'c';
          pObs.data._icon = pItem._icon;
          this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pObs.data, uid:vid });
        });
        break;
      case NodeInternalType.PACKAGE:
        this.service.getPackage(pItem.name).subscribe( (pObs:any)=>{
          pObs.data._t = 'p';
          pObs.data._icon = pItem._icon;
          this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pObs.data, uid:vid });
        });
        break;
      case NodeInternalType.FIELD:
        this.service.getField(pItem.__signature__).subscribe( (pObs:any)=>{
          pObs.data._t = 'f';
          pObs.data._icon = pItem._icon;
          this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pObs.data, uid:vid });
        });
        break;
    }
  }

  renameItem( pObj:any ):void{
    console.log(pObj);
    this.app.showModal('rename-item', pObj);
  }



  showItem( pObj:any):void{
    console.log('show item>', pObj);
    switch(pObj.__){
      case NodeInternalType.FILE:
        this.app.getController('ctrl:native-main').open(pObj,'code');
        break;
      case NodeInternalType.FUNC:
        this.app.getController('ctrl:native-main').open(pObj,'code');
        break;
      default:
        this.open( pObj, 'ctxm');
        break;
    }
  }

  showClass( pName:any):void{
    console.log('show class>', pName);
    this.open({ _t:'c', name:pName}, 'ctxm');
  }

  renameMeth( pObj:any ):void{
    //alert('renameMeth');
  }

  locateAppFile( pFile:string ){
    // locate file into reconstructed sources
  }

  filterCodeExplorer(pType:string) :void {

  }

  onRenameOpen( pModal:any):void {
    console.log('modal opened >',pModal);
  }

  showXref(pSubject: any, pOptions:any = null) {
    if(pSubject===null || pSubject===undefined) return;

    if(typeof pSubject==='object'){
      switch(pSubject._t){
        case 'f':
          if(pOptions.type==='read'){
            this.app.doSearch(`byID().field('${pSubject.__signature__}').select('_getters')`,'m');
          }else if(pOptions.type==='write'){
            this.app.doSearch(`byID().field('${pSubject.__signature__}').select('_setters')`,'m');
          }
          break;
        case 'm':
          if(pOptions.type==='to'){
            this.app.doSearch(`byID().method('${pSubject.__signature__}').select('_callers')`,'m');
          }else if(pOptions.type==='from'){
            this.app.doSearch(`call('callers.__signature__:${pSubject.__signature__}')`,'m');
          }
          break;
        case 'c':
          if(pOptions.type==='new'){
          //  this.app.doSearch(`call('__signature__:${pSubject.__signature__}')`);
          }
          break;
      }
    }

  }

  /**
   * An event stream  of method to display into a modal
   */
  openMethodModal: Subject<ModelMethod|string>  =new Subject<ModelMethod|string>();

  createHook(subject: any) {

  }


  /**
   *
   * @param pItem
   */
  printFilePath(pItem:ModelFile):void {
    this.service.printFilePath(pItem);
  }

  private getNodeTypeFrom(pItem: any):number {
    switch (pItem._t) {
      case 'c': return NodeInternalType.CLASS;
      case 'm': return NodeInternalType.METHOD;
      case 'f': return NodeInternalType.FIELD;
      case 'p': return NodeInternalType.PACKAGE;
    }
  }

  /**
   * To open detail of a node into the viewport from another component
   *
   * @param pUID
   * @param pNodeType
   * @method
   */
  openNode(pUID: any, pNodeType:number) {
    switch(pNodeType){
      case NodeInternalType.METHOD:
        this.open({ _t:'m', __:pNodeType, __signature__:pUID, _icon:this.lIcons['METH'] });
        break;
      case NodeInternalType.CLASS:
        this.open({ _t:'c', __:pNodeType, name:pUID, _icon:this.lIcons['CLASS'] });
        break;
      case NodeInternalType.FIELD:
        this.open({ _t:'f', __:pNodeType, __signature__:pUID, _icon:this.lIcons['CLASS'] });
        break;
    }
  }
}
