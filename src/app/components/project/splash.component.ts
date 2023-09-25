import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {ITerminalContainer} from "../../base/terminal/ITerminalContainer";
import {TerminalComponent} from "../../base/terminal/terminal.component";
import {WorkspaceController} from "../workspace/ctrl/WorkspaceController";
import {ActivatedRoute, Router} from "@angular/router";

// import { IpcRenderer} from 'electron';
import {ElectronService} from "../../core/services";
import {DexcaliburServerService} from "../../core/services/dexcalibur/dxc.service";
import {ControllerService} from "../../controller.service";


const PKG_INFO = require("../../../../package.json");

/**
 * Represents the content of splash window
 *
 * @class
 * @since 1.0.0
 */
@Component({
  selector: 'dxc-splash-screen',
  template: `
    <div class="screen" #splashScreen>
      <span class="dxcanim"></span>
      <span class="dxcanim"></span>
      <span class="dxcanim"></span>
      <span class="dxcanim"></span>
      <span class="dxcanim"></span>
      <span class="dxcanim"></span>
      <span class="dxcanim"></span>
      <span class="dxcanim"></span>
      <span class="dxcanim"></span>
      <div class="row banner" #banner>
        <div class="col-lg-6 offset-2">
          <h1>DEXCALIBUR PRO</h1>
        </div>
        <div class="col-lg-2">
          <img height="128" src="assets/icons/dexcalibur_256.png" />
        </div>
      </div>
      <div class="container-fluid menu-ctn" #body>
        <div class="row menu">
          <div class="fixed menu-entry">
            <!--<div class="action" (click)="showRecents()" [routerLinkActive]="active" [class.active]="active=='recents'">
              <fa-icon [icon]="['fas','history']" class="icon"></fa-icon>
            </div>-->
            <div class="action" (click)="showOpen()"  [routerLinkActive]="active"  [class.active]="active=='open'">
              <fa-icon [icon]="['fas','folder-open']" class="icon"></fa-icon>
            </div>
            <div class="action" (click)="showNewProject()"  [class.active]="active=='new'">
              <fa-icon [icon]="['fas','plus']" class="icon"></fa-icon>
            </div>
            <div class="action" (click)="showInfo()"  [class.active]="active=='info'">
              <fa-icon [icon]="['fas','info']" class="icon"></fa-icon>
            </div>
          </div>
          <div class="col menu-view">
            <!--<dxc-project-latest *ngIf="active=='recents'"></dxc-project-latest>-->
            <dxc-project-open *ngIf="active=='open'"></dxc-project-open>
            <dxc-svc-status *ngIf="active=='infp'"></dxc-svc-status>
          </div>
        </div>
      </div>
      <!--<div class="license">{{ product }} {{ version }} {{ build }}. Licensed to {{ license.identity }} until {{ license.date }}.
        <a [routerLink]="'/license'">See license</a>
      </div>-->
    </div>
  `,
  styleUrls: ['./project.component.scss']
})
export class SplashComponent implements OnInit,OnChanges {


  @Input() height:string;
  @Input() width:string;
  @ViewChild('splashScreen',{ read:ElementRef, static:true }) screenEl:ElementRef;
  @ViewChild('banner',{ read:ElementRef, static:true }) bannerEl:ElementRef;
  @ViewChild('body',{ read:ElementRef, static:true }) bodyEl:ElementRef;


  id: number;
  license: any = { identity:'Georges-B. Michel', date:'29 dec, 2099' };
  product:string = "Version ";
  version:string = PKG_INFO.version;
  build:string = " - Build x.xxx-x";
  active: string = 'open';
  ipcRenderer:  any  = null;

  dxcStatus: boolean = false;

  constructor(
    private router:Router,
    private activeRoute:ActivatedRoute,
    private ctrlService:ControllerService,
    private electronService: ElectronService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.hasOwnProperty('height')){
      this.screenEl.nativeElement.style.height = changes['height'].currentValue+"px";
      this.bodyEl.nativeElement.style.height = (changes['height'].currentValue - this.bannerEl.nativeElement.offsetHeight)+"px";
    }
    if(changes.hasOwnProperty('width')){
      this.screenEl.nativeElement.style.width = changes['width'].currentValue+"px";
    }
  }

  /**
   * To initialize IPC event handlers
   *
   * @method
   * @private
   * @since 1.0.0
   */
  private initializeIpcRenderer() {

      try {
        /*this.ipcRenderer = this.electronService.ipcRenderer;
        this.ipcRenderer.on('dxc-started', ()=>{
          this.dxcStatus = true;
        });*/
        this.dxcStatus = true;
      } catch (e) {
        throw e;
      }
  }

  ngOnInit() {

    // import IPC Renderer
    this.initializeIpcRenderer();

    // By default, it displays Recents panel
    this.showOpen();
  }

  /**
   * To display the panel "Recents Projects"
   *
   * @method
   * @since 1.0.0
   */
  showRecents():void {
    this.active = 'recents';
  }

  /**
   * To display the panel "New Project"
   *
   * @method
   * @since 1.0.0
   */
  showNewProject():void {
    this.ctrlService.getStage('main').showModal('newproj');
    //this.active = 'new';
  }

  /**
   * To display the panel "Open/Import project"
   *
   * @method
   * @since 1.0.0
   */
  showOpen():void {
    this.active = 'open';
  }


  /**
   * To display the panel "Status informations"
   *
   * @method
   * @since 1.0.0
   */
  showInfo() {
    this.active = 'info';
  }
}
