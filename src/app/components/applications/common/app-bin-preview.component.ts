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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input, OnChanges,
    OnInit,
    SimpleChanges
} from "@angular/core";
import {UploadUID} from "../upload/upload-form.component";
import {ApplicationService} from "../application.service";
import {ApplicationUnit} from "../../../models/ApplicationUnit";
import {OrganizationUnitUUID} from "../../../models/orgs/OrganizationUnit";
import {OperatingSystem} from "../../../models/OperatingSystem";
import {Nullable} from "@antfu/utils";
import {AppPreview} from "../../../models/AppPackage";
import {OrganizationService} from "../../organization/organization.service";



@Component({
    selector: 'dxp-app-bin-preview',
    template: `
        <ng-container [ngSwitch]="step">
            <div *ngSwitchCase="'running'" [ngClass]="styleClass" class="grid w-full app-preview dl-process">
                <div class="col-12 text-center">
                    <ngb-progressbar type="info" [animated]="true" [value]="100" [max]="100" height="10px"></ngb-progressbar>
                    <i class="margin-top:2em">Downloading ...</i>
                </div>
            </div>
            <div *ngSwitchCase="'none'" [ngClass]="styleClass" class="grid w-full app-preview dl-none">
                <div class="col-12 text-center">
                    <ng-content select="[none]"></ng-content>
                </div>
            </div>
            <div *ngSwitchDefault [ngClass]="styleClass" class="grid w-full app-preview dl-none">
                <div class="col-12 text-center">
                    <ng-content select="[none]"></ng-content>
                </div>
            </div>
            <div *ngSwitchCase="'process'" [ngClass]="styleClass" class="grid w-full app-preview dl-process">
                <div class="col-12 text-center">
                    <ngb-progressbar type="info" [animated]="true" [value]="100" [max]="100" height="10px"></ngb-progressbar>
                    <i class="margin-top:2em">Reading ...</i>
                </div>
            </div>
            <div *ngSwitchCase="'failed'" [ngClass]="styleClass" class="grid w-full app-preview dl-failed">

                <div class="col-12 text-center">
                    <ngb-progressbar type="danger" [animated]="true" [value]="100" [max]="100" height="10px"></ngb-progressbar>
                    <span class="pi pi-exclamation-triangle" style="font-size:4em;"></span>
                    <i class="margin-top:2em">Download failed</i>
                </div>
            </div>

            <div *ngSwitchCase="'done'" [ngClass]="styleClass" class="dl-done">
                <ng-container *ngIf="preview!=null">
                    <div class="flex-none p-2">
                        <ng-container *ngIf="preview.icons; else noicon">
                            <img [src]="preview.icons" style="height:6em;width:6em;border-radius:1em;" alt="app icon" />
                        </ng-container>
                        <ng-template #noicon>
                            <i class="pi pi-question-circle" style="font-size:4em;"></i>
                        </ng-template>
                    </div>
                    <div class="flex-growth p-2">
                        <h5>{{ preview.name }}</h5>
                        <div>
                            <dxc-meta *ngIf="preview.version!=null" class="mr-2" [ngClass]="'text-info'" [value]="'v'+preview.version" ></dxc-meta>
                            <dxc-meta *ngIf="preview.fmt!=null" class="mr-2" [ngClass]="'dxc-azur  dxc-text-black'" [value]="'File Format : '+preview.fmt.toUpperCase()" ></dxc-meta>
                            <dxc-meta *ngIf="preview.minOs!=null" class="mr-2" [ngClass]="'text-info'" [value]="'Require OS version >= '+preview.minOs+''" ></dxc-meta>
                            <dxc-meta *ngIf="preview.os=='android' && preview.targetOs!=null" [ngClass]="'text-info'" [value]="'Recommended OS version : '+preview.targetOs" ></dxc-meta>
                        </div>
                        <i class="text-black-alpha-50">{{ preview.pkgId }}</i>
                    </div>
                </ng-container>
                
            </div>
        </ng-container>

    `,
    styles:[`
      .app-preview {
         border-radius: 1em;
         margin: 0;
         height: 8em;
      }

      .dl-none {
         border: none;
         background: #efefef60;
         color: #333;
        border-radius: 0.5em;
      }

      .dl-process {
        border: none;
         background: #f1f2ff60;
        border-radius: 0.5em;
      }

      .dl-failed {
        border: none;
         background: #ffcaca60;
        border-radius: 0.5em;
      }

      .dl-done {
         border: none;
         background: #e1ffdc60;
         border-radius: 0.5em;
      }
   `],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppbinPreviewComponent implements OnInit, OnChanges {

    @Input() preview: Nullable<AppPreview> = null;
    @Input() org: Nullable<OrganizationUnitUUID> = null;
    @Input() appUnit: Nullable<ApplicationUnit> = null;
    @Input() os: OperatingSystem = OperatingSystem.NONE;
    @Input() uploadUID: Nullable<UploadUID> = null;
    @Input() styleClass: string | string[] | any = "";
    @Input() step:string = 'none';

    constructor(
        private _changeRef: ChangeDetectorRef,
        private _orgSvc:OrganizationService,
        private _appSvc:ApplicationService) {
    }


    ngOnInit() {
        console.log("app-bin-preview-init : ",this.org!=null && this.uploadUID!=null);
        this.refresh();
    }

    ngOnChanges(pChanges: SimpleChanges): void {
        console.log("preview changes > ",pChanges)
        if(pChanges.step!=null){
            this.switchStep(pChanges.step.currentValue);
            return;
        }

        /*if(this.org!=null && this.uploadUID!=null){
            this.refresh();
        }*/
    }

    refresh() {
        if(this.uploadUID!=null && this.step!='process'){

            this.step = 'process';
            if(this.appUnit!=null){
                this._appSvc.extractReleaseInfo(this.appUnit.getUID(), this.uploadUID)
                    .subscribe((vPrev)=>{
                        if(vPrev.success && vPrev.data!=null){
                            this.step = 'done';
                            this.preview = {
                                ...vPrev.data,
                                iconUrl: (this._orgSvc.getBaseUrl()+`/organization/ou/org/${this.org}/upload/${this.uploadUID}/preview/icon`)
                            };

                            console.log("PREVIEW >>  ",this.preview);
                            this._changeRef.detectChanges();
                        }
                    });
            }else if(this.org!=null){
                this._orgSvc.getUploadPreview(this.org, this.os, this.uploadUID)
                    .subscribe((vPrev)=>{
                        if(vPrev.success && vPrev.data!=null){
                            this.step = 'done';
                            this.preview = {
                                ...vPrev.data,
                                iconUrl: (this._orgSvc.getBaseUrl()+`/organization/ou/org/${this.org}/upload/${this.uploadUID}/preview/icon`)
                            };
                            console.log("PREVIEW >>  ",this.preview);
                            this._changeRef.detectChanges();
                        }
                    })
            }
        }
    }

    reset(){
        this.preview = null;
        //this.os = OperatingSystem.NONE;
        this.uploadUID = null;
        this.step = 'none';
        this._changeRef.detectChanges();
    }


    switchStep(pStep: string) {

        if(pStep=='process'){
            if(this.uploadUID!=null){

                this.step = 'process';
                if(this.appUnit!=null){
                    this._appSvc.extractReleaseInfo(this.appUnit.getUID(), this.uploadUID)
                        .subscribe((vPrev)=>{
                            if(vPrev.success && vPrev.data!=null){
                                this.step = 'done';
                                this.preview = {
                                    ...vPrev.data,
                                    iconUrl: (this._orgSvc.getBaseUrl()+`/organization/ou/org/${this.org}/upload/${this.uploadUID}/preview/icon`)
                                };
                                console.log("PREVIEW >>  ",this.preview);
                                this._changeRef.detectChanges();
                            }
                        });
                }else if(this.org!=null){
                    this._orgSvc.getUploadPreview(this.org, this.os, this.uploadUID)
                        .subscribe((vPrev)=>{
                            if(vPrev.success && vPrev.data!=null){
                                this.step = 'done';
                                this.preview = {
                                    ...vPrev.data,
                                    iconUrl: (this._orgSvc.getBaseUrl()+`/organization/ou/org/${this.org}/upload/${this.uploadUID}/preview/icon`)
                                };
                                console.log("PREVIEW >>  ",this.preview);
                                this._changeRef.detectChanges();
                            }
                        })
                }
            }
        }
        else if(pStep=='none'){
            // reset
            this.reset();
        }else{
            this._changeRef.detectChanges();
        }
    }
}
