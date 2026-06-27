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

import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {DxcApiService} from "../../../base/DxcApiService";
import {map} from "rxjs/operators";
import ModelFile from "../../../models/ModelFile";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {Nullable} from "../../../base/Nullable";
import {ContextMenuEvent} from "../../../base/context-menu/context-menu.component";
import DataScope from "../../../models/DataScope";


/**
 * Represent web service to request server FS and device FS
 */
@Injectable({
    providedIn: 'root'
})
export class FilesystemService extends DxcApiService {

    showFile$: Subject<ModelFile> = new Subject();
    displayCtxMenu$: Subject<ContextMenuEvent> = new Subject<ContextMenuEvent>();

    constructor(private outputSvc: OutputService, protected override _http: HttpClient) {

        super({
            list: {
                dev: {method: 'GET', url: '/device/fs/list', format: 'json', puid: false, auth: false},
                devData: {method: 'GET', url: '/device/fs/list', format: 'json', puid: true, auth: false /* removed */},
                //app: { method: 'GET', url:'/device/fs/list', format:'json', puid:true, auth:false /* removed */},
                pkg: {
                    method: 'GET',
                    url: '/application/package/content',
                    format: 'json',
                    puid: true,
                    auth: false /* removed */
                },
                ws: {method: 'POST', url: '/project/ws', format: 'json', puid: true, auth: false /* removed */},
            },
            view: {
                file: {method: 'GET', url: '/file/view', format: 'json', puid: true, auth: false /* removed */},
            }
        }, _http, outputSvc);
    }

    /**
     * To create a list of ModelFile instance from raw data
     * @param pData
     * @private
     */
    private _createFileList(pData: any): ModelFile[] {
        const list: ModelFile[] = [];

        pData.map((vData: any) => {
            list.push(new ModelFile(vData));
        });

        return list;
    }


    /**
     * To display a contextual menu defined by FS components
     *
     * It is mainly used as a callback for `FilesystemService.displayCtxMenu$` event pipe
     *
     * @param {MouseEvent} pEvent Mouse event fired
     * @param {string} pType Contextual menu name
     * @param {any} pObject Options
     * @method
     */
    displayContextMenu(pEvent: any, pType: string, pObject: any): void {
        this.displayCtxMenu$.next({event: pEvent, type: pType, obj: pObject});
    }

    listDevicePath(pOptions: any = {}): Observable<ModelFile[]> {
        return this._process(
            (pOptions.app != null ? this.endpoints['list']['devData'] : this.endpoints['list']['dev']),
            pOptions
        ).pipe(
            map((pObs) => {
                if (pObs.success) {
                    return this._createFileList(pObs.data);
                } else {
                    this.outputSvc.print(OutputMessage.newError({msg: pObs.msg}))
                    return [];
                }
            })
        );
    }

    /*
    listAppPath( pOptions = null):Observable<any[]> {
      return this._process(
        this.endpoints['list']['app'],
        pOptions
      ).pipe(
        map((pObs)=>{
          if(pObs.success){
            return this._createFileList(pObs.data);
          }else{
            this.outputSvc.print( OutputMessage.newError({msg:pObs.msg}))
            return null;
          }
        })
      );
    }
    */

    listWorkspace(pPath: string = "", pOptions = null): Observable<any[]> {
        return this._process(
            this.endpoints['list']['ws'],
            {
                path: pPath
            }
        ).pipe(
            map((pObs) => {
                if (pObs.success) {
                    return pObs.data.map((vData: any) => new ModelFile(vData));
                } else {
                    this.outputSvc.print(OutputMessage.newError({msg: pObs.msg}))
                    return null;
                }
            })
        );
    }

    listPackageContent(pPath: string = "", pOptions = null): Observable<any[]> {
        return this._process(
            this.endpoints['list']['pkg'],
            {
                path: pPath
            }
        ).pipe(
            map((pObs) => {
                if (pObs.success) {
                    return pObs.data;
                } else {
                    this.outputSvc.print(OutputMessage.newError({msg: pObs.msg}))
                    return null;
                }
            })
        );
    }

    /**
     * To get the corresponding node from a path (1st arfgrelative to a scope
     * @param pRpath
     * @param pScope
     */
    getNativeFileContent(pRpath: string, pScope: string): Observable<Nullable<ModelFile>> {
        return this._process(
            this.endpoints['view']['file'],
            {
                path: pRpath,
                scope: pScope,
                uid: -1
            }
        ).pipe(
            map((pObs) => {
                if (pObs.success) {
                    return new ModelFile(pObs.data); //pObs.data;
                } else {
                    this.outputSvc.print(OutputMessage.newError({msg: pObs.msg}))
                    return null;
                }
            })
        );
    }


    /**
     * To display the content of a file from its path relative to a scope
     *
     * @param {string} pRpath Path relative to the root of the scope
     * @param {string} pScope Scope UID
     * @return {void}
     * @method
     */
    viewNativeFileContent(pRpath: string, pScope: string): void {
        this.getNativeFileContent(pRpath, pScope).subscribe((vFile: Nullable<ModelFile>) => {
            if (vFile != null) {
                this.showFile$.next(vFile);
            } else {
                // trigger FS error box
                this.outputSvc.alert(OutputMessage.newError({
                    src: 'File Manager',
                    msg: `File not found in ${pScope}`
                }));
            }
        });
    }

    viewFileContent(pUID: string, pOptions = null): Observable<Nullable<ModelFile>> {
        return this._process(
            this.endpoints['view']['file'],
            {
                uid: pUID
            }
        ).pipe(
            map((pObs) => {
                if (pObs.success) {
                    return new ModelFile(pObs.data); //pObs.data;
                } else {
                    this.outputSvc.print(OutputMessage.newError({msg: pObs.msg}))
                    return null;
                }
            })
        );
    }


}
