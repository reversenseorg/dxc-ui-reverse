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
import {AppMenuService, MenuTemplate, MenuTemplateEntry, MenuUpdateEvent} from "./app-menu.service";
import {MenuItem} from "../menu/MenuItem";

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


    constructor( protected appmenuSvc:AppMenuService, private changeDetectorRef:ChangeDetectorRef) {
        this.appmenuSvc.onTemplateUpdate$.subscribe((pEvt:MenuUpdateEvent)=>{
            if(pEvt.update){
                //console.log("[APP-MENU] Update rendering ", this.entries);
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
            renderedEntry.submenu = [];

            vMenu.submenu.map((sub:any,o)=>{
                const subEntry:any = {}
                if(sub.role!=null) return;

                if(sub.id!=null) subEntry.id = sub.id;

                if(this.isSeparatorEntry(sub)){
                    subEntry.type = 'separator';
                }else{
                    if(sub.label==null){
                        return;
                    }
                    subEntry.enabled = (sub.enabled!==false);
                    subEntry.icon = sub.icon;
                    subEntry.label = sub.label;
                    subEntry.onclick = sub.click;
                    subEntry.type = null;
                }

                this._items[subEntry.id] = subEntry;

                if(subEntry.id !=null){
                    pIdMapping[subEntry.id] = subEntry;
                }

                renderedEntry.submenu.push(subEntry);
            });


            //if(this.isSeparatorEntry(sub))
            newRender.push(renderedEntry);
        });

        this.entries = newRender;
        // console.log("[APP-MENU] Renderering > ",this.entries);
        this.changeDetectorRef.detectChanges();
        this.appmenuSvc.onMenuRendered$.next(this._items);
    }

}