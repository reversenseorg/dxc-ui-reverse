import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {AppMenu} from "../menu/AppMenu";
import {Accelerator, MenuItem, MenuItemConstructorOptions} from "../menu/MenuItem";
import {Nullable} from "../Nullable";
import {map} from "rxjs/operators";
import {IconModel} from "../icon/IconModel";


export interface MenuEvent {
  item:string
}

interface MenuStatus {
  [label:string] :boolean
}

export type MenuItemType = 'separator' | 'radio' ;

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

export interface AcceleratorMapping {
  [acceleratorKey:string] :AcceleratedMenu
}

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

  onTemplateUpdate$:Subject<any> = new Subject<any>();

  private _accelerators:AcceleratorMapping = {};

  private _tpl:MenuItemConstructorOptions[] = [];

  private _items:MenuItem[] = [];

  constructor() {

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
    //this.beforeRender.next(this.tpl);

    //this.menu = AppMenu.getInstance();

    this.buildFromTemplate( this.tpl);

    this.onTemplateUpdate$.next(this.tpl);

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
   * Building template will search additional information
   * inside menu item such
   * @param pTpl
   */
  buildFromTemplate( pTpl:MenuTemplate[] ):any {

    // parse template
    this._accelerators = this.searchAccelerators(pTpl);

    return this;
  }

  getMenuItemById(pItemId:string):Nullable<MenuItem> {
    return this._items.find((pItem:MenuItem)=> pItem.id===pItemId);
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

}
