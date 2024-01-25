import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ExplorerView} from "../../../cmp/ExplorerView";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import {SubExplorerComponent} from "../../../base/explorer/subexplorer.component";
import {ExplorerTab} from "../../../cmp/ExplorerTab";
import {empty, from, Observable, Subject} from "rxjs";
import {ExpandableProvider} from "../../../base/expandable-list/expandable-provider";
import {
  ContextMenuComponent,
  ContextMenuList,
  ContextMenuState
} from "../../../base/context-menu/context-menu.component";
import {ProjectService} from "../../project/ctrl/project.service";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {IKeyboardNavigable} from "../../../base/keyboard/IKeyboardNavigable";
import {TopologyController} from "../ctrl/TopologyController";
import {TopologyService} from "../ctrl/topology.service";
import AndroidActivity from "../../../models/android/AndroidActivity";
import {TOPO_ICONS} from "../icons";
import {AndroidPermission} from "../../../models/android/Permissions";
import {NodeType} from "../../search/ctrl/ModelNode";
import AndroidProvider from "../../../models/android/AndroidProvider";
import AndroidService from "../../../models/android/AndroidService";
import AndroidReceiver from "../../../models/android/AndroidReceiver";
import {AndroidManifest} from "../../../models/android/AndroidManifest";
import AndroidComponent from "../../../models/android/AndroidComponent";
import {IntentFilter} from "../../../models/android/IntentFilter";
import {IntentDataCriteria} from "../../../models/android/Intent";
import {ModalSendIntentComponent} from "../modal-intent/modal-send-intent.component";
import ModelFile from "../../../models/ModelFile";
import {AbstractKeyboardNavigable, nextCUID} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {ExpandableItemComponent} from "../../../base/expandable-list/expandable-item.component";
import {Device} from "../../../models/Device";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {UIException} from "../../../base/error/UIException";




/**
 * This class controls events and content of 'code' tab into explorer area
 * (left vertical panel)
 *
 * @class
 * @since 1.0.0
 * @author Georges-Bastien MICHEL
 */
