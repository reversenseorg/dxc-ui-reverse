
import {IController, IControllerOptions, ViewCmpMap} from "../../../base/controllers/IController.interface";
import {StageComponent} from "../../stage/stage.component";
import {TagService} from "./tag.service";
import {Nullable} from "../../../base/Nullable";
import {UiController} from "../../../base/controllers/UiController";
import {ExplorerTagComponent} from "../explorer-tag/explorer-tag.component";



export class TagController extends UiController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'tag';

  id:Nullable<string> = null;
  app: Nullable<StageComponent> = null;

  service: TagService;


  explorer:Nullable<ExplorerTagComponent>;
  rendered:any = [];
  //viewComp: ViewportCodeComponent = null;

  constructor(pConfig:IControllerOptions) {
    super();
    this.configure(pConfig);
  }

  close(pItem: any, pSrc: any): any {
  }

  open(pItem: any, pSrc: any): any {
  }

    editTag(ctxMenuState: any, $event: any) {
        this.app?.showModal('tag_editor', ctxMenuState.subject);
    }


  showInfo(ctxMenuState: any, $event: any) {
    this.app?.showModal('tag_info', ctxMenuState.subject);
  }


}
