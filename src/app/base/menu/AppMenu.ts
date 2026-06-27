/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

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