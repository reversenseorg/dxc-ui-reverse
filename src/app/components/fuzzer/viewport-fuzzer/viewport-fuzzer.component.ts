import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {FUZZ_ICONS} from "../icons";
import {Subject} from "rxjs";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {HookService} from "../../hooks/ctrl/hook.service";
import {Nullable} from "../../../base/Nullable";
import {ActivatedRoute} from "@angular/router";
import {FuzzerController} from "../ctrl/FuzzerController";
import FuzzSession, {FuzzState} from "../../../models/fuzz/FuzzSession";
import {FuzzerService} from "../ctrl/fuzzer.service";
import {SearchService} from "../../search/ctrl/search.service";


export const DEVICE_PANEL = {
  FRIDA : 'fr',
  SYSTEM : 'ss',
  SYSCALL: 'sc',
  CERT : 'ct',
  PERM: 'pm',
  NETWORK: 'nt',
  MOUNTS: 'mnt',
  USB: 'usb',
  EOP:'eop'
}

@Component({
  selector: 'app-viewport-fuzzer',
  templateUrl: './viewport-fuzzer.component.html',
  styleUrls: ['../../../forms.scss'],
  providers: []
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportFuzzerComponent implements OnInit, AfterViewInit, IViewportContainer {

  PANEL_TYPE:any = DEVICE_PANEL;

  @Input() item: any;
  @Input() uid: string;
  @Input() data: FuzzSession;
  @Input() controller: FuzzerController;
  /**
   * Useless
   * @deprecated
   */
  @Input() parent: ViewportComponent;

  @Input() height: number;
  @Input() width: number;

  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;
  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;

  id = -1;

  activeLeft =  'ss';
  activeRight:Nullable<string> = null;
  defaultWidth = 100;
  defaultWidths = {
    [DEVICE_PANEL.MOUNTS]: 100,
    [DEVICE_PANEL.CERT]: 100,
    [DEVICE_PANEL.USB]: 100,
    [DEVICE_PANEL.EOP]: 100
  };
  activeWidth = 100;

/*
  topNav: NavbarSimpleView = new NavbarSimpleView({
    style: 'vp-navbar',
    menu: new MenuView({
      items: [
        new MenuItem({
          icon: GLOBAL_ICONS['JAVA'],
          label: "Implemented By"
        }),
        new MenuItem({
          icon: GLOBAL_ICONS['FIND'],
          label: "Instances"
        }),
        new MenuItem({
          icon: GLOBAL_ICONS['HOOKS'],
          label: "Permissions",
        })
      ]
    })
  });

  leftNav: NavbarSimpleView =  new NavbarSimpleView({
    menu: new MenuView({
      label: "Filter",
      items: [
        new MenuItem({
          id: 'app',
          icon: GLOBAL_ICONS['WINDOW'],
          label: "Application"
        }),
        new MenuItem({
          id: 'api',
          icon: GLOBAL_ICONS['ANDROID'],
          label: "Android"
        })
      ]
    })
  });

  rightNav: NavbarSimpleView = new NavbarSimpleView({
    menu: new MenuView({
      items: [
        new MenuItem({
          icon: GLOBAL_ICONS['HOOKS'],
          label: "Hook logs"
        }),
        new MenuItem({
          icon: GLOBAL_ICONS['LIBS'],
          label: "VM Out"
        }),
        new MenuItem({
          icon: GLOBAL_ICONS['ANDROID'],
          label: "adb logs"
        })
      ]
    })
  });
*/


  icons:any = FUZZ_ICONS;
  gIcons:any = GLOBAL_ICONS;


  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Fuzzer',
      icon: GLOBAL_ICONS['WRENCH'],
      color: 'dxc-text-clear100'
    })
  });

  resize$: Subject<any> = new Subject<any>();

  activeItem:any = null;


  constructor(
      private _route:ActivatedRoute,
    private searchSvc:SearchService,
    private fuzzSvc: FuzzerService,
    private hookSvc: HookService) {

    //this.height = 300;

    if(this._route.snapshot.data.device!==null){
      //this.data = this._route.snapshot.data.device;
      //this.ctrlSvc.getStage('main').showDevice(this._route.snapshot.data.device);
    }
  }

    onClose(): boolean {
        // free componentspace
        return true;
    }

    resize(opts: any): void {
        //throw new Error("Method not implemented.");

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
  configure( pData:FuzzSession, pFocus:any):void {

    console.log('configure fuzzer viewport>',pData);

    this.data = pData;

    this.view.tab.icon = this.icons['MOBILE'];
    this.view.tab.label = `Fuzzer [${pData.getUID()}]`;
    this.view.tab.tip = `Fuzzer [${pData.getUID()}]`;
    this.view.tab.color = 'dxc-text-blue font-weight-bold';

    console.log(pData, pFocus);

    if(pFocus!=null){
      console.log("[FUZZER] Focus : ",pFocus);
      this.activeLeft = pFocus
      if(this.defaultWidths[pFocus] != null)
        this.activeWidth = this.defaultWidths[pFocus];
      else
        this.activeWidth = this.defaultWidth;
    }
  }


  getState():FuzzState|string {
      if(this.data.history.length === 0){
          return 'never started';
      }

      return this.data.history[this.data.history.length-1].state;
  }

  countMatches():number {
    return this.data.results.length;
  }

  getDuration():string {
      const start = this.data.history.find(x => x.state===FuzzState.RUNNING);
      if(start==null){
          return 'not started';
      }

      const done = this.data.history.find(x => x.state===FuzzState.DONE);
      if(done === undefined){
          return 'running';
      }

      return Math.floor((done.time-start.time)/1000)+' s';
  }


    showDetail(pType:string):any {
      this.activeLeft = pType;
    }

    isDone():boolean {
      return (this.getState() === FuzzState.DONE);
    }
}
