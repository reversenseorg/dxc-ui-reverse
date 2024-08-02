import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {Nullable} from "../../../base/Nullable";
import {OutputService} from "../../output/ctrl/output.service";
import {Tag} from "../../../models/tags/Tag";
import ModelMethod from "../../../models/ModelMethod";
import ModelClass from "../../../models/ModelClass";
import ModelField from "../../../models/ModelField";
import {IconModel, IconModelCollection} from "../../../base/icon/IconModel";
import {CODE_ICONS} from "../icons";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {INode} from "../../../models/INode";
import {TagService} from "../../tag/ctrl/tag.service";
import {ModelFunction} from "../../../models/ModelFunction";
import ModelPackage from "../../../models/ModelPackage";
import {CodeControllerService} from "../ctrl/code-controller.service";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxc-node-token',
    template: `
        <ng-container *ngIf="interactive; else noInter">
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
                    <span *ngIf="item.enclosingClass !=null"  (click)="goTo(item.enclosingClass)" (contextmenu)="codeSvc.displayContextMenu($event,'clazz',item.enclosingClass)" [ngClass]="'badge dxc-no-gutters dxc-meta symbol'" [ngStyle]="style">
                        <dxc-icon [model]="cIcons.CLASS"></dxc-icon>
                        <dxc-node-alias [item]="item.enclosingClass" [text]="getSymbol(item.enclosingClass)"></dxc-node-alias>
                    </span>
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
                <ng-container *ngSwitchCase="NODE_TYPE.FUNC">
                    <span (click)="goTo(item)" (contextmenu)="codeSvc.displayContextMenu($event,'func',item)" [ngClass]="'badge dxc-no-gutters dxc-meta symbol'" [ngStyle]="style">
                        <dxc-icon [model]="cIcons.NATIVE"></dxc-icon>
                        <dxc-node-alias [item]="item" [text]="item.sym"></dxc-node-alias>
                    </span>
                </ng-container>
            </ng-container>
        </ng-container>
        <ng-template #noInter>
            <ng-container (click)="goTo(item)" (contextmenu)="codeSvc.displayContextMenu($event, 'meth', item)">
                <span *ngIf="nodeIcon!=null" [ngClass]="'badge dxc-no-gutters dxc-meta '+css" [ngStyle]="style">
                    <dxc-icon [model]="nodeIcon"></dxc-icon>
                </span>
                <span [ngClass]="'badge dxc-no-gutters symbol '+cssValue" [ngStyle]="styleValue">{{ getSymbol()  }}</span>
            </ng-container>
        </ng-template>
    `,
    styleUrls: ['../explorer-code/explorer-code.component.scss'],
    styles: [`
        .symbol {
          font-weight: 200;
          font-size: 0.8rem;
        }
    `],
    providers: [NgbTooltipConfig],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeTokenComponent implements OnInit, AfterViewInit {

    readonly NODE_TYPE = NodeInternalType;

    @Input() item:any; //ModelMethod|ModelClass|ModelField|ModelFunction|ModelPackage;

    @Input() hookstatus = false;
    @Input() interactive = true;
    @Input() value = false;

    @Input() style?: { [p:string]:any };
    @Input() styleValue?: { [p:string]:any };
    @Input() css:string = "";
    @Input() cssValue:string = "";


    @Input() full = false;

    @Input() format:Nullable<string> = null;
    @Input() noAlias = false;




    gIcons:IconModelCollection = GLOBAL_ICONS;
    cIcons:IconModelCollection = CODE_ICONS;
    nodeIcon:Nullable<IconModel> = null;


    window: Tag[] = [];
    selected:Nullable<Tag> = null;


    constructor(
        private _outputSvc: OutputService,
        private tagSvc: TagService,
        public codeSvc: CodeControllerService,
        private changeRef:ChangeDetectorRef) {

    }

    ngAfterViewInit() {
        //this.nodeIcon = (this.type=="to")? CODE_ICONS.XREF_TO : CODE_ICONS.XREF_FROM;
        console.log(this);
        this.changeRef.detectChanges();
    }

    ngOnInit() {

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

}
