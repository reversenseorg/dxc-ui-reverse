import {
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
import {TagService} from "../ctrl/tag.service";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxs-tag-list',
    templateUrl: './tag-list.component.html',
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
export class TagListComponent implements OnInit {

    @Input() title?:string;
    @Input() description = null;
    @Input() sort:"asc"|"desc" = "desc";
    @Input() pagignation: boolean = false;
    @Input() rows: number;
    @Input() visibleRows: number = 10;
    @Input() height: number = 200;
    @Input() rowPerPageOpts: number[] = [20,50,100];

    @Output() refreshed:EventEmitter<any> = new EventEmitter<any>();
    @Output() selectOne:EventEmitter<Tag> = new EventEmitter<Tag>();
    @Output() dblclickOne:EventEmitter<Tag> = new EventEmitter<Tag>();

    tagList: Tag[] = [];

    window: Tag[] = [];
    windowStartAt: number = 0;
    rowHeight = 15;

    selected:Nullable<Tag> = null;

    options = [
        { label: 'A to Z', icon: 'pi pi-fw pi-sort-alpha-down' },
        { label: 'Z to A', icon: 'pi pi-fw pi-sort-alpha-down-alt' }
    ];

    //items!: MenuItem[];


    canDrop = false;
    /**
     * Input Text into Drop confirmation dialog
     * @field
     */
    confirmInput: string = "";

    constructor(
        private _outputSvc: OutputService,
        private tagSvc: TagService,
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
        this.canDrop = true;
        this.selectOne.emit(pObject);
    }

    dblclickProject(pObject:any):void {
        this.dblclickOne.emit(pObject)
    }


    refresh(pResetUI  = false) {
        this.tagSvc.listTags(true).subscribe((vTags:Tag[])=>{
            //console.log("refreshProjects > ",vProj);

            this.tagList = vTags.sort((a:Tag,b:Tag)=>{
                return a.label.localeCompare(b.label);
            });

            if(this.pagignation){
                this.window = this.tagList.slice(this.windowStartAt, this.windowStartAt+this.rows);
            }else if(this.window.length==0 || pResetUI){
                this.windowStartAt = 0;
                this.window = this.tagList;
            }

            this.refreshed.emit(true);
        });
    }




    protected readonly gIcons = GLOBAL_ICONS;

    markAsFavorite() {

    }

    onPageChange(pEvent: {offset:number, size:number }) {
        this.window = this.tagList.slice(pEvent.offset, pEvent.offset+pEvent.size);
        console.log(pEvent.offset,pEvent.size,this.window);
    }
}
