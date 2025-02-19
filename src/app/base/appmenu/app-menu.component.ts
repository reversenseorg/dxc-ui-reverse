import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from "@angular/core";
import {Nullable} from "../Nullable";
import {AppMenuService, MenuItemTemplate, MenuTemplate, MenuTemplateEntry, MenuUpdateEvent} from "./app-menu.service";
import {MenuItem} from "../menu/MenuItem";
import {CheckItemEvent} from "./app-menu-item.component";
import {Subject} from "rxjs";


export interface RadioValueStream {
    values:string[];
    changes:Subject<string>;
    click:Subject<string>;
}
@Component({
    selector: 'app-menu',
    templateUrl: './app-menu.component.html',
    styleUrls: ['./app-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMenuComponent {

    @Input() id:Nullable<string> = null;
    @Input() menuClass: string = "";

    @Output() menuItemClick: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild("snavRef", {read: ElementRef}) snavRef: ElementRef;

    selectedItem:string = '';

    entries:any[] = [];
    _items:Record<string, MenuItem> = {};

    _radio:Record<string, RadioValueStream> = {};


    constructor( protected appmenuSvc:AppMenuService,
                 private changeDetectorRef:ChangeDetectorRef) {
        this.appmenuSvc.onTemplateUpdate$.subscribe((pEvt:MenuUpdateEvent)=>{
            if(pEvt.update){
                this.changeDetectorRef.detectChanges();
                this.appmenuSvc.onMenuRendered$.next(this._items);
            }else{
                this.render(pEvt.tpl, pEvt.idMapping);
            }

        })
    }

    /**
     *
     * @param pItem
     * @param pEvent
     */
    onItemSelect( pItem:any, pEvent:any):void{
        if(pItem.enable){
            if(pItem.onclick!=null){
                pItem.onclick.apply(null, [ pItem, pEvent]);
            }
        }
    }

    isSeparatorEntry(pItem:MenuTemplate):boolean {
        return ((pItem as any).type!=null && (pItem as any).type=='separator');
    }


    /**
     * Recursive browsing of nested submenus
     *
     * @param pMenuTpl
     * @param pIdMapping
     * @private
     */
    private _prepareMenuItems(pMenuTpl:MenuTemplateEntry[], pIdMapping: Record<string, MenuItem>):any[]{

        const itmToRender:any[]=[];

        pMenuTpl.map((sub:MenuTemplateEntry)=>{

            const subEntry:any = {}
            if((sub as MenuItemTemplate).role!=null) return;

            if((sub as MenuItemTemplate).id!=null) subEntry.id = (sub as MenuItemTemplate).id;

            if(this.isSeparatorEntry(sub as any)){
                subEntry.type = 'separator';
            }else{
                if((sub as MenuItemTemplate).label==null){
                    return;
                }
                subEntry.enabled = ((sub as MenuItemTemplate).enabled!==false);
                subEntry.icon = sub.icon;
                subEntry.label = (sub as MenuItemTemplate).label;
                subEntry.onclick = (sub as MenuItemTemplate).click;
                subEntry.type = (sub as any).type!==null ? (sub as any).type : null;
                subEntry.name = (sub as any).name!==null ? (sub as any).name : null;
                subEntry.value = (sub as any).value!==undefined ? (sub as any).value : undefined;
                subEntry.checked = (sub as any).checked!==undefined ? (sub as any).checked : undefined;

                subEntry.onSuccess = (sub as any).onSuccess!==null ? (sub as any).onSuccess : null;
                subEntry.onFailure = (sub as any).onFailure!==null ? (sub as any).onFailure : null;

                subEntry.onClick$ = null;
                subEntry.onChange$ = null;



                if(subEntry.type=='radio' || subEntry.type=='checkbox'){
                    if(subEntry.name!=null){

                        if(this._radio[subEntry.name]==null){
                            this._radio[subEntry.name] = {
                                values: [],
                                changes: new Subject(),
                                click: new Subject()
                            };
                            this._radio[subEntry.name].changes.subscribe((vVal:string)=>{
                                this._radio[subEntry.name].values.push(vVal);
                            });
                        }

                        subEntry.onChange$ = this._radio[subEntry.name].changes;
                        subEntry.onClick$ = this._radio[subEntry.name].click;

                        // initialize checked state
                        if(subEntry.checked===undefined){
                            if(subEntry.type=='radio'){
                                if(subEntry.value!==undefined){
                                    let i = this._radio[subEntry.name].values.length;
                                    if(i>0){
                                        subEntry.checked = (this._radio[subEntry.name].values[i-1]==subEntry.value);
                                    }else{
                                        subEntry.checked = false;
                                    }

                                }
                            }else{
                                subEntry.checked = false;
                            }
                        }else if(subEntry.checked===null){
                            subEntry.checked = false;
                        }

                        // to process new value
                        if((sub as any).onCheck!=null){
                            subEntry.onCheck = (sub as any).onCheck;
                        }else{
                            subEntry.onCheck = (vValue:any, vItem:any)=> {
                                if((vValue!==undefined) && (subEntry.value==vValue)){
                                    subEntry.checked = true;
                                }else{
                                    subEntry.checked = false;
                                }
                                return true;
                            };
                        }

                        // uncheck previously checked, and check new one
                        subEntry.onClick$.subscribe((vNewValue:any)=>{

                            let cont:boolean = false;
                            if(subEntry.type=='radio'){
                                // trigged when one of input (X) with same name has been clicked
                                if(subEntry.value==vNewValue){
                                    cont = subEntry.onCheck.apply(null, [vNewValue,subEntry]);
                                }else{
                                    cont = true;
                                }
                            }
                            else if(subEntry.type=='checkbox'){
                                // trigged when the of input (1) with this name has been clicked
                                cont = subEntry.onCheck.apply(null, [vNewValue,subEntry]);
                            }

                            if(cont){
                                subEntry.onChange$.next({
                                    newValue: vNewValue,
                                    checked: subEntry.checked
                                });
                            }else {
                                // todo : error to handle
                            }
                        });

                    }
                }


                if((sub as any).submenu!=null){
                    subEntry.submenu = this._prepareMenuItems((sub as any).submenu, pIdMapping);
                }
            }

            this._items[subEntry.id] = subEntry;

            if(subEntry.id !=null){
                pIdMapping[subEntry.id] = subEntry;
            }

            itmToRender.push(subEntry);
        });

        return itmToRender;
    }
    /**
     * To render or re-render a menu component
     *
     * @param {MenuTemplate[]} pTemplate
     * @param {Record<string, MenuItem>} pIdMapping
     *
     */
    render(pTemplate:MenuTemplate[], pIdMapping:Record<string, MenuItem>) {

        const newRender:any[] = [];

        pTemplate.map((vMenu:MenuTemplate, vOffset)=> {
            const renderedEntry:any = {}
            // new drop down btn
            renderedEntry.tpl = vMenu;
            renderedEntry.offset = vOffset;
            renderedEntry.id = vMenu.id;
            renderedEntry.label = vMenu.label;
            renderedEntry.submenu = this._prepareMenuItems(vMenu.submenu, pIdMapping);

            newRender.push(renderedEntry);
        });

        this.entries = newRender;
        // console.log("[APP-MENU] Renderering > ",this.entries);
        this.changeDetectorRef.detectChanges();
        this.appmenuSvc.onMenuRendered$.next(this._items);
    }

    hideSubMenu(pItem: any) {
        pItem.opened = false;
    }

    /**
     * Listener trigged when an item is checked,
     *
     * It must trigger uncheck of item with same name
     *
     * @param $event
     */
    onButtonCheck($event: CheckItemEvent) {

    }
}