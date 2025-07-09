import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {IconModel} from "../icon/IconModel";
import {DxcBaseModule} from "../dxc-base.module";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {Nullable} from "../Nullable";
import {MenuView} from "../../cmp/MenuView";


export interface MenuItem {
    icon?:Nullable<IconModel>;
    label?:Nullable<string>;
    styleClass?:string;
}


@Component({
    selector: 'dxc-dropdown-item',
    template: `
        <dxc-icon *ngIf="item.icon" [model]="item.icon"></dxc-icon>  {{ item.label }}
    `,
    styleUrls: ['../../forms.scss'],
    standalone: true,
    imports: [
        DxcBaseModule,
        NgIf,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DxcDropdownItemComponent {

    @Input() item: MenuItem;

    constructor() { }
}


@Component({
    selector: 'dxc-dropdown',
    template: `
        <div ngbDropdown [ngClass]="{'borderless':borderless}" class="d-inline-block nav-menu">
            <button [ngClass]="styleClass" class="btn dxc-text-clear100" id="ddb" ngbDropdownToggle>
                <dxc-icon *ngIf="selected.icon" [model]="selected.icon"></dxc-icon>  {{ selected.label }}
            </button>
            <div ngbDropdownMenu aria-labelledby="ddb">
                <button *ngFor="let item of options" [ngClass]="item.styleClass"
                        (click)="select(item)" ngbDropdownItem>
                    <dxc-icon *ngIf="item.icon" [model]="item.icon"></dxc-icon> {{ item.label }}
                </button>
            </div>
        </div>
    `,
    styleUrls: ['../../forms.scss'],
    standalone: true,
    styles: [`
      .borderless, .borderless:hover {
        border: none;
      }
    `],
    imports: [
        DxcBaseModule,
        NgForOf,
        NgIf,
        NgbDropdown,
        NgbDropdownItem,
        NgbDropdownMenu,
        NgbDropdownToggle,
        NgClass
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DxcDropdownComponent implements OnInit {

    @Input() icon:IconModel;
    @Input() label = "";

    @Input() borderless = false;
    @Input() disable:boolean = false;

    @Input() options: MenuItem[] = [];
    @Input() styleClass = "";

    @Input() selected: MenuItem;

    @Input() menu:Nullable<MenuView> = null;

    @Output() itemClick:EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
        if(this.menu!=null){
            this.options = this.menu.items;
            if(this.menu.selected>-1){
                this.selected = this.options[this.menu.selected];
            }else{
                this.selected = this.options[0];
            }
        }else{
            if(this.selected==null && this.options.length>0){
                this.selected = this.options[0];
            }
        }


    }

    select(item:any):void{
        this.selected = item;
        this.itemClick.emit(this.selected);
    }
}
