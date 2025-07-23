import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CodeItem} from "../explorer-code/CodeItem";
import {CodeController} from "../ctrl/CodeController";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {CodeControllerService} from "../ctrl/code-controller.service";
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import ModelClass from "../../../models/ModelClass";
import {CODE_ICONS} from "../icons";
import {ModelPackage} from "../../../cmp/ModelPackage";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";


@Component({
  selector: 'app-viewport-code-package',
  templateUrl: './viewport-code-package.component.html',
  styleUrls: ['./viewport-code.component.scss']
})
export class ViewportCodePackageComponent implements OnInit {

  @Input() item: any;
  @Input() data: ModelPackage;
  @Input() controller: CodeController;
  @Input() parent: ViewportComponent;

  @Input() height: number;
  @Input() width: number;



  @Input() direct = false;

  id: number = -1;
  icons:any = CODE_ICONS;
  gIcons:any = GLOBAL_ICONS;

  constructor() { }

  ngOnInit(): void {

  }

  configure( pData:any):void {
    this.data = pData;

  }

  onClose(): boolean {
    return true;
  }

}
