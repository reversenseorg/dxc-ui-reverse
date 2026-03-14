import {IController, IControllerOptions} from "../../../base/controllers/IController.interface";
import Hook from "../../../models/Hook";
import {Inspector} from "../../../models/Inspector";
import {InspectorController} from "../../inspector/ctrl/InspectorController";
import {StageComponent} from "../../stage/stage.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {AbstractHook} from "../../../models/AbstractHook";
import {UiController} from "../../../base/controllers/UiController";
import {NativeController} from "../../native/ctrl/NativeController";
import {FileController} from "../../file/ctrl/FileController";
import ModelFile from "../../../models/ModelFile";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {CodeController} from "../../code/ctrl/CodeController";
import HookSession from "../../../models/hook/HookSession";
import {RuntimeEvent, RuntimeEventType} from "../../../models/hook/RuntimeEvent";
import {Nullable} from "../../../base/Nullable";
import {IconModelCollection} from "../../../base/icon/IconModel";
import {UIException} from "../../../base/error/UIException";
import {RuntimeEventsService} from "./events.service";


export class RuntimeEventController extends UiController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'event-main';

  id:Nullable<string> = null;
  app: Nullable<StageComponent> = null;

  service: RuntimeEventsService;


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
  close(pItem: any = null, pSrc:any = null): any {

    // todo : clear events cache

    console.log("[RUNT. EVT. CONTROLLER][close=?] before ", this.rendered);

    //this.closeView.next(pItem);
  }

  /**
   * To show a hook
   *
   * @param pItem
   * @param pSrc
   */
  open(pItem: any = null, pSrc:any = null): any{
    console.log("[RUNT. EVT. CONTROLLER][open]",pItem,pSrc);
    //this._show( pItem, 'hook');
  }

  isAlreadyRendered(pItem:any):any {
    let f:any=null;


    this.rendered.map((vItem:any) => {
      //console.log("[HOOK CONTROLLER][isRendered?] ",pItem, vItem);

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
    /*this.service.enableHook( pHook, !pHook._enabled).subscribe( (pStatus:boolean) => {
      (pHook as any).enable = pStatus;
    });*/
  }


  private _show( pType:RuntimeEventType, pFilter:any = null):void {

    if(this.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    let existingRef = this.isAlreadyRendered(pType);
    let vid: string = this.id+':v'+this.rendered.length;

    if(existingRef != null){
      this.focusView.next( existingRef.uid);
      return;
    }else{
      console.log("[RUNT. EVT. CONTROLLER] Opening ",pType);
        //this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:vid });
        //this.rendered.push({ item:pHook, uid:vid });
    }


    //this.service.listEvents(pType).subscribe(()=>{
      // this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:vid });
      // this.rendered.push({ item:pHook, uid:vid });
    //})

  }

  /**
   * To show hook detail into viewport
   *
   * @param {Hook} pHook Hook instance
   * @method
   * @since 1.0.0
   */
  showHook( pHook:Hook):void {
    //this._show( pHook, 'hook');
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
