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

import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {Nullable} from "../../base/Nullable";
import {OutputService} from "../output/ctrl/output.service";
import {Tag} from "../../models/tags/Tag";
import ModelCall from "../../models/ModelCall";
import ModelMethod from "../../models/ModelMethod";
import ModelClass from "../../models/ModelClass";
import {ModelFunction} from "../../models/ModelFunction";
import {NodeInternalType} from "../../models/NodeInternalType";
import {CODE_ICONS} from "./icons";
import {from, Observable} from "rxjs";
import AndroidComponent from "../../models/android/AndroidComponent";
import {CodeControllerService} from "./ctrl/code-controller.service";
import {UIException} from "../../base/error/UIException";
import {IconComponent} from "../../base/icon/icon.component";
import {DxcBaseModule} from "../../base/dxc-base.module";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";

let ctr = 0;



interface Column {
    id: string;
    label: string;
    cls: string;
}




@Component({
    selector: 'dxc-osapi-xref',
    template: `
        <div class="container-fluid fill-height p-0">
            <h5 *ngIf="title">{{ title }}</h5>

            <div *ngIf="description!=null">
                <p>{{ description }}</p>
            </div>

            <ng-container *ngIf="data!=null && data.length>0; else noData">
                <app-expandable-list style="overflow: auto;">
                    <ng-container *ngFor="let cat of data">

                        <ng-template #expItem let-itemObj="item">

                            <ng-container [ngSwitch]="itemObj.__">
                                <ng-container *ngSwitchCase="NODE_TYPES.CLASS">
                          <span (contextmenu)="displayExtMenu($event,'clazz',itemObj)">
                            <dxc-icon [model]="cIcons['CLASS']"></dxc-icon>
                              {{ itemObj.uid }}
                          </span>
                                </ng-container>
                                <ng-container *ngSwitchCase="NODE_TYPES.METHOD">
                          <span (contextmenu)="displayExtMenu($event,'meth',itemObj)">
                                            <dxc-icon [model]="cIcons['METH']"></dxc-icon>
                              <!--<dxc-icon [model]="itemObj._icon"></dxc-icon>-->
                              {{ itemObj.short }}
                          </span>
                                </ng-container>
                                <ng-container *ngSwitchDefault>
                          <span (contextmenu)="displayExtMenu($event,'meth',itemObj)">
                            <dxc-icon [model]="cIcons['XREF_TO']"></dxc-icon>
                              <i *ngIf="itemObj.loc">[&nbsp;{{ itemObj.loc[0].bb }}&nbsp;:&nbsp;{{ itemObj.loc[0].instr }}&nbsp;]&nbsp;</i>{{ itemObj.parent }}
                          </span>
                                </ng-container>
                            </ng-container>
                        </ng-template>

                        <app-expandable-item
                                [itemTpl]="expItem"
                                [item]="cat"
                                [provider]="this"
                                [itemType]="cat.__"
                                [expandableFn]="isExpandable"
                                (itemFocus)="onItemFocus($event)"
                        >

                        </app-expandable-item>
                    </ng-container>
                </app-expandable-list>
            </ng-container>
            <ng-template #noData>
                <div class="dxc-text-clear100 pt-4 row">
                    <div class="text-right col-2 pt-2">
                        <dxc-icon [model]="gIcons['WARNING']"></dxc-icon>
                    </div>
                    <div class="col-8 text-left">
                        Deep Cross-references to {{ projectionAreaName }} not found<br>The class implementing this
                        activity is probably missing
                    </div>
                </div>
            </ng-template>
        </div>

    `,
    styles: [`
      .dxc-grid-body div.row {
        &:hover {
          background-color: var(--nav-btn-hover-bg);
          color: var(--nav-btn-hover-color);
        }

        &.focus {
          background-color: var(--menu-bg-hover);
          color: var(--text-100);
        }

        &.footer {
          position: absolute;
          bottom: 0;
          right: 0;
        }

        cursor: pointer;
      }
    `],
    imports: [
        IconComponent,
        DxcBaseModule,
        NgSwitch,
        NgForOf,
        NgIf,
        NgSwitchCase,
        NgSwitchDefault
    ],
    standalone: true
})
export class OsApiXrefComponent implements OnInit {

    @Input() title?:string;
    @Input() description = null;
    @Input() projectionAreaName = "OS API";
    /**
     * To automatically search xref to OS API
     */
    @Input() autoload = false;
    /**
     * Projection depth
     */
    @Input() depth = 1;
    @Input() component:Nullable<AndroidComponent> = null;
    @Input() node: Nullable<AndroidComponent|ModelClass|ModelFunction|ModelMethod> = null;

    @Input() controller:any;


    @Input() sort:"asc"|"desc" = "desc";
    @Input() pagignation: boolean = false;
    @Input() rows: number;
    @Input() visibleRows: number = 10;
    @Input() height: number = 200;
    @Input() rowPerPageOpts: number[] = [20,50,100];

    @Input() header = false;
    @Input() navbar = false;
    @Input() headerCols:string[] = [];


    @Input() xrefto = false;
    @Input() xreffrom = false;

    @Output() refreshed:EventEmitter<any> = new EventEmitter<any>();
    @Output() selectOne:EventEmitter<ModelCall> = new EventEmitter<ModelCall>();
    @Output() dblclickOne:EventEmitter<ModelCall> = new EventEmitter<ModelCall>();



