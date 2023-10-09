import {
  AfterViewInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef, Directive,
  ElementRef, HostListener,
  OnInit, QueryList, ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {ViewportView} from "./cmp/ViewportView";
import {ExplorerItem} from "./cmp/ExplorerItem";
import {Observable} from "rxjs";
import {ViewportController} from "./base/viewport/ViewportController";
import {ControllerService} from "./controller.service";
import {IController} from "./base/controllers/IController.interface";
import {CodeControllerService} from "./components/code/ctrl/code-controller.service";
import {TerminalItem} from "./cmp/TerminalItem";
import {ModalBaseComponent} from "./base/modal-base/modal-base.component";
import {SettingsService} from "./components/settings/ctrl/settings.service";
import {HelperController} from "./components/helper/ctrl/HelperController";
import {WebsocketClient} from "./base/WebsocketClient";
import {GLOBAL_ICONS} from "./cmp/GLOBAL_ICONS";
import {ElectronService} from "./core/services";
import {environment} from "../environments/environment";
import {DxcApiService} from "./base/DxcApiService";
import {AuthenticationEvent} from "./components/auth/AuthenticationEvent";
import {AuthService} from "./components/auth/ctrl/auth.service";
import {DxcApiToken} from "./base/DxcApiToken";
import {STAGE_ICONS} from "./components/stage/icons";
//import {Menu} from "electron";
//import {TranslateService} from "@ngx-translate/core";


enum DIRECTION {
  COL,
  ROW,
  ANY
}

interface ModalMap {
  [name: string]: ModalBaseComponent
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SettingsService]
})
export class AppComponent implements OnInit, AfterViewInit {

  menu: any = null;

  title = "Reverse Mode";

  constructor(
    private elementRef: ElementRef,
    //private dxcApiService: DxcApiService,
    private ctrlService: ControllerService,
    private settingsService: SettingsService,
    private authService: AuthService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private electronService: ElectronService) {


    document.documentElement.setAttribute('data-theme', 'dark');
    this.elementRef = elementRef;

    this.authService.getUserInfo().subscribe((pUser)=>{
      console.log("USer account ",pUser);
      if(pUser != null){
        this.authService.onAuthentication.next(AuthenticationEvent.newSuccess( new DxcApiToken("local",""), pUser))
      }
    });
  }

  ngOnInit() {
      // Local conn
      /*DxcApiService.setAuthProfile({
        ssl: false,
        ip: "localhost",
        port: 8080
      });*/


  }

  ngAfterViewInit() {

  }

  protected readonly STAGE_ICONS = STAGE_ICONS;
}

