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


// (contextmenu)="openVmMenu($event)"

@Component({
    selector: 'dxc-code-emulator',
    template: `
        <div #vm class="row view-outer g-0" (contextmenu)="openVmMenu($event)" [ngStyle]="{height:vmedHeight+'px'}">
            <div class="col-lg-8">
                <ace-editor #vmEditor theme="monokai" style="overflow: auto;z-index:0;"></ace-editor>
            </div>
            <div class="col-lg-4" style="overflow-y: scroll">
                <app-subnavbar [type]="'navbar'" [inlineStyle]="{ 'background-color': '#333'}" [parent]="this">
                    <ng-container main>
                        <app-subnavbar-btn [active]="true" [icon]="gIcons['INTERNAL']">&nbsp;Configuration</app-subnavbar-btn>
                        <app-subnavbar-btn [icon]="gIcons['PLAY']" (click)="ddvmExec()">&nbsp;Run</app-subnavbar-btn>
                    </ng-container>
                </app-subnavbar>

                <app-expandable-list
                        *ngIf="ddvmOpts">

                    <ng-template #expCodeItem let-itemObj="item" >

                <span *ngIf="itemObj._t=='c'" class="border-bottom-1 border-white">
                  <dxc-icon  *ngIf="itemObj._icon" [model]="itemObj._i"></dxc-icon>
                  <span class="dxc-text-clear100">{{ itemObj.label }}</span>
                    
                  <span *ngIf="itemObj._c=='p' && node?.__==NodeInternalType.METHOD" class="badge rounded-pill  badge-sm ml-2" [ngClass]="{ 'text-bg-secondary':node.args.length==0, 'text-bg-success':node.args.length>0 }">{{ node.args.length }}</span>
                </span>

                        <span *ngIf="itemObj._t=='p'">
                  <b class="dxc-text-clear100">{{ itemObj.label }}</b>
                  <input [(ngModel)]="itemObj.sym" type="checkbox" class="dxc-fr dxc-frm-input ml-2 mr-1" />symbolic&nbsp;
                  <input [(ngModel)]="itemObj.val" [class.dxc-hidden]="itemObj.sym" [disabled]="itemObj.sym" name="input" type="text" class="dxc-frm-input pl-1 ml-2"/>
                </span>

                        <span *ngIf="itemObj._t=='o'">
                  <dxc-icon  *ngIf="itemObj._icon" [model]="itemObj._i"></dxc-icon>
                  <input *ngIf="itemObj.ft=='c'" [(ngModel)]="itemObj.v" type="checkbox" class="dxc-frm-input mt-1 mr-2"/>
                  <span class="dxc-text-clear100">{{ itemObj.label }}</span>
                  <ng-container *ngIf="itemObj.ft!='c'">
                    <br>
                    <span class="pl-2">
                    <input *ngIf="itemObj.ft=='n'" [(ngModel)]="itemObj.v" type="number" class="dxc-frm-input"/>
                    <input *ngIf="itemObj.ft=='i'" [(ngModel)]="itemObj.v" type="text" class="dxc-frm-input"/>
                  </span>
                  </ng-container>

                </span>

                        <span *ngIf="itemObj._t=='e'">
                  <dxc-icon *ngIf="itemObj._icon" [model]="itemObj._i"></dxc-icon>
                  <span class="dxc-text-clear100">{{ itemObj.label }}</span>
                </span>

                    </ng-template>

                    <ng-container *ngFor="let dev of ddvmOpts">


                        <app-expandable-item
                                [itemTpl]="expCodeItem"
                                [item]="dev"
                                [provider]="this"
                                [itemType]="dev._t"
                                [expandableFn]="ddvmItemHasChildren"
                                (itemFocus)="ddvmOnItemFocus($event)"
                        >

                        </app-expandable-item>
                    </ng-container>
                </app-expandable-list>

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


    vmedHeight: number = 200;

    vm:DxcVM_Result = {
        events: [],
        instr: [],
        tags: [],
        error: null
    };


    /**
     * ft : Field Type
     * fi : Field Input
     * _t : type
     * _c : Child type
     * _i : Icon Model
     */
    ddvmOpts: any[] = [{
        _t: 'c',
        _c: 'p',
        _i: GLOBAL_ICONS['EDIT'],
        label: 'Parameters',
        children: []
    },{
        _t: 'c',
        _c: 's',
        _i: GLOBAL_ICONS['INTERNAL'],
        label: 'Context',
        children: [{
            _t: 'o',
            label: 'Load parent class',
            ft: 'c',
            v: false,
            name: 'clinit'
        }]
    },{
        _t: 'c',
        _c: 'o',
        _i: GLOBAL_ICONS['LIST'],
        label: 'Options',
        children: [{
            _t: 'o',
            label: 'Call stack limit (infinite=-1)',
            ft: 'n',
            v: 0,
            name: 'depth'
        }]
    }];

    private _vmLog:any[] = [];

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

        vmEditor.container.style.height = this.vmedHeight+'px';
        vmEditor.container.style.minHeight = this.vmedHeight+'px';
        vmEditor.container.style.maxHeight = this.vmedHeight+'px';

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

        this.ddvmOpts[1].children.map((vPar:any) => {
            ops[vPar.name] = vPar.v;
        });

        this.ddvmOpts[2].children.map((vPar:any) => {
            ops[vPar.name] = vPar.v;
        });

        ops.params = [];
        this.ddvmOpts[0].children.map((vPar:any) => {
            console.log(vPar);

            ops.params.push({
                notset: vPar.sym,
                val: (vPar.sym? null : vPar.val)
            });
        });

        ops.level = 0;

        return ops;
    }


    showDxcVM() {

        if(((this.node as any).hasOwnProperty('__vm_code'))){
            this.vmEditor.mode = 'javascript';
            this.vmEditor.value = (this.node as any).__vm_code; //this.data.__view_code;
            this.vmEditor.getEditor().resize();
        }


        if(this.ddvmOpts[0].children.length==0){

            if(this.node.args.length>0){
                this.node.args.map((vArg:any, vOffset:number) => {
                    console.log(vArg,this.ddvmOpts[0]);
                    this.ddvmOpts[0].children.push({
                        _t: 'p',
                        label: 'Arg_'+vOffset,
                        arg: vArg,
                        val: '',
                        ft: 'i',
                        sym: true
                    });
                })
            }else{
                this.ddvmOpts[0].children.push({
                    _t: 'e',
                    _i: GLOBAL_ICONS['WARNING'],
                    label: 'This methods has not parameters'
                });
            }
        }
    }

    ddvmExec() {
        this.codeSvc.ddvm_execMethod( this.node as ModelMethod, this.prepareDDVMOptions()).subscribe( vRes => {
            console.log('VM exec : ', vRes);

            this.vm = vRes;
            this._vmLog = [];

            if(vRes.instr.length>0){
                if(vRes.instr[0].indexOf('// An ')==0){
                    (this.node as any).__vm_code = vRes.instr[0]+" See VM logs."
                    this._vmLog.push({
                        t:"e", v:vRes.instr[1]
                    });
                }else{
                    (this.node as any).__vm_code = vRes.instr.join(`
 `);
                }
            }

            if(vRes.events.length>0){
                this._vmLog = this._vmLog.concat(vRes.events);
            }

            this.showDxcVM();
            this.vmLogs.emit(this._vmLog);
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
}
