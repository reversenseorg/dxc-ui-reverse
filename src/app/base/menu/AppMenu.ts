import {Nullable} from "../Nullable";
import {MenuItem, MenuItemConstructorOptions} from "./MenuItem";

let gInstance:Nullable<AppMenu> = null;

/**
 * @deprecated
 */
export class AppMenu {

    private tpl:MenuItemConstructorOptions[] = [];

    private items:MenuItem[] = [];

    constructor() {

    }

    static getInstance():AppMenu {
        if(gInstance==null){
            gInstance = new AppMenu();
        }
        return gInstance;
    }

    buildFromTemplate( pTpl:MenuItemConstructorOptions[]):AppMenu {
        this.tpl = pTpl;
        return this;
    }

    getMenuItemById(pItemId:string):Nullable<MenuItem> {
        return this.items.find((pItem:MenuItem)=> pItem.id===pItemId);
    }

    render():boolean {
        // TODO
        return true;
    }
}