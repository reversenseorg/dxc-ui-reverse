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

import {ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Optional, Output} from '@angular/core';
import {MenuItem, MenuItemCommandEvent, MessageService} from 'primeng/api';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "../project/project.service";
import DexcaliburProject from "../../api/DexcaliburProject";
import {Nullable} from "../../api/common";
import {ApplicationUnit} from "../../api/orgs/ApplicationUnit";
import {OperatingSystem} from "../../api/OperatingSystem";
import {AuditService} from "../audit/audit.service";
import {OrganizationService} from "../organization/organization.service";
import {ApplicationService} from "./application.service";
import {ApplicationResolver} from "./application-resolver.service";
import {OrganizationUnit} from "../../api/orgs/OrganizationUnit";
import {DialogService} from "primeng/dynamicdialog";
import {ReleaseUploadFormComponent} from "./upload/upload-form.component";
import {AssuranceNewScanComponent} from "../audit/scan-new.component";
import {Connection} from "../../api/orgs/auth/Connection";
import {AssuranceReportUUID} from "../../api/audit/common/AssuranceReport";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxp-app-dashboard',
    templateUrl: './application.component.html',
    styles: [`
      .pageSubtitle {
        font-size: 1.2em;
        color: #fff;
      }
      .orgName {
         font-size: 3em;
         padding-top: 5px;
       }
    `],
    providers: [MessageService, ApplicationResolver, DialogService]
})
export class ApplicationComponent implements OnInit {

    @Input() apps:Nullable<DexcaliburProject> = null;
    @Input() title:string = "Organisation";
    @Input() appUnit: Nullable<ApplicationUnit> = null;
    @Input() orgUnit: Nullable<OrganizationUnit> = null;

    @Output() clickImport:EventEmitter<any> = new EventEmitter<any>();

    latestProject: Nullable<DexcaliburProject> = null;

    items!: MenuItem[];

    projects: DexcaliburProject[] = [];
    sReport:Nullable<AssuranceReportUUID> = null;
    //stores:MenuItem[] = [];
    isPrinted: boolean = false


    constructor(
        private _dialogSvc:DialogService,
        private _route:ActivatedRoute,
        private _projectSvc: ProjectService,
        private _orgSvc: OrganizationService,
        private _appSvc: ApplicationService,
        public auditSvc: AuditService,
        public layoutService: LayoutService,
        private _changeRef:ChangeDetectorRef) {

        if(this._route.snapshot.data.app!=null){
            this.appUnit = this._route.snapshot.data.app;
            this.orgUnit = this._route.snapshot.data.org;
            //this._changeRef.detectChanges();
        }

        this._route.data.subscribe((c)=>{
            if(c.rid!=null){
                this.sReport = c.rid;
            }
            if(c.oid!=null){
                this._orgSvc.getOrganization(c.oid).subscribe((vOrg)=>{
                    if(vOrg == null) return;

                    this.orgUnit = vOrg;
                    //this.refreshStores();

                    if(c.aid!=null){
                        this._orgSvc.listAppUnit(vOrg.getUID()).subscribe((vApps)=>{
                            this.appUnit = vApps.find(a => (a.getUID()===c.aid));
                        })
                    }
                });
            }
        });
    }

    ngOnInit() {
       // this.refreshStores();
    }

    /*
    refreshStores():void{
        if(this.orgUnit==null || this.appUnit==null) return;

        this._orgSvc.listConnection(this.orgUnit.getUID()).subscribe((vConns)=>{
            this.stores = [];
            vConns.map(c => {
                this.stores.push({
                    label: c.name,
                    command: (event: MenuItemCommandEvent)=>{
                     //   this.downloadReleaseOver(this.appUnit, c);
                    }
                })
            });
            this.stores = this.stores.concat([
                { separator: true },
                { label:"Add store", routerLink:['/connections'] }
            ]);
        });
    }*/

    protected readonly OperatingSystem = OperatingSystem;

    hasPackages():boolean {
        return (this.appUnit!=null && this.appUnit.hasReleases())
    }

    hasDeviceAttached() {
        return (this.appUnit!=null && this.appUnit.getTargetDevices().length>0)
    }

    loadPkg(pOrgUnit:Nullable<OrganizationUnit> = null, pAppUnit:Nullable<ApplicationUnit> = null) {
        this._dialogSvc.open(
            ReleaseUploadFormComponent,
            {
                header: "Load packages & inputs",
                width: '50%',
                height: '70%',
                modal: true,
                closable: true,
                breakpoints: {
                    '960px': '75vw',
                    '640px': '90vw'
                },
                data: {
                    orgUnit: (pOrgUnit!=null ? pOrgUnit : this.orgUnit),
                    appUnit: (pAppUnit!=null ? pAppUnit : this.appUnit)
                }
            }
        );
    }

    scanNow(pAppUnit:Nullable<ApplicationUnit> = null) {
        this._dialogSvc.open(
            AssuranceNewScanComponent,
            {
                header: "Order a new scan",
                width: '50%',
                height: '70%',
                modal: true,
                closable: true,
                breakpoints: {
                    '960px': '75vw',
                    '640px': '90vw'
                },
                data: {
                    app: (pAppUnit!=null ? pAppUnit : this.appUnit),
                    org: this.orgUnit
                }
            }
        );
    }

    protected readonly navigator = navigator;

   /* private downloadReleaseOver(pAppUnit: Nullable<ApplicationUnit>, pConn: Connection) {
        if(pAppUnit==null) return;

        this._appSvc.downloadReleaseOver(pAppUnit.getUID() ,pConn).subscribe((vSuccess)=>{
            if(vSuccess.success){
            }
        })
    }*/

    getIconData(pIcon: any) {
        return  `data:image/${["png","jpg","webp"][pIcon.format]};base64,${pIcon.data}`;
    }



    @HostListener('window:beforeprint')
    onBeforePrint(){
        this.isPrinted=true;
        this._changeRef.detectChanges();
    }

    @HostListener('window:afterprint')
    onAfterPrint(){
        this.isPrinted=false;
        this._changeRef.detectChanges();
    }
}