@Component({
  selector: 'dxc-explorer-topo',
  templateUrl: './explorer-topo.component.html',
  styleUrls: ['./explorer-topo.component.scss'],
  providers: [NgbTooltipConfig]
})
export class ExplorerTopoComponent extends SubExplorerComponent<TopologyController>
    implements OnInit, AfterViewInit, ExpandableProvider, IKeyboardNavigable {

  readonly SUBVIEW:any =  {
    ALL: 0,
    ACT: 1,
    PROV: 2,
    SRV: 3,
    RECV: 4,
    PERM: 5,
    DATA: 6,
    KS: 7,
    DEX: 8,
    LIB: 9
  };

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
   * @type {CodeController}
   * @field
   */
  @Input() override controller!: TopologyController;

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

  override id = "explorerTopo";

  ctxMenu: ContextMenuList = {};

  selected:number = this.SUBVIEW.ALL;
  activeItem: any = null;





  //ctxMenuState:Nullable<ContextMenuState> = null;
  ctxMenuState:ContextMenuState = {
    subject: null
  };

  data:any = {};
  // packages:CodeItem[][] = [];

  projectReady:boolean = false;

  filtered: any = null;

  constructor( private projectService:ProjectService,
               private topoSvc: TopologyService,
               ngbTooltipConfig:NgbTooltipConfig) {
    super();

    ngbTooltipConfig.tooltipClass = "dxc-tooltip";
    this._cuid = nextCUID();

    this.offset = 4;


    this.tab = new ExplorerTab({
      offset: 0,
      label: 'Application',
      icon: GLOBAL_ICONS['GLOBE'],
      color: 'dxc-icon-window'
    });

    this.view = new ExplorerView({
      id: this.id,
      nav: new NavbarSimpleView({
        selected: this.selected,
        menu: new MenuView({
          items: [
            new MenuItem<any>({
              id:this.SUBVIEW.ALL,
              label:'All',
              color: 'dxc-text-clear75',
              icon: GLOBAL_ICONS['WINDOW']
            }),
            new MenuItem<any>({
              id:this.SUBVIEW.ACT,
              label:'Activities',
              color: 'dxc-text-clear75',
              icon: TOPO_ICONS['ACTIVITY']
            }),
            new MenuItem<any>({
              id:this.SUBVIEW.PROV,
              label:'Providers',
              color: 'dxc-text-clear75',
              icon: TOPO_ICONS['PROVIDER']
            }),
            new MenuItem<any>({
              id:this.SUBVIEW.SRV,
              label:'Services',
              color: 'dxc-text-clear75',
              icon: TOPO_ICONS['SERVICE']
            }),
            new MenuItem<any>({
              id:this.SUBVIEW.RECV,
              label:'Receiver',
              color: 'dxc-text-clear75',
              icon: TOPO_ICONS['RECEIVER']
            }),
            new MenuItem<any>({
              id:this.SUBVIEW.PERM,
              label:'Permissions',
              color: 'dxc-text-clear75',
              icon: TOPO_ICONS['PERM']
            }),
            new MenuItem<any>({
              id:this.SUBVIEW.DATA,
              label:'Data',
              color: 'dxc-text-clear75',
              icon: TOPO_ICONS['DB']
            }),
            new MenuItem<any>({
              id:this.SUBVIEW.KS,
              label:'Key Store',
              color: 'dxc-text-clear75',
              icon: TOPO_ICONS['KS']
            }),
            new MenuItem<any>({
              id:this.SUBVIEW.DEX,
              label:'Dex files',
              color: 'dxc-text-clear75',
              icon: TOPO_ICONS['DEX']
            }),
            new MenuItem<any>({
              id:this.SUBVIEW.LIB,
              label:'Libraries',
              color: 'dxc-text-clear75',
              icon: TOPO_ICONS['LIBS']
            })
          ]
        })
      })
    });


    this.data[this.SUBVIEW.ACT] = { _t: 'f', _s:0, children: [], name: 'Activities', _c: NodeInternalType.ANDROID_ACTIVITY, _icon: TOPO_ICONS['ACTIVITIES'] };
    this.data[this.SUBVIEW.PROV] = { _t: 'f', _s:0, children: [], name: 'Providers', _c: NodeInternalType.ANDROID_PROVIDER, _icon: TOPO_ICONS['PROVIDER'] };
    this.data[this.SUBVIEW.RECV] = { _t: 'f', _s:0, children: [], name: 'Receivers', _c: NodeInternalType.ANDROID_RECEIVER, _icon: TOPO_ICONS['RECEIVER'] };
    this.data[this.SUBVIEW.SRV] = { _t: 'f', _s:0, children: [], name: 'Services', _c: NodeInternalType.ANDROID_SERVICE, _icon: TOPO_ICONS['SERVICE'] };
    this.data[this.SUBVIEW.KS] = { _t: 'f', _s:0, children: [], name: 'Key Store', id:"ks", _c: NodeInternalType.FILE, _icon: TOPO_ICONS['KS'] };
    //this.data[this.SUBVIEW.DATA] = { _t: 'f', _s:0, children: [], name: 'Data', _icon: TOPO_ICONS['DB'] };
    this.data[this.SUBVIEW.DEX] = { _t: 'f', _s:0, children: [], name: 'Dex', id:"dex", _c: NodeInternalType.FILE, _icon: TOPO_ICONS['DEX'] };
    this.data[this.SUBVIEW.PERM] = { _t: 'f', _s:0, children: [], name: 'Permissions', _c: NodeInternalType.ANDROID_PERM, _icon: TOPO_ICONS['PERM'] };
    this.data[this.SUBVIEW.LIB] = { _t: 'f', _s:0, children: [], name: 'Libraries', id:"libs", _c: NodeInternalType.FILE, _icon: TOPO_ICONS['LIBS'] };
    //this.data[this.SUBVIEW.TA] = { _t: 'f', children: [], name: 'Trusted Apps', _icon: GLOBAL_ICONS['FOLDER'] };
    this.filtered = this.data;
  }

  ngOnInit(): void {
    this.onKeyboardEvent.subscribe(this._handleKeyEvent);

    //const self = this;
    this.topoSvc.onMenuClick$
      .subscribe((pEvent) =>{
        switch (pEvent.item) {
          // on 'list device' show Device explorer panel
          case NodeInternalType.ANDROID_SERVICE:
          case NodeInternalType.ANDROID_PROVIDER:
          case NodeInternalType.ANDROID_RECEIVER:
          case NodeInternalType.ANDROID_ACTIVITY:
            this.parent.selectTab(this.offset);
            this.expandItem(pEvent.item);
            break;
          case NodeInternalType.FILE:
            let itm:Nullable<ExpandableItemComponent<any>> = null;
            switch (pEvent.type){
              case 'ks':
                this.parent.selectTab(this.offset);
                itm = this._getItem( "name", "Key Store");
                break;
              case 'libs':
                this.parent.selectTab(this.offset);
                this.expandItem(pEvent.item);
                itm = this._getItem( "name", "Libraries");
                break
              case 'dex':
                this.parent.selectTab(this.offset);
                this.expandItem(pEvent.item);
                itm = this._getItem( "name", "Dex");
                break;
              case 'manifest':
                // todo
                break;
              default:
                return;
            }

            if(itm != null){
              itm.doExpand( null, itm.item, itm.itemRef);
            }
            break;
        }
      });
    //this.refresh();

    this.projectService.onProjectClose.subscribe( pStatus => {
      this.projectReady = false;
    });
    /*
    this.topoSvc.onMenuClick$.subscribe( pItemType => {
      this.topoSvc
        .getManifest()
        .subscribe((pActs:AndroidManifest) => {

          pActs.map((vChild:any) => {           vChild._t = NodeType.ACTIVITY;
            vChild._icon = this.icons['ACTIVITY'];
            // TODO : add intent filter as children
          });

          this.data[this.SUBVIEW.ACT].children = pActs;
          this.data[this.SUBVIEW.ACT]._s = pActs.length;
          console.log(this.data);
          this.parent.selectTab( this.offset);
        });
    });*/

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

   private _getItem( pName:string, pValue:any, pNested = false): Nullable<ExpandableItemComponent<any>> {
     let ret:Nullable<ExpandableItemComponent<any>> = null;

     const items = this.expandableItems.toArray();

     for(let i=0; i<items.length; i++){
       if(!pNested){
         console.log(this.expandableItems);
         if((items[i] as IStringIndex<any>)[pName] === pValue){
           ret = items[i];
           break;
         }
       }else{
         /*

         itm.doExpand(null, itm.item, itm.itemRef);
         for(let i=0; i<itm.children.length; i++){
           if(itm.children[i].instance.itemType === pType){
             ret = itm.children[i].instance;
             break;
           }
         }
          */
       }
     }

     return ret;
   }

  getCUID(): number {
    return this._cuid;
  }



  onKeyPress(pEvent: any) {

  }

  refresh():void {
    this.topoSvc
      .getActivities()
      .subscribe((pActs:AndroidActivity[]) => {

        if(pActs!=null){
          pActs.map((vChild:any) => {         vChild.__ = NodeInternalType.ANDROID_ACTIVITY;
            vChild._icon = this.icons['ACTIVITY'];
            // TODO : add intent filter as children
          });
        }else{
          pActs = [];
        }


        this.data[this.SUBVIEW.ACT].children = pActs;
        this.data[this.SUBVIEW.ACT]._s = pActs.length;
        //console.log(this.data);
        //this.parent.selectTab( this.offset);
      });

    this.topoSvc
      .getProviders()
      .subscribe((pActs:AndroidProvider[]) => {

        if(pActs!=null){
          pActs.map((vChild:any) => {
            vChild.__ = NodeInternalType.ANDROID_PROVIDER;
            vChild._icon = this.icons['PROVIDER'];
            // TODO : add intent filter as children
          });
        }else{
          pActs = [];
        }


        this.data[this.SUBVIEW.PROV].children = pActs;
        this.data[this.SUBVIEW.PROV]._s = pActs.length;
        //console.log(this.data);
        //this.parent.selectTab( this.offset);
      });


    this.topoSvc
      .getServices()
      .subscribe((pActs:AndroidService[]) => {

        if(pActs!=null){
          pActs.map((vChild:any) => {
            vChild.__ = NodeInternalType.ANDROID_SERVICE;
            vChild._icon = this.icons['SERVICE'];
            // TODO : add intent filter as children
          });
        }else{
          pActs = [];
        }

        this.data[this.SUBVIEW.SRV].children = pActs;
        this.data[this.SUBVIEW.SRV]._s = pActs.length;
        //console.log(this.data);
        //this.parent.selectTab( this.offset);
      });


    this.topoSvc
      .getReceivers()
      .subscribe((pActs:AndroidReceiver[]) => {

        if(pActs!=null){
          pActs.map((vChild:any) => {
            vChild.__ = NodeInternalType.ANDROID_RECEIVER;
            //vChild._icon = this.icons['SERVICE'];
            // TODO : add intent filter as children
          });
        }else{
          pActs = [];
        }


        this.data[this.SUBVIEW.RECV].children = pActs;
        this.data[this.SUBVIEW.RECV]._s = pActs.length;
        //console.log(this.data);
        // this.parent.selectTab( this.offset);
      });

    this.topoSvc
      .getPermissions()
      .subscribe((pActs:any[]) => {


        if(pActs!=null){
          pActs.map((vChild:any) => {
            vChild.__ = NodeInternalType.ANDROID_PERM;
            vChild._icon = this.icons['PERM'];
          });
        }else{
          pActs = [];
        }

        this.data[this.SUBVIEW.PERM].children = pActs;
        this.data[this.SUBVIEW.PERM]._s = pActs.length;
        //this.parent.selectTab( this.offset);
      });

    this.topoSvc
      .getFiles('dex')
      .subscribe((pFiles:ModelFile[]) => {

        if(pFiles!=null){
          pFiles.map((vFile:any) => {
            vFile._t = NodeInternalType.FILE;
            vFile._icon = this.data[this.SUBVIEW.DEX]._icon;
          });
        }else{
          pFiles = [];
        }


        this.data[this.SUBVIEW.DEX].children = pFiles;
        this.data[this.SUBVIEW.DEX]._s = pFiles.length;
        //this.parent.selectTab( this.offset);
      });

    this.topoSvc
      .getFiles('libs')
      .subscribe((pFiles:ModelFile[]) => {

        console.log("LIBS FILES : ",pFiles);
        pFiles.map( (vFile:any) => {
          vFile._t = NodeInternalType.FILE;
          vFile._icon = this.data[this.SUBVIEW.LIB]._icon;
        });

        this.data[this.SUBVIEW.LIB].children = pFiles;
        this.data[this.SUBVIEW.LIB]._s = pFiles.length;
      });

    this.topoSvc
      .getFiles('ks')
      .subscribe((pFiles:ModelFile[]) => {

        pFiles.map( (vFile:any) => {
          vFile._t = NodeInternalType.FILE;
          vFile._icon = this.data[this.SUBVIEW.KS]._icon;
        });

        this.data[this.SUBVIEW.KS].children = pFiles;
        this.data[this.SUBVIEW.KS]._s = pFiles.length;
      });
  }

  private _handleKeyEvent( pEvent:any):void {

  }


  ngAfterViewInit() {

    // subscribe to resize events
    this.resize$.subscribe( (pEvent:any)=>{
      this.drawExplorer(pEvent);
    });


    // init contextual menus
    this.ctxMenu = {};
    this.ctxMenuChildren.toArray().map((vMenu:any) => {     this.ctxMenu[vMenu.name] = vMenu;
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

  isExpandable( pItem:any): boolean {
    //console.log("isExpandable : ",pItem);
    return (pItem.children != null); // && (pItem.children.length>0);
  }

  expand( pItem:any, pType:string): Observable<any[]> {
      return from([pItem.children]);
  }

    /*
    console.log('Expand : ',pItem);
    switch(pType){
      case 'p':
        data = this.controller.service
          .listPackages( this.selected, '^'+pItem.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+'$')
          .pipe(
            map( (pObs:any)=>{
              //pObs.data._icon = this.icons['CLASS'];

              pObs.data[0].children.map((vSelf:any) => {               if(vSelf._t=='c'){
                  vSelf._icon = this.icons['CLASS'];
                }else{
                  vSelf._icon = this.icons['PKG'];
                }
                //expandable
                vSelf._e = true;
              });
              return pObs.data[0].children;
            })
          )
        break;
      case 'c':
        data = this.controller.service
          .getClass( pItem.name.replace(/"/g, '\\$&'))
          .pipe(
            map( (pObs:any)=>{
              let children:any=[];

              if(pObs.hasOwnProperty('data')==false || pObs.data==null) return;

              pObs.data._icon = this.icons['CLASS'];
              pObs.data.fields.map( (vField)=>{
                vField['_t'] = 'f';
                vField['mod'] = ModifierFormat.toJsonObject(vField.modifiers);
                vField._icon = this.icons['FIELD'];
                //expandable
                vField._e = false;
                children.push(vField);
              });

              pObs.data.methods.map( (vMeth)=>{
                vMeth['_t'] = 'm';
                vMeth['mod'] = ModifierFormat.toJsonObject(vMeth.modifiers);

                if(vMeth.mod.construct){
                  if(vMeth.mod.static) {
                    vMeth.mod._t = 'clinit';
                    vMeth._icon = this.icons['STATICB'];
                  }else {
                    vMeth.mod._t = 'new';
                    vMeth._icon = this.icons['NEW'];
                  }
                }else if(vMeth.mod.static){
                  vMeth._icon = this.icons['STATIC'];
                }else if(vMeth.mod.native){
                  vMeth._icon = this.icons['NATIVE'];
                }else{
                  vMeth._icon = this.icons['METH'];
                }

                vMeth._e = false;
                children.push(vMeth);
              });

              //console.log('exploring class children>',children);
              return children;
            })
          )
        break;
      default:
        data = empty();
        break;
    }

    return data;
  }*/

  open( pItem:any): any {
    this.controller.open( pItem, 'expl');
    return null;
  }

  sortPkg( pOtions:string):any {
    return null;
  }

  filterPkg( pOtions:string): Nullable<any[]>{
    return null ;
  }

  itemHasChildren( pItem:any, pType='p'): boolean {
    console.log("TOPO > itemHasChildren > ",pItem,(pItem._t=='f'||pType=='c'||pType=='p'));
    return (pItem._t=='f'||pType=='c'||pType=='p');
  }

  itemHasLazyChildren( pItem:any, pType ='p'): boolean {
    console.log("TOPO > itemHasLazyChildren > ",pItem,(pItem.children!=null && pItem.children.length==1 && pItem.children[0]._t=="wait"));
    return (pItem.children!=null && pItem.children.length==1 && pItem.children[0]._t=="wait");
  }


  itemGetChildren( pItem:any):any{
    console.log("TOPO > itemGetChildren > ",pItem.children);
    return pItem.children;
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
    let type:Nullable<string> = null;
    pEvent.preventDefault();

    this.ctxMenuState = {
      menu: this.ctxMenu[pType],
      subject: pObject
    };
    this.ctxMenu[pType].show(pEvent, pObject);
  }

  hideCtxMenu():void{

    if(this.ctxMenuState==null){
      throw UIException.CTX_MENU_NOT_READY("explorer-topo","hideCtxMenu");
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

    this.data[this.SUBVIEW.ACT] = { _t: 'f', _s:0, children: [], name: 'Activities', _icon: TOPO_ICONS['ACTIVITIES'] };
    this.data[this.SUBVIEW.PROV] = { _t: 'f', _s:0, children: [], name: 'Providers', _icon: TOPO_ICONS['PROVIDER'] };
    this.data[this.SUBVIEW.RECV] = { _t: 'f', _s:0, children: [], name: 'Receivers', _icon: TOPO_ICONS['RECEIVER'] };
    this.data[this.SUBVIEW.SRV] = { _t: 'f', _s:0, children: [], name: 'Services', _icon: TOPO_ICONS['SERVICE'] };
    this.data[this.SUBVIEW.KS] = { _t: 'f', _s:0, children: [], name: 'Key Store', _icon: TOPO_ICONS['KS'] };
    this.data[this.SUBVIEW.DATA] = { _t: 'f', _s:0, children: [], name: 'Data', _icon: TOPO_ICONS['DB'] };
    this.data[this.SUBVIEW.DEX] = { _t: 'f', _s:0, children: [], name: 'Dex', _icon: TOPO_ICONS['DEX'] };
    this.data[this.SUBVIEW.PERM] = { _t: 'f', _s:0, children: [], name: 'Permissions', _icon: TOPO_ICONS['PERM'] };
    this.data[this.SUBVIEW.LIB] = { _t: 'f', _s:0, children: [], name: 'Libraries', _icon: TOPO_ICONS['LIBS'] };
    //this.data[this.SUBVIEW.TA] = { _t: 'f', children: [], name: 'Trusted Apps', _icon: GLOBAL_ICONS['FOLDER'] };
    this.filtered = this.data;


    this.selected = this.SUBVIEW.ALL;
    this.activeItem = null;
  }

  search() {

  }

  filter() {

  }

  openClassOf( pItem:any) {
    //console.log(pItem);
    //this.controller.
  }
}
