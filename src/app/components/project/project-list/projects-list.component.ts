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
import {IconModel} from "../../../base/icon/IconModel";
import {DeviceResolver} from "../../device/ctrl/device-resolver.service";
import {ProjectResolver} from "../ctrl/project-resolver.service";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxs-projects-list',
    // templateUrl: './projects-list.component.html',
    template: `
        <div>
            <h5 *ngIf="title">{{ title }}</h5>
            <div *ngIf="description!=null">
                <p>{{ description }}</p>
            </div>
            
            <app-subnavbar  [type]="'navbar'"  [opts]="true" [parent]="this">
                <ng-container options>
                    <!--app-subnavbar-btn  (click)="showModel()">Details</app-subnavbar-btn>-->
                    <app-subnavbar-btn  [icon]="gIcons['REFRESH']" (click)="refreshProjects(windowStartAt,rows)"></app-subnavbar-btn>
                    <app-subnavbar-btn  [icon]="gIcons['STAR']" (click)="doOnSelection('project','toggleFavorite')"></app-subnavbar-btn>
                    <app-subnavbar-btn  [icon]="gIcons['PLUS']" (click)="newProject()"></app-subnavbar-btn>
                    <app-subnavbar-btn  [disable]="selected==null" [icon]="removeIcon" (click)="deleteProject(selected)"></app-subnavbar-btn>
                </ng-container>
            </app-subnavbar>


            <div class="h-full w-full"  [ngStyle]="{'height':height+'px', 'border-bottom':'none'}" style="overflow-y: auto">
                <table class="w-full dxc-table" >
                    <thead>
                    <th style="width:6%"><div class="dxc-text-std">OS</div></th>
                    <th style="width:50%"><div class="dxc-text-std">Name</div></th>
                    <th style="width:5%"><div class="dxc-text-std">Ready</div></th>
                    <th style="width:15%"><div class="dxc-text-std">Version</div></th>
                    <th style="width:12%"><div class="dxc-text-std">Open</div></th>
                    <th style="width:12%"><div class="dxc-text-std">Created</div></th>
                    </thead>
                    <tbody style="background: #333">
                    <ng-container *ngIf="projectList.length>0; else noProj">
                        <tr *ngFor="let project of window; let index = index" [ngClass]="{'focus':(project.uid==selected?.uid)}" (dblclick)="dblclickProject(project)" (click)="selectProject(project, 'click')">
                            <td class="text-center">
                                <ng-container [ngSwitch]="project.os">
                                    <dxc-icon *ngSwitchCase="'fireos'" [model]="gIcons['FIREOS']"></dxc-icon>
                                    <dxc-icon *ngSwitchCase="'android'" [model]="gIcons['ANDROID']"></dxc-icon>
                                    <dxc-icon *ngSwitchCase="'linux'" [model]="gIcons['LINUX']"></dxc-icon>
                                    <dxc-icon *ngSwitchCase="'android2'" [model]="gIcons['ANDROID']"></dxc-icon>
                                    <dxc-icon *ngSwitchCase="'ios'" [model]="gIcons['IOS']"></dxc-icon>
                                    <dxc-icon *ngSwitchCase="'macos'" [model]="gIcons['IOS']"></dxc-icon>
                                    <dxc-icon *ngSwitchCase="'tizen'" [model]="gIcons['ANDROID']"></dxc-icon>
                                    <dxc-icon *ngSwitchCase="'webos'" [model]="gIcons['ANDROID']"></dxc-icon>
                                    <dxc-icon *ngSwitchCase="'window'" [model]="gIcons['ANDROID']"></dxc-icon>
                                </ng-container>
                            </td>
                            <td>{{ project.pkg }}</td>
                            <td><dxc-icon [model]="project.isReady()? gIcons['LED_GREEN'] : gIcons['LED_RED']"></dxc-icon></td>
                            <td>{{ project.meta.versionName }}</td>
                            <td>{{ project.meta.lastOpenDate | date: 'dd/MM/yyyy HH:mm:ss'}}</td>
                            <td>{{ project.meta.creationDate | date: 'dd/MM/yyyy HH:mm:ss'}}</td>
                            <!--<div class="col-lg-2">
                                <dxc-meta [label]="project.archs[0]"> </dxc-meta>
                            </div>-->
                        </tr>
                    </ng-container>
                    <ng-template #noProj>
                        <tr>
                            <td colspan="6" class="dxc-text-std text-center">Loading projects ...</td>
                        </tr>
                    </ng-template>
                    </tbody>
                </table>
            </div>
            
            <div *ngIf="pagignation" class="dxc-navbar">
                <div class="col-lg-6 offset-6">
                    <dxc-paginator [rows]="rows" [totalRecords]="-1" (onPageChange)="onPageChange($event)"></dxc-paginator>
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
    providers: [ProjectResolver],
    changeDetection: ChangeDetectionStrategy.OnPush
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

    removeIcon: IconModel = GLOBAL_ICONS.TRASH;

    //items!: MenuItem[];


    private _droping: Nullable<DexcaliburProject> = null ;
    canDrop = false;
    /**
     * Input Text into Drop confirmation dialog
     * @field
     */
    confirmInput: string = "";
    page: { offset: number; size: number } = { offset:0, size:20};

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

        this.refreshProjects(this.windowStartAt, this.rows);
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


    selectProject(pObject: any, pType:string) {
        this.selected = pObject;
        this.canDrop = true;
        this.selectOne.emit(pObject);
    }

    dblclickProject(pObject:any):void {
        this.dblclickOne.emit(pObject)
    }


    refreshProjects(pPage:number, pRows:number, pResetUI  = false) {
        this._projectSvc.listProjects2(pPage, pRows).subscribe((vProj:DexcaliburProject[])=>{
            //console.log("refreshProjects > ",vProj);

            this.projectList = vProj.sort((a:DexcaliburProject,b:DexcaliburProject)=>{
                const dateA = a.meta.lastOpenDate!=null ? a.meta.lastOpenDate : a.meta.creationDate;
                const dateB = b.meta.lastOpenDate!=null ? b.meta.lastOpenDate : b.meta.creationDate;
                return dateA>dateB ? -1 : 1;
            });


            if(this.pagignation){
                this.window = this.projectList; //.slice(this.windowStartAt, this.windowStartAt+this.rows);
            }else if(this.window.length==0 || pResetUI){
                this.windowStartAt = 0;
                this.window = this.projectList; //.slice(this.windowStartAt, this.windowStartAt+this.rows);
            }

            console.log("refreshProjects > ",this.projectList, this.window );
            this.removeIcon = GLOBAL_ICONS.TRASH;
            this.changeRef.detectChanges();
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
                this.removeIcon = GLOBAL_ICONS.SPINNER;

                this._projectSvc.removeProject(pProject).subscribe( (pResult)=>{
                    if(pResult.remove==true){
                        this.removeIcon = GLOBAL_ICONS.CHECK;
                        this.selectProject(null,"delete");
                        this._outputSvc.print( OutputMessage.newSuccess({ src:"Project Manager", msg:`Project "${pProject.uid}" has been removed.`}));
                        this.refreshProjects(this.windowStartAt, this.rows);
                    }else{
                        this.removeIcon = GLOBAL_ICONS.WARNING;
                        this.changeRef.detectChanges();
                    }

                });
            }catch (err:any) {
                this.removeIcon = GLOBAL_ICONS.WARNING;
                this.changeRef.detectChanges();
                setTimeout(()=>{
                    this.removeIcon = GLOBAL_ICONS.TRASH;
                    this.changeRef.detectChanges();
                })
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


    protected readonly gIcons = GLOBAL_ICONS;
    focusEl: any = null;

    markAsFavorite() {

    }

    newProject() {
        this._projectSvc.onMenuClick.next({ item:'new-project' });
    }

    onPageChange(pEvent: {offset:number, size:number }) {
        //this.window = this.projectList.slice(pEvent.offset, pEvent.offset+pEvent.size);
        this.page = pEvent;

        this.refreshProjects(pEvent.offset, pEvent.size);

        console.log(pEvent.offset,pEvent.size,this.window);
    }
}
