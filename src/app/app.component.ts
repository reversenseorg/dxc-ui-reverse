import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnInit,
} from '@angular/core';
import {ControllerService} from "./controller.service";
import {ModalBaseComponent} from "./base/modal-base/modal-base.component";
import {SettingsService} from "./components/settings/ctrl/settings.service";
import {ClipboardService} from "./core/services/clipboard.service";
import {AuthService} from "./components/auth/ctrl/auth.service";
import {STAGE_ICONS} from "./components/stage/icons";


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
export class AppComponent  {

  menu: any = null;

  title = "Reverse Mode";

  constructor(
    private elementRef: ElementRef) {


    document.documentElement.setAttribute('data-theme', 'dark');
    this.elementRef = elementRef;
  }

  protected readonly STAGE_ICONS = STAGE_ICONS;
}

