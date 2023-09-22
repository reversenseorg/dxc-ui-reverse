import {
  AfterContentInit, AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Input,
  OnInit,
  QueryList, ViewChild
} from '@angular/core';
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {DEV_ICONS} from "../icons";
import {Subject} from "rxjs";
import {DeviceController} from "../ctrl/DeviceController";
import ModelClass from "../../../models/ModelClass";
import {CodeController} from "../../code/ctrl/CodeController";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {Device} from "../../../models/Device";
import {IconModel} from "../../../base/icon/IconModel";
import {TOPO_ICONS} from "../../topology/icons";
import {DeviceManagerService} from "../ctrl/device-manager.service";
import {OutputService} from "../../output/ctrl/output.service";
import {HookService} from "../../hooks/ctrl/hook.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import ModelSyscall from "../../../models/ModelSyscall";
import {ElectronService} from "../../../core/services";


export const DEVICE_PANEL = {
  FRIDA : 'fr',
  SYSTEM : 'ss',
  SYSCALL: 'sc',
  CERT : 'ct',
  PERM: 'pm',
  NETWORK: 'nt',
  MOUNTS: 'mnt',
  USB: 'usb'
}
@Component({
  selector: 'app-viewport-device',
  templateUrl: './viewport-device.component.html',
  styleUrls: ['./viewport-device.component.scss','../../../forms.scss']
})
export class ViewportDeviceComponent implements OnInit, AfterViewInit, IViewportContainer {

  PANEL_TYPE:any = DEVICE_PANEL;

  @Input() item: any;
  @Input() uid: string;
  @Input() data: Device;
  @Input() controller: DeviceController;
  @Input() parent: ViewportComponent;
  @Input() height: number;
  @Input() width: number;

  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;
  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;

  id = -1;
  icn: IconModel = DEV_ICONS.MOBILE;
  activeLeft =  'ss';
  activeRight:string = null;
  defaultWidth = 70;
  defaultWidths = {
    [DEVICE_PANEL.MOUNTS]: 100,
    [DEVICE_PANEL.CERT]: 100,
    [DEVICE_PANEL.USB]: 100
  };
  activeWidth = 70;


  topNav: NavbarSimpleView = new NavbarSimpleView({
    style: 'vp-navbar',
    entries: [
      new MenuItem({
        icon: GLOBAL_ICONS.JAVA,
        label: "Implemented By"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS.FIND,
        label: "Instances"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS.HOOKS,
        label: "Permissions",
      })
    ]
  });

  leftNav: NavbarSimpleView =  new NavbarSimpleView({
    menu: new MenuView({
      label: "Filter",
      items: [
        new MenuItem({
          id: 'app',
          icon: GLOBAL_ICONS.WINDOW,
          label: "Application"
        }),
        new MenuItem({
          id: 'api',
          icon: GLOBAL_ICONS.ANDROID,
          label: "Android"
        })
      ]
    })
  });

  rightNav: NavbarSimpleView = new NavbarSimpleView({
    entries: [
      new MenuItem({
        icon: GLOBAL_ICONS.HOOKS,
        label: "Hook logs"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS.LIBS,
        label: "VM Out"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS.ANDROID,
        label: "adb logs"
      })
    ]
  });


  icons:any = DEV_ICONS;
  gIcons:any = GLOBAL_ICONS;
  tIcons:any = TOPO_ICONS;

