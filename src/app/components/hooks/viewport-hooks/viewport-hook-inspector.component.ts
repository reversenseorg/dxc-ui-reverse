import {AfterViewInit, Component, ContentChildren, Input, OnInit, QueryList} from '@angular/core';
import {HookController} from "../ctrl/HookController";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportView} from "../../../cmp/ViewportView";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {HOOK_ICONS} from "../icons";
import {Subject} from "rxjs";


// @ts-ignore
@Component({
  selector: 'app-viewport-hook-inspector',
  templateUrl: './viewport-hook-inspector.component.html',
  styleUrls: ['./viewport-hook.component.scss']
})
export class ViewportHookInspectorComponent implements OnInit, AfterViewInit, IViewportContainer {


  @Input() controller: HookController;
  @Input() parent: ViewportComponent;
  @Input() data: any;
//  @ContentChildren(ViewportHookInspectorComponent) classCmp: QueryList<ViewportHookInspectorComponent>;

  gIcons :any = GLOBAL_ICONS;
  icons :any = HOOK_ICONS;

  id: number = -1;
  uid: string = '';
  size:any = {
    height: '150px'
  };

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Code',
      icon: HOOK_ICONS['DEFAULT'],
      color: 'dxc-text-clear100'
    })
  });


  resize$: Subject<any> = new Subject<any>();

  constructor() { }

  ngOnInit(): void {

  }

  configure( pData:any):void {
    this.data = pData;
    //this.view.tab.icon = pData._icon;
    //this.view.tab.label = pData.name;
    //this.view.tab.color = 'dxc-text-clear100';
  }

  ngAfterViewInit() {


  }

  onClose(): boolean {
    //this.controller.close(this,'vp');
    return true;
  }

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
  }
}
