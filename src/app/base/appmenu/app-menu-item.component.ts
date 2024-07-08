import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input, OnChanges, OnInit,
    Output,
    ViewChild
} from "@angular/core";
import {Nullable} from "../Nullable";
import {MenuItem} from "../menu/MenuItem";
import {AppMenuService, MenuItemTemplate, MenuTemplate, MenuUpdateEvent} from "./app-menu.service";
import {NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap/dropdown/dropdown-config";
import {ICON_TYPE, IconModel} from "../icon/IconModel";


export interface CheckItemEvent {
    target?:any;
    name:string;
    value:string;
}




@Component({
    selector: 'app-menu-item',
    template: `
        <ng-container *ngIf="item.submenu==null;then noSubmenu else withSubmenu"></ng-container>
        <ng-template #noSubmenu>
            <ng-container *ngIf="item.type=='separator'">
                <div class="menu-item separator">
                    <div class="separator"></div>
                </div>
            </ng-container>
            <ng-container *ngIf="item.enabled && item.type!='separator'" ngbDropdownItem>
                <ng-container *ngIf="item.type=='radio' || item.type=='checkbox'">
                    <div class="row g-0 menu-item" (click)="checkInput()">
                        <div class="col-1"  >
                            <dxc-icon *ngIf="item.checked" [model]="checkedIcon"></dxc-icon>
                        </div>
                        <div class="col-11"  >
                            <dxc-icon *ngIf="item.icon!=null" [model]="item.icon"></dxc-icon>
                            {{ item.label }}
                        </div>
                    </div>
                </ng-container>
                
                <ng-container *ngIf="item.type==null">
                    <div class="row g-0 menu-item" (click)="onItemSelect(item,$event)"  ngbDropdownItem>
                        <div class="col-10">
                            <dxc-icon *ngIf="item.icon" [model]="item.icon"></dxc-icon>
                            {{ item.label }}
                        </div>
                        <div class="col-2">
                            <!-- shortcut -->
                        </div>
                    </div>
                </ng-container>
                <!--<button class="btn dxc-text-clear100" [id]="'dropdownBasic'+offset" ngbDropdownToggle>
                    <dxc-icon *ngIf="item.icon!=null" [model]="item.icon"></dxc-icon>
                    {{ item.label }}
                </button>-->
                
                <!--<button class="menu-item" (click)="onItemSelect(item,$event)"  ngbDropdownItem>
                    
                </button>-->
            </ng-container>
            <ng-container *ngIf="!item.enabled && item.type!='separator'">
                <div class="row g-0 menu-item dropdown-item disabled" ngbDropdownItem>
                    <div class="col-10">
                        <dxc-icon *ngIf="item.icon" [model]="item.icon"></dxc-icon>
                        {{ item.label }}
                    </div>
                    <div class="col-2">

                    </div>
                </div>
            </ng-container>
        </ng-template>
        <ng-template #withSubmenu>
            
            <div ngbDropdown [(open)]="opened" class="menu-item-dd" placement="right" (openChange)="onMenuChange($event)" #ddmenu>
                <!--<button class="menu-item" [id]="'subDropdownBasic'+offset" (mouseenter)="showSubMenu(item)" ngbDropdownToggle>
                    <dxc-icon *ngIf="item.icon!=null" [model]="item.icon"></dxc-icon>
                    {{ item.label }}
                </button>-->
                <div class="row g-0 menu-item" [id]="'subDropdownBasic'+offset"  ngbDropdownToggle>
                    <div class="col-11"  >
                        <dxc-icon *ngIf="item.icon!=null" [model]="item.icon"></dxc-icon>
                        {{ item.label }}
                    </div>
                    <div class="col-1">
                        <fa-icon [icon]="['fas','chevron-right']"></fa-icon>
                    </div>
                </div>
                <div ngbDropdownMenu class="nav-menu-dropdown" aria-labelledby="subDropdownBasic" #submenu>
                    <ng-container *ngFor="let subi of item.submenu; ">
                        <ng-container *ngIf="subi.type==null; then buttonEntry else otherEntry"></ng-container>
                        <ng-template #otherEntry>
                            <ng-container *ngIf="subi.type=='separator'">
                                <div class="menu-item separator">
                                    <div class="separator"></div>
                                </div>
                            </ng-container>
                            <ng-container *ngIf="subi.type=='radio' || subi.type=='checkbox' ">
                                <app-menu-item [item]="subi"></app-menu-item>
                            </ng-container>
                        </ng-template>
                        <ng-template #buttonEntry>
                            <ng-container *ngIf="subi.enabled">
                                <ng-container *ngIf="subi.submenu && subi.submenu">
                                    <app-menu-item [item]="subi"></app-menu-item>
                                </ng-container>
                                <ng-container *ngIf="subi.submenu==null">
                                    
                                    <button class="menu-item" (click)="onItemSelect(subi,$event)" ngbDropdownItem>
                                        <dxc-icon *ngIf="subi.icon" [model]="subi.icon"></dxc-icon>
                                        {{ subi.label }}
                                    </button>
                                    
                                </ng-container>
                            </ng-container>
                            <ng-container *ngIf="!subi.enabled">
                                <button class="menu-item dropdown-item disabled">
                                    <dxc-icon *ngIf="subi.icon" [model]="subi.icon"></dxc-icon>
                                    {{ subi.label }}
                                </button>
                            </ng-container>
                        </ng-template>
                    </ng-container>
                </div>
            </div>
        </ng-template>
    `,
    styleUrls: ['./app-menu.component.scss','../base.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMenuItemComponent implements AfterViewInit {

    @Input() item: any;

    @Input() offset: number;

    @Input() opened = false;

    @Output() onCheck: EventEmitter<CheckItemEvent> = new EventEmitter<CheckItemEvent>();

    @Output() openChange: EventEmitter<any> = new EventEmitter<any>();

    @Output() menuItemClick: EventEmitter<any> = new EventEmitter<any>();

    subscription:any  = null;

    checkedIcon: IconModel;



    constructor( protected appmenuSvc:AppMenuService,
                 protected changeDetectorRef:ChangeDetectorRef) {

    }

    ngAfterViewInit() {
        console.log("AppMenuIetmCmp > ", this.item);

        if(this.item.onChange$!=null){
            this.subscription = this.item.onChange$.subscribe((vEvt:any)=>{
                switch(this.item.type){
                    case 'radio':
                        this.item.checked = (this.item.value==vEvt.newValue);
                        break;
                    case 'checkbox':
                        this.item.checked = vEvt.checked;
                        break;
                }
                this.changeDetectorRef.detectChanges();
            })
        }

        switch (this.item.type){
            case 'radio':
                this.checkedIcon = new IconModel({
                    iconType: ICON_TYPE.ICON,
                    type: 'fal',
                    name: 'circle',
                    color1: 'dxc-text-75'
                });
                break;
            case 'checkbox':
                this.checkedIcon = new IconModel({
                    iconType: ICON_TYPE.ICON,
                    type: 'fal',
                    name: 'check',
                    color1: 'dxc-text-75'
                });
                break;
        }
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
    render() {
        // console.log("[APP-MENU] Renderering > ",this.entries);
        this.changeDetectorRef.detectChanges();
    }


    /**
     * A listener trigged when the state of the dropdown menu change
     *
     * @param $event
     */
    onMenuChange($event: boolean) {
        //this.menuDisplayed = $event;
    }


    /**
     * To check the item, it emit the item and the value
     *
     */
    checkInput() {
        switch (this.item.type){
            case 'radio':
            case 'checkbox':
                //this.item.value = (this.item.value==true)? false : true;
                this.item.onClick$.next(this.item.value);
                break;
        }

    }
}