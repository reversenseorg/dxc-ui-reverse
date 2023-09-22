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
import {Menu} from "electron";
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

  menu: Menu = null;

  constructor(
    private elementRef: ElementRef,
    private ctrlService: ControllerService,
    private settingsService: SettingsService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private electronService: ElectronService) {


    document.documentElement.setAttribute('data-theme', 'dark');
    this.elementRef = elementRef;
  }

  ngOnInit() {


  }

  ngAfterViewInit() {

  }
}

