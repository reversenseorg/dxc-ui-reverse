import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {HookController} from "../ctrl/HookController";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {Subject} from "rxjs";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {HookService} from "../ctrl/hook.service";
import {ModalNewFragmentComponent} from "../modal-new-fragment/modal-new-fragment.component";
import {ViewportHookJavaComponent} from "./viewport-hook-javahook.component";

@Component({
  selector: 'app-viewport-hook',
  templateUrl: './viewport-hook.component.html',
  styleUrls: ['./viewport-hook.component.scss']
})
export class ViewportHookComponent implements OnInit, AfterViewInit, IViewportContainer {


  @Input() controller: HookController;
  @Input() parent: ViewportComponent;
  //@ContentChildren(ViewportInspectorClassComponent) classCmp: QueryList<ViewportCodeClassComponent>;

  @ViewChild(ViewportHookJavaComponent) viewHookJavaCmp:ViewportHookJavaComponent;

  NODE_TYPES = NodeInternalType;

  id: number = -1;
  uid: string = '';
  size:any = {
    height: '150px'
  };

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Hook',
      icon: GLOBAL_ICONS['HOOKS'],
      color: 'dxc-text-clear100'
    })
  });


  resize$: Subject<any> = new Subject<any>();


  data: any;

  constructor( ) { }

  ngOnInit(): void {

    console.log('size vp > ', this.size);
  }

  configure( pData:any):void {
    this.data = pData;

    console.log('configure viewport>',pData);
    this.view.tab.icon = pData._icon;


    switch(pData.__){
      case NodeInternalType.HOOK_JAVA:
        this.view.tab.label = pData.method.enclosingClass+'.'+pData.method.name;
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case NodeInternalType.HOOK_NATIVE:
        this.view.tab.label = pData.file+' : '+pData.func.name;
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case NodeInternalType.KEY_POINT:
        this.view.tab.label = pData.token;
        this.view.tab.color = 'dxc-text-clear100';
        break;
      default:
        if(pData._t=='s'){
          this.view.tab.icon = GLOBAL_ICONS['INFO'];
          this.view.tab.label = "Compiled script" ;
          this.view.tab.color = 'dxc-text-clear100';
        }
        else if(pData._t=='i'){
          this.view.tab.label = pData.name;
          this.view.tab.color = 'dxc-text-clear100';
        }
        break;
    }

    if(pData.alias != null){
      this.view.tab.label = '@'+pData.alias;
      this.view.tab.color = 'text-warning';
    }

  }

  ngAfterViewInit() {


  }

  /**
   * To perform some actions before to close the viewport (or prevent closing)
   */
  onClose(): boolean {
    console.log("[VP HOOK PARENT] onClose", this);
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
