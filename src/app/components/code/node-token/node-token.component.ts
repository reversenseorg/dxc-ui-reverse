import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {Nullable} from "../../../base/Nullable";
import {Tag} from "../../../models/tags/Tag";
import {IconModel, IconModelCollection} from "../../../base/icon/IconModel";
import {CODE_ICONS} from "../icons";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {INode} from "../../../models/INode";
import {CodeControllerService} from "../ctrl/code-controller.service";
import {INodeRef} from "../../../base/common/common";
import {DexcaliburProjectUUID} from "../../../models/DexcaliburProject";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxc-node-token',
    template: `
        <ng-container *ngIf="err==null && interactive && item!=null; else noInter">
            <span *ngIf="nodeIcon!=null" [ngClass]="'badge dxc-no-gutters dxc-meta '+css" [ngStyle]="style">
                <dxc-icon [model]="nodeIcon"></dxc-icon>
            </span>
            <ng-container [ngSwitch]="item.__">
                <ng-container *ngSwitchCase="NODE_TYPE.CLASS">
                    <span (click)="goTo(item)" (contextmenu)="codeSvc.displayContextMenu($event,'clazz',item)" [ngClass]="'badge dxc-no-gutters dxc-meta symbol'" [ngStyle]="style">
                        <dxc-icon [model]="cIcons.CLASS"></dxc-icon>
                        <dxc-node-alias [item]="item" [text]="item.name"></dxc-node-alias>
                    </span>
                </ng-container>
                <ng-container *ngSwitchCase="NODE_TYPE.FIELD">
                    
                    <dxc-node-token [cache]="cache" [ref]="asRef(item.enclosingClass, NODE_TYPE.CLASS)" [hookstatus]="false" [interactive]="true" [value]="true" [full]="false"></dxc-node-token>
                    
                    <span  [ngClass]="'badge dxc-no-gutters symbol'"  (click)="goTo(item)" (contextmenu)="codeSvc.displayContextMenu($event,'field',item)" [ngStyle]="style">
                        <dxc-icon [model]="cIcons.FIELD"></dxc-icon>
                        <dxc-node-alias [item]="item" [text]="item.name"></dxc-node-alias>
                    </span>
                </ng-container>
                <ng-container *ngSwitchCase="NODE_TYPE.METHOD">
                    <span *ngIf="item.enclosingClass !=null" (click)="goTo(item.enclosingClass)" (contextmenu)="codeSvc.displayContextMenu($event,'clazz',item.enclosingClass)" [ngClass]="'badge dxc-no-gutters dxc-meta symbol'" [ngStyle]="style">
                        <dxc-icon [model]="cIcons.CLASS"></dxc-icon>
                        <dxc-node-alias [item]="item.enclosingClass" [text]="getSymbol(item.enclosingClass)"></dxc-node-alias>
                    </span>
                    <span [ngClass]="'badge dxc-no-gutters dxc-meta symbol'"  (click)="goTo(item)" (contextmenu)="codeSvc.displayContextMenu($event,'meth',item)" [ngStyle]="style">
                        <dxc-icon [model]="cIcons.METH"></dxc-icon>
                        <dxc-node-alias [item]="item" [text]="item.name"></dxc-node-alias>
                    </span>
                    <ng-container *ngIf="full">
                        <span>(</span>
                            <ng-container *ngFor="let a of item.args; let i=index">
                                <span>arg{{i}}</span>
                                <dxc-node-alias [item]="a" [text]="getSymbol(a)"></dxc-node-alias>
                                <span *ngIf="(i+1)<item.args.length">&nbsp;,&nbsp;</span>
                            </ng-container>
                        <span>)</span> 
                        <span> :ret </span>
                        <dxc-node-alias [item]="item.ret" [text]="getSymbol(item.ret)"></dxc-node-alias>
                    </ng-container>
                </ng-container>
                <ng-container *ngSwitchCase="NODE_TYPE.STRING">
                    <span (click)="goTo(item)" (contextmenu)="codeSvc.displayContextMenu($event,'str',item)" [ngClass]="'badge dxc-no-gutters dxc-meta symbol'" [ngStyle]="style">
                        <dxc-icon [model]="cIcons.STRING"></dxc-icon>
                        <dxc-node-alias [item]="item" [text]="item.sym"></dxc-node-alias>
                    </span>
                </ng-container>
                <ng-container *ngSwitchCase="NODE_TYPE.FUNC">
                    <span (click)="goTo(item)" (contextmenu)="codeSvc.displayContextMenu($event,'func',item)" [ngClass]="'badge dxc-no-gutters dxc-meta symbol'" [ngStyle]="style">
                        <dxc-icon [model]="cIcons.NATIVE"></dxc-icon>
                        <dxc-node-alias [item]="item" [text]="item.sym"></dxc-node-alias>
                    </span>
                </ng-container>
                <ng-container *ngSwitchCase="NODE_TYPE.FILE">
                    <span (click)="goTo(item)" (contextmenu)="codeSvc.displayContextMenu($event,'bin',item)" [ngClass]="'badge dxc-no-gutters dxc-meta symbol'" [ngStyle]="style">
                        <dxc-icon [model]="gIcons.BIN"></dxc-icon>
                        <dxc-node-alias [item]="item" [text]="item._r"></dxc-node-alias>
                    </span>
                </ng-container>
                <ng-container *ngSwitchCase="NODE_TYPE.RESOURCE">
                    <span (click)="goTo(item)" [ngClass]="'badge dxc-no-gutters dxc-meta symbol'" [ngStyle]="style">
                        <dxc-icon [model]="gIcons.RES"></dxc-icon>
                        <dxc-node-alias [item]="item" [text]="item.name"></dxc-node-alias>
                        <ng-container *ngIf="item.location">
                            
                        </ng-container>
                    </span>
                </ng-container>
            </ng-container>
            <ng-container *ngIf="tags">
                <dxc-tag-badge *ngFor="let t of item.tags" [tagUUID]="t"></dxc-tag-badge>
            </ng-container>
        </ng-container>
        <ng-template #noInter>
            <ng-container *ngIf="err==null; else errmsg" (click)="goTo(item)" (contextmenu)="codeSvc.displayContextMenu($event, 'meth', item)">
                <span *ngIf="nodeIcon!=null" [ngClass]="'badge dxc-no-gutters dxc-meta '+css" [ngStyle]="style">
                    <dxc-icon [model]="nodeIcon"></dxc-icon>
                </span>
                <span *ngIf="item" [ngClass]="'badge dxc-no-gutters symbol '+cssValue" [ngStyle]="styleValue">{{ getSymbol()  }}</span>
            </ng-container>
            <ng-template #errmsg>
                <fa-icon [icon]="['fas','times-circle']" class="ms-2 ps-1 pe-1 dxc-text-yellow"></fa-icon>
                <span class="ps-2">Node not found</span>
            </ng-template>
        </ng-template>
    `,
    styleUrls: ['../explorer-code/explorer-code.component.scss'],
    styles: [`
        .symbol {
          font-weight: 200;
          font-size: 0.8rem;
        }
    `],
    providers: [
        NgbTooltipConfig
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeTokenComponent implements OnInit {

    readonly NODE_TYPE = NodeInternalType;

    @Input() item:any = null; //ModelMethod|ModelClass|ModelField|ModelFunction|ModelPackage;

    @Input() hookstatus = false;
    @Input() interactive = true;
    @Input() value = false;

    @Input() cache = false;

    @Input() style?: { [p:string]:any };
    @Input() styleValue?: { [p:string]:any };
    @Input() css:string = "";
    @Input() cssValue:string = "";

    @Input() ref:Nullable<INodeRef> = null;
    @Input() full = false;

    /**
     * To show tag badges
     */
    @Input() tags = false;

    @Input() format:Nullable<string> = null;
    @Input() noAlias = false;

    err:Nullable<string> = null;



    gIcons:IconModelCollection = GLOBAL_ICONS;
    cIcons:IconModelCollection = CODE_ICONS;
    nodeIcon:Nullable<IconModel> = null;


    window: Tag[] = [];
    selected:Nullable<Tag> = null;


    constructor(
        public codeSvc: CodeControllerService,
        private changeRef:ChangeDetectorRef) {

    }


    ngOnInit() {

        console.log("Retrieved node on init : ",this.ref);
        if(this.ref!=null){
            if(sessionStorage.getItem('puid')!=null){

                if(this.cache){
                    const n = this.codeSvc.getFromCache(
                        sessionStorage.getItem('puid') as DexcaliburProjectUUID,
                        this.ref as INodeRef);

                    if(n!=null){
                        this.item = n;
                        this.changeRef.detectChanges();
                        return;
                    }
                }


                this.codeSvc.retrieveNode<any>(
                    sessionStorage.getItem('puid') as DexcaliburProjectUUID,
                    this.ref as INodeRef,
                    this.cache
                ).subscribe((vNode)=>{
                    console.log("Retrieved node : ",this.ref,vNode);
                    if(vNode.success){
                        this.item = vNode.data;
                        this.changeRef.detectChanges();
                    }else{
                        this.err = 'not_found';
                    }
                })
            }
        }
    }

    /**
     * Navigate to the item
     *
     * @param {INode} pItem
     */
    goTo(pItem:any = null){
        this.codeSvc.displayNode$.next({
            node: (pItem!=null? pItem : this.item)
        });
    }


    /**
     *
     */
    getSymbol(pItem:Nullable<INode> = null):string {

        const itm = (pItem!=null ? pItem : this.item);
        console.log("getSymbol() of ",itm,typeof pItem==='string');
        if(typeof pItem==='string'){
            return pItem;
        }else {
            if(this.format != null){
                return this.codeSvc.getFormatedSymbol(itm, this.format);
            }else{
                return this.codeSvc.getBaseSymbol(itm);
            }
        }

    }

    protected readonly GLOBAL_ICONS = GLOBAL_ICONS;

    asRef(pEnclosingClass: any, pType: NodeInternalType) {
        let c = null;
        if(typeof pEnclosingClass == 'string'){
            c= { __:pType, _uid:pEnclosingClass};
        }else if(pType==NodeInternalType.CLASS && pEnclosingClass.name!=null){
            c= { __:pType, _uid:pEnclosingClass.name};
        }

        console.log("asRef() : ",pEnclosingClass,pType,c);
        return c;
    }
}
