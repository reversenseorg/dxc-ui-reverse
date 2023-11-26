import {ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Message} from "../../../cmp/Error";
import {FormControl} from "@angular/forms";
import {SearchController} from "../ctrl/SearchController";
import {SearchService} from "../ctrl/search.service";
import {SEARCH_ICONS} from "../icons";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {StageComponent} from "../../stage/stage.component";
import {IconModel} from "../../../base/icon/IconModel";
import {CODE_ICONS} from "../../code/icons";
import {
  RequestHelper, RequestHelperTYPES,
  RequestNode,
  SearchNode,
  SearchNodeList,
  SearchScope,
  SearchScopeList
} from "../ctrl/RequestGenerator";
import {SubnavbarInputComponent} from "../../../base/subnavbar/subnavbar.component";
import {Subject} from "rxjs";
import {TOPO_ICONS} from "../../topology/icons";
import {map} from "rxjs/operators";
import {TagService} from "../../tag/ctrl/tag.service";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {Tag} from "../../../models/tags/Tag";
import {ProjectService} from "../../project/ctrl/project.service";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";


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
  selector: 'dxc-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.scss','../../../modal.scss']
})
export class ModalSearchComponent implements OnInit {

  @Input() mainController:StageComponent;
  @Input() controller:SearchController;

  aliasControl = new FormControl('');
  error:Nullable<Message> = null;

  @ViewChild('msgBox', {read:ElementRef, static:false}) msgEl:ElementRef;
  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;
  @ViewChild(SubnavbarInputComponent) searchInput:SubnavbarInputComponent;

  NODE_TYPES:any = NodeInternalType;

  TAGS:any = null;

  message:Nullable<Message> = null;
  item: any = null;
  msg:string = INITIAL_MSG;

  icons:any = SEARCH_ICONS;
  gIcons:any = GLOBAL_ICONS;
  cIcons:any = CODE_ICONS;
  tIcons:any = TOPO_ICONS;

  //FILTERS:SearchNodeList;
  FILTER_SCOPES:SearchScopeList;

  _trail:any = {
    _styles: {
      bgColor: '#1fa2f1'
    }
  };

  options:SearchNode[] = [];
  selectedNode:Nullable<SearchNode>;
  selectedScope:SearchScope;



  activeNode:Nullable<RequestNode> = null;

  /**
   * The list of picked nodes
   */
  pickedFilters: RequestNode[] = [];

  /**
   * Search request history
   * @type {string[]}
   * @field
   * @since 1.0.0
   */
  history:string[] = [];

  /**
   * Instance of the request helper building the query
   * @type {RequestHelper}
   * @field
   * @since 1.0.0
   */
  helper: RequestHelper;

  /**
   * A stream of event trigged when node's menu from request builder are closed.
   *
   * @type {number}
   * @field
   * @since 1.0.0
   */
  closeMenu: Subject<boolean>;

  results:any[] = [];

