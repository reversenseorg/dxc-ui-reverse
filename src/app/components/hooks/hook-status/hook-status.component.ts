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
import {OutputService} from "../../output/ctrl/output.service";
import ModelMethod from "../../../models/ModelMethod";
import {HOOK_ICONS} from "../icons";
import {NgbTooltip, NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {ModelFunction} from "../../../models/ModelFunction";
import {AbstractHook} from "../../../models/AbstractHook";
import {HookService} from "../ctrl/hook.service";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import {IconModel} from "../../../base/icon/IconModel";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {IconComponent} from "../../../base/icon/icon.component";
import {Nullable} from "../../../base/Nullable";
import {INodeRef} from "../../../base/common/common";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxc-hook-status',
    template: `
        <dxc-icon [ngbTooltip]="getTooltip()" [model]="icon" (click)="changeStatus()"></dxc-icon>
    `,
    styleUrls: ['../explorer-hooks/explorer-hooks.component.scss'],
    providers: [NgbTooltipConfig],
    standalone: true,
    imports: [
        IconComponent,
        NgbTooltip
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HookStatusComponent implements OnInit {


    @Input() item:ModelMethod|ModelFunction;
    @Input() ref:Nullable<INodeRef> = null;
    @Input() hook:AbstractHook;

    icon:IconModel = GLOBAL_ICONS.SPINNER;

    constructor(
        private hookSvc: HookService,
        private changeRef:ChangeDetectorRef) {

        this.hookSvc.onHookEdit.subscribe((pHookEvent)=>{

            if(this.hook!=null && this.hook.id==pHookEvent.hookID){

                if(pHookEvent.hook!=null){
                    this.hook = pHookEvent.hook;
                    this.refreshHook();
                }

            }
        })
    }

    refreshHookStatus():void {
        console.log("refreshHookStatus > ",this.hook, this.hook.isEnable())
        this.icon = this.hook.isEnable()? HOOK_ICONS.UP : HOOK_ICONS.DOWN;
        this.changeRef.detectChanges();
    }

    refreshHook(){
        if(this.hook != null){
            this.refreshHookStatus();
        }else if(this.item != null || this.ref != null){
            let hks:any;
            if(this.item!=null)
                hks = this.hookSvc.getHooksFor(this.item);
            else
                hks = this.hookSvc.getHooksForRef(this.ref as INodeRef);


            hks.subscribe((vHook:any)=>{

                if(vHook.length==0){
                    this.icon = HOOK_ICONS.NOT_HOOKED;
                    this.changeRef.detectChanges();
                }else{

                    const h:AbstractHook[] = [];
                    vHook.map( (vRaw:any)=>{
                        const o:any = new AbstractHook(vRaw);

                        o._t = "h";
                        if(o.__==NodeInternalType.HOOK_NATIVE){
                            o.symbol = o.func.substr(o.func.lastIndexOf(':')+1);
                        }
                        h.push( o as AbstractHook);
                    });

                    this.hook = h[0];
                    this.refreshHook();
                }

            });
        }else{
            this.icon = HOOK_ICONS.UNKNOWN_HOOK_STATE;
            this.changeRef.detectChanges();
        }
    }

    ngOnInit() {
        this.refreshHook();
    }


    /**
     * To get tooltip text from hook status
     *
     * @return {string}
     * @method
     */
    getTooltip(){
        if(this.hook==null) return "";

        if(this.hook.isEnable()){
            return "Click to disable";
        }else{
            return "Click to enable";
        }
    }

    changeStatus():void {
        if(this.hook != null){
            this.hookSvc.enableHook(this.hook, this.hook.isEnable()?false:true)
                .subscribe(()=>{
                    // nothing to do
                });
        }else{
            // generate hook
        }
    }
}
