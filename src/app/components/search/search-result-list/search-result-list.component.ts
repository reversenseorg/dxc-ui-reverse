import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input, OnChanges,
  OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';
import {Message} from "../../../cmp/Error";
import {SearchController} from "../ctrl/SearchController";
import {SearchService} from "../ctrl/search.service";
import {SEARCH_ICONS} from "../icons";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {StageComponent} from "../../stage/stage.component";
import {CODE_ICONS} from "../../code/icons";
import {SubnavbarInputComponent} from "../../../base/subnavbar/subnavbar.component";
import {TOPO_ICONS} from "../../topology/icons";
import {TagService} from "../../tag/ctrl/tag.service";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {ProjectService} from "../../project/ctrl/project.service";
import {Nullable} from "../../../base/Nullable";
import ModelMethod from "../../../models/ModelMethod";


const INITIAL_MSG = "Type something to search ... Visit documentation to see more.";

const BINDING = {
  'c':{type:'class',id:'name'},
  'm':{type:'method',id:'__signature__'},
  'f':{type:'field',id:'__signature__'},
  'p':{type:'package',id:'name'}
};

/**
 * Represents the search modal
 *
 * @class
 */
// @ts-ignore
@Component({
  selector: 'dxc-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss','../../../modal.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultListComponent implements OnInit {

  @Input() mainController:Nullable<StageComponent>;
  @Input() controller:SearchController;
  @Input() results:any[] = [];
  @Input() size:number = -1;
  @Input() hFull = false;

  error:Nullable<Message> = null;

  @ViewChild('msgBox', {read:ElementRef, static:false}) msgEl:ElementRef;
  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;
  @ViewChild(SubnavbarInputComponent) searchInput:SubnavbarInputComponent;

  NODE_TYPES:any = NodeInternalType;

  TAGS:any = {};

  message:Nullable<Message> = null;
  item: any = null;
  msg:string = INITIAL_MSG;

  icons:any = SEARCH_ICONS;
  gIcons:any = GLOBAL_ICONS;
  cIcons:any = CODE_ICONS;
  tIcons:any = TOPO_ICONS;

  /**
   * Offwet of the selected result into the result set
   * @type {number}
   * @field
   * @since 1.0.0
   */
  selectedResult = -1;
  searching = false;
  height:string = "220px";

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private searchSvc:SearchService,
              private tagSvc:TagService,
              private projectSvc:ProjectService,
              private codeService: CodeControllerService) {

  }

  ngOnInit(): void {

    this.height = this.hFull ? '100%' : '220px';

    this.projectSvc.onProjectReady.subscribe(()=>{
      this.TAGS = {
        INTERNAL: this.tagSvc.getTagByName("discover.internal"),
        STATIC: this.tagSvc.getTagByName("discover.static"),
        DYNAMIC: this.tagSvc.getTagByName("discover.dynamic"),
        VENDOR: this.tagSvc.getTagByName("discover.vendor"),
      }
    });

    if((this.mainController==null) && (this.controller.app!=null)){
      this.mainController = this.controller.app;
    }else if((this.mainController!=null) && (this.controller==null)){
          this.controller = this.mainController.getController('ctrl:search');
      }
  }


  reset(){
    this.results = [];
  }

  selectResult(pResItem: any, pOffset:number) {
    this.selectedResult = pOffset;
  }

  /**
   *
   * @param pEvent
   * @param pResultItem
   */
  displayCtxMenu(pEvent:any, pResultItem:any):void{
    let type:string;

    switch(pResultItem.__){
      case NodeInternalType.CLASS:
        type = 'clazz';
        break;
      case NodeInternalType.PACKAGE:
        type = 'pkg';
        break;
      case NodeInternalType.METHOD:
        type = 'meth';
        break;
      case NodeInternalType.FIELD:
        type = 'fld';
        break;
      default:
        return;
        break;
    }

    this.codeService.displayContextMenu(pEvent, type, pResultItem);
  }

  openLazyView(pSubject:string, pPurpose:string):void {
    switch (pPurpose){
      case 'setter':
      case 'getter':
      case 'invoke':
        this.codeService.getModelMethod(pSubject).subscribe((vMethod:Nullable<ModelMethod>)=>{
          console.log(vMethod);
          if(vMethod!=null){
            this.openView(vMethod);
          }
        });
        break;
    }
  }



  openView(e: any, opts:number = 0) {

    if(this.mainController==null) return;

    switch (e.__) {
      case NodeInternalType.PACKAGE:
      case NodeInternalType.CLASS:
      case NodeInternalType.METHOD:
      case NodeInternalType.FIELD:
        this.mainController.getController('ctrl:code-main').open(e, 'mdl');
        break;

      case NodeInternalType.ANDROID_SERVICE:
      case NodeInternalType.ANDROID_ACTIVITY:
      case NodeInternalType.ANDROID_PROVIDER:
      case NodeInternalType.ANDROID_RECEIVER:
        this.mainController.getController('ctrl:topo').open(e, 'mdl');
        break;

      case NodeInternalType.FILE:
        this.mainController.getController('ctrl:file').open(e, 'mdl');
        break;

      case NodeInternalType.STRING:
        this.mainController.getController('ctrl:code-main').open(e, 'mdl', e.instr);
        break;

      case NodeInternalType.FUNC:
        this.mainController.getController('ctrl:native-main').open(e, 'mdl');
        break;
      default:
        break;
    }
    /*
    if(e._t!== 'x'){
      this.mainController.getController('ctrl:code-main').open(e, 'mdl');
    }else if(opts == 0){
      this.mainController.getController('ctrl:code-main').open(e.caller, 'mdl');
    }else{
      this.mainController.getController('ctrl:code-main').open(e.callee, 'mdl');
    }*/

  }

  open($event: MouseEvent, e: any) {
    if(this.mainController==null) return;

    switch(e._t){
      case 'c':
      case 'f':
      case 'm':
        this.mainController.getController('ctrl:code-main').open(e, 'mdl');
        break;
      case 's':
        this.codeService.getMethod(e.instr.method, true).subscribe( pData => {
          pData._t = 'm';
          if(this.mainController==null) return;

          this.mainController.getController('ctrl:code-main').open(pData, 'mdl');
        });
        break;
      case 'taa':
      case 'tas':
      case 'tar':
      case 'tap':
        this.mainController.getController('ctrl:topo').open(e, 'mdl');
        break;
    }
  }

    protected readonly Number = Number;
}
