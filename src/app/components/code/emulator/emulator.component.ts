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
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {Nullable} from "../../../base/Nullable";
import {OutputService} from "../../output/ctrl/output.service";
import {CodeControllerService} from "../ctrl/code-controller.service";
import ModelMethod from "../../../models/ModelMethod";
import {ModelFunction} from "../../../models/ModelFunction";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {from, Observable} from "rxjs";
import * as ace from "ace-builds";
import {IconModel} from "../../../base/icon/IconModel";
import {CodeSymbolTableComponent} from "./symbol-table.component";
import DDVM_SymbolTable from "../../../models/vm/DDVM_SymbolTable";
import {CodeEmuLoggerComponent} from "./emu-logs.component";

let ctr = 0;



interface Column {
    id: string;
    label: string;
    cls: string;
}


interface DxcVM_Result {
    events: any[],
    instr: string[],
    tags: string[],
    error: Nullable<string>
}

interface DDVM_Configuration extends Record<string, DDVM_Option>{
    context:DDVM_Option;
    options:DDVM_Option;
    args:DDVM_Option;
}

interface DDVM_Option {
    _t?: string,
    _c?: string,
    _i?: IconModel,
    /**
     * Field type
     */
    ft?: any,
    /**
     * Default value / initial value
     */
    v?:any,
    val?:any,
    pos?:number,
    label?: string,
    arg?:any;
    children?: DDVM_Option[],
    inputName?:string;
    /**
     * Is the value symbolic or concrete
     */
    sym?:boolean;
}

// (contextmenu)="openVmMenu($event)"

