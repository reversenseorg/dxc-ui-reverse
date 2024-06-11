import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {ProjectService} from "../ctrl/project.service";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {Nullable} from "../../../base/Nullable";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxs-projects-list',
    templateUrl: './projects-list.component.html',
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
        
        cursor: pointer;
      }
    `]
})
export class ProjectsListComponent implements OnInit {

    @Input() title?:string;
    @Input() description = null;
    @Input() sort:"asc"|"desc" = "desc";
    @Input() pagignation: boolean = false;
    @Input() rows: number;
    @Input() visibleRows: number = 10;
    @Input() height: number = 200;
    @Input() rowPerPageOpts: number[] = [20,50,100];

    @Output() refreshed:EventEmitter<any> = new EventEmitter<any>();
    @Output() selectOne:EventEmitter<DexcaliburProject> = new EventEmitter<DexcaliburProject>();

    projectList: DexcaliburProject[] = [];
    window: DexcaliburProject[] = [];
    windowStartAt: number = 0;
    rowHeight = 15;

    selected:Nullable<DexcaliburProject> = null;

    options = [
        { label: 'Favorite first', icon: 'pi pi-fw pi-star' },
        { label: 'Newest first', icon: 'pi pi-fw pi-clock' },
        { label: 'Oldest first', icon: 'pi pi-fw pi-clock' },
        { label: 'A to Z', icon: 'pi pi-fw pi-sort-alpha-down' },
        { label: 'Z to A', icon: 'pi pi-fw pi-sort-alpha-down-alt' }
    ];

    //items!: MenuItem[];


    private _droping: Nullable<DexcaliburProject> = null ;
    canDrop = false;
    /**
     * Input Text into Drop confirmation dialog
     * @field
     */
    confirmInput: string = "";

    constructor(
        private _projectSvc: ProjectService,
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

        this.refreshProjects();
    }


    toggleFavorite(pProject: DexcaliburProject) {
        // check againts user preferences
        //pProject.favorite = (pProject.favorite===true ? false: true);

    }



    doOnSelection(pType:string,pSymbol: string):void {

        /*this.selected[pType].map((x:any) => {
            ((this as IStringIndex<any>)[pSymbol] as any).apply(this, x);
        })*/

    }

    openProject(pProject:DexcaliburProject) {
        if(pProject.ready){
            window.open(location.protocol+"//"+location.hostname+":"+location.port+"/pro/#/home/"+pProject.uid, "_blank");
        }else{
            if(pProject.meta.hasOwnProperty('openning') && pProject.meta.openning!=1){
                // nothing to do, latter cancel
            }else{
                pProject.meta.openning = 1;
                this._projectSvc.openProject(pProject).subscribe((vData:any)=>{
                    if(vData.success){
                        pProject.meta.openning = 0;
                        pProject.ready = true;
                    }else{
                        pProject.meta.openning = 0;
                        pProject.meta.openningFailed = 1;
                    }
                })
            }
        }
    }

    selectProject(pObject: any, pType:string) {
        this.selected = pObject;
        this.canDrop = true;
        this.selectOne.emit(pObject);
    }


    refreshProjects(pResetUI  = false) {
        this._projectSvc.listProjects2().subscribe((vProj:DexcaliburProject[])=>{
            //console.log("refreshProjects > ",vProj);

            this.projectList = vProj.sort((a:DexcaliburProject,b:DexcaliburProject)=>{
                const dateA = a.meta.lastOpenDate!=null ? a.meta.lastOpenDate : a.meta.creationDate;
                const dateB = b.meta.lastOpenDate!=null ? b.meta.lastOpenDate : b.meta.creationDate;
                return dateA>dateB ? -1 : 1;
            });

            if(this.pagignation){
                this.window = this.projectList.slice(this.windowStartAt, this.windowStartAt+this.rows);
            }else if(this.window.length==0 || pResetUI){
                this.windowStartAt = 0;
                this.window = this.projectList; //.slice(this.windowStartAt, this.windowStartAt+this.rows);
            }

            console.log("refreshProjects > ",this.projectList, this.window );
            //this.changeRef.detectChanges();
            this.refreshed.emit(true);
        });
    }

    removeProject(pProject:Nullable<DexcaliburProject>=null) {
        /*
        this._droping = pProject==null ? Object.values(this.selected.projects)[0] : pProject;
        if(this._droping != null){
            this.confirmSvc.confirm({
                header: 'Are you sure to remove project "'+this._droping.uid+'" ?',
                message: 'Please confirm to proceed by typing name of the project to remove.',
                accept: () => {
                    this._projectSvc.removeProject(this._droping as DexcaliburProject).subscribe((vSuccess:any)=>{

                        if(vSuccess.remove){
                            this.canDrop = false;
                            this._droping = null;
                            this.messageSvc.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
                            //this._droping.pop();
                        }else{
                            this.messageSvc.add({ severity: 'error', summary: 'Rejected', detail: 'Removing rejected', life: 3000 });
                        }
                    });
                },
                reject: () => {
                    this.messageSvc.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });
        }*/

    }

    onConfirmInput(pEvent: any) {
        this.confirmInput = pEvent.target.value;
        if(this._droping!=null && (pEvent.target.value===this._droping.uid)){
            this.canDrop = true;
        }
    }

    /*pageChange(pEvent: PaginatorState) {
        const start = (pEvent.first as number)*(pEvent.rows as number);
        this.window = this.projectList.slice(start, start+(pEvent.rows as number));
    }*/

    protected readonly gIcons = GLOBAL_ICONS;
    focusEl: any = null;

    markAsFavorite() {

    }

    newProject() {

    }

    onPageChange(pEvent: {offset:number, size:number }) {
        this.window = this.projectList.slice(pEvent.offset, pEvent.offset+pEvent.size);
        console.log(pEvent.offset,pEvent.size,this.window);
    }
}
