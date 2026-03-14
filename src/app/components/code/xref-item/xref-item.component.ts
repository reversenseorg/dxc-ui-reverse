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
import {IconModel, IconModelCollection} from "../../../base/icon/IconModel";
import {CODE_ICONS} from "../icons";
import ModelCall from "../../../models/ModelCall";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxs-xref-item',
    template: `
    <div class="row g-0">
        <div  *ngIf="item.tags!=null && item.tags.length>0" class="col-lg-1">
            <ng-container [ngSwitch]="item.instr">
                <span *ngSwitchCase="'GETTER'" class="badge padge-pill text-bg-success">GET</span>
                <span *ngSwitchCase="'SETTER'" class="badge padge-pill text-bg-success">SET</span>
                <span *ngSwitchCase="'INVOKE'" class="badge padge-pill text-bg-danger">CALL</span>
                <span *ngSwitchCase="'CLASS_CHECK'" class="badge padge-pill text-bg-success">TYPE CHECK</span>
                <span *ngSwitchDefault class="badge padge-pill">{{ item.instr }}</span>
            </ng-container>
        </div>
        <div [ngClass]="'col-lg-'+((item.tags!=null&& item.tags.length>0)?'9':'11')">
            <dxc-hook-status *ngIf="hookstatus" [ref]="getNode()"></dxc-hook-status>
            <dxc-icon [model]="xrefIcon"></dxc-icon>
            <dxc-node-token [interactive]="true" [cache]="true" [ref]="getNode()"></dxc-node-token>
        </div>
        <div  *ngIf="item.tags!=null && item.tags.length>0" class="col-lg-2">
            <ng-container *ngFor="let t of item.tags">
                <dxc-tag-badge [editable]="true" [tagUUID]="t"></dxc-tag-badge>
            </ng-container>
        </div>
    </div>
    `,
    styles:[`
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
    `]
})
export class XrefItemComponent implements OnInit, AfterViewInit {

    @Input() item:ModelCall; //ModelMethod|ModelClass|ModelField;
    @Input() hookstatus = false;
    @Input() type:"to"|"from";


    xrefIcon:IconModel = CODE_ICONS.XREF_FROM;


    selected:Nullable<Tag> = null;

    canDrop = false;

     icons:IconModelCollection = CODE_ICONS;
     gIcons:IconModelCollection = GLOBAL_ICONS;

    constructor(

        private changeRef:ChangeDetectorRef) {

    }

    ngAfterViewInit() {
        this.xrefIcon = (this.type=="to")? CODE_ICONS.XREF_TO : CODE_ICONS.XREF_FROM;
    }

    ngOnInit() {

    }

    getNode():any {
        console.log("xref getNode > ",this.item, " type : ", (this.type=="to" ? this.item._caller : this.item._called),this);
        return (this.type=="to" ? this.item._caller : this.item._called);
    }

}
