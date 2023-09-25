import {IController, IControllerOptions} from "../../../base/controllers/IController.interface";
import {Observable, Subject} from "rxjs";
import {ViewportView} from "../../../cmp/ViewportView";
import {ComponentFactoryResolver} from "@angular/core";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import {AppComponent} from "../../../app.component";
import Hook from "../../../models/Hook";
import {map} from "rxjs/operators";
import {HOOK_TARGET_TYPE, HookService} from "./hook.service";
import {Inspector} from "../../../models/Inspector";
import {InspectorController} from "../../inspector/ctrl/InspectorController";
import {StageComponent} from "../../stage/stage.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {OutputMessage} from "../../../cmp/OutputMessage";
import ModelMethod from "../../../models/ModelMethod";
import {AbstractHook} from "../../../models/AbstractHook";
import {UiController} from "../../../base/controllers/UiController";
import {NativeController} from "../../native/ctrl/NativeController";
import {FileController} from "../../file/ctrl/FileController";
import ModelFile from "../../../models/ModelFile";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {ViewportHookComponent} from "../viewport-hooks/viewport-hook.component";
import KeyPoint from "../../../models/KeyPoint";
import {CodeController} from "../../code/ctrl/CodeController";
import ModelClass from "../../../models/ModelClass";
import {CodeItem} from "../../code/explorer-code/CodeItem";
import HookMessage from "../../../models/HookMessage";
import HookSession from "../../../models/hook/HookSession";
import {RuntimeEvent} from "../../../models/hook/RuntimeEvent";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {IconModelCollection} from "../../../base/icon/IconModel";
import {UIException} from "../../../base/error/UIException";


