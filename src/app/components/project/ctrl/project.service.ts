import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {finalize, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {DxcApiService} from "../../../base/DxcApiService";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {AppMenuService, MenuEvent} from "../../../base/appmenu/app-menu.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {OutputService} from "../../output/ctrl/output.service";
import {Device} from "../../../models/Device";
import {AuthService} from "../../auth/ctrl/auth.service";
import {AuthenticationEvent, AuthenticationEventType} from "../../auth/AuthenticationEvent";
import {DxcApiToken} from "../../../base/DxcApiToken";
import {DeviceCacheFlavor, DeviceManagerService} from "../../device/ctrl/device-manager.service";
import {TagService} from "../../tag/ctrl/tag.service";
import {Nullable} from "../../../base/Nullable";
import {Location} from "@angular/common";

export interface ProjectMenuEvent extends MenuEvent {
  win?:any
}

export interface ProjectSetting {
  name:string,
  value:any
}

export interface  ProjectAnalyzerConfiguration {
    na_auto: boolean,
    fa_mode: string,
    msa_auto: boolean,
    ssa_auto: boolean,
    da_target: string,
    abi: string
}

/**
 *  Represent a request to create a new project
 *
 *  Such events are used to trigger "new project" from various data
 *  (native libs, applications from device, process, memory region ...)
 *
 *  @interface
 */
export interface NewProjectRequest<T> {
    /**
     * Flag to force native analysis only
     * @type {boolean}
     */

    force_native:boolean,

    /**
     * A string to uniquely identify the origin of the event.
     * It must allow to retrieve the type of data to analysis
     *
     * @type {string}
     */
    origin:string,

    /**
     * A callback function called the configuration has been fulfilled and submitted
     * by the user
     *
     * @type {((vConfig:any)=>any)}
     */
    onStart:((vConfig:ProjectAnalyzerConfiguration)=>any),

    /**
     * To interprent
     */
    data?:T;
}

/**
 * Represent the service to manage projects
 *
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService extends DxcApiService {

  /**
   * Hold Lock status.
   *
   * Lock helps to prevent concurrent
   * TRUE if locked, else FALSE
   * @type {boolean}
   * @field
   */
  private _l =false

  /**
   * Hold active projects
   *
   * An active project is server-side ready
   *
   * @type {DexcaliburProject[]}
   * @field
   */
  activeProject:DexcaliburProject[] = [];

  /**
   * Hold project selected (included into active projects)
   *
   * @type {DexcaliburProject}
   * @field
   */
  selected:Nullable<DexcaliburProject> = null;

  /**
   * Event stream.
   *
   * Event are emitted when a menu entry is clicked into application menu
   *
   * @type {Subject<ProjectMenuEvent>} Stream of menu events
   * @field
   */
  onMenuClick:Subject<ProjectMenuEvent> = new Subject<ProjectMenuEvent>();

  /**
   * Event stream.
   *
   * When a new project is opened and ready, the project instance is pushed into
   * stream
   *
   * @type {Subject<DexcaliburProject>} Stream of DexcaliburProject instances
   * @field
   */
  onProjectReady:Subject<DexcaliburProject> = new Subject<DexcaliburProject>();

  /**
   * Event stream.
   *
   * When a new project is closed successfully, the dead project instance is pushed into
   * stream
   *
   * @type {Subject<DexcaliburProject>} Stream of DexcaliburProject instances
   * @field
   */
  onProjectClose:Subject<DexcaliburProject> = new Subject<DexcaliburProject>();

  onProjectSettingsChange:Subject<ProjectSetting[]> = new Subject<ProjectSetting[]>();

  onProjectOpening:Subject<any> = new Subject<any>();

  onProjectHaltOpening:Subject<any> = new Subject<any>();

  onAnalysisConfig:Subject<NewProjectRequest<any>> = new Subject<NewProjectRequest<any>>();

  /**
   * A list of  all projects available in the remote workspace
   * @type {DexcaliburProject[]}
   * @field
   */
  projects:DexcaliburProject[] = [];

  onRefreshAll:Subject<DexcaliburProject[]> = new Subject<DexcaliburProject[]>();

  scheduler: any = null;

  progressUpload:any;
  subscriptionUpload:any;

    /**
     * An observable to trigger switch and rendering of a another project
     */
  showProject$:Subject<DexcaliburProject> = new Subject();

    /**
     * An hashmap to keep mapping between latest uploaded files and UploadUID
     *
     * @type {Record<string,string>}
     * @field
     */
  private _uploaded:Record<string, Nullable<string>> = {};

  /**
   *
   * @param {AppMenuService} appmenuSvc
   * @param {OutputService} outputSvc
   * @param {HttpClient} _http
   * @constructor
   */
  constructor( private appmenuSvc:AppMenuService,
               private authSvc:AuthService,
               private devSvc:DeviceManagerService,
               private tagSvc:TagService,
               private outputSvc:OutputService,
               private _location: Location,
               protected override _http:HttpClient) {
    super(
      {
        workspace: {
          list: { method: 'GET', url:'/workspace/list', format:'json', auth:false /* removed */},
          open: { method: 'GET', url:'/workspace/open', format:'json', auth:false /* removed */},
          status: { method: 'GET', url:'/status', format:'json'},
          new: { method: 'POST', url:'/workspace/new', format:'json', auth:false /* removed */},
          delete: { method: 'POST', url:'/workspace/delete', format:'json', auth:false /* removed */},
          upload: { method: 'POST', url:'/workspace/upload', format:'json', auth:false /* removed */},
          test: { method:'GET', url:'/workspace/availability', format:'json', auth:false /* removed */},
          info: { method: 'GET', url:'/workspace/info/:uid', format:'json', auth:false /* removed */ },
        },
        project: {
          device: { method: 'GET', url:'/project/device', format:'json', auth:false /* removed */, puid:true },
          set_device: { method: 'POST', url:'/project/device', format:'json', auth:false /* removed */, puid:true },
          edit_settings: { method: 'POST', url:'/project/settings', format:'json', auth:false /* removed */, puid:true },
          info: { method: 'GET', url:'/project/info/:uid', format:'json', auth:false /* removed */ },
          active: { method: 'GET', url:'/project/active', format:'json', auth:false /* removed */ },
          set_active: { method: 'POST', url:'/project/active', format:'json', auth:false /* removed */},
          close: { method: 'POST', url:'/project/close', format:'json', auth:false /* removed */, puid:true },
            list: { method: 'GET', url:'/project/list', format:'json', auth:false, puid:false }
        },
        settings: {
          list_abi: { method:'GET', url:'/native/public/settings/abi', format:'json'}
        },
        validate: {
          get:  { method: 'GET', url:'/validation', format:'json'},
          post:  { method: 'POST', url:'/validation', format:'json'}
        }
      },_http, outputSvc
    );

    this.appmenuSvc.addMenu(
      {
        id: 'dxc',
        label: 'Dexcalibur',
        submenu: [{
          label: 'Check for updates',
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({ item: 'update', win: pBrowserWindow });
          }
        },{
          role: 'about'
        },{
          type: 'separator'
        },{
          label: 'Preferences',
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({ item: 'gsettings', win: pBrowserWindow });
          }
        },{
          type: 'separator'
        },{
          role: 'services'
        },{
          type: 'separator'
        },{
          role: 'hide'
        },{
          role: 'unhide'
        },{
          type: 'separator'
        },{
          role: 'quit'
        }]
      }
      , 0);



    this.appmenuSvc.addMenu(
      {
        id:'prj',
        label: 'Project',
        submenu: [{
          label: 'Login',
          //accelerator: 'CommandOrControl+Shift+N',
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({ item:'login', win:pBrowserWindow });
          }
        },{
          label: 'New ...',
          accelerator: 'CommandOrControl+Shift+N',
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({ item:'new-project', win:pBrowserWindow });
          }
          /*
          submenu: [
            {
              label: 'Project',
              accelerator: 'CommandOrControl+Shift+N',
              click: (pMenuItem:any, pBrowserWindow:any ) => {
                this.onMenuClick.next({ item:'new-project', win:pBrowserWindow });
              }
            },{
              type: 'separator'
            },{
              label: 'Custom hook',
              click: (pMenuItem:any, pBrowserWindow:any ) => {
                this.onMenuClick.next({ item:'new-custom-hook', win:pBrowserWindow });
              }
            },{
              label: 'Hook scratchpad',
              click: (pMenuItem:any, pBrowserWindow:any ) => {
                this.onMenuClick.next({ item:'new-scratch-hook', win:pBrowserWindow });
              }
            },{
              label: 'Script',
              click: (pMenuItem:any, pBrowserWindow:any ) => {
                this.onMenuClick.next({ item:'new-script', win:pBrowserWindow });
              }
            }]*/
        },{
          label: 'Show active projects',
          enabled:true, //(this.hasMultipleActiveProject()),
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({ item:'active', win:pBrowserWindow });
          }
        },{
          label: 'Open project ...',
          accelerator: 'CommandOrControl+Shift+O',
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({ item:'open', win:pBrowserWindow });
          }
        },{
          label: 'Close Project',
          enabled:true, //(this.isProjectIsOpen()),
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({ item:'close-project', win:pBrowserWindow });
          }
        },{
          label: 'Save',
          enabled:true, //(this.isProjectIsOpen()),
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({ item:'save', win:pBrowserWindow });
          }
        },{
          type: 'separator'
        },{
          label: 'Project settings',
          enabled:true, //(this.isProjectIsOpen()),
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({ item:'settings', win:pBrowserWindow });
          }
        },{
          label: 'Update agent libraries',
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({ item:'hook-update-libs', win:pBrowserWindow });
          }
        }]
      }
      , 1);




      this.authSvc.onAuthentication.subscribe( (pEvent:AuthenticationEvent) => {
        switch(pEvent.type){
            case AuthenticationEventType.AUTH_SUCCESS:
              // if authentication success, retrieve project list

                // if PUID is null, search remote active project and load it
                /*
                if(!DxcApiToken.exists("puid")){
                    this.getActiveProject("project-svc:on-auth").subscribe((vProjects)=>{
                        if(vProjects!=null && vProjects.length==1){
                            // change project
                            this.showProject$.next(vProjects[0])
                        }
                    });
                }else{
                    const proj = new DexcaliburProject(
                        {},
                        (DxcApiToken.getInstance("puid") as any).getToken()
                    );


                    this.getProjectInfo(proj)
                        .subscribe((vProject)=>{
                            for(let k in vProject) (proj as any)[k]=vProject[k];

                            console.log("[PROJECT SVC] Project onAuthentication SUCCESS > ",proj);
                            this.showProject$.next(proj)
                    });
                }*/


                this.getActiveProject("project-svc:on-auth").subscribe((vProjects)=>{

                    if(vProjects==null) return;

                    if(!DxcApiToken.exists("puid")){
                        if(vProjects.length==1){
                            // change project
                            this.showProject$.next(vProjects[0])
                        }
                    }else{
                        const proj = new DexcaliburProject(
                            {
                                uid: (DxcApiToken.getInstance("puid") as any).getToken()
                            }
                        );

                        if(vProjects.map(x => x.uid).indexOf(proj.uid)>-1){
                            // if the specified project is active (remotely opened), then open it
                            this.getProjectInfo(proj)
                                .subscribe((vProject)=>{
                                    for(let k in vProject) (proj as any)[k]=vProject[k];

                                    console.log("[PROJECT SVC] Project onAuthentication SUCCESS > ",proj);
                                    this.showProject$.next(proj)
                                });
                        }else{
                            // TODO : load / open project
                        }
                    }
                });

                this.listProjects2().subscribe( (pEvent)=>{
                  this.projects = pEvent;
                  console.log("[PROJECT SVC] List of projects ",pEvent);
                  this.onRefreshAll.next(this.projects );
                });


            break;
          case AuthenticationEventType.LOGOUT_SUCCESS:
            this.projects = [];
            this.onRefreshAll.next([]);
            break;
        }
      });

      // to locally handle menu events
      this.onMenuClick.subscribe((pEvent)=>{
        // close selected/foreground project
        if((pEvent.item==='close-project') && (this.selected!=null) && (this.activeProject.length==1)){
          this.closeProject(this.selected).subscribe((pSuccess)=>{
            if(pSuccess){
              this.activeProject = [];
              this.selected = null;
            }
          })
        }
      });

      this.showProject$.subscribe((vProject:DexcaliburProject)=>{

          console.log("[PROJECT SVC] Showing project > ",vProject);

          this.switchTo(vProject).subscribe((vData:DexcaliburProject)=>{
              console.log('[PROJECT SVC] switched to project: ', vProject);
              this._location.replaceState('/home/'+vProject.uid,'');
          })

          /*
          DxcApiToken.remove("puid");
          DxcApiToken.create("puid",vProject.uid);

          this.getProjectInfo(vProject).subscribe((pEvent)=>{


              this.outputSvc.print(OutputMessage.newSuccess({ msg:"Displaying project  : "+vProject.uid, src:'' }));
              this._refreshDefaultDeviceFor(pEvent);
              this.selected = pEvent;
              this._beforeProjectReady(pEvent);
              //this.onProjectReady.next(pEl);
              // this.appmenuSvc.onProjectOpen();
          });*/
      });
  }


  listSupportedAbi():Observable<any> {
    return this._process(
      this.endpoints['settings']['list_abi']
    ).pipe(
      map((pEl:any)=>{
        if(pEl.success){
          return Object.values(pEl.data);
        }else{
          this.outputSvc.print( OutputMessage.newError({ msg:"List of projects cannot be retrieved" }));
          return null;
        }
      })
    );
  }

  /**
   * To list all project from local server
   *
   * @return {Observable<DexcaliburProject[]>} An array containing all projects
   * @method
   */
  listProjects():Observable<DexcaliburProject[]>{
    return this._process(
      this.endpoints['workspace']['list']
    ).pipe(
      map((pEl:any)=>{
        if(pEl.success){
          const proj:DexcaliburProject[] = [];
          const p = pEl.data.projects;
          p.map( (x:string) => proj.push( new DexcaliburProject( { uid: x })));
          return proj;
        }else{
          this.outputSvc.print( OutputMessage.newError({ msg:"List of projects cannot be retrieved" }));
          return [];
        }
      })
    );
  }


    /**
     * To list all project from local server
     *
     * @return {Observable<DexcaliburProject[]>} An array containing all projects
     * @method
     */
    listProjects2():Observable<DexcaliburProject[]>{
        return this._process(
            this.endpoints.project.list, {}
        ).pipe(
            map((pEl:any)=>{

                console.log('listProjects2 > ',pEl);
                if(pEl.success){
                    const proj:DexcaliburProject[] = [];
                    const p = pEl.data;
                    p.map( (x:any) => proj.push(  DexcaliburProject.fromJsonObject( x)));
                    return proj;
                }else{
                    this.outputSvc.print( OutputMessage.newError({ msg:"List of projects cannot be retrieved" }));
                    return [];
                }
            })
        );
    }


    removeProject( pProject:DexcaliburProject) :Observable<any> {


    // lock service, prevent concurrent exec
    if(this.isLocked()) {
      this.outputSvc.print(OutputMessage.newError({ msg:"Multiple project cannot be removed/opened/created in a same time. Please wait ..." }));
      throw new Error("Project cannot be removed. The service is busy by another workflow (locked).");
    }else {
      this.setLock(true);
    }

    this.outputSvc.print( new OutputMessage({ src:"Project Manager", msg:"Removing project ["+pProject.uid+"] ..." }));
    return this._process(
      this.endpoints['workspace']['delete'],
      { 'uid': pProject.uid }
    ).pipe(
      map((pEl:any)=>{

        this.setLock(false);

        if(!pEl.success) {
          this.outputSvc.print( OutputMessage.newError({ src:"Project Manager", msg:"Project cannot be removed."}));
        }else{
          return pEl.data;
        }
      })
    );
  }

  /**
   * To prepare UI prior to display a project
   *
   * @param pEl
   * @param pRefreshAppMenu
   * @private
   */
  private _beforeProjectReady( pEl:any, pRefreshAppMenu = true){
      if(DxcApiToken.exists("puid")){
          this.tagSvc.listTags().subscribe((vtags)=>{
              this.onProjectReady.next(pEl);
              if(pRefreshAppMenu){
                  this.appmenuSvc.onProjectOpen();
              }
          });
      }else{
          throw new Error("Cannot prepare project : PUID is null.")
      }
  }

  openProject( pProject:DexcaliburProject) :Observable<any> {


    // lock service, prevent concurrent exec
    if(this.isLocked()) {
      this.outputSvc.print(OutputMessage.newError({ msg:"Multiple project cannot be removed/opened/created in a same time. Please wait ...", src:'' }));
      this.tryUnlock(()=>{
        throw new Error("Project cannot be opened. The service is busy by another workflow (locked). Please wait ...");
      })

    }

    this.setLock(true);
    this.startOpening(pProject.uid);



    return this._process(
      this.endpoints['workspace']['open'],
      {
          'uid': pProject.uid
      }
    ).pipe(
      map((pEl:any)=>{

        this.setLock(false);

        if(pEl.success) {
          DxcApiToken.remove("puid");
          DxcApiToken.create("puid",pProject.uid);


          this.getProjectInfo(pProject).subscribe((pEvent)=>{
            this._refreshDefaultDeviceFor(pEvent);
            this.selected = pEvent;
            this._beforeProjectReady(pEl);
           //this.onProjectReady.next(pEl);
           // this.appmenuSvc.onProjectOpen();
          });

        }else{
          this.stopOpening();
          this.outputSvc.print( OutputMessage.newError({ src:"Project Manager", msg:pEl.msg}));
        }

        return pEl;
      })
    );
  }



  private _refreshSelectedProject():any {
    if(this.selected!=null){
      this.getProjectInfo(this.selected).subscribe((pEvent)=>{
        this._refreshDefaultDeviceFor(pEvent);
        this.selected = pEvent;
      });
    }

  }

  /**
   * To close a local project
   * @param pProject
   */
  closeProject( pProject:DexcaliburProject) :Observable<any> {

    this.outputSvc.print( new OutputMessage({ src:"Project Manager", msg:"Closing project ["+pProject.package+"] ..." }));
    return this._process(
      this.endpoints['project']['close'],
      { 'uid': pProject.uid }
    ).pipe(
      map((pEl:any)=>{
        if(pEl.success) {

          this.outputSvc.print( new OutputMessage({ src:"Project Manager", msg:"Project ["+pProject.package+"] has been closed." }));
          this.onProjectClose.next( pProject);
          this.appmenuSvc.onProjectClose();
          if(pProject.uid===(DxcApiToken.getInstance('puid') as DxcApiToken).getToken()){
            DxcApiToken.remove('puid');
          }

          // refresh activeProject list
          this.getActiveProject("project-svc:close").subscribe(()=>{ return; });
        }else{
          this.outputSvc.print( OutputMessage.newError({ src:"Project Manager", msg:"Project has not been closed. Cause : "+pEl.msg}));
        }
        return pEl;
      })
    );
  }

  /**
   * To check if the service is locked.
   *
   * Only 'newProject' can be locked.
   *
   * @return {boolean} TRUE if locked, else FALSE
   * @method
   */
  isLocked():boolean{
      return this._l;
  }

  /**
   * Try to unlock the service
   *
   * Lock is used to handle race condition when some operation related to
   * project lifecycle are running.
   *
   *
   */
  tryUnlock(pFailureCallback:(()=>void)):void {
    return ;
  }

  /**
   * To set a lock which prevents concurrent critical or time consumings
   *
   * @param {boolean} pStatus TRUE if locked, else FALSE
   * @return {void}
   * @method
   */
  setLock( pStatus:boolean):void {
      this._l = pStatus;
  }

  /**
   * To send request to create a new project
   *
   * Some options are listed below :
   *  - name : string
   *  - type : ['fromfs'|'url'|'...']
   *  - device : device UID
   *  - platform : platform UID
   *
   * Optional :
   *  - url : string
   *  - file : string
   *
   *
   * @param {any} pOptions Project option
   * @return {void}
   * @method
   */
  newProject( pOptions:any) :Observable<any> {

    // lock service, prevent concurrent exec
    if(this.isLocked()) {
      this.outputSvc.print(OutputMessage.newError({ msg:"Multiple project cannot be removed/opened/created in a same time. Please wait ..." }));
      throw new Error("Multiple project cannot be created in a same time. Please wait ...");
    }else {
      this.setLock(true);
    }

    this.startOpening(pOptions.name, true);

    return this._process(
      this.endpoints['workspace']['new'], pOptions
    ).pipe(
      map((pEl:any)=>{

            // unlock service
            this.setLock(false);

            if(pEl.success) {

              DxcApiToken.remove("puid");
              DxcApiToken.create("puid",pEl.data.uid);
              this.selected = new DexcaliburProject({
                  uid: pEl.data.uid
              });

              this._beforeProjectReady(pEl);
//          this.onProjectReady.next(pEl);
              //        this.appmenuSvc.onProjectOpen();

              return pEl;
            }else{
              this.stopOpening();
              this.outputSvc.print( OutputMessage.newError({ src:"Project Manager", msg:pEl.msg}))
            }
          }
      )
    );
  }


  /**
   *
   *
   * @param pFile
   * @return {string} UID mapped to uploaded file
   */
  uploadFile( pFile:File) :Observable<string> {

    const form = new FormData();
    form.append('file', pFile);

    this._uploaded[pFile.name+":"+pFile.size] = null;

    console.log(form);

    const req = this._processUpload(
        this.endpoints['workspace']['upload'], form
    ).pipe(
        finalize(()=>{
          console.log(" uploadFile > finalize");

          this.subscriptionUpload = null;
          this.progressUpload = null;
        })
    ).pipe(
        map((pEl:any)=>{

          console.log(" uploadFile > process response");

          if(pEl.success) {
            return pEl.data;
          }else{
            this.outputSvc.print( OutputMessage.newError({ src:"Project Manager", msg:pEl.msg}))
          }
        })
    );

    this.subscriptionUpload = req.subscribe((vEvent)=>{

        console.log("Upload progress > ",vEvent)

        if(vEvent!=null){
            this._uploaded[pFile.name+":"+pFile.size] = vEvent.upload;
        }


        if (vEvent.type == HttpEventType.UploadProgress) {
        this.progressUpload = Math.round(100 * (vEvent.loaded / vEvent.total));
      }
    })

    return this.subscriptionUpload;
  }

  getProjectInfo( pProject:DexcaliburProject) :Observable<any> {
    return this._process(
      this.endpoints['project']['info'],
      { 'uid': pProject.uid }
    ).pipe(
      map((pEl:any)=>{
        console.log('Project service > getProjectInfo > ',pEl);
        if(pEl.success)
          return pEl.data;
        else
          return null;
      })
    );
  }


  /**
   *
   * @param pPpt
   * @param pValue
   */
  isAvailable( pPpt:string, pValue:string):Observable<boolean> {
    return this._process(
      this.endpoints['workspace']['test'],{
        field: pPpt,
        value: pValue
      }).pipe(
        map((pEl:any)=>{
          return pEl.data.availability;
        })
      );
  }

    /**
     *
     * @param pPpt
     * @param pValue
     */
    getProject(  pUID:string):Observable<{loaded:boolean, project:Nullable<DexcaliburProject>}> {
        return this._process(
            this.endpoints['workspace']['info'],{
                uid: pUID,
            }).pipe(
            map((pEl:any)=>{
                //new DexcaliburProject()
                if(pEl.success){
                    return {
                        loaded: pEl.data.loaded,
                        project: new DexcaliburProject(pEl.data.projects)
                    }
                }else{
                    return {loaded:false, project:null};
                }
            })
        );
    }
  /**
   *
   * It should be called only when a new window pops or when a project is closed.
   */
  getActiveProject(pSource = ""):Observable<DexcaliburProject[]> {
    return this._process(
      this.endpoints['project']['active']
    ).pipe(
      map((pEl:any)=>{
        console.log('Project service > getActiveProject [from='+pSource+'] > ',pEl);

        if(pEl.success){
          /*if(pEl.data != null && pEl.data.length==1){

            this.activeProject = [];
            const project = pEl.data[0];



            DxcApiToken.remove("puid");
            DxcApiToken.create("puid", project.uid);

            this._refreshDefaultDeviceFor(project);

            this.activeProject.push(project);
            this.selected = project;
            //this.onProjectReady.next( project);
            //this.appmenuSvc.onProjectOpen();

            this._beforeProjectReady(project);
          }*/

          return pEl.data;
        }
      })
    );
  }

    /**
     * To select another active project
     * @param pProject
     */
  selectActiveProject(pProject:DexcaliburProject): Observable<any> {
    return this._process(
      this.endpoints['project']['set_active'],
      {
        uid: pProject.uid
      }
    ).pipe( map( (pData:any)=>{
        if(pData.success){
          this._beforeProjectReady(pProject, false);
          return pData;
        }else{
          this.outputSvc.print( OutputMessage.newError({ msg:pData.msg, src:"Project Manager"}));
          return null;
        }
    }));
  }

