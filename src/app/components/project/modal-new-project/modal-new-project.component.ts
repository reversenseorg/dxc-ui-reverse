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
  targetFile:Nullable<string> = null;
  targetUrl:Nullable<string> = null;
  proxyIp:Nullable<string> = null;
  proxyPort:Nullable<string> = null;
  httpHeaders:Nullable<string> = null;
  deviceList: any;
  device: Device;
  devuid:Nullable<string> = null;
  pltList: any;
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
    this.pltList = this.platformSvc.list().subscribe(
      (pPltf) => {
        console.log(pPltf);
        this.pltList = pPltf;
        this.display.pltf = true;
      }
    );
  }

  show(){
    this.modal.show();
  }

  close(){
    this.modal.hide('close');
  }

  updateAppFile($event: any) {
    const path = $event.composedPath ? $event.composedPath() : $event.path;
    if(path){
      this.targetFile = path[0].files[0].path;
    }else{
      console.error("Event path cannot be retrieved : ",$event);
    }

    //this.targetFile = $event.path[0].files[0].path;
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
            type: 'fromfs',
            platform: this.platform,
            path: this.targetFile
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


/*
      this.close();
      this.projSvc.startOpening( this.project);
      //console.log(this.selected);
      this.projSvc.openProject(this.selected).subscribe( (pResult)=>{
        console.log(pResult);
      } );*/
  }

  checkDevice(pDevice:Device) {
    this.displayPlatformList();
  }
}
