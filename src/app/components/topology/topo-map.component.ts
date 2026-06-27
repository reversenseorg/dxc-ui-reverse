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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import DexcaliburProject from "../../models/DexcaliburProject";
import {Nullable} from "../../base/Nullable";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {CODE_ICONS} from "../code/icons";
import {NodeInternalType} from "../../models/NodeInternalType";
import {TopologyService} from "./ctrl/topology.service";
import {CodeControllerService} from "../code/ctrl/code-controller.service";
import {OutputService} from "../output/ctrl/output.service";
import AndroidActivity from "../../models/android/AndroidActivity";
import AndroidProvider from "../../models/android/AndroidProvider";
import AndroidService from "../../models/android/AndroidService";
import AndroidReceiver from "../../models/android/AndroidReceiver";
import AndroidComponent from "../../models/android/AndroidComponent";
import {OperatingSystem} from "../../models/OperatingSystem";
import {TOPO_ICONS} from "./icons";
import {UIException} from "../../base/error/UIException";
import {ControllerService} from "../../controller.service";
import {OutputMessage} from "../../cmp/OutputMessage";
import {TopologyController} from "./ctrl/TopologyController";

let ctr = 0;



interface Column {
    id: string;
    label: string;
    cls: string;
}




@Component({
    selector: 'dxc-topo-map',
    template: `
        <div class="w-full row">
            <ng-container *ngFor="let item of data; let i = index">
                <div *ngIf="showInfo!=item.name; else infotpl" (click)="show(item)" [ngbTooltip]="getTooltip(item)" class="col-1 dxs-cmp" [ngStyle]="{backgroundColor:getBgColor(item)}" >
                    <fa-icon  *ngFor="let tag of item.tags"  [icon]="['fas','circle']" class="tag ms-1"></fa-icon>&nbsp;
                </div>
                <ng-template #infotpl>
                    <div class="col-6 dxs-cmp dxs-cmp-info" [ngStyle]="{backgroundColor:getBgColor(item)}" >
                        <div class="row">
                            <div class="col-8 cmp-type">{{getType(item)}}</div>
                            <div class="col-4 cmp-btn">
                                <button class="btn btn-inline btn-sm" (click)="open(item)">
                                    <dxc-icon [model]="icons['REFRESH']"></dxc-icon>Open
                                </button>
                            </div>
                        </div>
                        <div class="cmp-title">{{item.name}}</div>
                        <dxc-tag-badge *ngFor="let tag of item.tags" [tagUUID]="tag"></dxc-tag-badge>
                        
                    </div>
                </ng-template>
                
            </ng-container>
        </div>
    `,
    styles:[`

      div.cmp-btn > button {
        background-color: #333;
        border: 1px solid #777;
        color: #777;
      }
      .tag {
        color: #9ce118;
      }

      .dxs-cmp {
        border-radius: 0px;
        border: 1px solid #777;
        margin: 2px;

        &:hover {
          border: 1px solid #fff;
          cursor: pointer;
        }

        button {
          font-size: 0.8em;
        }
      }

      .cmp-title {
        word-break: break-word;
        font-size: 1em;
      }

      .cmp-type {
        font-size: 0.8em;
        text-decoration: underline;
      }

      .dxs-cmp-info {
        height: 6em;
      }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopologyMapComponent implements OnInit {

    @Input() controller:any;
    @Input() project?:Nullable<DexcaliburProject>;

    showInfo = false;
    data:any[] = [];


    cmps:Record<string, any> = {};


    protected readonly gIcons = GLOBAL_ICONS;
    protected readonly NODE_TYPES = NodeInternalType;
    protected readonly cIcons = TOPO_ICONS;

    constructor(
        private _ctrlSvc:ControllerService,
        private _outputSvc: OutputService,
        private topoSvc: TopologyService,
        private codeSvc: CodeControllerService,
        private changeRef:ChangeDetectorRef) {

    }

    ngOnInit() {
        this.refresh();
    }

    refreshAsAndroid() {

        this.data = [];

        this.cmps = {
            activity: [],
            receiver: [],
            provider: [],
            broadcast: [],
        };

        this.topoSvc
            .getActivities()
            .subscribe((pActs:AndroidActivity[]) => {
                if(pActs!=null){
                    pActs.map((vChild:any) => {
                        vChild.__ = NodeInternalType.ANDROID_ACTIVITY;
                        vChild._icon = this.cIcons['ACTIVITY'];
                    });
                }else{ pActs = []; }
                this.cmps.activity = pActs;
                this.data = this.data.concat(pActs);
                console.log(this.data);
                this.changeRef.detectChanges();
            });

        this.topoSvc
            .getProviders()
            .subscribe((pActs:AndroidProvider[]) => {
                if(pActs!=null){
                    pActs.map((vChild:any) => {
                        vChild.__ = NodeInternalType.ANDROID_PROVIDER;
                        vChild._icon = this.cIcons['PROVIDER'];
                    });
                }else{ pActs = []; }
                this.cmps.provider = pActs;
                this.data = this.data.concat(pActs);
                console.log(this.data);
                this.changeRef.detectChanges();
            });


        this.topoSvc
            .getServices()
            .subscribe((pActs:AndroidService[]) => {
                if(pActs!=null){
                    pActs.map((vChild:any) => {
                        vChild.__ = NodeInternalType.ANDROID_SERVICE;
                        vChild._icon = this.cIcons['SERVICE'];
                    });
                }else{ pActs = []; }
                this.cmps.service = pActs;
                this.data = this.data.concat(pActs);
                console.log(this.data);
                this.changeRef.detectChanges();
            });


        this.topoSvc
            .getReceivers()
            .subscribe((pActs:AndroidReceiver[]) => {
                if(pActs!=null){
                    pActs.map((vChild:any) => {
                        vChild.__ = NodeInternalType.ANDROID_RECEIVER;
                        vChild._icon = this.cIcons['RECEIVER'];
                    });
                }else{ pActs = []; }
                this.cmps.receiver = pActs;
                this.data = this.data.concat(pActs);
                console.log(this.data);
                this.changeRef.detectChanges();
            });
    }

    refresh(pResetUI  = false) {



        if(this.project==null) return;

        switch (this.project.os){
            case OperatingSystem.ANDROID:
                this.refreshAsAndroid();
                break;
        }


    }



    open(pItem: any):any /*Observable<boolean>*/ {

        const ctrl = this._ctrlSvc.getController<TopologyController>('topo');

        if(ctrl==null){
            this._outputSvc.print(OutputMessage.newError({ msg:"Cannot open the component. Cause : UiException" }));
            return;
        }

        switch (pItem.__){
            case NodeInternalType.ANDROID_SERVICE:
            case NodeInternalType.ANDROID_RECEIVER:
            case NodeInternalType.ANDROID_ACTIVITY:
            case NodeInternalType.ANDROID_PROVIDER:
                ctrl.open(pItem, 'project-dashboard');
                break;
        }
    }

    getBgColor(item: any):string {
        switch (item.__){
            case NodeInternalType.ANDROID_ACTIVITY:
                return "#9b9bec60";
            case NodeInternalType.ANDROID_PROVIDER:
                return "#baf4ba60";
            case NodeInternalType.ANDROID_SERVICE:
                return "#fbd5d560";
            case NodeInternalType.ANDROID_RECEIVER:
                return "#ffffc560";
            default:
                return "#33333360"
        }

    }


    getTooltip(item: any):string {
        return item.name;
    }


    getType(item: any):string {
        switch (item.__){
            case NodeInternalType.ANDROID_ACTIVITY:
                return "Activity";
            case NodeInternalType.ANDROID_PROVIDER:
                return "Provider";
            case NodeInternalType.ANDROID_SERVICE:
                return "Service";
            case NodeInternalType.ANDROID_RECEIVER:
                return "Receiver";
            default: return "";
        }
    }

    show(item: any):void {
        this.showInfo = item.name;
    }
    protected readonly icons = GLOBAL_ICONS;
}
