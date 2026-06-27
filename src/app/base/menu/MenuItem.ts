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

import {IconModel} from "../icon/IconModel";
import {Menu} from "./Menu";
import {Nullable} from "../Nullable";


export class Accelerator extends String {

}

interface SharingItem {

    /**
     * An array of files to share.
     */
    filePaths?: string[];
    /**
     * An array of text to share.
     */
    texts?: string[];
    /**
     * An array of URLs to share.
     */
    urls?: string[];
}


export interface MenuItemConstructorOptions {
    /**
     * Will be called with `click(menuItem, browserWindow, event)` when the menu item
     * is clicked.
     */
    click?: (menuItem: MenuItem, browserWindow:any,  event: KeyboardEvent) => void;
    /**
     * Can be `undo`, `redo`, `cut`, `copy`, `paste`, `pasteAndMatchStyle`, `delete`,
     * `selectAll`, `reload`, `forceReload`, `toggleDevTools`, `resetZoom`, `zoomIn`,
     * `zoomOut`, `togglefullscreen`, `window`, `minimize`, `close`, `help`, `about`,
     * `services`, `hide`, `hideOthers`, `unhide`, `quit`, `startSpeaking`,
     * `stopSpeaking`, `zoom`, `front`, `appMenu`, `fileMenu`, `editMenu`, `viewMenu`,
     * `shareMenu`, `recentDocuments`, `toggleTabBar`, `selectNextTab`,
     * `selectPreviousTab`, `mergeAllWindows`, `clearRecentDocuments`,
     * `moveTabToNewWindow` or `windowMenu` - Define the action of the menu item, when
     * specified the `click` property will be ignored. See roles.
     */
    role?: ('undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'pasteAndMatchStyle' | 'delete' | 'selectAll' | 'reload' | 'forceReload' | 'toggleDevTools' | 'resetZoom' | 'zoomIn' | 'zoomOut' | 'togglefullscreen' | 'window' | 'minimize' | 'close' | 'help' | 'about' | 'services' | 'hide' | 'hideOthers' | 'unhide' | 'quit' | 'startSpeaking' | 'stopSpeaking' | 'zoom' | 'front' | 'appMenu' | 'fileMenu' | 'editMenu' | 'viewMenu' | 'shareMenu' | 'recentDocuments' | 'toggleTabBar' | 'selectNextTab' | 'selectPreviousTab' | 'mergeAllWindows' | 'clearRecentDocuments' | 'moveTabToNewWindow' | 'windowMenu');
    /**
     * Can be `normal`, `separator`, `submenu`, `checkbox` or `radio`.
     */
    type?: ('normal' | 'separator' | 'submenu' | 'checkbox' | 'radio');
    label?: string;
    sublabel?: string;
    /**
     * Hover text for this menu item.
     *
     * @platform darwin
     */
    toolTip?: string;
    accelerator?: Accelerator;
    icon?: (IconModel) | (string);
    /**
     * If false, the menu item will be greyed out and unclickable.
     */
    enabled?: boolean;
    /**
     * default is `true`, and when `false` will prevent the accelerator from triggering
     * the item if the item is not visible`.
     *
     * @platform darwin
     */
    acceleratorWorksWhenHidden?: boolean;
    /**
     * If false, the menu item will be entirely hidden.
     */
    visible?: boolean;
    /**
     * Should only be specified for `checkbox` or `radio` type menu items.
     */
    checked?: boolean;
    /**
     * If false, the accelerator won't be registered with the system, but it will still
     * be displayed. Defaults to true.
     *
     * @platform linux,win32
     */
    registerAccelerator?: boolean;
    /**
     * The item to share when the `role` is `shareMenu`.
     *
     * @platform darwin
     */
    sharingItem?: SharingItem;
    /**
     * Should be specified for `submenu` type menu items. If `submenu` is specified,
     * the `type: 'submenu'` can be omitted. If the value is not a `Menu` then it will
     * be automatically converted to one using `Menu.buildFromTemplate`.
     */
    submenu?: (MenuItemConstructorOptions[]) | (Menu);
    /**
     * Unique within a single menu. If defined then it can be used as a reference to
     * this item by the position attribute.
     */
    id?: string;
    /**
     * Inserts this item before the item with the specified label. If the referenced
     * item doesn't exist the item will be inserted at the end of  the menu. Also
     * implies that the menu item in question should be placed in the same “group” as
     * the item.
     */
    before?: string[];
    /**
     * Inserts this item after the item with the specified label. If the referenced
     * item doesn't exist the item will be inserted at the end of the menu.
     */
    after?: string[];
    /**
     * Provides a means for a single context menu to declare the placement of their
     * containing group before the containing group of the item with the specified
     * label.
     */
    beforeGroupContaining?: string[];
    /**
     * Provides a means for a single context menu to declare the placement of their
     * containing group after the containing group of the item with the specified
     * label.
     */
    afterGroupContaining?: string[];
}

export class MenuItem {

    accelerator?: Accelerator;
    checked: boolean;
    click: Function;
    commandId: number;
    enabled: boolean;
    icon?: Nullable<IconModel>;
    id: string;
    label: string;
    menu: Menu;
    registerAccelerator: boolean;
    role?: ('undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'pasteAndMatchStyle' | 'delete' | 'selectAll' | 'reload' | 'forceReload' | 'toggleDevTools' | 'resetZoom' | 'zoomIn' | 'zoomOut' | 'togglefullscreen' | 'window' | 'minimize' | 'close' | 'help' | 'about' | 'services' | 'hide' | 'hideOthers' | 'unhide' | 'quit' | 'startSpeaking' | 'stopSpeaking' | 'zoom' | 'front' | 'appMenu' | 'fileMenu' | 'editMenu' | 'viewMenu' | 'recentDocuments' | 'toggleTabBar' | 'selectNextTab' | 'selectPreviousTab' | 'mergeAllWindows' | 'clearRecentDocuments' | 'moveTabToNewWindow' | 'windowMenu');
    sharingItem: SharingItem;
    sublabel: string;
    submenu?: Menu;
    toolTip: string;
    type: ('normal' | 'separator' | 'submenu' | 'checkbox' | 'radio');
    visible: boolean;

    /**
     * MenuItem
     */
    constructor(options: MenuItemConstructorOptions){

    }

    setEnable( pStatus:boolean ){
        this.enabled = pStatus;
    }


}