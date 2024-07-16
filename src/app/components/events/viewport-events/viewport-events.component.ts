import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {Subject} from "rxjs";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {RuntimeEventController} from "../ctrl/RuntimeEventController";
import {RuntimeEventType} from "../../../models/hook/RuntimeEvent";
import {RTEVENT_ICONS} from "../icons";
import {IconModelCollection} from "../../../base/icon/IconModel";

@Component({
  selector: 'app-viewport-events',
  templateUrl: './viewport-events.component.html',
  styleUrls: ['./viewport-events.component.scss']
})
export class ViewportEventsComponent implements OnInit, IViewportContainer {


  @Input() controller: RuntimeEventController;
  @Input() parent: ViewportComponent;
  //@ContentChildren(ViewportInspectorClassComponent) classCmp: QueryList<ViewportCodeClassComponent>;


  NODE_TYPES = NodeInternalType;

  id: number = -1;
  uid: string = '';
  size:any = {
    height: '150px'
  };

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Events',
      icon: GLOBAL_ICONS['HOOKS'],
      color: 'dxc-text-clear100'
    })
  });


  resize$: Subject<any> = new Subject<any>();

  icons:IconModelCollection = RTEVENT_ICONS;

  data: any;

  constructor( ) { }

  ngOnInit(): void {

  }

  configure( pData:any):void {
    this.data = pData;

    this.view.tab.icon = pData._icon;


    switch(pData.rt_type){
      case RuntimeEventType.HOOK:
        this.view.tab.label = "Hook Events";
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case RuntimeEventType.NETWORK:
        this.view.tab.label = "Network Events";
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case RuntimeEventType.FILESYSTEM:
        this.view.tab.label = "FS Events";
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case RuntimeEventType.MEMORY:
        this.view.tab.label = "Memory Events";
        this.view.tab.color = 'dxc-text-clear100';
        break;
      default:
        this.view.tab.label = "Runtime Events";
        this.view.tab.color = 'dxc-text-clear100';
        break;
    }
  }

  /**
   * To perform some actions before to close the viewport (or prevent closing)
   */
  onClose(): boolean {
    console.log("[VP EVENT PARENT] onClose", this);
    this.controller.close(this, 'vp');
    return true;
  }

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
    /*console.log('resize vp > ', pSize, this.codeEditor.getEditor());
    if(this.codeEditor != null){
      this.codeEditor.nativeElement.style.minHeight = pSize.height;
      this.codeEditor.nativeElement.style.height = pSize.height;
    }*/
  }
}
