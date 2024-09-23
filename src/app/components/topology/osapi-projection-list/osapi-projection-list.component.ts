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
import ModelCall from "../../../models/ModelCall";
//import {CodeControllerService} from "../ctrl/code-controller.service";
import ModelMethod from "../../../models/ModelMethod";
import ModelField from "../../../models/ModelField";
import ModelClass from "../../../models/ModelClass";
import {ModelFunction} from "../../../models/ModelFunction";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {CODE_ICONS} from "../../code/icons";
import {from, Observable} from "rxjs";
import {TopologyService} from "../ctrl/topology.service";
import AndroidComponent from "../../../models/android/AndroidComponent";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";

let ctr = 0;



interface Column {
    id: string;
    label: string;
    cls: string;
}




@Component({
    selector: 'dxc-osapi-projection-list',
    templateUrl: './osapi-projection-list.component.html',
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
export class OsApiProjectionListComponent implements OnInit {

    @Input() title?:string;
    @Input() description = null;

    @Input() component:Nullable<AndroidComponent> = null;

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
    @Input() data: (any)[] = [];

    @Input() xrefto = false;
    @Input() xreffrom = false;

    @Output() refreshed:EventEmitter<any> = new EventEmitter<any>();
    @Output() selectOne:EventEmitter<ModelCall> = new EventEmitter<ModelCall>();
    @Output() dblclickOne:EventEmitter<ModelCall> = new EventEmitter<ModelCall>();


    activeItem: any = null;
    window: (ModelMethod|ModelFunction)[] = [];
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
        private topoSvc: TopologyService,
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
            this.data = this.getXrefsOf(this.node);

            if(this.pagignation){
                this.window = this.data.slice(this.windowStartAt, this.windowStartAt+this.rows);
            }else if(this.window.length==0 || pResetUI){
                this.windowStartAt = 0;
                this.window = this.data;
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


    bookmark() {

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


    protected readonly NODE_TYPES = NodeInternalType;
    protected readonly cIcons = CODE_ICONS;

    /**
     * To display a contextual menu defined by another brick
     *
     * @param $event
     * @param pType
     * @param pObj
     */
    displayExtMenu($event: MouseEvent, pType: string, pObj:any) {
        this.codeSvc.displayCtxMenu$.next({ event:$event, type:pType, obj:pObj});
    }

    showAndroidAPI(pTabName: string) {

        if(this.component==null) return;


        this.topoSvc.scanComponent( this.component).subscribe((x:AndroidComponent)=>{

            console.log(x);
            //this.data = x;
            let clsX:any, methX:any;

            /*
            for(const cls in x.__ppts.internals){

              clsX = {
                __: NodeInternalType.CLASS,
                uid: cls,
                meths: []
              };

              for(const idx in x.__ppts.internals[cls]){
                methX = x.__ppts.internals[cls][idx]
                clsX.children.push({
                  __: NodeInternalType.METHOD,
                  uid: idx,
                  xrefs: []
                })
              })

              this.data.internals.push({
                __: NodeInternalType.CLASS,
                name: cls,
                children: []
              });
            }*/
            console.log(this.data,x);
        })
    }

    expand(pItem: any, pType: string): Observable<any> {
        console.log("expand: ",pItem,pType);
        let ret:Observable<any>
        switch (pItem.__){
            case NodeInternalType.CLASS:
                ret = from([pItem.methods])
                break;
            case NodeInternalType.METHOD:
                ret = from([pItem.xrefs])
                break;
            default:
                ret = from([]);
                break;
        }
        return ret;
    }

    isExpandable(pItem:any, pSrc:any):boolean{
        return (pItem.__!=null) && ([NodeInternalType.CLASS,NodeInternalType.METHOD].indexOf(pItem.__)>-1);
    }

    onItemFocus( pEvent:any):void{

        if(this.activeItem != null){
            this.activeItem.el.style.backgroundColor = "#444";
        }

        this.activeItem = pEvent;
        pEvent.el.style.backgroundColor = "royalblue";
    }
}
