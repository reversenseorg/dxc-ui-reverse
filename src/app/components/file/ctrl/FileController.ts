import {ViewportView} from "../../../cmp/ViewportView";
import {IController} from "../../../base/controllers/IController.interface";
import {Subject} from "rxjs";
import {ComponentFactoryResolver} from "@angular/core";
import {CodeControllerService} from "../../code/ctrl/code-controller.service";
import {AppComponent} from "../../../app.component";
import {StageComponent} from "../../stage/stage.component";
import {ViewerController} from "../../viewer/ctrl/ViewerController";
import {FilesystemService} from "./FilesystemService";
import {FS_SUBVIEW} from "../explorer-file/explorer-file.component";
import {OutputService} from "../../output/ctrl/output.service";
import {File, FileLocation} from "../../../cmp/File";


export class FileController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'file';

  id:string = null;
  app: StageComponent = null;

  service: FilesystemService = null;

  explorerCmp: any = null;
  viewCmp: any = null;
  terminalCmp: any = null;
  modalCmp: any = null;

  views:ViewportView[] = [];

  componentFactoryResolver:ComponentFactoryResolver = null;

  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();

  viewer: ViewerController = null;
  //viewComp: ViewportCodeComponent = null;

  constructor(pConfig:any=null) {
    this.configure(pConfig);
  }

  configure( pConfig:any=null):void {
    if(pConfig==null) return;

    for(let i in pConfig){
      if(this.hasOwnProperty(i)) this[i] = pConfig[i];
    }
  }

  getExplorerCmp():any {
    return this.explorerCmp.main;
  }

  getViews():ViewportView[]{
    return this.views;
  }

  close(pItem: any, pSrc:any): any {

  }

  open(pItem: any, pSrc:any): any{

    if(this.viewer==null)
      this.viewer = (this.app.getController('ctrl:viewer') as ViewerController);

    let fn:any = null;

    switch(pItem.pool){
      case FS_SUBVIEW.DEV:
        this.service.listWorkspace(pItem.file.p).subscribe( pFile => {
          console.log(pFile);
          if(pFile!=null && pFile.length==1){
            pFile[0].local = true;
            this.viewer.open(pFile[0], 'file');
          }else{
            // add output svc
          }
        });
        break;
      case FS_SUBVIEW.APP:
        this.service.listWorkspace(pItem.file.p).subscribe( pFile => {
          if(pFile!=null && pFile.length==1){
            pFile[0].local = true;
            this.viewer.open(pFile[0], 'file');
          }else{
            // add output svc
          }
        });
        break;
      case FS_SUBVIEW.WS:
        this.service.listWorkspace(pItem.file.p).subscribe( pFile => {
          if(pFile!=null && pFile.length==1){
            pFile[0].local = true;
            this.viewer.open(pFile[0], 'file');
          }else{
            // add output svc
          }
        });
        break;
      case FS_SUBVIEW.PKG:
              console.log(pItem.file._uid);
              switch (pItem.file.t) {
                case 'ELF':
                  fn = this.service.viewNativeFileContent(pItem.file._r, 'PKG').subscribe( pFile => {
                    console.log(pFile);
                    if(pFile!=null) {
                      //console.log(pFile);
                      (pFile as any).local = true;
                      pFile._icon = pItem.file._icon;
                      this.app.getController('ctrl:native-main').open(pFile, 'file');
                    }
                  });

                  break;
                default:

                  fn = this.service.viewFileContent(pItem.file._uid).subscribe( pFile => {
                    console.log(pFile);
                    if(pFile!=null) {
                      //console.log(pFile);
                      (pFile as any).local = true;
                      pFile._icon = pItem.file._icon;
                      this.viewer.open(pFile, 'file');
                    }
                  });
                  break;
              }



        break;
    }
  }
}
