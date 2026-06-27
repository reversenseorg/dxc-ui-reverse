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

import {Injectable} from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {finalize, Observable, Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {DxcApiService} from "../../base/DxcApiService";
import {Nullable} from "../../base/Nullable";
import {ApplicationUnit, ApplicationUnitUUID} from "../../models/ApplicationUnit";
import {AuthService} from "../auth/ctrl/auth.service";
import {OutputService} from "../output/ctrl/output.service";
import {Device} from "../../models/Device";
import {ProjectOrder} from "../../models/project/ProjectOrder";
import {OutputMessage} from "../../cmp/OutputMessage";
import {ScanOrder} from "../../models/ScanOrder";
import {Connection} from "../../models/orgs/auth/Connection";
import {DxApiResponse} from "../../base/common/common";
import {OrganizationUnitUUID} from "../../models/orgs/OrganizationUnit";
import {ProjectInputPurpose} from "../../models/project/ProjectInput";
import {UploadedFile} from "../../models/project/common";


const AUTH_ENFORCE = false;


export interface SsoOptions {
    clientId?: string;
    clientSecret?: string;
    discoverUri?: string;
}
/**
 * Represent the service to manage projects
 *
 * @class
 */
@Injectable({
    providedIn: 'root'
})
export class ApplicationService extends DxcApiService {

    app:Nullable<ApplicationUnit> = null;
    onFileUpload:Subject<UploadedFile> = new Subject<UploadedFile>();
    onProjectOpening:Subject<any> = new Subject<any>();
    onProjectHaltOpening:Subject<any> = new Subject<any>();

    private _subscriptionUpload: Nullable<Subscription>[] = [];
    private _progressUpload: any[] = [];



    /**
     *
     * @param {OutputService} outputSvc
     * @param {HttpClient} _http
     * @constructor
     */
    constructor( private _authSvc:AuthService,
                 private _outputSvc:OutputService,
                 _http:HttpClient) {
        super(
            {
                app: {
                    listScan: { method: 'GET', url:'/application/au/:aid/scan/list', format:'json', auth:AUTH_ENFORCE, puid:false},
                    listDevs: { method: 'GET', url:'/application/au/:aid/dev/list', format:'json', auth:AUTH_ENFORCE, puid:false},
                    attachDevice: { method: 'PUT', url:'/application/block/:uid', format:'json', auth:AUTH_ENFORCE, puid:false},
                    info: { method: 'GET', url:'/application/au/:aid/info', format:'json', auth:AUTH_ENFORCE, puid:false},
                    store_dl:  { method: 'POST', url:'/application/au/:aid/store/download', format:'json', auth:AUTH_ENFORCE, puid:false},
                    extract_dl:  { method: 'POST', url:'/application/au/:aid/store/info/:rid', format:'json', auth:AUTH_ENFORCE, puid:false},
                    relupload: { method: 'POST', url:'/workspace/upload', format:'json', auth:false},
                },
                org:{
                    quickstart_dl: { method: 'POST', url:'/organization/ou/org/:oid/store/:cid/dl', format:'json', auth:AUTH_ENFORCE, puid:false},
                    quickstart_check: { method: 'POST', url:'/organization/ou/org/:oid/wizard/appcheck', format:'json', auth:AUTH_ENFORCE, puid:false},
                },
                project_order:{
                    list: { method: 'GET', url:'/organization/ou/app/:aid/project/orders', format:'json', auth:AUTH_ENFORCE, puid:false},
                },
                scan_order:{
                    list: { method: 'GET', url:'/organization/ou/app/:aid/scan/orders', format:'json', auth:AUTH_ENFORCE, puid:false},
                }
            },_http, _outputSvc
        );
    }



    getInfo(pAppUnitUUID:ApplicationUnitUUID):Observable<ApplicationUnit>{
        return this._process(
            this.endpoints['app']['info'],
            {
                aid: pAppUnitUUID,
            }
        ).pipe(
            map((pEl:any)=>{
                return new ApplicationUnit(pEl.data);
            })
        );
    }

    listDevs(pAppUnitUUID:ApplicationUnitUUID):Observable<Device[]>{
        return this._process(
            this.endpoints['app']['listDevs'],{
                aid: pAppUnitUUID,
            }
        ).pipe(
            map((pEl:any)=>{
                return pEl.success;
            })
        );
    }

    listStores(pAppUnitUUID:ApplicationUnitUUID):Observable<Device[]>{
        return this._process(
            this.endpoints['app']['listDevs'],{
                aid: pAppUnitUUID,
            }
        ).pipe(
            map((pEl:any)=>{
                return pEl.success;
            })
        );
    }

    listReports(pAppUnitUUID:ApplicationUnitUUID):Observable<Report[]>{
        return this._process(
            this.endpoints['app']['rerollokc'],{
                aid: pAppUnitUUID,
            }
        ).pipe(
            map((pEl:any)=>{
                return pEl.success;
            })
        );
    }

    /**
     * To list project orders
     *
     * @param {ApplicationUnitUUID} pAppUnit AppUnit UUID
     * @return {Observable<ProjectOrder[]>}
     * @method
     */
    listProjectOrders(pAppUnit: ApplicationUnitUUID):Observable<ProjectOrder[]> {
        return this._process(
            this.endpoints.project_order.list,
            { aid:pAppUnit }
        ).pipe(
            map(pRes => {
                if(pRes.success==false){
                    this._outputSvc.alert(OutputMessage.newError({
                        src: 'Application Manager',
                        msg: pRes.msg
                    }));
                    return [];
                }else{
                    return pRes.data.map((x:any) => new ProjectOrder(x));
                }
            })
        )
    }


    /**
     * To list project orders
     *
     * @param {ApplicationUnitUUID} pAppUnit AppUnit UUID
     * @return {Observable<ProjectOrder[]>}
     * @method
     */
    listScanOrders(pAppUnit: ApplicationUnitUUID):Observable<ScanOrder[]> {
        return this._process(
            this.endpoints.scan_order.list,
            { aid:pAppUnit }
        ).pipe(
            map(pRes => {
                if(pRes.success==false){
                    this._outputSvc.alert(OutputMessage.newError({
                        src: 'Application Manager',
                        msg: pRes.msg
                    }));
                    return [];
                }else{
                    return pRes.data.map((x:any) => new ScanOrder(x));
                }
            })
        )
    }

    startOpening( pUID:string, pCreating = false, pProgress = 5, pMsg = 'Opening project'):void {
        this.onProjectOpening.next({ project:pUID, creating:pCreating });
    }

    stopOpening( ):void {
        this.onProjectHaltOpening.next({});
    }

    newReleaseFromFiles(pOptions:any):Observable<boolean> {

        // lock service, prevent concurrent exec
        /*if(this.isLocked()) {
            this.outputSvc.print(OutputMessage.newError({ msg:"Multiple project cannot be removed/opened/created in a same time. Please wait ..." }));
            throw new Error("Multiple project cannot be created in a same time. Please wait ...");
        }else {
            this.setLock(true);
        }*/

        //this.startOpening(pOptions.name, true);

        return this._process(
            this.endpoints.app.addRelease, {

            }
        ).pipe(
            map((pEl:any)=>{

                // unlock service
                //this.setLock(false);

                if(pEl.success) {

                    return true;
                }else{
                    this.stopOpening();
                    this._outputSvc.alert( OutputMessage.newError({ src:"Project Manager", msg:pEl.msg}));
                    return false;
                }
            })
        );
    }

    /**
     *
     *
     * @param pFile
     * @return {string} UID mapped to uploaded file
     */
    uploadFile( pFile:File, pLocalUID:string) :Nullable<Subscription> {

        const uplCtr = this._subscriptionUpload.length;
        const form = new FormData();
        form.append('file', pFile);

        const req = this._processUpload(
            this.endpoints['app']['relupload'], form
        ).pipe(
            finalize(()=>{
                console.log(" uploadFile > finalize");
                this._subscriptionUpload[uplCtr] = null;
                this._progressUpload[uplCtr] = null;
            })
        ).pipe(
            map((pEl:any)=>{

                console.log(" uploadFile > process response > ",pEl);

                if(pEl.success) {
                    return pEl.data;
                }else{
                    this._outputSvc.alert( OutputMessage.newError({ src:"Project Manager", msg:pEl.msg}))
                }
            })
        );

        this._subscriptionUpload[uplCtr] = req.subscribe((vEvent:any)=>{

            console.log(" uploadFile > process response > subscribe ",vEvent);

            if (vEvent.type == HttpEventType.UploadProgress) {
                this._progressUpload[uplCtr] = Math.round(100 * (vEvent.loaded / vEvent.total));
            }

            this.onFileUpload.next({
                filename: pFile.name,
                uid: vEvent.upload,
                localUID: pLocalUID
            });
        })

        return this._subscriptionUpload[uplCtr];
    }


    /**
     *
     * @param pApp
     * @param pConn
     */
    downloadReleaseOver(pApp:ApplicationUnitUUID, pConn:Connection):Observable<DxApiResponse<any>> {
        return this._processApiRequest<any>(
            this.endpoints['app']['store_dl'],
            { aid: pApp, cid: pConn.getUID() }
        );
    }

    /**
     *
     * @param pApp
     * @param pConn
     */
    downloadPackageOver(pOrg:OrganizationUnitUUID, pPackageID:string, pConn:Connection)
            :Observable<DxApiResponse<{ uid:string, purpose:ProjectInputPurpose}[]>> {
        return this._processApiRequest<any>(
            this.endpoints['org']['quickstart_dl'],
            { oid:pOrg, pkg: pPackageID, cid: pConn.getUID() }
        );
    }

    extractReleaseInfo(pApp:ApplicationUnitUUID, pResUID:string) {
        return this._processApiRequest<any>(this.endpoints['app']['extract_dl'], { aid: pApp, rid: pResUID } );
    }

    /**
     *
     * @param pOrg
     * @param pSettings
     */
    checkApp(pOrg: OrganizationUnitUUID, pSettings: any):Observable<DxApiResponse<any>> {
        return this._processApiRequest<any>(
            this.endpoints['org']['quickstart_check'],
            { oid:pOrg, ...pSettings }
        );
    }
}

