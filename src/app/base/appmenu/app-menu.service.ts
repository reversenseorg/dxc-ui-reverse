import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {AppMenu} from "../menu/AppMenu";
import {Accelerator, MenuItem, MenuItemConstructorOptions} from "../menu/MenuItem";
import {Nullable} from "../Nullable";
import {map} from "rxjs/operators";
import {IconModel} from "../icon/IconModel";


export interface MenuEvent {
  item:string,
    opts?:any
}

interface MenuStatus {
  [label:string] :boolean
}

export type MenuItemType = 'separator' | 'radio' | 'checkbox' ;

export interface MenuUpdateEvent {
  tpl: MenuTemplate[],
  idMapping: Record<string, MenuItem>;
  update: boolean;
}
export interface MenuItemSeparator {
  type: MenuItemType;
  icon?:Nullable<IconModel>;
}

export interface MenuItemPreset {
  role: string;
  icon?:Nullable<IconModel>;
}

export interface MenuItemShortCutable {
  accelerator?:string
}

export interface MenuItemTemplate extends MenuItemShortCutable{
  role?:string;
  label:string;
  click?: ((vItem:MenuItem, VCtx:any)=>any);
  enabled?:boolean;

  /**
   * TRUE to put a checkbox at the begin of the item
   * @type {boolean}
   */
  checkbox?:boolean;

  /**
   * The value to return when the checkbox is checked.
   * This value is also used to verify if the box is cheked or not
   * @type {any}
   */
  value?:any;

  /**
   * The name of the input related to this checkbox
   * @type {string}
   */
  name?:string;

  /**
   * An event stream publishing value changes to any item with same `name`
   * @type {Subject<string>}
   */
  onChange$?:Subject<string>;

  onCheck?:(vVal:boolean,vItem:any)=>void;

  onSuccess$?:Subject<boolean>;

  onFailure$?:Subject<boolean>;

  checked?:boolean;
  icon?:Nullable<IconModel>;
  id?:string;
}

export type MenuTemplateEntry = MenuItemTemplate | MenuItemSeparator | MenuItemPreset | MenuTemplate;

export interface MenuTemplate extends MenuItemShortCutable{
  id:string;
  label:string;
  submenu: MenuTemplateEntry[]
  icon?:Nullable<IconModel>;
  enabled?:boolean;
  offset?:number
}

export interface AcceleratedMenu {
  menu: MenuTemplateEntry;
  click: ((vItem:MenuItem, VCtx:any)=>any);
}

export type AcceleratorMapping = Record<string, AcceleratedMenu>;