    data:ModelClass[] = [];

    activeItem: any = null;
    window: (ModelMethod|ModelFunction)[] = [];

    selected:Nullable<ModelMethod|ModelFunction> = null;

    options = [
        { label: 'A to Z', icon: 'pi pi-fw pi-sort-alpha-down' },
        { label: 'Z to A', icon: 'pi pi-fw pi-sort-alpha-down-alt' }
    ];


    columns: Record<string, Column> = {};


    protected readonly gIcons = GLOBAL_ICONS;
    protected readonly NODE_TYPES = NodeInternalType;
    protected readonly cIcons = CODE_ICONS;

    constructor(
        private _outputSvc: OutputService,
        //private topoSvc: TopologyService,
        private codeSvc: CodeControllerService,
        private changeRef:ChangeDetectorRef) {

    }

    ngOnInit() {
        this.refresh();
    }



    doOnSelection(pType:string,pSymbol: string):void {

        /*this.selected[pType].map((x:any) => {
            ((this as IStringIndex<any>)[pSymbol] as any).apply(this, x);
        })*/

    }

    openTag(pTag:Tag) {

    }

    select(pObject: any, pType:string) {
        this.selected = pObject;
        this.selectOne.emit(pObject);
    }

    dblclickProject(pObject:any):void {
        this.dblclickOne.emit(pObject)
    }



    refresh(pResetUI  = false) {

        if(this.node != null){

            let projection:Nullable<Observable<any>> = null;
            switch (this.node.__) {
                case NodeInternalType.ANDROID_ACTIVITY:
                case NodeInternalType.ANDROID_RECEIVER:
                case NodeInternalType.ANDROID_SERVICE:
                case NodeInternalType.ANDROID_PROVIDER:
                    //projection = this.topoSvc.scanComponent( this.node as AndroidComponent);
                    break;
                case NodeInternalType.METHOD:
                case NodeInternalType.FUNC:
                case NodeInternalType.CLASS:
                    projection = this.codeSvc.xrefAndroidApi(this.node as ModelClass);
                    break;
            }


            if(projection!=null){
                projection.subscribe((x)=>{
                    this.data = x;

                    /*
                    for(const cls in x.__ppts.internals){

                      clsX = {
                        __: NodeInternalType.CLASS,
                        uid: cls,
                        meths: []
                      };

                      for(const idx in x.__ppts.internals[cls]){
                        methX = x.__ppts.internals[cls][idx]
                        clsX.children.push({
                          __: NodeInternalType.METHOD,
                          uid: idx,
                          xrefs: []
                        })
                      })

                      this.data.internals.push({
                        __: NodeInternalType.CLASS,
                        name: cls,
                        children: []
                      });
                    }*/
                    console.log(this.data,x);

                    this.changeRef.detectChanges();
                });
           }
        }
    }





    /**
     * To display a contextual menu defined by another brick
     *
     * @param $event
     * @param pType
     * @param pObj
     */
    displayExtMenu($event: MouseEvent, pType: string, pObj:any) {
        this.codeSvc.displayCtxMenu$.next({ event:$event, type:pType, obj:pObj});
    }

    expand(pItem: any, pType: string): Observable<any> {
        console.log("expand osapi: ",pItem,pType);
        let ret:Observable<any>
        switch (pItem.__){
            case NodeInternalType.CLASS:
                ret = from([pItem.methods])
                break;
            case NodeInternalType.METHOD:
                ret = from([pItem.xrefs])
                break;
            default:
                ret = from([]);
                break;
        }
        return ret;
    }

    itemHasChildren(pItem: any, pType: string): boolean {
        return (pItem.__!=null) && ([NodeInternalType.CLASS,NodeInternalType.METHOD].indexOf(pItem.__)>-1);
    }


    itemHasLazyChildren( pItem:any, pType ='p'): boolean {
        return (pItem.children.length==1 && pItem.children[0]._t=="wait");
    }

    itemGetChildren( pItem:any):any{
        switch (pItem.__){
            case NodeInternalType.CLASS:
                return pItem.methods;
                break;
            case NodeInternalType.METHOD:
                return pItem.xrefs;
                break;
            default:
                pItem.children;
                break;
        }
    }

    isExpandable(pItem:any, pSrc:any):boolean{
        return (pItem.__!=null) && ([NodeInternalType.CLASS,NodeInternalType.METHOD].indexOf(pItem.__)>-1);
    }

    onItemFocus( pEvent:any):void{

        if(this.activeItem != null){
            this.activeItem.el.style.backgroundColor = "#444";
        }

        this.activeItem = pEvent;
        pEvent.el.style.backgroundColor = "royalblue";
    }

    open(pItem: any): Observable<boolean> {

        console.log('osapi open > ',pItem);
        if(this.controller==null || this.controller.app==null){
            throw  UIException.APP_NOT_INITIALIZED();
        }

        let success:boolean;
        switch (pItem.__){
            case NodeInternalType.CLASS:
            case NodeInternalType.METHOD:
                this.controller.app.getController('ctrl:code-main')
                    .openNode(pItem.uid, pItem.__);
                success = true;
                break;
            default:
                if(pItem.hasOwnProperty('parent')){
                    this.controller.app.getController('ctrl:code-main')
                        .openNode(pItem.parent, NodeInternalType.METHOD);
                    success = true;
                }else{
                    success = false;
                }
                break;
        }

        return from([success]);
    }
}
