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
import {ProjectService} from "../ctrl/project.service";
import {ModalNewProjectComponent} from "../modal-new-project/modal-new-project.component";
import {ModalOpenProjectComponent} from "../modal-open-project/modal-open-project.component";
import {ModalProjectSettingsComponent} from "../modal-project-settings/modal-project-settings.component";
import {AuthService} from "../../auth/ctrl/auth.service";
import {ModalProjectAnalConfigComponent} from "../modal-project-anal-config/modal-project-anal-config.component";

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
      icon: GLOBAL_ICONS.PACKAGE,
      color: 'dxc-text-clear100'
    })
  });

  data:any = null;

  projectName:string = null;

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
    this.projSvc.onAnalysisConfig.subscribe( (pEvent:any) => {
      this.modalAnal.show( pEvent.force_native, pEvent.callback );
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

  performExtra( pActionName:string):void {

  }

  openGlobalSettings( pSubmenu:string = null):void {
    //this.
  }
}
