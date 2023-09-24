import {MenuItem} from "./MenuItem";

export class Menu {

    items:MenuItem[];

    constructor(pItems:MenuItem[]) {
        this.items = pItems;
    }
}