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

import {Component, OnInit} from "@angular/core";
import {Device} from "../../models/Device";
import {ProjectService} from "./ctrl/project.service";
import {DeviceManagerService} from "../device/ctrl/device-manager.service";
import Platform from "../../models/Platform";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {SPLASH_ICONS} from "./icons";


@Component({
  selector: 'dxc-project-new',
  template: `
    <div class="splash-panel newproject">
      <div class="header">
        <h4>Create a new project</h4>
      </div>

      <div class="body">
        <h5 class="subtitle text-warning">Project settings</h5>
        <div class="row">
            <div class="col-lg-2 frm-label">
              <label for="projName">Project Name</label>
            </div>
            <div class="col-lg-10 frm-input">
              <input type="text" name="projName" [(ngModel)]="projectName" (change)="validate('project',$event)" />
            </div>
        </div>
        <div class="row">
          <div class="col-lg-2 frm-label">
            <label for="projName">Target application</label>
          </div>
          <div class="col-lg-10 frm-input">
            <input type="file" name="targetfile"  />
          </div>
        </div>


        <h5 class="subtitle text-warning">Target settings</h5>
        <div class="row">
          <div class="col-lg-2 frm-label">
            <label for="platform">Target platform</label>
          </div>
          <div class="col-lg-10 frm-input">
            <select class="" name="platform">
              <option value="min">Minimal version supported</option>
              <option value="max">Target version from manifest</option>
              <option value="dev"></option>
              <option disabled>--------------</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-2 frm-label">
            <label for="device">Test device</label>
          </div>
          <div class="col-lg-10 frm-input">
            <div class="frm-select">
              <div class="explorer-list-root" #devicesCtn>
                <!--
                <app-expandable-list *ngIf="devices.length>0">


                  <li class="dxc-text-75 exp-separator yellow">
                    Local devices
                  </li>

                  <ng-container *ngFor="let dev of devices">

                    <ng-template #expDevItem let-itemObj="item" >
                    <span *ngIf="itemObj.children">
                      <dxc-icon [model]="gIcons['FOLDER']"></dxc-icon>
                      {{ itemObj.label  }}
                    </span>

                      <span *ngIf="itemObj.children==null">
                            <dxc-icon [model]="dmSvc.isDeviceOnline(itemObj)? gIcons['UP'] : gIcons['DOWN']"></dxc-icon>
                        {{ itemObj.method  }}
                    </span>
                    </ng-template>

                    <app-expandable-item
                      [itemTpl]="expDevItem"
                      [item]="dev"
                      [provider]="this"
                      [itemType]="'h'"
                      [expandable]="dev.children!=null"
                      (itemFocus)="onItemFocus($event)"
                      (collapse)="onCollapse($event)"
                      (expand)="onExpand($event)"
                    >

                    </app-expandable-item>
                  </ng-container>
                </app-expandable-list>

                <div *ngIf="platform.length==0" class="text-center dxc-text-clear100 pt-4">
                  (!) There is not yet enrolled devices. Start <u class="text-warning">here</u> or lets it empty
                </div>
                <app-subnavbar [type]="'navbar'" [parent]="this" class="dxc-frm-nav-b">
                  <ng-container main>
                  </ng-container>
                  <ng-container options>
                    <app-subnavbar-btn [icon]="gIcons['PLUS']" [position]="'right'">&nbsp;Add</app-subnavbar-btn>
                  </ng-container>
                </app-subnavbar>
-->
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./project.component.scss','../../forms.scss']
})
export class NewProjectComponent implements OnInit {

  // UI
  gIcons: any = GLOBAL_ICONS;
  lIcons: any = SPLASH_ICONS;

  // model
  projectName:string = '';
  devices:Device[] = [];
  platform:Platform[] = [];

  activeSplash:string = 'new';

  constructor( private projectSvc:ProjectService,
               private dmSvc:DeviceManagerService) {

  }

  ngOnInit() {

  }

  validate(pType:string,pEvent:any=null){

  }

  onCollapse(){

  }

  onExpand(){

  }

  onItemFocus(){

  }
}
