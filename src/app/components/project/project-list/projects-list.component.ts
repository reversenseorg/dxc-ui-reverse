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
import {OutputMessage} from "../../../cmp/OutputMessage";
import {OutputService} from "../../output/ctrl/output.service";

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
        
        &.footer {
          position: absolute;
          bottom: 0;
          right: 0;
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
    @Output() dblclickOne:EventEmitter<DexcaliburProject> = new EventEmitter<DexcaliburProject>();

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
        private _outputSvc: OutputService,
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

    dblclickProject(pObject:any):void {
        this.dblclickOne.emit(pObject)
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


    /**
     * Action of delete a project when a user select a project and click on the trash
     *
     * @param {Nullable<DexcaliburProject>} pProject Default NULL
     */
    deleteProject(pProject: Nullable<DexcaliburProject> = null) {

        if(pProject!=null){
            try{
                this._projectSvc.removeProject(pProject).subscribe( (pResult)=>{
                    if(pResult.remove==true){
                        this.selectProject(null,"delete");
                        this._outputSvc.print( OutputMessage.newSuccess({ src:"Project Manager", msg:`Project "${pProject.uid}" has been removed.`}));
                        this.refreshProjects();
                    }
                });
            }catch (err:any) {
                this._outputSvc.alert(new OutputMessage({ msg:err.message }))
            }
        }
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
