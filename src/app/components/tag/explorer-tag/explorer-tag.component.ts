import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ExplorerView} from "../../../cmp/ExplorerView";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import {SubExplorerComponent} from "../../../base/explorer/subexplorer.component";
import {ExplorerTab} from "../../../cmp/ExplorerTab";
import { from, Observable, Subject} from "rxjs";
import {ExpandableProvider} from "../../../base/expandable-list/expandable-provider";
import {
  ContextMenuComponent,
  ContextMenuList,
  ContextMenuState
} from "../../../base/context-menu/context-menu.component";
import {ProjectService} from "../../project/ctrl/project.service";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {IKeyboardNavigable} from "../../../base/keyboard/IKeyboardNavigable";
import { nextCUID} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {ExpandableItemComponent} from "../../../base/expandable-list/expandable-item.component";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";
import {TagController} from "../ctrl/TagController";
import {TagMenuEvent, TagService} from "../ctrl/tag.service";
import TagCategory from "../../../models/tags/TagCategory";




/**
 * This class controls events and content of 'Tag' tab into explorer area
 * (left vertical panel)
 *
 * The purpose of this component is to offer GUI to TagManager.
 * Tagging system is a main component of Dexcalibur.
 *
 *
 * @class
 * @since 1.0.0
 * @author Georges-Bastien MICHEL
 */
