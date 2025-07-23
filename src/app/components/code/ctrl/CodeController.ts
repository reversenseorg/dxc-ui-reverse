import {ViewportView} from "../../../cmp/ViewportView";
import {ExplorerCodeComponent} from "../explorer-code/explorer-code.component";
import {IController, IControllerOptions, ViewCmpMap} from "../../../base/controllers/IController.interface";
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
import {Nullable} from "../../../base/Nullable";



export class CodeController extends UiController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name :string = 'code-main';

  id:string = '';
  app:StageComponent; // Nullable<StageComponent> = null;

  lIcons: any = CODE_ICONS;
  gIcons: any = GLOBAL_ICONS;

  service: CodeControllerService;



  override views:ViewportView[] = [];
  explorer:ExplorerCodeComponent;
  rendered:any = [];

  error: Nullable<Error> = null;

  //viewComp: ViewportCodeComponent = null;

  constructor(pConfig:IControllerOptions) {
    super();
    // configure with options
    this.configure(pConfig);
    // perform extra actions
    this.service.displayNode$.subscribe((vEvent)=>{
      this.showItem(vEvent.node);
    });

    this.service.setController(this);
  }



  override getViews():ViewportView[]{
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
    if(pItem==null) return;

   //console.log("[HOOK CONTROLLER][isRendered?] ",pItem)
    this.rendered.map((vItem:any):void => {
      if(vItem.item == null){
        //console.log(vItem);
        return;
      }
      //console.log("[CODE CONTROLLER][isRendered?] ",pItem.__,vItem.item);

      //if(vItem.item._t !== pItem._t) return null;
      if(pItem!=null && (vItem.item.__ != pItem.__)) return;

      console.log('Code Controller > isAlreadyRendered > ',vItem);

      switch(vItem.item._t){
        case 'p':
        case 'c':
          console.log(vItem.item.name === pItem.name,vItem, pItem);
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
        default:
          return;
      }
    });

    return f;
  }


  /**
   * To open a method and focus a region
   *
   * @param pMethod
   * @param pInstruction
   * @param pOptions
   */
  openMethodAt( pMethod:ModelMethod|string, pInstruction:Nullable<ModelInstruction> = null, pOptions:any = null, pDirect = false){
    let target:ModelMethod;

    if(typeof (pMethod)=='string'){
      target = new ModelMethod({ __signature__: pMethod, _icon: this.gIcons['METHOD'] });
    }else{
      target = pMethod;
    }

    if(target==null || target.__signature__==null){
      throw new Error("openMethodAt() failed");
    }

    if(pDirect){
      (pMethod as any)._t = 'm';
      (pMethod as any)._icon = ((target as any)._icon != null)? (target as any)._icon : this.gIcons['METHOD'];

      if(pInstruction != null){
        (pMethod as any).focus = pInstruction;
      }

      (pMethod as any).__view_code = "test";
      //this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pMethod, uid:pOptions.vid });


      this.service.disassMethod({
        __: NodeInternalType.METHOD,
        _uid: target.__signature__
      }, pDirect, (pMethod.hasOwnProperty('__puid__')?(pMethod as any).__puid__:"-")).subscribe( (pCode:any)=>{
        (pMethod as any).__view_code = pCode.smali;
        this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pMethod, uid:pOptions.vid, opts:{direct:true} });
      });
      return;
    }

    this.service.getMethod(target.__signature__,true).subscribe( (pObs:any)=>{
      console.log(pObs);
      pObs._t = 'm';
      pObs._icon = ((target as any)._icon != null)? (target as any)._icon : this.gIcons['METHOD'];

      if(pInstruction != null){
        pObs.focus = pInstruction;
      }


      this.service.disassMethod({
        __: NodeInternalType.METHOD,
        _uid: target.__signature__
      }).subscribe( (pCode:any)=>{
        let code = '';

        pCode.disass.map((pBB:any) => {         pBB.instr.map((pInstr:any) => {           code += pInstr.value+`
`;
          })
          code += `
`;
        })
        pObs.__view_code = code;


        this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pObs, uid:pOptions.vid, opts:{direct:false} });
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
  open(pItem: any, pSrc:any = 'vp', pInstruction:Nullable<ModelInstruction> = null, pDirect = false): void{


    console.log("CodeController > open >  ",pItem,pSrc);

    let existingRef = this.isAlreadyRendered(pItem);
    let vid: string = this.id+':v'+this.rendered.length;

    if(existingRef != null){
      console.log('item is already rendered>', existingRef,pItem,existingRef.uid);
      //this.focusView.next( existingRef.uid);
      this.app?.focusView(existingRef.uid);
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
        this.openMethodAt(pItem,pInstruction, { vid:vid }, pDirect);
        break;
      case NodeInternalType.CLASS:
        this.service.getClass(pItem.name).subscribe( (pObs:any)=>{
          console.log("getClass() => ",pObs);
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
    this.app?.showModal('rename-item', pObj);
  }



  showItem( pObj:any, pDirect = false):void{
    console.log('show item>', pObj);
    switch(pObj.__){
      case NodeInternalType.FILE:
        this.app?.getController('ctrl:native-main').open(pObj,'code',pDirect);
        break;
      case NodeInternalType.FUNC:
        this.app?.getController('ctrl:native-main').open(pObj,'code',pDirect);
        break;
      case NodeInternalType.CLASS:
        if(typeof pObj==='string')
          this.open({ _t:'c', name:pObj}, 'ctxm', null, pDirect);
        else
          this.open({ _t:'c', name:pObj.name}, 'ctxm', null,pDirect);
        break;
      case NodeInternalType.STRING:
        //this.app?.getController('ctrl:native-main').open(pObj,'code');
        break;
      default:
        this.open( pObj, 'ctxm', null, pDirect);
        break;
    }
  }

  showClass( pClass:any):void{

    console.log('show class>', pClass);
    if(typeof pClass==='string')
      this.open({ _t:'c', name:pClass}, 'ctxm');
    else
      this.open({ _t:'c', name:pClass.name}, 'ctxm');
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

    console.log('showXref > ',pSubject, pOptions);
    if(typeof pSubject==='object'){
      switch(pSubject.__){
        case NodeInternalType.FIELD:
        case 'f':
          if(pOptions.type==='read'){
            this.app?.doSearch(`byID().field('${pSubject.__signature__}').select('_getters')`,'m');
          }else if(pOptions.type==='write'){
            this.app?.doSearch(`byID().field('${pSubject.__signature__}').select('_setters')`,'m');
          }
          break;
        case NodeInternalType.METHOD:
        case 'm':
          if(pOptions.type==='to'){
            this.app?.doSearch(`byID().method('${pSubject.__signature__}').select('_callers')`,'m');
          }else if(pOptions.type==='from'){
            this.app?.doSearch(`call('caller.__signature__:${pSubject.__signature__}')`,'m');
          }
          break;
        case NodeInternalType.CLASS:
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
      default: return -1;
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
