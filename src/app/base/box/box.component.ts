import {
    AfterContentInit,
    Component, ComponentFactory,
    ComponentFactoryResolver, ComponentRef,
    ElementRef,
    Input,
    OnChanges,
    OnInit, SimpleChanges,
    ViewChild, ViewContainerRef
} from "@angular/core";
import {ExplorerItem} from "../../cmp/ExplorerItem";
import {SubExplorerComponent} from "../explorer/subexplorer.component";
import {Nullable} from "../Nullable";
import {ExplorerDirective} from "../explorer/explorer.directive";
import {Subject} from "rxjs";
import {IStringIndex} from "../IStringIndex";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";



/**
 * This class represents the Explorer Area (left panel)
 *
 * @class
 * @since 1.0.0
 */
@Component({
    selector: 'dxc-box',
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.scss']
})
export class BoxComponent  {

    @Input() public parent: any;

    /**
     * The collection of explorer components
     *
     * @type {SubExplorerComponent[]}
     * @field
     * @since 1.0.0
     */
    elements: SubExplorerComponent<any>[] = [];

    /**
     * The active explorer component
     * By default, its the first
     *
     * @type {number}
     * @field
     * @since 1.0.0
     */
    active = 0;


    resize$: Subject<any> = new Subject<any>();



    constructor(private componentFactoryResolver: ComponentFactoryResolver) {

    }



}