/**
 * Represent the service responsible to manage applICation menus
 *
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class AppMenuService {


  /**
   * Menu template
   */
  tpl:MenuTemplate[] = [];

  menu:AppMenu; //Menu;
  beforeRender:Subject<any> = new Subject<any>();
  afterRender:Subject<any> = new Subject<any>();

  rendered = false;
  menuStatus:any = {};

  onTemplateUpdate$:Subject<MenuUpdateEvent> = new Subject<MenuUpdateEvent>();

  private _accelerators:AcceleratorMapping = {};

  private _tpl:MenuItemConstructorOptions[] = [];

  /**
   * List of menu items indexed by unique ID
   *
   * The purpose of this map is to change the state of menu item
   *
   * @type {Record<string, MenuTemplate|MenuTemplateEntry>}
   * @private
   */
  private _items:Record<string, MenuItem> = {};

  onMenuRendered$:Subject<Record<string, MenuItem>> = new Subject<Record<string, MenuItem>>();

  constructor() {

    this.onMenuRendered$.subscribe((pIdMapping:Record<string, MenuItem>)=>{
      this._items = pIdMapping;
    })
  }


  /**
   * Callback function, called to complete/change states of menus
   * when a project is opened successfully
   * TODO : change
   * @method
   */
  onProjectOpen():void {

    for(const id in this.menuStatus){

      this.tpl.map((vOpts:MenuTemplate) => {
        if(vOpts.id===id)
          vOpts.enabled = true;
      });
    }

    this.render();
  }

  /**
   * Callback function, called to change states of menus
   * when a project is closed successfully
   *
   * @method
   */
  onProjectClose():void {

  }


  /**
   * to append a menu template to template list, before app menu rendering
   *
   * @param pTpl
   * @param pOffset
   */
  addMenu(pTpl:MenuTemplate, pOffset=-1):void{


    if(typeof pTpl.enabled==='boolean'){
      this.menuStatus[pTpl.id] = pTpl.enabled;
    }

    pTpl.offset = pOffset;

    if(pOffset>-1)
      this.tpl[pOffset] = pTpl;
    else
      this.tpl = [pTpl];
  }

  render():void{
    // build menu
    this.buildFromTemplate( this.tpl);

    // effective update of rendering
    this.onTemplateUpdate$.next({
      tpl:this.tpl,
      idMapping: this._items,
      update: false
    });

    //this.rendered = AppMenu.getInstance().render();
    //this.afterRender.next(this.tpl);
  }

  // MenuItemConstructorOptions[]

  /**
   * Scan entire menu tree to search mapping between shortcut and menu item + action
   *
   * @param {MenuTemplate[]} pTpl App menu template
   * @return {AcceleratorMapping} Shortcut mapping
   */
  searchAccelerators( pTpl:MenuTemplateEntry[], pMapping:AcceleratorMapping = {} ):AcceleratorMapping {
      const mapping:AcceleratorMapping = pMapping;
      pTpl.map(x => {
        if((x as any).accelerator!=null){
          if(mapping[(x as any).accelerator] !=null){
            console.error("App menu : duplicated accelerator : ",(x as any).accelerator);
          }
          mapping[(x as any).accelerator] = {
            menu: x,
            click: (x as any).click
          }
        }
        if((x as any).submenu!=null){
          this.searchAccelerators( (x as any).submenu, mapping);
        }
      })
      return mapping;
  }


  /**
   * Scan a menu tree to search mapping between shortcut and menu item + action
   *
   * @param {MenuTemplate[]} pTpl App menu template
   * @return {AcceleratorMapping} Shortcut mapping
   */
  searchAccelerator( pTplEntry:MenuTemplateEntry, pMapping:AcceleratorMapping = {} ):AcceleratorMapping {
    const mapping:AcceleratorMapping = pMapping;

    if((pTplEntry as any).accelerator!=null){
      if(mapping[(pTplEntry as any).accelerator] !=null){
        console.error("App menu : duplicated accelerator : ",(pTplEntry as any).accelerator);
      }
      mapping[(pTplEntry as any).accelerator] = {
        menu: pTplEntry,
        click: (pTplEntry as any).click
      }
    }

    return mapping;
  }

  /**
   * Building template will search additional information
   * inside menu item such
   * @param pTpl
   */
  buildFromTemplate( pTpl:MenuTemplate[]|MenuTemplateEntry[] ):any {

    const mapping:AcceleratorMapping = {};
    const items:Record<string, MenuItem> = {};

    // scan recursively entire menu
    pTpl.map((x:MenuTemplate|MenuTemplateEntry)=>{

      // search accelerator
      this.searchAccelerator(x, mapping);

      // search id
      if((x as any).id != null){
        items[(x as any).id] = null as any;
      }

      // recursively browse nested menu
      if((x as MenuTemplate).submenu!=null){
        const subm = (x as MenuTemplate).submenu;
        if(Array.isArray(subm) && subm.length>0){
          this.buildFromTemplate(subm);
        }
      }

    })

    // registers IDs
    this._items = items;

    // parse template
    //this._accelerators = this.searchAccelerators(pTpl);


    return this;
  }

  getMenuItemById(pItemId:string):Nullable<MenuItem> {
    //console.log("getMenuItemById > ",pItemId, this._items[pItemId])
    return this._items[pItemId];
  }


  /**
   * To get the menu
   * @method
   */
  getMenu():AppMenu{
    return AppMenu.getInstance();
  }

  /**
   * To get a submenu by its id
   *
   * @param {string} pId submenu id
   */
  getSubMenu( pId:string):Nullable<MenuItem> {
    return this.menu.getMenuItemById(pId);
  }

  /**
   * To trigger an update of rendered elements
   *
   * @method
   */
  update() {
    // effective update of rendering
    this.onTemplateUpdate$.next({
      tpl:this.tpl,
      idMapping: this._items,
      update: true
    });
  }
}
