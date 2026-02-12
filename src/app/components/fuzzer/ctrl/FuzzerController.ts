import {IController, IControllerOptions} from "../../../base/controllers/IController.interface";
import {StageComponent} from "../../stage/stage.component";
import {UiController} from "../../../base/controllers/UiController";
import {Nullable} from "../../../base/Nullable";
import {FuzzerService} from "./fuzzer.service";
import FuzzSession from "../../../models/fuzz/FuzzSession";


export class FuzzerController extends UiController  implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'fuzz';
  id:Nullable<string> = null;
  app:StageComponent; // Nullable<StageComponent> = null;
  service: FuzzerService;

  constructor(pConfig:IControllerOptions) {
    super();
    this.configure(pConfig);

    this.service.show$.subscribe((vSess)=>{
        this.open(vSess,null);
    })
  }


  close(pItem: any, pSrc:any): any {

  }

  open(pItem: FuzzSession, pSrc:any): any{
    this.openView.next( { cmp: this.viewCmp.main,  ctrl:this, data:pItem, uid:pItem.getUID() });
  }
}
