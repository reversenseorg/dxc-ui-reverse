import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from "@angular/core";
import {Nullable} from "../Nullable";
import {AppMenuService, MenuTemplate, MenuTemplateEntry} from "./app-menu.service";

@Component({
    selector: 'app-menu',
    templateUrl: './app-menu.component.html',
    styleUrls: ['./app-menu.component.scss'],
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMenuComponent {

    @Input() id:Nullable<string> = null;
    @Input() menuClass: string = "";

    @Output() menuItemClick: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild("snavRef", {read: ElementRef}) snavRef: ElementRef;

    selectedItem:string = '';

    entries:any[] = [];


    constructor( protected appmenuSvc:AppMenuService) {
        this.appmenuSvc.onTemplateUpdate$.subscribe((pTemplate:MenuTemplate[])=>{
            this.render(pTemplate);
            // re render
            console.log("App Menu Template updated : ",pTemplate);
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

        console.log(pItem, (pItem as any).type, ((pItem as any).type!=null && (pItem as any).type=='separator'))
        return ((pItem as any).type!=null && (pItem as any).type=='separator');
    }

    render(pTemplate:MenuTemplate[]) {

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

                if(this.isSeparatorEntry(sub)){
                    subEntry.type = 'separator';
                }else{
                    if(sub.label==null){
                        console.log("Menu entry has not label : ",sub);
                        return;
                    }
                    subEntry.enable = !(sub.enabled===false);
                    subEntry.icon = sub.icon;
                    subEntry.label = sub.label;
                    subEntry.onclick = sub.click;
                    subEntry.type = null;
                }
                renderedEntry.submenu.push(subEntry);
            });


            //if(this.isSeparatorEntry(sub))
            newRender.push(renderedEntry);
        });

        this.entries = newRender;
        console.log("Entries to render : ",this.entries)
    }

}