@Component({
    selector: 'dxc-code-emulator',
    template: `
        <div #vm class="row view-outer g-0" (contextmenu)="openVmMenu($event)" [ngStyle]="{height: '100%' }">
            <div class="col-lg-8">
                <ace-editor #vmEditor theme="monokai" [ngStyle]="{'height':'100%'}" style="overflow: auto;z-index:0; height:100%"></ace-editor>
            </div>
            <div class="col-lg-4" style="overflow-y: scroll">
                <app-subnavbar [type]="'navbar'" [inlineStyle]="{ 'background-color': '#333'}" [parent]="this">
                    <ng-container main>
                        <app-subnavbar-btn [active]="optTab=='args'" [icon]="gIcons['INTERNAL']" (click)="optTab='args'">&nbsp;Arguments</app-subnavbar-btn>
                        <app-subnavbar-btn [active]="optTab=='ctx'"[icon]="gIcons['INTERNAL']" (click)="optTab='ctx'">&nbsp;Options</app-subnavbar-btn>
                        <app-subnavbar-btn [icon]="gIcons['PLAY']" (click)="ddvmExec()">&nbsp;Run</app-subnavbar-btn>
                    </ng-container>
                </app-subnavbar>
                <div class="param-section w-full p-0">
                    <ng-container *ngIf="optTab=='args'">
                        <table class="w-full h-full dxc-text-std dxc-table">
                            <thead>
                                <th style="width: 10%">
                                    <div class="w-full border-1 pl-2">#</div>
                                </th>
                                <th style="width: 40%">
                                    <div class="w-full border-1 pl-2">Arg</div>
                                </th>
                                <th style="width: 50%">
                                    <div class="w-full border-1 pl-2">Value</div></th>
                            </thead>
                            <tbody>
                            <ng-container *ngIf="ddvmOpts.args.children!=null && ddvmOpts.args.children.length>0; else noArgs">
                                <tr *ngFor="let itemObj of ddvmOpts.args.children">
                                    <td class="text-center"><i class="dxc-text-clear100">{{ itemObj.pos }}</i></td>
                                    <td><i class="dxc-text-clear100">{{ itemObj.label }}</i></td>
                                    <td>
                                        <input [(ngModel)]="itemObj.sym" type="checkbox" class="dxc-fr dxc-frm-input ml-2 mr-1" /><i>Symbolic</i>
                                        <input [(ngModel)]="itemObj.val" [class.dxc-hidden]="itemObj.sym" [disabled]="itemObj.sym==true" name="input" type="text" class="dxc-frm-input pl-1 ml-2"/>
                                    </td>
                                </tr>
                            </ng-container>
                            <ng-template #noArgs>
                                <tr>
                                    <td colspan="2" class="text-center p-2">This function has not arguments</td>
                                </tr>
                            </ng-template>
                            </tbody>
                        </table>
                    </ng-container>
                    <ng-container *ngIf="optTab=='ctx'">
                        <h5 class="title m-1">Context</h5>
                        <div class="row param m-1" *ngFor="let itemObj of ddvmOpts.context.children">
                            <ng-container *ngIf="itemObj.ft=='c'; else noCheckbox">
                                <div class="col-2" >
                                    <dxc-icon  *ngIf="itemObj._i" [model]="itemObj._i"></dxc-icon>
                                    <input *ngIf="itemObj.ft=='c'" [(ngModel)]="itemObj.v" type="checkbox" class="dxc-frm-input mt-1 mr-2"/>
                                </div>
                                <div class="col-10">
                                    {{ itemObj.label }}
                                </div>
                            </ng-container>
                            <ng-template #noCheckbox>
                                <div class="col-6">
                                    {{ itemObj.label }}
                                </div>
                                <div class="col-6">
                                    <input *ngIf="itemObj.ft=='n'" [(ngModel)]="itemObj.v" type="number" class="dxc-frm-input"/>
                                    <input *ngIf="itemObj.ft=='i'" [(ngModel)]="itemObj.v" type="text" class="dxc-frm-input"/>
                                </div>
                            </ng-template>
                            </div>
                        <h5 class="title m-1">Extra options</h5>
                        <div class="row param m-1" *ngFor="let itemObj of ddvmOpts.options.children">
                            <ng-container *ngIf="itemObj.ft=='c'; else noCheckbox">
                                <div class="col-2" >
                                    <dxc-icon  *ngIf="itemObj._i" [model]="itemObj._i"></dxc-icon>
                                    <input *ngIf="itemObj.ft=='c'" [(ngModel)]="itemObj.v" type="checkbox" class="dxc-frm-input mt-1 mr-2"/>
                                </div>
                                <div class="col-10">
                                    {{ itemObj.label }}
                                </div>
                            </ng-container>
                            <ng-template #noCheckbox>
                                <div class="col-6">
                                    {{ itemObj.label }}
                                </div>
                                <div class="col-6">
                                    <input *ngIf="itemObj.ft=='n'" [(ngModel)]="itemObj.v" type="number" class="dxc-frm-input"/>
                                    <input *ngIf="itemObj.ft=='i'" [(ngModel)]="itemObj.v" type="text" class="dxc-frm-input"/>
                                </div>
                            </ng-template>
                        </div>
                    </ng-container>
                </div>
                <!--<span *ngIf="itemObj._t=='c'" class="border-bottom-1 border-white">
                  <dxc-icon  *ngIf="itemObj._icon" [model]="itemObj._i"></dxc-icon>
                  <span class="dxc-text-clear100">{{ itemObj.label }}</span>
                    
                  <span *ngIf="itemObj._c=='p' && node?.__==NodeInternalType.METHOD" class="badge rounded-pill  badge-sm ml-2" [ngClass]="{ 'text-bg-secondary':node.args.length==0, 'text-bg-success':node.args.length>0 }">{{ node.args.length }}</span>
                </span>-->
            </div>
        </div>
    `,
    styleUrls:['../viewport-code/viewport-code.component.scss','../../../forms.scss'],
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEmulatorComponent implements OnInit, AfterViewInit {

    @Input() height: number = 200;
    @ViewChild('vmEditor') vmEditor:any;
    @ViewChild('vm',{ read:ElementRef, static:false}) vmEl:ElementRef;
    @Input() navbar = false;
    @Input() headerCols:string[] = [];

    @Input() node: ModelMethod|ModelFunction;
    @Output() vmLogs: EventEmitter<any> = new EventEmitter<any>();

    @Input() parentLayout:any = null;


    optTab = 'args'

    vmedHeight: number = 200;

    vm:DxcVM_Result = {
        events: [],
        instr: [],
        tags: [],
        error: null
    };

    sym:DDVM_SymbolTable;

    /*
        loadClassFirst:boolean =  false;
        mockAndroidInternals:boolean = false;
        autoInstanceArgs:boolean = false;
        simplify:number = 0;
        initParent:boolean = true;
        maxdepth:number = -1;
         */

    /**
     *
     * loadClassFirst:boolean =  false;
     *         mockAndroidInternals:boolean = false;
     *         autoInstanceArgs:boolean = false;
     *         simplify:number = 0;
     *         initParent:boolean = true;
     *         maxdepth:number = -1;
     *
     * ft : Field Type
     * fi : Field Input
     * _t : type
     * _c : Child type
     * _i : Icon Model
     */
    ddvmOpts: DDVM_Configuration = {
        args: {
            _t: 'c',
            _c: 'p',
            _i: GLOBAL_ICONS['EDIT'],
            label: 'Parameters',
            children: []
        },
        context:{
            _t: 'c',
            _c: 's',
            _i: GLOBAL_ICONS['INTERNAL'],
            label: 'Context',
            children: [{
                _t: 'o',
                label: 'Load parent class',
                ft: 'c',
                v: false,
                inputName: 'clinit'
            }]
        },
        options:{

            _t: 'c',
            _c: 'o',
            _i: GLOBAL_ICONS['LIST'],
            label: 'Options',
            children: [{
                _t: 'o',
                label: 'Call stack limit (infinite=-1)',
                ft: 'n',
                v: 0,
                inputName: 'depth'
            },{
                _t: 'o',
                label: 'Simplify level (0=basic)',
                ft: 'n',
                v: 0,
                inputName: 'level'
            }]
    }};

    private _vmLog:any[] = [];

    private _symTabs:CodeSymbolTableComponent[] = [];
    private _loggers:CodeEmuLoggerComponent[] = [];

    constructor(
        private _outputSvc: OutputService,
        private codeSvc: CodeControllerService,
        private changeRef:ChangeDetectorRef) {

    }

    ngOnInit() {

    }


    ngAfterViewInit() {

        let vmEditor:any = this.vmEditor.getEditor();

        ace.config.set('basePath','assets/ace');

        // vm editor
        vmEditor.setOptions({
            showLineNumbers: true,
            tabSize: 2
        });

        this.vmedHeight = this.height; //this.height; //vSizes.bottom.height-this.topNavEl.nativeElement.offsetHeight;

        //vmEditor.container.style.height = this.vmedHeight+'px';
        vmEditor.container.style.minHeight = this.vmedHeight+'px';
        //vmEditor.container.style.maxHeight = this.vmedHeight+'px';

        this.vmEditor.mode = 'javascript';
        this.vmEditor.value = "Ready for emulation";

        vmEditor.resize();

        this.showDxcVM();
    }


    protected readonly gIcons = GLOBAL_ICONS;

    ddvmItemHasChildren(pItem:any):boolean {
        return (pItem.hasOwnProperty('children')
            && Array.isArray(pItem.children));
    }


    itemHasChildren(pItem: any, pType: string): boolean {
        return this.ddvmItemHasChildren(pItem);
    }

    open(pItem: any): Observable<any> {
        return from([]);
    }

    prepareDDVMOptions():any {
        let ops:any = {

        };

        if(this.ddvmOpts.context.children!=null){
            this.ddvmOpts.context.children.map((vPar:any) => {
                ops[vPar.inputName] = vPar.v;
            });
        }

        if(this.ddvmOpts.options.children!=null){
            this.ddvmOpts.options.children.map((vPar:any) => {
                ops[vPar.inputName] = vPar.v;
            });
        }


        ops.params = [];
        if(this.ddvmOpts.args.children!=null){
            this.ddvmOpts.args.children.map((vPar:any) => {
                console.log(vPar);

                ops.params.push({
                    notset: vPar.sym,
                    val: (vPar.sym? null : vPar.val)
                });
            });
        }


        console.log("DDVM options : ",ops);

        return ops;
    }


    showDxcVM() {

        if(((this.node as any).hasOwnProperty('__vm_code'))){
            this.vmEditor.mode = 'javascript';
            this.vmEditor.value = (this.node as any).__vm_code; //this.data.__view_code;
            this.vmEditor.getEditor().resize();
        }


        if(this.ddvmOpts.args.children !=null){
            if(this.ddvmOpts.args.children.length==0){

                if(this.node.args.length>0){
                    this.node.args.map((vArg:any, vOffset:number) => {
                        console.log(vArg,this.ddvmOpts.args);
                        this.ddvmOpts.args?.children?.push({
                            _t: 'p',
                            label: vArg.name,
                            pos: vOffset,
                            arg: vArg,
                            val: '',
                            ft: 'i',
                            sym: true
                        });
                    })
                }
            }
        }

    }

    ddvmExec() {
        this.codeSvc.ddvm_execMethod( this.node as ModelMethod, this.prepareDDVMOptions()).subscribe( vRes => {
            console.log('VM exec : ', vRes);

            this.vm = vRes;
            this._vmLog = [];

            if(vRes.success){
                if(vRes.data.instr.length>0){
                    if(vRes.data.instr[0].indexOf('// An ')==0){
                        (this.node as any).__vm_code = vRes.data.instr[0]+" See VM logs."
                        this._vmLog.push({
                            t:"e", v:vRes.data.instr[1]
                        });
                    }else{
                        (this.node as any).__vm_code = vRes.data.instr.join(`\n`);
                        this._vmLog.push({
                            t:"i", v:"Execution done successfully"
                        });
                    }

                    this.vmEditor.value = (this.node as any).__vm_code;
                }

                if(vRes.data.events.length>0 ){
                    this._vmLog = this._vmLog.concat(vRes.data.events);
                }

                if(this._vmLog.length>0){ this.refreshLogs(); }

                //this.showDxcVM();
                //this.vmLogs.emit(this._vmLog);
            }else{
                this._vmLog = [{ t:"e", v:"DDVM crashed" }];
                this.refreshLogs();
            }

        });
    }


    ddvmOnItemFocus($event: any) {

    }

    openVmMenu($event: MouseEvent) {

    }


    expand( pItem:any, pType:string): Observable<any> {
        let data:any = null;

        switch (pItem._t){
            case "c":
                console.log("expand params",pItem)
                break;
            case "p":
                break;
            case "c":
                break;
        }

        return from( [data]);
    }

    itemGetChildren( pItem:any):any{
        return pItem.children;
    }

    protected readonly NodeInternalType = NodeInternalType;

    addSymbolTableView( pSymtabCmp:CodeSymbolTableComponent):void {
        this._symTabs.push(pSymtabCmp);
    }

    addLogOutput(pLoggerCmp:CodeEmuLoggerComponent):void {
        this._loggers.push(pLoggerCmp);
    }

    nextStep() {
        this._symTabs.map(s => {
            s.update(this.sym);
        })
    }

    refreshLogs():void {
        this._loggers.map( vLogger => {
            vLogger.update(this._vmLog);
        })
    }

    resume(){

    }



}