@Component({
    selector: 'dxc-explorer-tag',
    templateUrl: './explorer-tag.component.html',
    styleUrls: ['./explorer-tag.component.scss'],
    providers: [NgbTooltipConfig]
  })
  export class ExplorerTagComponent extends SubExplorerComponent<TagController>
  implements OnInit, AfterViewInit, ExpandableProvider, IKeyboardNavigable {


  NODE_TYPES:any = NodeInternalType;

  /**
   * Context
   *
   * @type {AppComponent}
   * @field
   */
  override  app:any = null;

  /**
   * The default controller associated to this UI component
   *
   * @type {TagController}
   * @field
   */
  @Input() override controller!: TagController;

  /**
   * This field holds the parent component, here the main explorer component.
   *
   * @type {ExplorerComponent}
   * @field
   */
  @Input() override parent!:any;

  /**
   * The reference to the DOM element containing this component
   *
   * @type {ElementRef}
   * @field
   */
  @ViewChild("explRef", {read: ElementRef}) explRef!: ElementRef;

  /**
   * The reference to the DOM element containing the dynamic part (data)
   *
   * @type {ElementRef}
   * @field
   */
  @ViewChild("explCtnRef", {read: ElementRef}) explCtnRef!: ElementRef;

  /**
   * The list of contextual menu declared
   *
   * @type {QueryList<ContextMenuComponent>}
   * @field
   */
  @ViewChildren(ContextMenuComponent) ctxMenuChildren!: QueryList<ContextMenuComponent>;

  /**
   * The list pf expandable items
   */
  @ViewChildren(ExpandableItemComponent) expandableItems!: QueryList<ExpandableItemComponent<any>>;

  protected _cuid:number = -1;

  onKeyboardEvent:Subject<any> = new Subject<any>();

  override id = "explorerTag";

  override offset = 6;

  ctxMenu: ContextMenuList = {};

  activeItem: any = null;

  ctxMenuState:ContextMenuState = {
    subject: null
  };

  data:any = { _t: 'f', _s:0, children: [], name: 'Tags', _icon: GLOBAL_ICONS['HELPER'] };
  // packages:CodeItem[][] = [];

  projectReady:boolean = false;

  filtered: any = null;

  constructor( private projectService:ProjectService,
               private tagSvc: TagService,
               ngbTooltipConfig:NgbTooltipConfig) {
    super();

    ngbTooltipConfig.tooltipClass = "dxc-tooltip";
    this._cuid = nextCUID();

    this.offset = 6;


    this.tab = new ExplorerTab({
      offset: 0,
      label: 'Tags',
      icon: GLOBAL_ICONS['GLOBE'],
      color: 'dxc-icon-window'
    });

    this.view = new ExplorerView({
      id: this.id,
      nav: new NavbarSimpleView({
        label: "Tag Manager",
        selected: null
      })
    });

    this.filtered = this.data;

    this.tagSvc.onTagMenu$.subscribe((pTagEvent:TagMenuEvent)=>{
      this.controller.displayCtxMenu(pTagEvent.evt,'tag_menu',pTagEvent.tag);
    });
  }

  ngOnInit(): void {


    this.projectService.onProjectClose.subscribe( pStatus => {
      this.projectReady = false;
    });

    this.projectService.onProjectReady
        .subscribe((pProject:DexcaliburProject) => {
          this.projectReady = true;
          this.refresh();
        });

  }

  expandItem( pType:NodeInternalType){
    this.expandableItems.map((itm:ExpandableItemComponent<any>)=>{
      if(itm.item.__ === pType){
        itm.doExpand(null, itm.item, itm.itemRef);
        /*
        itm.children.map( (vItem:any) => {
          console.log(vItem);
          if(vItem.instance.item._t === pType){

            setTimeout( ()=>{
              vItem.instance.doExpand(
                null,
                vItem.instance.item,
                vItem.instance.itemRef
              );
            }, 50);
          }
        });*/
      }
    });
  }

  getCUID(): number {
    return this._cuid;
  }

  onKeyPress(pEvent: any) {

  }

  refresh():void {
    this.tagSvc
        .listCategories(true)
        .subscribe((pActs:TagCategory[]) => {

          if(pActs!=null){
            pActs.map((vChild:any) => {
              //vChild.__ = NodeInternalType.ANDROID_ACTIVITY;
              vChild._icon = this.gIcons['HELPER'];
            });
          }else{
            pActs = [];
          }

          this.data.children = pActs;
          this.data._s = pActs.length;
          this.filter();
        });
  }


  ngAfterViewInit() {

    // subscribe to resize events
    this.resize$.subscribe( (pEvent:any)=>{
      this.drawExplorer(pEvent);
    });

    // init contextual menus
    this.ctxMenuChildren.toArray().map((vMenu:any) => {
      this.ctxMenu[vMenu.name] = vMenu;
      this.controller.registerCtxMenu(vMenu.name, this);
    });
  }

  private drawExplorer(pSize:any):void {

    const el = this.explCtnRef.nativeElement; //document.getElementById('explorerCode');
    const ctn = this.explCtnRef.nativeElement; //document.getElementById('explorerCodeCtn');
    const navHeight:number = (this.view as any).nav.size.height;

    el.style.width = pSize.width+'px';
    el.style.maxWidth = pSize.width+'px';
    el.style.height = pSize.height+'px';
    el.style.maxHeight = pSize.height+'px';

    ctn.style.width = pSize.width+'px';
    ctn.style.maxWidth = pSize.width+'px';
    ctn.style.height = (pSize.height-navHeight)+'px';
    ctn.style.maxHeight = (pSize.height-navHeight)+'px';
  }

  /**
   * A function called by expandable-list component to check if an item
   * has children (and can be expanded) or not.
   *
   * @param {any} pItem Item to check
   * @return {boolean} TRUE if the item is expandable else FALSE
   * @method
   */
  isExpandable( pItem:any): boolean {
    return (pItem.__ == NodeInternalType.TAG_CATEGORY || pItem.__ == NodeInternalType.REMOTE_TAG_CATEGORY );
  }

  /**
   *
   * @param pItem
   * @param pType
   */
  expand( pItem:any, pType:string): Observable<any[]> {
    if(pItem.__==NodeInternalType.TAG_CATEGORY){
      console.log("expand > ",pItem);
      return this.tagSvc.listTagsByCategory(pItem);
    }else{
      return from([]);
    }
  }

  open( pItem:any): any {
    //this.controller.open( pItem, 'expl');
    return null;
  }

  itemHasChildren( pItem:any, pType='p'): boolean {
    return (pItem.__ == NodeInternalType.TAG_CATEGORY || pItem.__ == NodeInternalType.REMOTE_TAG_CATEGORY );
  }

  itemHasLazyChildren( pItem:any, pType ='p'): boolean {
    return false;
  }


  itemGetChildren( pItem:any):any{
    console.log("TAG > itemGetChildren > ",pItem,pItem._tags);
    return pItem._tags;
  }

  onItemFocus( pEvent:any):void{

    if(this.activeItem != null){
      this.activeItem.el.style.backgroundColor = "#444";
    }

    this.activeItem = pEvent;
    pEvent.el.style.backgroundColor = "royalblue";
  }

  onMenuItemClick( pEvent:any):void{
    console.log(pEvent);
    //this.view.nav.selectItem(pEvent.item);
    //this.selected = pEvent.item.id;
  }

  /**
   * To display contextual menu
   *
   * @method
   * @since 1.0.0
   */
  displayCtxMenu(pEvent:any, pType:string, pObject:any):void{
    pEvent.preventDefault();

    this.ctxMenuState = {
      menu: this.ctxMenu[pType],
      subject: pObject
    };
    this.ctxMenu[pType].show(pEvent, pObject);
  }

  hideCtxMenu():void{

    if(this.ctxMenuState==null){
      throw UIException.CTX_MENU_NOT_READY("explorer-tag","hideCtxMenu");
    }

    if(this.ctxMenuState.menu!=null){
      this.ctxMenuState.menu.hide(this.ctxMenuState.subject);
    }
  }

  /**
   * To reset the component between two projects
   *
   * @method
   * @since 1.0.0
   */
  reset():void {

    this.data = { _t: 'f', _s:0, children: [], name: 'Tags', _icon: GLOBAL_ICONS['HELPER'] };
    //this.data[this.SUBVIEW.TA] = { _t: 'f', children: [], name: 'Trusted Apps', _icon: GLOBAL_ICONS['FOLDER'] };
    this.filtered = this.data;

    this.activeItem = null;
  }

  search() {

  }

  filter(pOptions:Nullable<any> = null) {
    this.filtered = this.data.children;
  }


  editTag(pState:any, $event: any) {

  }
}
