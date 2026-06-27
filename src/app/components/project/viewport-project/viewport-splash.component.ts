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
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {ViewportView} from "../../../cmp/ViewportView";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {SplashController} from "../ctrl/SplashController";
import {SPLASH_ICONS} from "../icons";
import {Subject} from "rxjs";
import {NewProjectRequest, ProjectService} from "../ctrl/project.service";
import {ModalNewProjectComponent} from "../modal-new-project/modal-new-project.component";
import {ModalOpenProjectComponent} from "../modal-open-project/modal-open-project.component";
import {ModalProjectSettingsComponent} from "../modal-project-settings/modal-project-settings.component";
import {AuthService} from "../../auth/ctrl/auth.service";
import {ModalProjectAnalConfigComponent} from "../modal-project-anal-config/modal-project-anal-config.component";
import {Nullable} from "../../../base/Nullable";
import {DeviceBindedData} from "../../device/common";
import AppPackage from "../../../models/AppPackage";

@Component({
  selector: 'app-viewport-splash',
  templateUrl: './viewport-splash.component.html',
  styleUrls: ['./viewport-splash.component.scss']
})
export class ViewportSplashComponent implements OnInit, AfterViewInit, IViewportContainer {

  @Input() controller: SplashController;
  @Input() parent: ViewportComponent;

  id = -1;
  uid = '';
  size:any = {
    height: '100%',
    width: '100%'
  };

  //activeLeft:string = 'hk';
  //activeWidth: number = 80;

  gIcons:any = GLOBAL_ICONS;
  icons:any = SPLASH_ICONS;

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Home',
      icon: GLOBAL_ICONS['PACKAGE'],
      color: 'dxc-text-clear100'
    })
  });

  data:any = null;

  projectName:Nullable<string> = null;

  @ViewChild(ModalNewProjectComponent) modalNewProj:ModalNewProjectComponent;
  @ViewChild(ModalOpenProjectComponent) modalOpenProj:ModalOpenProjectComponent;
  @ViewChild(ModalProjectSettingsComponent) modalSettings:ModalProjectSettingsComponent;
  @ViewChild(ModalProjectAnalConfigComponent) modalAnal:ModalProjectAnalConfigComponent;

  resize$: Subject<any> = new Subject<any>();

  constructor( private projSvc:ProjectService,
               private authSvc:AuthService,
               private changeDetector:ChangeDetectorRef) {
    this.projSvc.onMenuClick.subscribe( pEvent => {
      if(pEvent.item=="settings"){
        this.modalSettings.show();
      }
    });
  }

  ngOnInit(): void {
    this.projSvc.onMenuClick.subscribe( (pEvent:any) => {
      switch(pEvent.item){
        case 'open':
          this.modalOpenProj.show();
          break;
        case 'new-project':
          this.modalNewProj.show();
          break;
      }
    });

    this.projSvc.onAnalysisConfig.subscribe( (pEvent:NewProjectRequest<any>) => {
      // switch cases must match origin of t he "new project" request
      switch (pEvent.origin){
        case 'device:app':
          this.modalAnal.showFromApp( pEvent as NewProjectRequest<DeviceBindedData<AppPackage>>); // pEvent.force_native, pEvent.callback );
          break;
        default:
          break;
      }
    });
  }

  ngAfterViewInit() {
    //this.resize( this.size);
    //this.resize$.next(this.size);
  }

  configure( pData:any):void {

  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
    this.changeDetector.detectChanges();
  }
}