export class HookController extends UiController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'hook-main';

  id:Nullable<string> = null;
  app: Nullable<StageComponent> = null;

  service: HookService;


  rendered:any = [];
  gIcons:IconModelCollection = GLOBAL_ICONS;

  // -- data --
  inspectors: Inspector[] = [];
  hooks: any = [];

  constructor(pConfig:IControllerOptions) {
    super();
    this.configure(pConfig);
  }



  /**
   * Perform initializing when project is fully loaded
   */
  onAppInit(){
    this.loadInspectors();
  }

  /**
   * To check if the hook is enabled$
   *
   * @param {Hook} pHook The hook object
   * @return {boolean} TRUE is the hook is enabled, else false
   */
  isHookEnabled( pHook:Hook):boolean {
    return (pHook.enabled === true);
  }

  /**
   * To intercept viewport closing.
   *
   * It can be used to detected unsaved hook code
   * and prevent viewport closing.
   *
   * Remove the panel from rendered view list
   *
   * @param pItem
   * @param pSrc
   */
  close(pItem: any, pSrc:any): any {


    console.log(pItem);
    console.log("[HOOK CONTROLLER][close="+pItem.data.id+"] before ", this.rendered);

    switch (pItem.data.__) {
      case NodeInternalType.HOOK_JAVA:
      case NodeInternalType.HOOK_NATIVE:
        this.rendered = this.rendered.filter( (vItem:any) => {
          if(!vItem.item.hasOwnProperty('id')){
            return true;
          }else{
            return (vItem.item.id !== pItem.data.id);
          }

          return false;
        });
        break;
    }

    console.log("[HOOK CONTROLLER][close="+pItem.data.id+"] after ", this.rendered);

    //this.closeView.next(pItem);
  }

  /**
   * To show a hook
   *
   * @param pItem
   * @param pSrc
   */
  open(pItem: any, pSrc:any): any{
    console.log("[HOOK CONTROLLER][open] ",pItem,pSrc);
    this._show( pItem, 'hook');
  }


  loadInspectors():Observable<any> {
    this.inspectors = [];
    return this.service.listInspectors().pipe(
      map( vEl => {
        console.log(vEl);
        vEl.data.map( (vInsp:any)=>{
          this.inspectors.push(new Inspector(vInsp));
        })
        //this.inspectors.push()
        return vEl;
      })
    );
  }

  /**
   * TODO
   * @param pInspector
   */
  bindInspector( pInspector:Inspector):Inspector {
    let hooks=[]

    /*
    if(pInspector.hookset==null){

    }
    for(let i in pInspector.hookset.hooks){
      //hooks.push(this.service.getHook())
    }*/
    //pInspector.hookset.hooks = hooks;
    return pInspector;
  }

  isAlreadyRendered(pItem:any):any {
    let f:any=null;


    this.rendered.map((vItem:any) => {     console.log("[HOOK CONTROLLER][isRendered?] ",pItem, vItem);

      if(vItem.item == null) return;

      if(vItem.item.__ === pItem.__){
        switch (pItem.__) {
          case NodeInternalType.HOOK_JAVA:
          case NodeInternalType.HOOK_NATIVE:
            if(pItem.id === vItem.item.id){
              f = vItem;
            }
            break;
        }
      }
    });

    if(f !== null){
      console.log("[HOOK CONTROLLER][isRendered?] YES : ",f);
    }else{
      console.log("[HOOK CONTROLLER][isRendered?] NO : ",pItem);
    }

    return f;
  }





  /**
   * To turn ON / OFF a hook
   *
   * @param {Hook} pHook Hook instance to turn ON / OFF
   * @method
   * @since 1.0.0
   */
  switchOnOff( pHook:AbstractHook):void {
    this.service.enableHook( pHook, !pHook._enabled).subscribe( (pStatus:boolean) => {
      console.log(pHook);
      (pHook as any)._enabled = pStatus;
      console.log(pHook);
    });
  }


  _show( pItem:any, pType:string):void {


    if(this.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    let existingRef = this.isAlreadyRendered(pItem);
    let vid: string = this.id+':v'+this.rendered.length;

    if(existingRef != null){
      console.log('item is already rendered>', existingRef,pItem,existingRef.uid);
      this.focusView.next( existingRef.uid);
      return;
    }else{
      console.log("[HOOK CONTROLLER] Opening ",pItem);
    }

    switch(pItem.__){
      case NodeInternalType.HOOK_NATIVE:
      case NodeInternalType.HOOK_JAVA:
        this.service.getHook(pItem.id).subscribe( (pHook:AbstractHook)=>{
          (pHook as any)._icon = GLOBAL_ICONS['HOOKS'];
          this.rendered.push({ item:pHook, uid:vid });
          this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pHook, uid:vid });
        });
        break;
      case NodeInternalType.KEY_POINT:
        this.rendered.push({ item:pItem, uid:vid });
        this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:vid });
        break;
      case NodeInternalType.INSPECTOR:
        (this.app.getController('ctrl:inspector') as InspectorController)._show(pItem);
        break;
      case NodeInternalType.HOOK_SESSION:
        if((pItem as HookSession).getUID()!=null){
          this.service.getMessageFromSession((pItem as HookSession).getUID() as string).subscribe(( pMessages:RuntimeEvent<any>[] )=>{
            console.log(pMessages);
          });
        }else{
          this.service.outputSvc.print(OutputMessage.newError({msg:"HookSession cannot be retrieved : invalid session ID", src:"HookController"}));
        }

        break;
      default:
        if(pItem._t == 's'){
          console.log(pItem);
          this.rendered.push({ item:pItem, uid:vid });
          this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:vid });
        }
        break;
      // is the item is a method
      /*case 'm':
        this.service.getHookFor((pItem as ModelMethod).getSignature()).subscribe( (pHook:Hook)=>{
          pHook._icon = GLOBAL_ICONS['HOOKS'];
          this.rendered.push({ item:pHook, uid:vid });
          this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pHook, uid:vid });
        });
        break;*/
    }
  }

  /**
   * To show hook detail into viewport
   *
   * @param {Hook} pHook Hook instance
   * @method
   * @since 1.0.0
   */
  showHook( pHook:Hook):void {
    this._show( pHook, 'hook');
  }


  /**
   * To show the list of key points
   *
   * @param {Hook} pHook Hook instance
   * @method
   * @since 1.0.0
   */
  showAttachToKP( pOpts:any):void {
    if(this.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }
    this.app.showModal('selectKP', pOpts);
  }


  /**
   * To show inspector detail into viewport
   *
   * @param {Inspector} pInspector Inspector instance
   * @method
   * @since 1.0.0
   */
  showInspectorDetail( pInspector:any): void {
    if(this.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }
    (this.app.getController('ctrl:inspector') as InspectorController)._show(pInspector);
  }


  /**
   * To show detection output of the given inspector
   *
   * @param {Inspector} pInspector Inspector instance
   * @method
   * @since 1.0.0
   */
  showDetectionsOf( pInspector:any): void {
    //(this.app.getController('ctrl:inspector') as InspectorController).showDetectionOf(pInspector);
  }

  /**
   * To show output of hook defined into inspector
   *
   * @param {Inspector} pInspector Inspector instance
   * @method
   * @since 1.0.0
   */
  showLogsOf( pInspector:any): void {

  }


  editFrag(pFragInfo: any) {
    this.service.onEditFragment.next(pFragInfo);
  }


  /**
   * To delete a fgragment from a hook :
   *
   * It trigger an event to refresh hook info / fragments list
   *
   * @param pFragInfo
   */
  deleteFrag(pFragInfo: any) {
    console.log(pFragInfo);
    this.service.deleteHookFragment(pFragInfo.hook, pFragInfo.frag, pFragInfo.pos).subscribe( (vBool:boolean) => {

    });
  }

  /**
   *
   * @param pHook
   */
  deleteHook(pHook:any){
    this.service.removeHook(pHook).subscribe( (vBool:boolean) => {
      //
    });
  }

  openLib(fileUID: string) {

    if(this.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    const nativeCtrl:NativeController = this.app.getController('ctrl:native-main');
    const fileCtrl:FileController = this.app.getController('ctrl:file');

    fileCtrl.service.viewFileContent(fileUID).subscribe( (vFile:Nullable<ModelFile>)=>{
      if(vFile!=null){
        nativeCtrl.open(vFile,'code');
      }
    })

    //this.app.getController('ctrl:code')
  }


  showTargetKP(pKeyPoint: any) {
    console.log(pKeyPoint);


    if(this.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    if(pKeyPoint.node.length==0){
      this.service.outputSvc.alert(OutputMessage.newWarning({
        msg: "This key point is not associated to a node from the AST"
      }))
    }

    const codeCtrl:CodeController = this.app.getController('ctrl:code-main');
    const target = pKeyPoint.node[0];


    switch (target.__) {
      case NodeInternalType.FILE:
        const fileCtrl:FileController = this.app.getController('ctrl:file');
        const nativeCtrl:NativeController = this.app.getController('ctrl:native-main');
        fileCtrl.service.viewFileContent(pKeyPoint.node[0].uid).subscribe( (vFile:Nullable<ModelFile>)=>{
          if(vFile!=null) nativeCtrl.open(vFile,'code');
        });
        break;
      case NodeInternalType.CLASS:
        codeCtrl.open({ __:target.__, name:target.uid },'code');
        break;
      case NodeInternalType.METHOD:
        codeCtrl.open({ __:target.__, __signature__:target.uid },'code');
        break;
      case NodeInternalType.FIELD:
        codeCtrl.open({ __:target.__, __signature__:target.uid },'code');
        break;
      case NodeInternalType.PACKAGE:
        codeCtrl.open({ __:target.__, name:target.uid },'code');
        break;
      case NodeInternalType.FUNC:
        //const nativeCtrl2:NativeController = this.app.getController('ctrl:native-main');

        break;
    }

  }
}
