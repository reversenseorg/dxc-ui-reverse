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
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    Input, OnChanges,
    OnInit,
    QueryList, SimpleChanges,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {Subject} from "rxjs";
import {IViewportContainer} from "../../base/viewport/IViewportContainer";
import {NativeController} from "./ctrl/NativeController";
import {NativeService} from "./ctrl/native.service";
import ModelFile from "../../models/ModelFile";
import ModelBasicBlock from "../../models/ModelBasicBlock";
import {Nullable} from "../../base/Nullable";
import {ContextMenuComponent, ContextMenuList, ContextMenuState} from "../../base/context-menu/context-menu.component";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {ModelFunction} from "../../models/ModelFunction";
import ModelCpuInstruction from "../../models/ModelCpuInstruction";

@Component({
  selector: 'dxs-disass-view',
  template: `
      <div class="container-fluid m-0 p-0" [ngStyle]="getStyle()">
              <ng-container *ngFor="let ins of blocks; let offset=index">

                  
                  <div *ngIf="ins.flags!=null && ins.flags.length>0" class="row no-gutters">
                      <div class="col-lg-10" [ngStyle]="{color: opstyle.flags.color}" style="font-family: 'Courier New', Courier, monospace;"><b>{{ ins.flags[0] }}</b></div>
                  </div>
                  <div class="row no-gutters dxc-disass-row"  (contextmenu)="displayCtxMenu($event,'inst',ins)" [ngClass]="getStyleForInstr(ins, offset)">
                      <div class="col-lg-2">
                          <span *ngIf="offset==12" class="badge badge-sm dxc-meta text-bg-success">TRACKED</span>&nbsp;
                      </div>
                      <div class="col-lg-2" style="color:darkgrey;font-family: 'Courier New', Courier, monospace">0x{{ ins.offset }}</div>
                      <div class="col-lg-2" style="color:yellow;font-family: 'Courier New', Courier, monospace">{{ ins.bytes }}</div>
                      <div class="col-lg-6" [ngStyle]="{ 'color': opstyle.color[ins.type] }" style="color:white;font-family: 'Courier New', Courier, monospace">
                          <b>{{ ins.opcode }}</b>
                      </div>
                  </div>
          </ng-container>

      </div>


      <app-context-menu [width]="200" [name]="'inst'">
          <app-context-item [label]="'Track context'" (click)="showDetail('fn', ctxMenuState.subject, 'di')"></app-context-item>
          <app-context-item [label]="'Track ...'" (click)="showDetail('fn', ctxMenuState.subject, 'di')"></app-context-item>
          <app-context-item [label]="'Hook'" [icon]="gIcons['GEN_HOOK']"  (click)="createInsnHook('fn', ctxMenuState.subject, 'xf')"></app-context-item>
          <app-context-item [label]="'Memory snapshot here'" (click)="showDetail('fn', ctxMenuState.subject, 'xf')"></app-context-item>
          <app-context-item [label]="'Xref to'"   (click)="showDetail('fn', ctxMenuState.subject, 'xt')"></app-context-item>
          <app-context-item [label]="'Patch'" [icon]="gIcons['HOOKS']"  (click)="patch( 'fn', ctxMenuState.subject)"></app-context-item>
          <app-context-item [label]="'Add bookmark'" [icon]="gIcons['BOOKMARK']"  (click)="addBookmark(ctxMenuState.subject)"></app-context-item>
          <app-context-item [label]="'Search syscalls'" [separator]="true"  (click)="addBookmark(ctxMenuState.subject)"></app-context-item>
          <app-context-item [label]="'Search ...'"   [icon]="gIcons['FIND']"  (click)="addBookmark(ctxMenuState.subject)"></app-context-item>
          <app-context-item [label]="'Start emulation here'"   [icon]="gIcons['FIND']"  (click)="addEmuPoint(ctxMenuState.subject,'start')"></app-context-item>
          <app-context-item [label]="'Stop emulation here'"   [icon]="gIcons['FIND']"  (click)="addEmuPoint(ctxMenuState.subject,'start')"></app-context-item>
          <!--<app-context-item [label]="'Show details'" [icon]="gIcons['FIND']"  (click)="showDetails(ctxMenuState.subject)"></app-context-item>-->
      </app-context-menu>
  `,
  styles: [`
  
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisassemblyViewComponent implements OnInit, OnChanges, AfterViewInit {


    @Input() blocks:ModelCpuInstruction[] = [];
    @Input() func:Nullable<ModelFunction> = null;
    @Input() funcUID:Nullable<string> = null;


    /**
     * The list of contextual menu declared
     *
     * @type {QueryList<ContextMenuComponent>}
     * @field
     */
    @ViewChildren(ContextMenuComponent) ctxMenuChildren: QueryList<ContextMenuComponent>;

    opstyle: any = {
        color: {
            cjmp: 'greenyellow',
            cmp: 'royalblue',
            store: 'deepskyblue',
            load: 'deepskyblue',
            mov: 'white',
            shl: 'orange',
            shr: 'orange',
            add: 'orange',
            call: 'greenyellow',
            ucall: 'greenyellow',
        },
        flags: {
            color: 'red'
        }
    };

    ctxMenu: Record<string,ContextMenuComponent> = {};
    ctxMenuState:ContextMenuState = { subject: null };


    readonly gIcons = GLOBAL_ICONS;
    private activeItem: any = -1;

    constructor(private nativeSvc: NativeService,
                private _chref: ChangeDetectorRef) {

    }

    ngOnChanges(pChanges: SimpleChanges): void {
        if(pChanges['funcUID'].currentValue!=null
            || pChanges['func'].currentValue!=null) {
            console.log("disass view : ngOnChanges : ", pChanges);
            this.refresh();
            return;
        }
    }

    ngOnInit() {
        //console.log("disass view : ngOnInit : ", this);
        //this.refresh();
    }

    ngAfterViewInit() {
        // init contextual menus
        this.ctxMenu = {};
        this.ctxMenuChildren.toArray().map( (vMenu:ContextMenuComponent) => {
            if(vMenu.name!=null){
                this.ctxMenu[vMenu.name] = vMenu;
            }
        });
    }

    refresh() {
        if(this.funcUID!=null){
            console.log("disass view : refresh : ", this.funcUID);
            this.nativeSvc.getFunction(this.funcUID).subscribe(res=>{
                this.func = res;
                this._chref.detectChanges();
            });

            this.nativeSvc.disass(this.funcUID).subscribe(res=>{
                console.log("disass view : refresh : done : ", res);
                this.blocks = res;
                this._chref.detectChanges();
            });
        }else if(this.func!=null){
            this.blocks = this.func.instr;
            this._chref.detectChanges();
        }
    }

    displayCtxMenu(pEvent:any, pType:string, pObject:any):void{

        let type:Nullable<string> = null;
        pEvent.preventDefault();

        if(pType.indexOf('inst')>-1){
            this.activeItem = pObject;
        }

        this.ctxMenuState = {
            menu: this.ctxMenu[pType],
            subject: pObject
        };
        this.ctxMenu[pType].show(pEvent, pObject);
    }

    getStyle() {
        return {
            backgroundColor:'#0c0c0c',
            height:'100%',
            overflow:'scroll',
        };
    }

    showDetail(fn: string, subject: any, di: string) {

    }

    createInsnHook(fn: string, subject: any, xf: string) {

    }

    addBookmark(subject: any) {

    }

    patch(fn: string, subject: any) {
        
    }

    addEmuPoint(subject: any, start: string) {
        
    }


    getStyleForInstr(ins: any, offset: number):string {
        if(this.activeItem !=null && ins.offset==this.activeItem.offset){
            return 'active-item';
        }else {
            return "";
        }
    }
}