  /**
   * Offwet of the selected result into the result set
   * @type {number}
   * @field
   * @since 1.0.0
   */
  selectedResult: number = -1;
  searching: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private searchSvc:SearchService,
              private tagSvc:TagService,
              private projectSvc:ProjectService,
              private codeService: CodeControllerService) {

    this.closeMenu = new Subject<boolean>();

    this.helper = new RequestHelper(this.searchSvc, this.tagSvc);

    this.FILTER_SCOPES = this.helper.getBuiltinScopes();

    this.activeNode = this.helper.getCurrentNode();
    this.pickedFilters = [];
    this.selectedScope = this.helper.getDefaultScope();
    console.log(this);
  }

  ngOnInit(): void {
    this.codeService.onMenuClick.subscribe( (pEvent:any)=>{
      console.log(pEvent, this.modal);
      if(pEvent.item=="search"){
        this.modal.show();
      }
    });

    this.projectSvc.onProjectReady.subscribe(()=>{
      this.TAGS = {
        INTERNAL: this.tagSvc.getTagByName("discover.internal"),
        STATIC: this.tagSvc.getTagByName("discover.static"),
        DYNAMIC: this.tagSvc.getTagByName("discover.dynamic"),
        VENDOR: this.tagSvc.getTagByName("discover.vendor"),
      }
    });

    if(this.mainController==null){
      if(this.controller.app==null){
        throw  UIException.APP_NOT_INITIALIZED();
      }
      this.mainController = this.controller.app;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(){
    if(this.modal.isDisplayed()){
      this.close();
    }
  }


  close(){

    this.closeMenu.next(true);
    this.modal.hide('close');
  }

  /**
   *
   */
  resetError(pEvent:any):void{
    // if differs from enter (avoid conflict with submit on enter)
    if(pEvent.keyCode != 13){
      this.error = null;
    }
  }

  /**
   * To initialize alias input when the modal is loaded
   *
   * TODO : param should be {ModelPackage|ModelClass|ModelField|ModelMethod} instead of event
   *
   * @param {any} pSubject
   * @method
   */
  onOpen(pSubject:any):void {

  }


  reset(){
    this.closeMenu.next(true);
    this.helper.reset();
    this.results = [];

    this.selectedNode = null;
  }

  markRequest() {
    // add request parameters to bookmark
  }


  applyScope(pScopeName: string, pEvent:any) {
    console.log("Apply scope : ",pScopeName, pEvent);
    this.selectedScope = this.FILTER_SCOPES[pScopeName];

    this.helper.applyScope(pScopeName);
    //this.helper.filterByScope( this.results, pScopeName);
  }

  /**
   * To select the next node and update UI when the user click on a
   * node
   *
   * @param {SearchNode} pNode Node from UI
   * @param {number} pOffset Offset of changed node into node path. Node with upper offset should change
   * @param {any} Optional Mouse event
   * @method
   */
  selectNode(pNode: SearchNode, pOffset:number,pItem:any = null):void {
    const next:Nullable<RequestNode> = this.helper.selectNode(pOffset);

    this.pickedFilters = this.helper.getActiveFilters();
    if(next != null) {
      // selected node is not a leaf node
      this.activeNode = next;
    }else{
      // selected node is a leaf
      const currNode =  this.helper.getCurrentNode();

      if(currNode==null){
        throw UIException.SOMETHING_IS_WRONG_WITH_REQUEST("Current node is null");
      }

      console.log( currNode, currNode.opts[currNode.selected]._t, RequestHelperTYPES.T_TAG);
      this.closeMenu.next(true);
      if(currNode.opts[currNode.selected]._t != RequestHelperTYPES.T_TAG){
        this.searchInput.focus();
      }else{
        //this.searchInput.value = currNode.opts[currNode.selected]._f;
        this.doSearch(currNode.opts[currNode.selected]._f,'in');
      }
    }

  }

  changePickedFilter(pNode: SearchNode, pStackOffset:number = -1, pOffset:number = -1) {

    console.log("changePickedFilter: ",pNode, pStackOffset, pOffset)
    let next:Nullable<RequestNode> = this.helper.changePickedFilter(pNode, pStackOffset, pOffset);

    console.log("changePickedFilter (next): ",next)


    this.pickedFilters = this.helper.getActiveFilters();
    if(next != null) {
      this.activeNode = next;
      if(next.opts == null){
        next.opts = [];
      }
    }else{
      //this.activeNode = null;

      //this.activeNode = this.helper.getCurrentNode();
    }

    this.closeMenu.next(true);
  }

  search():any {

  }

  /**
   * to perform search
   * @param pEvent
   */
  doSearch(pEvent: any, pSrc:string) {
    let req:string;

    this.msg = "Searching ...";
    if(pSrc=='in'){
      // when the search is trigged by 'enter' key down into search input
      req = pEvent;
    }else{
      // when the search is trigged by a button or an other key event
      req = this.searchInput.value;
    }

    //this.history.push(req);
    this.helper.execute(req).subscribe( (pObs:any) => {
      this.msg = "Executed : ";
      if(pObs.data != null){
        this.msg += pObs.data.length+" results (50 per pages)";
        if(pObs.data.length>50){
          this.results = pObs.data.slice(0,50);
        }else
          this.results = pObs.data;

        console.log(this.results);
      }else{
        this.msg += "No results";
      }
    });
  }

  doBackgroundSearch(pRequest: string, pResultType:string):void {
    let req:string;
    this.searching = true;
    console.log("Doing search in background");
    this.searchSvc.executeRaw(pRequest,pResultType).pipe(map( (pObs:any) => {

      this.msg = "Executed : ";
      if(pObs.data != null){

        pObs.data.map( (vRes:any) => {
          vRes._t = pResultType;
        });

        this.msg += pObs.data.length+" results";

        console.log(pObs.data);
        this.results = pObs.data;
      }else{
        this.msg += "No results";
      }

    })).subscribe( pResults => {
      console.log(pResults);
    })
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

  openView(e: any, opts:number = 0) {
    switch (e.__) {
      case NodeInternalType.PACKAGE:
      case NodeInternalType.CLASS:
      case NodeInternalType.METHOD:
      case NodeInternalType.FIELD:
        this.mainController.getController('ctrl:code-main').open(e, 'mdl');
        this.close();
        break;

      case NodeInternalType.ANDROID_SERVICE:
      case NodeInternalType.ANDROID_ACTIVITY:
      case NodeInternalType.ANDROID_PROVIDER:
      case NodeInternalType.ANDROID_RECEIVER:
        this.mainController.getController('ctrl:topo').open(e, 'mdl');
        this.close();
        break;

      case NodeInternalType.FILE:
        this.mainController.getController('ctrl:file').open(e, 'mdl');
        this.close();
        break;

      case NodeInternalType.STRING:
        if(e.instr != null){
          this.mainController.getController('ctrl:code-main').open({ __:NodeInternalType.METHOD, __signature__:e.instr.method}, 'mdl', e.instr);
        }
        break;

      case NodeInternalType.FUNC:
        this.mainController.getController('ctrl:native-main').open(e, 'mdl');
        this.close();
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

  spawn(pRawRequest:string, pResultType:string):void {
    this.modal.show();
    this.searchInput.value = pRawRequest;
    this.doBackgroundSearch( pRawRequest, pResultType);
  }

  open($event: MouseEvent, e: any) {
    switch(e._t){
      case 'c':
      case 'f':
      case 'm':
        this.mainController.getController('ctrl:code-main').open(e, 'mdl');
        this.close();
        break;
      case 's':
        this.codeService.getMethod(e.instr.method, true).subscribe( pData => {
          pData._t = 'm';
          this.mainController.getController('ctrl:code-main').open(pData, 'mdl');
          this.close();
        });
        break;
      case 'taa':
      case 'tas':
      case 'tar':
      case 'tap':
        this.mainController.getController('ctrl:topo').open(e, 'mdl');
        this.close();
        break;
    }
  }

  /**
   * To open search result inside a tab panel in terminal area
   */
  openInTab() {

  }
}
