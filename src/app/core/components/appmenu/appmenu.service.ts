import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Menu} from "../../../base/menu/Menu";
import {AppMenu} from "../../../base/menu/AppMenu";
import {Nullable} from "../../../base/Nullable";
import {MenuItem, MenuItemConstructorOptions} from "../../../base/menu/MenuItem";


export interface MenuEvent {
  item:string
}

interface MenuStatus {
  [label:string] :boolean
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
  tpl:any = [];

  menu:AppMenu; //Menu;
  beforeRender:Subject<any> = new Subject<any>();
  afterRender:Subject<any> = new Subject<any>();

  rendered = false;
  menuStatus:any = {};

  constructor() {

  }


  /**
   * Callback function, called to complete/change states of menus
   * when a project is opened successfully
   *
   * @method
   */
  onProjectOpen():void {

    for(const id in this.menuStatus){

      this.tpl.map((vOpts:MenuItemConstructorOptions) => {
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
  addMenu(pTpl:any, pOffset=-1):void{

    if(typeof pTpl.enabled==='boolean'){
      this.menuStatus[pTpl.id] = pTpl.enabled;
    }

    if(pOffset>-1)
      this.tpl[pOffset] = pTpl;
    else
      this.tpl = pTpl;
  }

  render():void{
    //this.beforeRender.next(this.tpl);

    //this.menu = AppMenu.getInstance();

    AppMenu.getInstance().buildFromTemplate( this.tpl);
    this.rendered = AppMenu.getInstance().render();
    //this.afterRender.next(this.tpl);
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
