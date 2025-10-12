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
import {Message} from "../../../cmp/Error";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {ProjectService} from "../ctrl/project.service";
import {Device} from "../../../models/Device";
import {DeviceManagerService} from "../../device/ctrl/device-manager.service";
import {PlatformService} from "../../platform/ctrl/platform.service";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {Nullable} from "../../../base/Nullable";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}





@Component({
  selector: 'dxc-modal-new-project',
  templateUrl: './modal-new-project.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalNewProjectComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() controller:any;
  @Input() closable = true;
  @Input() progress$:Observable<any> ;
  @Input() progressSrc:any = null;
  @Input() progress = 20;

  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:Nullable<string> = null;

  @Input() message:Nullable<Message> = null;

  @ViewChild('appFile',{read:ElementRef, static:true}) appFileEl:ElementRef;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  gIcons:any = GLOBAL_ICONS;

  item: any = null;

  // model
  projectName = "";
  method = "fs";
  targetFile:Nullable<File> = null;
  targetFileUplUID:Nullable<string> = null;
  targetFileName:Nullable<string> = null;
  targetUrl:Nullable<string> = null;
  proxyIp:Nullable<string> = null;
  proxyPort:Nullable<string> = null;
  httpHeaders:Nullable<string> = null;
  deviceList: any;
  device: Device;
  devuid:Nullable<string> = null;
  platform: any;

  display:any = {
    dev: false,
    pltf: false
  };
  dev: any;

  constructor( private changeDetectorRef: ChangeDetectorRef,
               private devSvc:DeviceManagerService,
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

  displayDeviceList():void {
    this.deviceList = this.devSvc.listDevices().subscribe(
      (pDevs) => {
        console.log(pDevs);
        this.deviceList = pDevs;
        this.display.dev = true;
      }
    );
  }


  displayPlatformList():void {
    this.display.pltf = true;
    this.changeDetectorRef.detectChanges();
    /*
    this.pltList = this.platformSvc.list().subscribe(
      (pPltf) => {
        console.log(pPltf);

        this.pltList = pPltf;
        this.display.pltf = true;
      }
    );*/
  }

  show(){
    this.modal.show();
  }

  close(){
    this.modal.hide('close');
  }

  updateAppFile($event: any) {
    console.log("updateAppFile", $event);
    this.targetFile = $event.target.files[0];


    if(this.targetFile!=null){
      this.targetFileName = this.targetFile.name;
      // upload
      this.projSvc.uploadFile(this.targetFile as File);

      /*.subscribe((pUploadUID:string)=>{
        console.log(" updateAppFile > uploaded ",pUploadUID);
        this.targetFileUplUID = pUploadUID;
      });*/

    }


    this.displayDeviceList();
  }

  openDevicePanel() {
    // nothing todo ?
  }

  /**
   * Callback for 'beforeClose' modal component input
   */
  beforeModalClose(){
    console.log("Prevent escape closing ...");
    return false;
  }

  newProject() {
    try{
      switch(this.method){
        case 'upload':
          this.projSvc.newProject({
            name: this.projectName,
            dev: this.devuid,
            type: 'upload',
            platform: this.platform,
            file: this.projSvc.findUploadUid(this.targetFile)
          }).subscribe( (pRes)=>{
            this.modal.hide('close');
          })
          break;
        case 'url':
          break;
        case 'device':
          break;
      }
    }catch(err:any){
      this.outputSvc.alert(new OutputMessage({ msg:err.message }))
    }

  }

  checkDevice(pDevice:Device) {
    this.device = pDevice;
    this.devuid = pDevice.uid;
    this.displayPlatformList();
  }

  platformChange($event: string) {
    console.log("changes : ", $event);
    this.platform = $event;
  }
}