  now:Date = new Date();

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Device',
      icon: DEV_ICONS.DEFAULT,
      color: 'dxc-text-clear100'
    })
  });

  resize$: Subject<any> = new Subject<any>();
  fridaPath: any;
  fridaTrans: any = "usb";
  fridaOK =  false;

  selectedSyscall:ModelSyscall = null;

  activeItem:any = null;


  constructor(
    private dmService: DeviceManagerService,
    private hookSvc: HookService,
    private electronSvc:ElectronService,
    private outputSvc:OutputService) {

    this.height = 300;
  }

  /**
   * To init component
   */
  ngOnInit(): void {

  }

  /**
   * To init component
   */
  ngAfterViewInit(): void {
    this.height = this.height-this.layout.topHeight;
    console.log(this.layout, this.metadataEl);
    // this.metadataEl.nativeElement .getComputedStyle().height
    this.resize({ height:this.height-this.metadataEl.nativeElement.style.height })
  }

  /**
   * To configure the viewport with data
   *
   * @param pData {any}
   * @method
   * @public
   */
  configure( pData:any, pFocus:any):void {
    this.data = pData;

    console.log('configure device viewport>',pData);

    this.view.tab.icon = this.icons.MOBILE;
    this.view.tab.label = pData.id;
    this.view.tab.tip = pData.model;
    this.view.tab.color = 'dxc-text-blue font-weight-bold';


    if(pData.alias != null){
      this.view.tab.label = '@'+pData.alias;
      this.view.tab.color = 'text-warning';
    }

    if(pData.$ != null)
      this.showDetail(pData.$);
    else if(pData.profile == null)
      this.showDetail(DEVICE_PANEL.SYSTEM);

    if(pFocus!=null){
      this.activeLeft = pFocus
      if(this.defaultWidths[pFocus] != null)
        this.activeWidth = this.defaultWidths[pFocus];
      else
        this.activeWidth = this.defaultWidth;
    }


  }

  private _retrieveShortForm(pItem:any):string {
    switch (this.activeLeft) {
      case DEVICE_PANEL.SYSTEM:
        return pItem.key+"="+pItem.val;
        break;
      case DEVICE_PANEL.MOUNTS:
        return pItem.partition+" "+pItem.mountPoint+" "+pItem.fsType+" "+pItem.opts._raw+" "+pItem.dump+" "+pItem.fsckOrder;
        break;
      default:
        return "";
        break;
    }
  }

  /**
   *
   * @param pEvent
   */
  onItemFocus( pEvent: any, pItem:any, pSrc:string): void{

    console.log(pEvent,pItem,pSrc);

    const o = {
      item:pItem,
      src:pSrc,
      el: pEvent.path[0],
      oldBg: null
    };

    this.electronSvc
      .getSelectionManager()
      .selectNode(pItem, this._retrieveShortForm(pItem));

    if (this.activeItem != null){
      this.activeItem.el.style.backgroundColor = this.activeItem.oldBg; //'#444'
    }

    if(o.el.className.indexOf('col-')>-1){
      o.el = pEvent.path[1];
    }

    o.oldBg = o.el.style.backgroundColor;
    o.el.style.backgroundColor = 'royalblue';
    this.activeItem = o;
  }

  showDetail(pType:string):any {

    switch (pType){
      case DEVICE_PANEL.FRIDA:
        this.activeLeft = DEVICE_PANEL.FRIDA;
        break;
      case DEVICE_PANEL.SYSCALL:
        this.dmService.getSystemCalls(this.data).subscribe((pSyscalls)=>{
          this.data.syscalls = pSyscalls;
          console.log(pSyscalls);
          this.activeLeft = pType;
          this.activeRight = pType;
        });
        break;
      default:
        this.dmService.getProfile(this.data).subscribe((pProfile)=>{
          this.data.profile = pProfile;
          console.log(this.data);
          this.activeLeft = pType;
          this.activeRight = pType;

          switch (pType){
            case DEVICE_PANEL.USB:
            case DEVICE_PANEL.MOUNTS:
              this.activeWidth = 100;
              break;
            default:
              this.activeWidth = this.defaultWidth;
              break;
          }
        });
        break;
    }



    return true;
  }

  showSyscallInfo(pEl:any, pSyscall:ModelSyscall):void {
    this.selectedSyscall = pSyscall;
    this.onItemFocus(pEl, pSyscall, 'sc');
  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.height = pSize.height;
    //this.size = pSize;
  }

  showFrida() {
    this.activeLeft = DEVICE_PANEL.FRIDA;

  }

  /**
   * To test to spawn / connect to frida server using settings
   *
   * @param $event
   * @method
   * @since 1.0.0
   */
  testFridaConnection() {
    console.log(this.data);
    this.hookSvc.startServer({
      dev: this.data.uid,
      path: this.data.frida.server,
      port: this.data.frida.port,
      transport: this.data.frida.transport,
      privileged: this.data.frida.privileged,
      timeout: this.data.frida.timeout
    }).subscribe( (pRes:any)=>{
      if(pRes.success){
          this.fridaOK = true;
      }else{
          this.fridaOK = false;
      }
    })
  }

  /**
   * To save frida options
   * @param $event
   */
  saveFrida($event: MouseEvent) {
    console.log(this.data);
    this.dmService.saveSettings(this.data, {
      server: this.data.frida.server,
      port: (this.data.frida.port==null ? -1 : this.data.frida.port),
      transport: this.data.frida.transport,
      privileged: this.data.frida.privileged,
      before: this.data.frida.before,
      timeout: this.data.frida.timeout
    }).subscribe((pRes:any)=>{
      if(pRes.success){
        this.outputSvc.alert(OutputMessage.newSuccess({ msg:"Options for Frida Server have been succesfully saved." }))
      }
    });
  }
}
