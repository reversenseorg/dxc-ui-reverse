import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {NgbTooltip, NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {IconComponent} from "../../base/icon/icon.component";
import ModelMethod from "../../models/ModelMethod";
import {ModelFunction} from "../../models/ModelFunction";
import {Nullable} from "../../base/Nullable";
import {INodeRef} from "../../base/common/common";
import {AbstractHook} from "../../models/AbstractHook";
import {IconModel} from "../../base/icon/IconModel";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {HookService} from "../hooks/ctrl/hook.service";
import {HOOK_ICONS} from "../hooks/icons";
import {NodeInternalType} from "../../models/NodeInternalType";
import {CodeModule} from "../code/code.module";
import {KeyValuePipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {MetaComponent} from "../../base/meta/meta.component";
import {PreviewerComponent} from "../../base/previewer/previewer.component";
import {CODE_ICONS} from "../code/icons";
import {RuntimeEvent} from "../../models/hook/RuntimeEvent";
import {CodeControllerService} from "../code/ctrl/code-controller.service";
import {IStringIndex} from "../../base/IStringIndex";
import {UIException} from "../../base/error/UIException";


@Component({
    selector: 'dxc-rtevt',
    template: `
        <div class="col-lg-1 col-msg">
            <ng-container *ngIf="msg.rt_type" [ngSwitch]="msg.rt_type" >
                <ng-container *ngSwitchCase="'h'">
                    <dxc-meta [label]="'HOOK'" [ngClass]="'dxc-yellow dxc-text-black'"></dxc-meta>
                </ng-container>
                <ng-container *ngSwitchCase="'he'">
                    <dxc-meta [label]="'ERROR'" [ngClass]="'dxc-salmon'"></dxc-meta>
                </ng-container>
                <ng-container *ngSwitchDefault>
                    <dxc-meta [label]="'HOOK'" [ngClass]="'dxc-yellow dxc-text-black'"></dxc-meta>
                </ng-container>
            </ng-container>

            <dxc-meta *ngIf="!msg.rt_type" [label]="'HOOK'" [ngClass]="'dxc-yellow dxc-text-black'"></dxc-meta>


        </div>
        <div class="col-lg-1 col-msg">
            <dxc-meta *ngIf="msg.data.when==-1" [label]="getPosition(msg)" [ngClass]="getPositionStyle(msg)"></dxc-meta>
            <!--<ng-container *ngFor="let t of msg.tags">
              <dxc-meta [label]="t.text" [style]="{'backgroundColor':t.style,'font-size':'12px'}"></dxc-meta>
            </ng-container>-->
            <!--<span *ngFor="let t of msg.tags" class="badge rounded-pill " [ngStyle]="{'backgroundColor':t.style}">{{ t.text }}</span>-->
        </div>
        <div class="col-lg-3 col-msg">
            <ng-container *ngFor="let n of msg.node">
                <dxc-node-token [ref]="n" [cache]="true"></dxc-node-token>
                <!--<ng-container *ngIf="n.__==NODE_TYPE.METHOD">
    
                  <dxc-icon [model]="cIcons['CLASS']"></dxc-icon>&nbsp;<span (click)="open(n, NODE_TYPE.CLASS, 'enclosingClass')" class="actionable">{{ getProperty(n,'enclosingClass') }}</span>
                  .
                  <dxc-icon [model]="cIcons['METH']"></dxc-icon>&nbsp;<span (click)="open(n,NODE_TYPE.METHOD)" class="actionable">{{ getProperty(n,'name') }}</span>(...)
                </ng-container>-->
            </ng-container>
        </div>
        <div class="col-lg-1 col-msg">
            <ng-container *ngIf="msg.interceptors">
                <code class="dxc-text-yellow" *ngFor="let t of msg.interceptors">{{ t }}</code><br>
            </ng-container>
        </div>
        <div class="col-lg-6 ppt">
            <ng-container *ngIf="msg.isHookMessage()">
                <ng-container *ngFor="let d of msg.getHookMessageData() | keyvalue">

                    <!--<ng-container *ngIf="msg.isRootDetectionData(d.value)">
                      <dxc-icon [model]="gIcons['WARNING']"></dxc-icon>&nbsp;
                      <span class="text-warning">Root detection</span>
                    </ng-container>-->

                    <ng-container [ngSwitch]="getProperty(d.value,'__')">
                        <ng-container *ngSwitchCase="NODE_TYPE.CLASS">
                            <dxc-icon [model]="cIcons['CLASS']"></dxc-icon>&nbsp;<span (click)="open(d.value,NODE_TYPE.CLASS)" class="actionable">{{ getProperty(d.value,'fqcn') }}</span>
                        </ng-container>
                        <ng-container *ngSwitchCase="NODE_TYPE.METHOD">
                            <dxc-icon [model]="cIcons['METH']"></dxc-icon>&nbsp;
                            <span (click)="open(d,NODE_TYPE.METHOD)" class="actionable">{{ d.value!=null ? d.value : "null" }}</span>
                        </ng-container>
                        <ng-container *ngSwitchCase="NODE_TYPE.FILE">
                            <dxc-icon [model]="cIcons['FILE']"></dxc-icon>&nbsp;<span (click)="open(d,NODE_TYPE.FILE)" class="actionable">{{ d.value.path }}</span>
                        </ng-container>
                        <ng-container *ngSwitchDefault>
                            <div *ngIf="d.key[0]!='_'">
                                <span>{{ d.key }}</span>&nbsp;:&nbsp;<span>{{ d.value!=null ? d.value : "null" }}</span>
                            </div>
                            <div *ngIf="d.key=='__class__'">
                                <dxc-icon [model]="cIcons['CLASS']"></dxc-icon>&nbsp;<span (click)="open(d,NODE_TYPE.CLASS)" class="actionable">{{ d.value }}</span>
                            </div>
                            <div *ngIf="d.key=='__meth__'">
                                <dxc-icon [model]="cIcons['METH']"></dxc-icon>&nbsp;<span (click)="open(d,NODE_TYPE.METHOD)" class="actionable">{{ d.value }}</span>
                            </div>
                            <div *ngIf="d.key=='__msg__'">
                                {{ d.value }}
                            </div>
                            <div *ngIf="d.key=='__trace__'">
                                <span (click)="openTrace(msg,d.value)" class="actionable"><dxc-icon [model]="cIcons['TRACE']"></dxc-icon>Trace</span>
                            </div>
                            <div *ngIf="d.key=='str'">
                                <dxc-preview [length]="120" [data]="d.value"></dxc-preview>
                            </div>
                        </ng-container>

                    </ng-container>

                </ng-container>
            </ng-container>

        </div>
        
    `,
    styleUrls: ['../explorer-hooks/explorer-hooks.component.scss'],
    providers: [NgbTooltipConfig],
    standalone: true,
    imports: [
        IconComponent,
        CodeModule,
        KeyValuePipe,
        MetaComponent,
        NgForOf,
        NgIf,
        NgSwitchCase,
        PreviewerComponent,
        NgClass,
        NgSwitch
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RuntimeEventComponent implements OnInit {


    @Input() msg:RuntimeEvent<any>;

    icon:IconModel = GLOBAL_ICONS.SPINNER;
    controller:any;

    constructor(
        private hookSvc: HookService,
        private codeSvc: CodeControllerService,
        private changeRef:ChangeDetectorRef) {

        this.controller = this.codeSvc.getController();
    }


    ngOnInit() {
    }

    /**
     * To display stack trace of the method hooked
     *
     * @param pMsg
     * @param pTrace
     */
    openTrace(pMsg: RuntimeEvent<any>, pTrace: IStringIndex<any>[]) {

    }


    open(pObj: any, pNodeType:number, pSubPpt:Nullable<string>=null) {
        if(this.controller.app==null){
            throw  UIException.APP_NOT_INITIALIZED();
        }

        let d = pObj;
        if(pSubPpt!=null){
            d = pObj[pSubPpt];
        }

        console.log("[HOOK MESSAGE] open ",d,pNodeType);
        switch(pNodeType){
            case NodeInternalType.METHOD:
                this.controller.app.getController('ctrl:code-main').open(d);
                break;
            case NodeInternalType.CLASS:
                this.controller.app.getController('ctrl:code-main').open(d);
                break;
            case NodeInternalType.FIELD:
                this.controller.app.getController('ctrl:code-main').open(d);
                break;
        }
    }


    protected readonly NODE_TYPE = NodeInternalType;
    protected readonly cIcons = CODE_ICONS;


    getPosition(msg: RuntimeEvent<any>):string {
        switch (msg.data.when) {
            case 1: return 'after';
            case 0: return 'replace';
            case -1: return 'before';
        }
        return '-';
    }

    getPositionStyle(msg: RuntimeEvent<any>):string {
        switch (msg.data.when) {
            case 1: return 'dxc-pink';
            case 0: return 'dxc-azur  dxc-text-black';
            case -1: return 'text-info';
        }
        return '';
    }

    getProperty( d:any, pSubPpt:string ):string {
        if(d==null){
            return "";
        }else{
            return (d as IStringIndex<any>)[pSubPpt] as string;
        }
    }
}
