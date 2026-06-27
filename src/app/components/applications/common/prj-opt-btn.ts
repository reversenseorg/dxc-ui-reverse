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

import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit} from "@angular/core";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {MenuModule} from "primeng/menu";
import {Button} from "primeng/button";
import {LayoutService} from "../../../../layout/service/app.layout.service";
import DexcaliburProject from "../../../api/DexcaliburProject";
import {ProjectService} from "../../project/project.service";
import {Nullable} from "../../../api/common";
import {ApplicationUnitUUID} from "../../../api/orgs/ApplicationUnit";


@Component({
    selector: 'dxp-prj-opts-btn',
    template: `
        <p-menu #menu [model]="items" />
        <p-button (onClick)="menu.toggle($event)" text="true" outlined="false" styleClass="dxp-white-btn" icon="pi pi-ellipsis-v"/>
    `,
    providers: [MessageService],
    standalone: true,
    imports: [
        MenuModule,
        Button
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareButtonOptionsComponent implements OnInit {

    @Input() prj: DexcaliburProject;
    @Input() app: Nullable<ApplicationUnitUUID>;
    @Input() help: string;
    @Input() styleClass = "";

    @Input() onDrop: EventEmitter<DexcaliburProject> = new EventEmitter();
    @Input() onDropCancel: EventEmitter<DexcaliburProject> = new EventEmitter();

    items:MenuItem[] = [];

    private _droping: Nullable<DexcaliburProject> = null;

    constructor(
        private _msgSvc:MessageService,
        private _confirmSvc:ConfirmationService,
        private _prjSvc:ProjectService,
        public layoutService: LayoutService) {
    }

    ngOnInit() {
        this.items = [
            {
                label: 'Copy UID',
                icon: 'pi pi-copy',
                command: () => {
                    navigator.clipboard.writeText(this.prj.uid)
                }
            },{
                label: 'Explore code',
                icon: 'pi pi-eye',
                command: () => {
                    window.open(location.protocol+"//"+location.hostname+":"+location.port+"/pro/#/project/puid/"+this.prj.uid, "_blank");
                }
            },{
                label: 'Help',
                url: 'https://help.reversense.com/'+(this.help!=null?this.help:"")
            },
            { separator: true },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
                command: () => {
                    this.drop(this.prj);
                }
            }

        ];
    }

    drop(pProj:DexcaliburProject):void {

        this._confirmSvc.confirm({
            header: 'Confirm removing ',
            message: 'Are you sure to remove the project ?',
            accept: () => {

                console.log("ACCEPTED DROP");
                this._prjSvc.removeProject(pProj,(this.app!=null ? this.app : null)).subscribe((vResp)=>{

                    this._msgSvc.clear();
                    if(!vResp.success || (vResp.data!=null && !vResp.data)){
                        this._msgSvc.add({ severity: 'error', summary: 'Project cannot be removed', detail: 'Something is wrong with inputs. Please contact support.' });
                    }else{
                        // reset dialog state
                        this._droping = null;
                        // print msg
                        this._msgSvc.add({ severity: 'success', summary: 'Project has been removed', life: 3000 });
                    }

                    this.onDrop.emit(pProj);
                });
            },
            reject: () => {
                this._msgSvc.add({ severity: 'error', summary: 'Cancelled', detail: 'You have cancelled project removing', life: 3000 });
                this.onDropCancel.emit(pProj);
            }

        });
    }
}