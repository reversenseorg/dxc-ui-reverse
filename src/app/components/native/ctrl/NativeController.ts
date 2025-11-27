import {IController, IControllerOptions} from "../../../base/controllers/IController.interface";
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
import {Nullable} from "../../../base/Nullable";
import {IconModelCollection} from "../../../base/icon/IconModel";
import {CODE_ICONS} from "../../code/icons";
import {NATIVE_ICONS} from "../icons";


export class NativeController extends UiController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'native-main';

  id:Nullable<string> = null;
  app: Nullable<StageComponent> = null;

  service: NativeService;


  rendered:any = [];
  gIcons:IconModelCollection = GLOBAL_ICONS;

  // -- data --

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

    this.rendered.map((vItem:any) => {
        switch (pItem.__){
            case NodeInternalType.FUNC:
                if((pItem as any).__s!=null && vItem.__s=== (pItem as any).__s){
                    f = vItem;
                }
                break;
            default:
                if(vItem._uid!=null && vItem._uid=== pItem._uid){
                    f = vItem;
                }
                break;
        }
    });

    return f;
  }





  _show( pItem:any, pType:string):void {

    let existingRef = this.isAlreadyRendered(pItem);
    let vid: string = this.id+':v'+this.rendered.length;

    if(existingRef != null){
      console.log('item is already rendered>', existingRef,pItem,existingRef.uid);
      this.focusView.next( existingRef.uid);
      return;
    }

    let cmp = this.viewCmp.main;
    switch (pItem.__) {
        case NodeInternalType.FUNC:
            cmp = this.viewCmp.func;
            pItem._icon = NATIVE_ICONS['FUNC'];
            break;
        default:
            pItem._icon = FILE_ICONS['BIN'];
            break;
    }


      this.rendered.push({ item:pItem, uid:vid });
      this.openView.next( { cmp: cmp,  ctrl:this, data:pItem, uid:vid });
  }

}