/**
 * To switch
 * @param pProject
 */
  switchTo(pProject:DexcaliburProject):Observable<any> {

      console.log("Switch to > ",pProject);

        /*this.getProjectInfo(pProject).subscribe((pEvent)=>{
            this._refreshDefaultDeviceFor(pEvent);
            this.selected = pEvent;
            this._beforeProjectReady(pEl);
            //this.onProjectReady.next(pEl);
            // this.appmenuSvc.onProjectOpen();
        });*/

        DxcApiToken.remove("puid");
        DxcApiToken.create("puid", pProject.uid)

        this._refreshDefaultDeviceFor(pProject);
        this.selected = pProject;
        // select remotely for the current user
        return this.selectActiveProject(pProject);
  }

  /**
   * To refresh the default device of the project instance with instance of specified device
   *
   * @param {DexcaliburProject} pProject The project to refresh
   * @return {Device} The instance of the default device of the project after refresh
   * @method
   * @since 1.0.0
   */
  private _refreshDefaultDeviceFor( pProject:DexcaliburProject):Device{
    if(typeof (pProject.device)==='string'){
      const devUID = pProject.device;
      this.devSvc.listDevices(DeviceCacheFlavor.CACHE_FIRST).subscribe( (vDevs:Device[]) => {
        vDevs.map( (vDev:Device)=>{
          if(vDev.uid === devUID){
            pProject.device = vDev;
          }
        });
      });
    }

    return pProject.device;
  }

  getSelectedProject():Nullable<DexcaliburProject>{
    return this.selected;
  }


  startOpening( pUID:string, pCreating = false, pProgress = 5, pMsg = 'Opening project'):void {
    this.onProjectOpening.next({ project:pUID, creating:pCreating });
  }

  stopOpening( ):void {
    this.onProjectHaltOpening.next({});
  }

  getPackageID( pActiveProject = 0):Nullable<string>{
    if(this.activeProject.length > 0 && this.activeProject[pActiveProject]!=null){
      return this.activeProject[pActiveProject].package;
    }else{
      throw new Error("Package identifier cannot be retrieved. There is not active project.");
    }
  }

  validate( pValue:string, pType:string):Observable<any> {
    return this._process(
      this.endpoints['validate']['post'],
      {
          field: pType,
          val: pValue
        }
      ).pipe( map((pData:any)=>{
        if(!pData.success){
          this.outputSvc.print( OutputMessage.newError({msg: "An error occurred during data validation", src:"Project Manager" }));
          return { valid:null, err:null };
        }else{
          return pData.data;
        }
      }));
  }
  hasMultipleActiveProject():boolean {
    return (this.activeProject.length > 0)
  }

  isProjectIsOpen() {
    return (this.selected != null);
  }


  updateSettings(pProject: DexcaliburProject, pSettings:any) {

    pSettings.project = pProject.uid;

    return this._process(
      this.endpoints['project']['edit_settings'],
      pSettings
    ).pipe(
      map(pRes => {
        if(pRes.success==false){
          this.outputSvc.print(OutputMessage.newError({ msg:pRes.msg, src:"Project Manager" }));
          return false;
        }else{
          this.outputSvc.print(new OutputMessage({ msg:"Project settings have been successfully updated.", src:"Project Manager" }));

          const changes:ProjectSetting[] = []
          for(const ppt in pSettings){
            changes.push({
              name: ppt,
              value: pSettings[ppt]
            });
          }


          this.onProjectSettingsChange.next(changes);

          return true;
        }
      })
    )
  }

  setDefaultDevice(pDevice: Device, pProject:Nullable<DexcaliburProject>=null) {
    return this._process(
      this.endpoints['project']['set_device'],
      {
        device: pDevice.uid,
        project: (pProject!=null ? pProject.uid : "")
        // project
      }
    ).pipe(
      map(pRes => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({ msg: pRes.msg }));
        }else{
          this.outputSvc.print(new OutputMessage({ msg:"Default device updated for active project.", src:"Project Manager" }));
          return pRes;
        }
      })
    )
  }

    /**
     * To retrieve the upload UID associated to an uploaded file.
     *
     * It works only for thie tab panel
     *
     * @param {string} pTargetFile
     */
    findUploadUid(pTargetFile: Nullable<File>):Nullable<string> {
      if(pTargetFile==null){
          return null;
      }

      return this._uploaded[pTargetFile.name+":"+pTargetFile.size];

    }

    getProjectNode(pProjectUID:string):Observable<DexcaliburProject> {
        return this._process(
            this.endpoints['project']['load'],
            {
                uid: pProjectUID
            }
        ).pipe(
            map(pRes => {
                if(!pRes.success){
                    this.outputSvc.print(OutputMessage.newError({ msg: pRes.msg }));
                }else{
                    this.outputSvc.print(new OutputMessage({ msg:"Default device updated for active project.", src:"Project Manager" }));
                    return pRes;
                }
            })
        )
    }
}

