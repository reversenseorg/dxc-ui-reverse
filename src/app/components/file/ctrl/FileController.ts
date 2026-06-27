/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {ViewportView} from "../../../cmp/ViewportView";
import {IController, IControllerOptions} from "../../../base/controllers/IController.interface";
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
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {UIException} from "../../../base/error/UIException";
import ModelFile from "../../../models/ModelFile";

export interface FileNode {
    file: ModelFile,
    type: string,
    pool: number
}
export class FileController implements IController {

  /**
   * Controller unique name
   * @type {string}
   */
  name:string = 'file';

  id:Nullable<string> = null;
  app: Nullable<StageComponent> = null;

  service: FilesystemService;

  explorerCmp: any = null;
  viewCmp: any = null;
  terminalCmp: any = null;
  modalCmp: any = null;

  views:ViewportView[] = [];

  componentFactoryResolver:Nullable<ComponentFactoryResolver> = null;

  openView: Subject<any> = new Subject<any>();
  closeView: Subject<any> = new Subject<any>();
  focusView: Subject<any> = new Subject<any>();


  constructor(pConfig:IControllerOptions) {
    this.configure(pConfig);
  }

  configure( pConfig:IControllerOptions):void {
    if(pConfig==null) return;

    for(let i in pConfig){
      (this as IStringIndex<any>)[i] = pConfig[i];
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

  openFile(pFile:ModelFile):any {
    if(this.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    const fileViewer = (this.app.getController('ctrl:viewer') as ViewerController);

    fileViewer.open(pFile, 'file');
  }

  open(pItem: FileNode, pSrc:any): any{

    if(this.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    const fileViewer = (this.app.getController('ctrl:viewer') as ViewerController);


    let fn:any = null;

    switch(pItem.pool){
      case FS_SUBVIEW.DEV:
      case FS_SUBVIEW.APP:
      case FS_SUBVIEW.WS:
        this.service.listWorkspace((pItem.file as any).p).subscribe( pFile => {
          if(pFile!=null && pFile.length==1){
            pFile[0].local = true;
              pFile[0]._ui = (pItem.file as any)._ui;
            fileViewer.open(pFile[0], 'file');
          }else{
            // add output svc
          }
        });
        break;
      case FS_SUBVIEW.PKG:
              console.log(pItem.file._uid);
              switch ((pItem.file as any).t) {
                case 'ELF':
                  fn = this.service.getNativeFileContent((pItem.file as any)._r, 'PKG').subscribe( pFile => {
                    console.log(pFile);
                    if(pFile!=null) {
                      //console.log(pFile);
                      (pFile as any).local = true;
                      pFile._icon = pItem.file._icon;
                      (this.app as any).getController('ctrl:native-main').open(pFile, 'file');
                    }
                  });

                  break;
                default:

                  fn = this.service.viewFileContent((pItem.file as any)._uid).subscribe( pFile => {
                    console.log(pFile);
                    if(pFile!=null) {
                      //console.log(pFile);
                      (pFile as any).local = true;
                      pFile._icon = pItem.file._icon;
                      fileViewer.open(pFile, 'file');
                    }
                  });
                  break;
              }



        break;
    }
  }
}
