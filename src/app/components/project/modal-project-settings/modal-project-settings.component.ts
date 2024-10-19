import {
  AfterContentInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ProjectService} from "../ctrl/project.service";
import {Device} from "../../../models/Device";
import {DeviceCacheFlavor, DeviceManagerService} from "../../device/ctrl/device-manager.service";
import {PlatformService, PlatformSet} from "../../platform/ctrl/platform.service";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}


export interface ProjectSettings {
  device:Nullable<Device>,
  platform?:any,
  devUID?:string
}


@Component({
  selector: 'dxc-modal-project-settings',
  templateUrl: './modal-project-settings.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalProjectSettingsComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() controller:any;

  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:string = "Project settings";
  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  gIcons:any = GLOBAL_ICONS;

  item: any = null;

  project:Nullable<DexcaliburProject> = null;

  // model
  deviceList: Device[] = [];
  device: string;
  devuid:Nullable<string> = null;
  pltList: PlatformSet;
  platform: any;

  previous:ProjectSettings = {
    device: null,
    platform: null
  };

  success:any =  {
    dev: false,
    plt: false
  };

  display:any = {
    dev: false,
    pltf: false
  };
  dev: any;
  msg:string = "";

  constructor( private devSvc:DeviceManagerService,
               private platformSvc:PlatformService,
               private outputSvc:OutputService,
               private kbSvc:KeyboardNavigationService,
               private projSvc:ProjectService) {
    super();
  }


  ngOnInit(): void {
    this.kbSvc.register(this);
  }


  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }

  displayDeviceList(pForce =false):void {
    if(!pForce){
      this.deviceList = this.devSvc.listDevicesFromCache();
      this.display.dev = true;
    }

    /*
    this.devSvc.listDevices(DeviceCacheFlavor.CACHE_FIRST).subscribe(
      (pDevs) => {
        console.log(pDevs);
        this.deviceList = pDevs;
        this.display.dev = true;
      }
    );*/
  }


  displayPlatformList():void {
    this.platformSvc.list().subscribe(
      (pPltf) => {
        this.pltList = pPltf;
        /*if(this.project!=null){
          for(let i=0; i<this.pltList.length; i++){
            if(this.pltList[i].uid===this.project.platform){
              this.project.platform = this.pltList[i];
              break;
            }
          }
        }*/
        this.display.pltf = true;
      }
    );
  }

  show(){
      // if project is not cached, retrieve info from server
      this.project = this.projSvc.getSelectedProject();

      if(this.project==null){
        throw UIException.PROJECT_IS_NOT_READY("modal-project","show");
      }

      this.projSvc.getProjectInfo(this.project).subscribe( (pInfo:any)=>{
        console.log(pInfo);

        this.device = pInfo.device;
        this.platform = pInfo.platform;

        this.displayDeviceList();
        this.displayPlatformList();
        console.log(this);
        this.modal.show();
      });

  }

  close(){
    this.modal.hide('close');
  }

  /**
   * Save changes
   */
  save():void{

  }


  openDevicePanel() {

  }

  @HostListener('document:keydown.escape')
  onEscape(){
    if(this.modal.isDisplayed()){
      this.close();
    }
  }

  changeDevice() {

    if(this.project==null){
      throw UIException.PROJECT_IS_NOT_READY("modal-project","show");
    }

    this.projSvc.updateSettings(
      this.project,
      {
        device: this.device
      }
    ).subscribe((pRes)=>{
      this.success.dev = pRes;
    });
  }


  changePlatform() {

    if(this.project==null){
      throw UIException.PROJECT_IS_NOT_READY("modal-project","show");
    }

    this.projSvc.updateSettings(
      this.project,
      {
        platform: this.project.platform
      }
    ).subscribe((pRes)=>{
      this.success.plt = true;
    });
  }
}
