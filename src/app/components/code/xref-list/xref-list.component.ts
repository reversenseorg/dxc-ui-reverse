import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input, OnChanges,
    OnInit,
    Output, SimpleChanges
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {Nullable} from "../../../base/Nullable";
import {OutputService} from "../../output/ctrl/output.service";
import {Tag} from "../../../models/tags/Tag";
import ModelCall from "../../../models/ModelCall";
import {CodeControllerService} from "../ctrl/code-controller.service";
import ModelMethod from "../../../models/ModelMethod";
import ModelField from "../../../models/ModelField";
import ModelClass from "../../../models/ModelClass";
import {ModelFunction} from "../../../models/ModelFunction";
import {NodeInternalType} from "../../../models/NodeInternalType";

let ctr = 0;



interface Column {
    id: string;
    label: string;
    cls: string;
}




@Component({
    selector: 'dxc-xref-list',
    template: `
        <div>
            <h5 *ngIf="title">{{ title }}</h5>

            <div *ngIf="description!=null">
                <p>{{ description }}</p>
            </div>



            <app-subnavbar *ngIf="navbar" [type]="'navbar'"  [opts]="true" [parent]="this">
                <ng-container options>
                    <!--app-subnavbar-btn  (click)="showModel()">Details</app-subnavbar-btn>-->
                    <app-subnavbar-btn  [icon]="gIcons['REFRESH']" (click)="refresh()"></app-subnavbar-btn>
                    <app-subnavbar-btn  [icon]="gIcons['STAR']" (click)="doOnSelection('project','toggleFavorite')"></app-subnavbar-btn>
                </ng-container>
            </app-subnavbar>

            <div *ngIf="header" class="row">
                <ng-container *ngFor="let col of getHeaderColumns()">
                    <div [ngClass]="col.cls">
                        {{ col.label }}
                    </div>
                </ng-container>
            </div>

            <div class="dxc-grid-body" [ngStyle]="{'height':height+'px', 'border-bottom':'none'}" style="overflow-y: auto">
                <div *ngIf="window.length==0">
                    <div *ngIf="data.length>0" class="row">
                        <div class="col-lg-12 text-center">
                            <dxc-icon [model]="gIcons.SPINNER"></dxc-icon><span>Loading xref ...</span>
                        </div>
                    </div>
                    <div *ngIf="data.length==0" class="row">
                        <div class="col-lg-12 text-center">
                            <dxc-icon [model]="gIcons.WARNING"></dxc-icon><span>This node has not known cross references ...</span>
                        </div>
                    </div>
                </div>
                <ng-container *ngFor="let xref of window; let index = index">
                    <div class="row g-0" [ngStyle]="{'height':rowHeight+'px'}"  (click)="select(xref, 'click')">
                        <div class="col-lg-12">
                            <dxs-xref-item [hookstatus]="true" [type]="xreffrom?'from':'to'" [item]="xref"></dxs-xref-item>
                        </div>
                    </div>
                </ng-container>
            </div>

            <div *ngIf="pagignation" class="dxc-navbar">
                <div class="col-lg-6 offset-6">
                    <dxc-paginator [rows]="rows"  [totalRecords]="data.length" (onPageChange)="onPageChange($event)"></dxc-paginator>
                </div>
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
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class XrefListComponent implements OnInit, OnChanges {

    @Input() title?:string;
    @Input() description = null;

    @Input() sort:"asc"|"desc" = "desc";
    @Input() pagignation: boolean = false;
    @Input() rows: number;
    @Input() visibleRows: number = 10;
    @Input() height: number = 200;
    @Input() rowPerPageOpts: number[] = [20,50,100];

    @Input() header = false;
    @Input() navbar = false;
    @Input() headerCols:string[] = [];

    @Input() node: Nullable<ModelCall|ModelMethod|ModelField|ModelClass|ModelFunction> = null
    @Input() data: ModelCall[] = [];

    @Input() xrefto = false;
    @Input() xreffrom = false;

    @Output() refreshed:EventEmitter<any> = new EventEmitter<any>();
    @Output() selectOne:EventEmitter<ModelCall> = new EventEmitter<ModelCall>();
    @Output() dblclickOne:EventEmitter<ModelCall> = new EventEmitter<ModelCall>();


    window: ModelCall[] = [];
    windowStartAt: number = 0;
    rowHeight = 15;

    selected:Nullable<ModelMethod|ModelFunction> = null;

    options = [
        { label: 'A to Z', icon: 'pi pi-fw pi-sort-alpha-down' },
        { label: 'Z to A', icon: 'pi pi-fw pi-sort-alpha-down-alt' }
    ];


    columns: Record<string, Column> = {};

    constructor(
        private _outputSvc: OutputService,
        private codeSvc: CodeControllerService,
        private changeRef:ChangeDetectorRef) {

    }

    ngOnInit() {

        this.rowHeight = Math.round(this.height / this.visibleRows);

        if(this.pagignation){
            this.rows = this.rowPerPageOpts[0];
            this.windowStartAt = 0;
        }else{
            this.rows = -1;
        }

        this.refresh();
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.data!=null && changes.data.currentValue!=null){
            this.data = changes.data.currentValue;
            this.node = null;
            this.refresh(true);
        }
    }

    /**
     *
     */
    getHeaderColumns(){
        let cols = Object.values(this.columns);
        if(cols.length==0){
            if(this.xrefto){
                cols.push({
                    id: "xrefto",
                    label: "Xref To",
                    cls: "dxc-text-75",
                });
            }
            if(this.xreffrom){
                cols.push({
                    id: "xreffrom",
                    label: "Xref From",
                    cls: "dxc-text-75",
                });
            }
        }
        return cols;
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
            //this.data = this.getXrefsOf(this.node);

            if(this.pagignation){
                this.window = this.data.slice(this.windowStartAt, this.windowStartAt+this.rows);
            }else if(this.window.length==0 || pResetUI){
                this.windowStartAt = 0;
                this.window = this.data;
            }

            this.changeRef.detectChanges();
        }

        if(this.data.length>0){
            this.window = this.data;
            if(this.pagignation){
                this.windowStartAt = 0;
                this.window = this.data.slice(this.windowStartAt, this.windowStartAt+this.rows);
            }
            this.changeRef.detectChanges();
        }


        /*
        this.codeSvc.listTags(true).subscribe((vTags:Tag[])=>{
            //console.log("refreshProjects > ",vProj);

            this.xrefList = vTags.sort((a:ModelCall,b:ModelCall)=>{
                return a.calleed.name.localeCompare(b.calleed.label);
            });

            if(this.pagignation){
                this.window = this.xrefList.slice(this.windowStartAt, this.windowStartAt+this.rows);
            }else if(this.window.length==0 || pResetUI){
                this.windowStartAt = 0;
                this.window = this.xrefList;
            }

            this.refreshed.emit(true);
        });*/
    }




    protected readonly gIcons = GLOBAL_ICONS;


    markAsFavorite() {

    }

    onPageChange(pEvent: {offset:number, size:number }) {
        this.window = this.data.slice(pEvent.offset, pEvent.offset+pEvent.size);
    }

    getXrefsOf(pItem: ModelCall|ModelMethod|ModelFunction|ModelField|ModelClass):(ModelFunction|ModelMethod)[] {
        let xrefs:(ModelFunction|ModelMethod)[] = [];
        switch((pItem as any).__){
            case NodeInternalType.FUNC:
                if(this.xreffrom){
                    xrefs = (pItem as any).xcref;
                }else{
                    xrefs = (pItem as any).xdref;
                }
                break;
            case NodeInternalType.METHOD:

                this.codeSvc.getMethodXref(
                    (pItem as any).__signature__, (this.xreffrom?'from':'to')
                ).subscribe( (pData:any)=>{

                    pData.map((x:any) => {

                        this.codeSvc.getModelMethod(x.s).subscribe((vMeth:any)=>{
                            if(vMeth!=null && vMeth.enclosingClass!=null){
                                this.codeSvc.getClass(vMeth.enclosingClass as string).subscribe((vClz:any)=>{
                                    if(vClz!=null && vClz.success){
                                        vMeth.enclosingClass = new ModelClass(vClz.data);
                                        this.data.push(vMeth);
                                        this.changeRef.detectChanges();
                                    }else{
                                        console.log("Class not found : ",vMeth.enclosingClass,vClz)
                                    }
                                });
                            }
                        })
                    })

                    xrefs= [];
                });

                break;
            case NodeInternalType.FIELD:

                xrefs = (pItem as any)._getters;
                xrefs = xrefs.concat((pItem as any)._setters);
                break;
            case NodeInternalType.CALL:
                if(this.xreffrom){
                    xrefs = [(pItem as any).calleed];
                }else{
                    xrefs = [(pItem as any).caller];
                }
                break;
        }

        return xrefs;
    }


}
