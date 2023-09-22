import {Injectable} from "@angular/core";
import {from, Observable, Subject} from "rxjs";
import {ElectronService} from "../index";
import {IpcRenderer} from "electron";


interface ProjectStatus {
  [uid:string] :Subject<boolean>
}

@Injectable({
  providedIn: 'root'
})
export class DexcaliburServerService {

  ipcRenderer:IpcRenderer = null;

  projectsReady: ProjectStatus = {};
  status:Subject<number> = new Subject<number>();
  //ready: Observable<boolean> = from(true);

  constructor(private electronService: ElectronService) {
    this.initializeIpcRenderer();
  }




  /**
   * To initialize IPC event handlers
   *
   * @method
   * @private
   * @since 1.0.0
   */
  private initializeIpcRenderer() {

    if (this.electronService.ipcRenderer) {
      try {
        this.ipcRenderer = this.electronService.ipcRenderer;

        // handlers
        this.ipcRenderer.on('dxc-status', (pEvent, pArgs:any[])=>{
          console.log('[DXC SERVICE] (startus) : ',pEvent,pArgs);
          this.status.next(1);
        });

        this.ipcRenderer.on('dxc-project-ready', (pEvent, pArgs:any[])=>{
          console.log('[DXC SERVICE] (startus) : ',pEvent,pArgs);
          this.projectsReady[pArgs[0].uid].next(pArgs[0].ready);
        });


        console.log('[DXC SERVICE] IPC Renderer : ',this.ipcRenderer);
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
  }

  getRemoteStatus(pUrl:string):Observable<boolean> {
    return null;
  }


  getStatus():Observable<number> {
    this.ipcRenderer.send('dxc', [{cmd:'dxc-status', data:{}}]);

    return this.status;
  }

  /**
   * To check if the given project is Active
   * @param pUID
   * @param pRefresh
   */
  isProjectReady(pUID:string, pRefresh:boolean = false):Observable<boolean> {
    if(this.projectsReady.hasOwnProperty(pUID)){
      if(pRefresh){
        this.ipcRenderer.send('dxc', [{cmd:'dxc-ready', data:{ uid:pUID }}]);
      }
    }else{
      this.projectsReady[pUID] = new Subject<boolean>();
      this.ipcRenderer.send('dxc', [{cmd:'dxc-ready', data:{ uid:pUID }}]);
    }

    return this.projectsReady[pUID];
  }
}
