import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {ElectronService} from "../../services";
import {Menu, MenuItem} from "electron";

let ElectronMenu:any = null;

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

  menu:Menu = null;
  beforeRender:Subject<any> = new Subject<any>();
  afterRender:Subject<any> = new Subject<any>();

  rendered = false;
  menuStatus:any = {};

  constructor( private electronSvc:ElectronService) {

    ElectronMenu = this.electronSvc.remote.Menu;
  }


  /**
   * Callback function, called to complete/change states of menus
   * when a project is opened successfully
   *
   * @method
   */
  onProjectOpen():void {

    for(const id in this.menuStatus){

      this.tpl.map( menu => {
        if(menu.id===id)
          menu.enabled = true;
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
    /*
    for(let id in this.menuStatus){
      console.log(ElectronMenu.getApplicationMenu());
      ElectronMenu.getApplicationMenu().getMenuItemById(id).enabled = this.menuStatus[id];
    }*/
  }


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

    this.menu = ElectronMenu.buildFromTemplate( this.tpl);
    ElectronMenu.setApplicationMenu(this.menu);
    this.rendered = true;
    //this.afterRender.next(this.tpl);
  }

  /**
   * To get the menu
   * @method
   */
  getMenu():Menu{
    return this.menu;
  }

  /**
   * To get a submenu by its id
   *
   * @param {string} pId submenu id
   */
  getSubMenu( pId:string):MenuItem {
    return this.menu.getMenuItemById(pId);
  }

}
