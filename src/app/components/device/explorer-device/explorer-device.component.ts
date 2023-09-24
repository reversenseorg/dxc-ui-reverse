import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ExplorerView} from '../../../cmp/ExplorerView';
import {GLOBAL_ICONS} from '../../../cmp/GLOBAL_ICONS';
import {NavbarSimpleView} from '../../../cmp/NavbarSimpleView';
import {MenuItem, MenuView} from '../../../cmp/MenuView';
import {SubExplorerComponent} from '../../../base/explorer/subexplorer.component';
import {ExplorerTab} from '../../../cmp/ExplorerTab';
import {ActivatedRoute} from '@angular/router';
import {empty, from, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {DEV_SUBVIEW} from '../explorer-dev.const';
import {DeviceItem} from './DeviceItem';
import {ExpandableProvider} from '../../../base/expandable-list/expandable-provider';
import {
  ContextMenuComponent,
  ContextMenuList,
  ContextMenuState
} from '../../../base/context-menu/context-menu.component';
import {DEV_ICONS} from '../icons';
import {Utils} from '../../../cmp/Utils';
import {ProjectService} from '../../project/ctrl/project.service';
import DexcaliburProject from '../../../models/DexcaliburProject';
import {DeviceCacheFlavor, DeviceManagerService} from '../ctrl/device-manager.service';
import {DeviceController} from '../ctrl/DeviceController';
import {Device} from '../../../models/Device';
import {ModalDmComponent} from '../modal-dm/modal-dm.component';
import {OutputMessage} from '../../../cmp/OutputMessage';
import {OutputService} from '../../output/ctrl/output.service';
import {ModalProgressComponent} from '../../../base/modal-progress/modal-progress.component';
import {ModalAlertComponent} from '../../output/modal-alert/modal-alert.component';
import {WorkspaceService} from "../../workspace/ctrl/workspace.service";
import {IconModel, IconModelCollection} from "../../../base/icon/IconModel";
import {FilesystemService} from "../../file/ctrl/FilesystemService";
import {ExpandableItemComponent} from "../../../base/expandable-list/expandable-item.component";
import {ViewerController} from "../../viewer/ctrl/ViewerController";
import AppPackage from "../../../models/AppPackage";
import {HookService} from "../../hooks/ctrl/hook.service";
import {ElectronService} from "../../../core/services";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {FILE_ICONS} from "../../file/icons";
import {ContextMenuEvent} from "../../code/ctrl/code-controller.service";

/*interface PackageSets {
  [name: nu] :ModelPackage[]
}*/


interface DeviceListItem extends Device {
  _icon?:IconModel;
  _t?:string;
  children?:any[];
}


/**
 * This class controls events and content of 'device' tab into explorer area
 * (left vertical panel)
 *
 * @class
 * @since 1.0.0
 * @author Georges-Bastien MICHEL
 */
@Component({
  selector: 'app-explorer-device',
  templateUrl: './explorer-device.component.html',
  styleUrls: ['../device.component.scss'],
  providers: [NgbTooltipConfig]
})
export class ExplorerDeviceComponent extends SubExplorerComponent<DeviceController> implements OnInit, AfterViewInit, ExpandableProvider {

  /**
   * Context
   *
   * @type {AppComponent}
   * @field
   */
  app: any = null;

  /**
   * The default controller associated to this UI component
   *
   * @type {DeviceController}
   * @field
   */
  @Input() controller: DeviceController;

  /**
   * This field holds the parent component, here the main explorer component.
   *
   * @type {ExplorerComponent}
   * @field
   */
  @Input() parent: any;

  /**
   * The reference to the DOM element containing this component
   *
   * @type {ElementRef}
   * @field
   */
  @ViewChild('explDevRef', {read: ElementRef}) explDevRef: ElementRef;

  /**
   * The reference to the DOM element containing the dynamic part (data)
   *
   * @type {ElementRef}
   * @field
   */
  @ViewChild('explDevCtnRef', {read: ElementRef}) explDevCtnRef: ElementRef;

  /**
   * The list of contextual menu declared
   *
   * @type {QueryList<ContextMenuComponent>}
   * @field
   */
  @ViewChildren(ContextMenuComponent) ctxMenuChildren: QueryList<ContextMenuComponent>;
  @ViewChildren(ExpandableItemComponent) expandableItems: QueryList<ExpandableItemComponent<any>>;


  @ViewChild(ModalDmComponent) modalDm: ModalDmComponent;
  @ViewChild(ModalProgressComponent) modalProgress: ModalProgressComponent ;

  id = 'explorerDevice';

  ctxMenu: ContextMenuList = {};

  selected: DEV_SUBVIEW = DEV_SUBVIEW.ALL;
  activeItem: any = null;

  icons: any = DEV_ICONS;
  gIcons: IconModelCollection = GLOBAL_ICONS;

  fIcons: any = FILE_ICONS;

  // Unique identifier for all explorer tab
  /**
   * unique identifier for all explorer
   */
  offset = 4;

  tab: ExplorerTab = new ExplorerTab({
    offset: 0,
    label: 'Devices',
    icon: GLOBAL_ICONS['DEVICE'],
    color: 'dxc-text-clear100'
  });

  view: ExplorerView = new ExplorerView({
    nav: new NavbarSimpleView({
      selected: this.selected,
      opt: [],
      menu: new MenuView({
        items: [
          new MenuItem<DeviceItem>({
            id: DEV_SUBVIEW.ALL,
            label: 'All',
            color: 'dxc-text-clear75',
            icon: GLOBAL_ICONS['DEVICE']
          }),
          new MenuItem<DeviceItem>({
            id: DEV_SUBVIEW.ANDROID,
            label: 'Android',
            color: 'dxc-text-clear75',
            icon: GLOBAL_ICONS['ANDROID']
          }),
          new MenuItem<DeviceItem>({
            id: DEV_SUBVIEW.APPLE,
            label: 'Apple',
            color: 'dxc-text-clear75',
            icon: GLOBAL_ICONS['APPLE']
          })
        ]
      })
    })
  });

  initialSize: any = null;

  ctxMenuState: ContextMenuState = null;

  devices: Device[][] = [];

  dmReady = false;
  privileged = false;
  progress$: Subject<any> = new Subject<any>();

  /**
   * Progress modal title
   *
   * @type {string}
   * @field
   * @since 1.0.0
   */
  progressTitle:Nullable<string> = null;
  enrolling = false ;



  constructor( private projectService: ProjectService,
               private dmService: DeviceManagerService,
               private wsSvc: WorkspaceService,
               private fsSvc: FilesystemService,
               private route: ActivatedRoute,
               private hookSvc: HookService,
               private electronSvc: ElectronService,
               private outputSvc: OutputService,
               ngbTooltipConfig:NgbTooltipConfig) {
    super();
    this.devices[DEV_SUBVIEW.ALL] = [];
    this.devices[DEV_SUBVIEW.ANDROID] = [];
    this.devices[DEV_SUBVIEW.APPLE] = [];
    this.view.id = this.id;

    ngbTooltipConfig.tooltipClass = "dxc-tooltip"
  }

  private _printError(pMessage:string, pExtra:any = null){
    this.outputSvc.print( OutputMessage.newError({ msg:pMessage, src:'Device Manager', extra:pExtra }));
  }

  private _printSuccess(pMessage:string, pExtra:any = null){
    this.outputSvc.print( OutputMessage.newSuccess({ msg:pMessage, src:'Device Manager', extra:pExtra }));
  }


  ngOnInit(): void {


    //
    this.dmService.onMenuClick
      .subscribe( (pEvent: any) => {
          switch (pEvent.item){
            // on 'list device' show Device explorer panel
            case 'list-dev':
              this.parent.selectTab( this.offset);
              break;
            case 'show-dev':
              this.controller.openFocus( pEvent.dev, pEvent.tab, 'expl');
              break;
          }
      });


    this.dmService.devices$.subscribe((pDevices)=>{
      this.outputSvc.print( OutputMessage.newSuccess({ msg:"Devices have been refreshed", src:'Device Manager', extra:null }));
      pDevices.map((vDev)=>{
        this._prepareDeviceRendering(vDev);
      });
      this.dmReady = true;
      this.devices[DEV_SUBVIEW.ALL] = pDevices;
    })

    this.hookSvc.onDeviceConfigure.subscribe( (pDev:Device)=>{
      this.controller.configureFrida(pDev);
    });



    this.refresh();

  }




  ngAfterViewInit() {

    // subscribe to resize events
    this.resize$.subscribe( (pEvent: any) => {
      // console.log("[CODE] Explorer > resize > ",pEvent);
      this.drawExplorer(pEvent);
    });


    // init contextual menus
    this.ctxMenu = {};
    this.ctxMenuChildren.toArray().map( vMenu => {
      this.ctxMenu[vMenu.name] = vMenu;
      this.controller.registerCtxMenu(vMenu.name, this);
    });
  }

  drawExplorer(pSize: any): void {

    const el = this.explDevRef.nativeElement; // document.getElementById('explorerCode');
    const ctn = this.explDevCtnRef.nativeElement; // document.getElementById('explorerCodeCtn');
    const navHeight: number = this.view.nav.size.height;

    el.style.width = pSize.width + 'px';
    el.style.maxWidth = pSize.width + 'px';
    el.style.height = pSize.height + 'px';
    el.style.maxHeight = pSize.height + 'px';

    ctn.style.width = pSize.width + 'px';
    ctn.style.maxWidth = pSize.width + 'px';
    ctn.style.height = (pSize.height - navHeight) + 'px';
    ctn.style.maxHeight = (pSize.height - navHeight) + 'px';
  }

  expand( pItem: any, pType: string): Observable<DeviceItem[]> {
    let data: any = null;

    console.log('expanding ...', pItem);
    switch (pItem._t){
      case 'app':
        data = this.dmService.getApplications(pItem.dev).pipe(
          map( (pObs: any) => {
            // pObs.data._icon = this.icons['CLASS'];
            console.log(pObs);

            if(pObs != null){
              pObs.map( pApp => {

                pApp._t = 'apkg';
                pApp._e = false ;
                pApp.tag = (pApp.packagePath.split('/')[1]);
                pApp.dev = pItem.dev;
              });

            }




            return pObs;
          })
        );
        break;
      case 'ps':
        data = this.dmService.getProcesses(pItem.dev, (pItem.dev.rootMode? 'privileged':'user')).pipe(
          map( (pObs: any) => {
            if(pObs!=null){
              pObs.map( pApp => {
                pApp._t = 'p';
                pApp._e = false ;
                pApp.dev = pItem.dev;
              });
              console.log(pObs);
            }

            return pObs;
          })
        );
        break;
      case 'fs':
        console.log(pItem);
        data = this.fsSvc.listDevicePath( {
          uid: pItem.dev.uid,
          //path: (pItem.p != null ? encodeURIComponent(pItem.p) : '/'),
          type:(pItem.dev.rootMode? 'privileged':'user')
        });
        if(data!=null){
          data = data.pipe( map((pObs:any)=>{
            return this.sortFiles(pObs, pItem.dev);
          }));
        }
        break;
      case 'd':
        data = this.fsSvc.listDevicePath( {
          uid: pItem.dev.uid,
          path:encodeURIComponent(pItem.p),
          type:(pItem.dev.rootMode? 'privileged':'user')
        });
        if(data!=null){
          data = data.pipe( map((pObs:any)=>{
            return this.sortFiles(pObs, pItem.dev);
          }));
        }
        break;
      case 'dev':
        data = from([this._prepareDeviceRendering(pItem)])
        break;
      default:
        data = empty();
        break;
    }

    return data;
  }

  sortFiles( pFiles:any, pDevice:Device): any{
    const t1:any = [],t2:any = [];
    pFiles.map( (vFile) => {
      if(vFile.dev == null){
        vFile.dev = pDevice;
      }
      if(vFile._t=='f'){
        t1.push(vFile);
      }else{
        //if(vFile.hasOwnProperty('children')==false)
        // vFile.children = [];
        t2.push(vFile);
        //if(vFile.hasOwnProperty('children')==false) vFile.children = [];
      }
    });
    return t2.concat(t1);
  }

  getIconForType(pType: any):IconModel {

    switch (pType.t) {
      case 'XML':
        return this.fIcons['XML'];
      case 'PNG':
        return this.fIcons['PNG'];
      case 'ELF':
        return this.fIcons['BIN'];
      default:
        return this.fIcons['FILE'];
    }
  }

  open( pItem: any): any {


    switch (pItem._t){
      case 'f':
         this.dmService.readFile(
          pItem.dev,
          pItem.p,
          (pItem.dev.rootMode? 'privileged':'user')
        ).subscribe( (pData:any)=>{
          console.log(pItem);
          //this.controller.open( pItem, 'expl');
           pItem.name = pItem.n;
           pItem.ctn = pData;
           (this.app.getController('ctrl:viewer') as ViewerController).open( pItem, 'file');
        })
        break;
      case 'info':
        this.dmService.listDevices(DeviceCacheFlavor.CACHE_FIRST).subscribe((vDevs)=>{
          let dev:Device = null;
          for(let i=0; i<vDevs.length; i++){
            if(vDevs[i].uid==pItem.uid){
              dev = vDevs[i];
              break;
            }
          }
          this.controller.openFocus(dev, 'ss','expl');
        })
        break;
    }

    //this.controller.open( pItem, 'expl');
    return null;
  }


  filterPkg(pData: DeviceItem[], pKey: string, pValue: string): DeviceItem[]{
    let field: string, cmpFn: any;
    const out: DeviceItem[] = [] ;

    if (pKey[0] == '['){
      field = pKey.substr(1);
      cmpFn = ((aVal) => (aVal.indexOf(pValue) > -1));
    }else{
      field = pKey;
      cmpFn = ((aVal) => (aVal === pValue));
    }

    pData.map( (aPkg: DeviceItem) => {
      if (cmpFn(aPkg) === true) { out.push(aPkg); }
    });

    return out;
  }

  onPanelResize(pEvent: any): any{

    console.log('device panel resize >', pEvent, pEvent.dim.width);

    const width: number = pEvent.dim.width;
    const height: number = pEvent.dim.height;


    if (pEvent.type === 'resize'){

      const el = this.explDevRef.nativeElement;
      const ctn = this.explDevCtnRef.nativeElement;
      const navH: number = this.view.nav.size.height;

      [el, ctn].map((pEl) => {

        if (!isNaN(width)){
          pEl.style.width = width + 'px';
          pEl.style.maxWidth = width + 'px';
        }
        if (!isNaN(height)){
          pEl.style.height = (height - navH) + 'px';
          pEl.style.maxHeight = (height - navH) + 'px';
        }
      });

    }
    else if (pEvent.type === 'render'){

      this.initialSize = Utils.dxc_deepCopy(pEvent);
      this.initialSize.type = 'resize';
    }

  }


  itemHasChildren( pItem: any, pType= 'p'): boolean {

    return (pItem.children != null  || pItem._t =='d' || pItem._t=='l');
  }


  itemHasLazyChildren( pItem:any, pType ='p'): boolean {
    return (pItem.children.length==1 && pItem.children[0]._t=="wait");
  }

  itemGetChildren( pItem: any): any{

    return pItem.children;
  }

  onExpand( pItem: any): void {
    // TODO

  }

  onCollapse( pItem: any): void {
    // todo
  }

  private _retrieveShortForm( pEl:any):string {

    console.log(pEl);
    switch(pEl.item._t){
      case "dev":
        return pEl.item.model+" [id="+pEl.item.id+"]";
        break;
      case "apkg":
        return pEl.item.packageIdentifier;
        break;
      case "p":
        return pEl.item.PID+" "+pEl.item.USER+" "+pEl.item.NAME;
        break;
      default:
        if(pEl.item.__ == NodeInternalType.FILE){
          return pEl.item.p;
        }else{
          return "";
        }
        break;
    }
  }

  /**
   *
   * @param pEvent
   */
  onItemFocus( pEvent: any): void{

    console.log(pEvent);


    this.electronSvc
      .getSelectionManager()
      .selectNode(pEvent.item, this._retrieveShortForm(pEvent));

    if (this.activeItem != null){
      this.activeItem.el.style.backgroundColor = '#444';
    }

    this.activeItem = pEvent;

    if (this.activeItem.item._t == 'enrollnow') {
      pEvent.el.style.backgroundColor = '#330000';
    }
    else {
      pEvent.el.style.backgroundColor = 'royalblue';
    }
  }

  onMenuItemClick( pEvent: any): void{

    this.view.nav.selectItem(pEvent.item);

    this.selected = pEvent.item.id;
  }


  displayExtMenu($event: MouseEvent, pType: string, pObj:any) {
    this.fsSvc.displayContextMenu($event, pType, pObj);
  }

  displayCtxMenu(pEvent: any, pType: string, pObject: any): void{
    const type:Nullable<string> = null;
    pEvent.preventDefault();
/*
    switch(pEvent.target._t){
      case 'c':
        type = 'clazz';
        break;
      case 'p':
        type = 'pkg';
        break;
      default:
        return ;
    }

    this.ctxMenuState = {
      menu: this.ctxMenu[type],
      subject: pEvent.target
    };

    console.log(type,pEvent);
    this.ctxMenu[type].show(pEvent.event, pEvent.target);*/

    this.ctxMenuState = {
      menu: this.ctxMenu[pType],
      subject: pObject
    };
    this.ctxMenu[pType].show(pEvent, pObject);
  }

  hideCtxMenu(): void{
    this.ctxMenuState.menu.hide(this.ctxMenuState.subject);
  }

  private _prepareDeviceRendering(pDevice:DeviceListItem):DeviceListItem {
    pDevice._icon = this.gIcons['DEVICE'];
    pDevice._t = 'dev';
    pDevice.children = [];

    if (pDevice.enrolled == false){
      pDevice.children.push({
        _t: 'enrollnow',
        dev: pDevice
      });
    }

    for (const bridge in pDevice.bridges){
      pDevice.children.push({
        _t: 'b',
        _icon: ((pDevice.bridges[bridge].shortname.indexOf('usb') > -1) ? this.icons['USB'] : this.icons['WIFI']),
        shortname: pDevice.bridges[bridge].shortname,
        uid: pDevice.bridges[bridge].deviceID,
      });
    }

    pDevice.children.push({
      _t: 'info',
      uid: pDevice.uid
    });

    pDevice.children.push({
      _t: 'app',
      _e: true,
      dev: pDevice,
      children: [{
        _t: 'wait'
      }]
    });

    pDevice.children.push({
      _t: 'ps',
      _e: true,
      dev: pDevice,
      children: [{
        _t: 'wait'
      }]
    });

    pDevice.children.push({
      _t: 'fs',
      _e: true,
      dev: pDevice,
      children: [{
        _t: 'wait'
      }]
    });

    return pDevice;
  }

  refresh() {

    this.dmService.listDevices()
      .pipe(
        map( (pObs: any) => {
          if( pObs == null) return pObs;
          pObs.map( vChild => {

            this._prepareDeviceRendering(vChild);
            /*
            vChild._icon = this.gIcons['DEVICE'];
            vChild._t = 'dev';
            vChild.children = [];

            if (vChild.enrolled == false){
              vChild.children.push({
                _t: 'enrollnow',
                dev: vChild
              });
            }

            for (const bridge in vChild.bridges){
              vChild.children.push({
                _t: 'b',
                _icon: ((vChild.bridges[bridge].shortname.indexOf('usb') > -1) ? this.icons['USB'] : this.icons['WIFI']),
                shortname: vChild.bridges[bridge].shortname,
                uid: vChild.bridges[bridge].deviceID,
              });
            }

            vChild.children.push({
              _t: 'info',
              uid: vChild.uid
            });

            vChild.children.push({
              _t: 'app',
              _e: true,
              dev: vChild,
              children: [{
                _t: 'wait'
              }]
            });

            vChild.children.push({
              _t: 'ps',
              _e: true,
              dev: vChild,
              children: [{
                _t: 'wait'
              }]
            });

            vChild.children.push({
              _t: 'fs',
              _e: true,
              dev: vChild,
              children: [{
                _t: 'wait'
              }]
            });*/
          });
          return pObs;
        })
      )
      .subscribe((pDevices: Device[]) => {
        this.dmReady = true;
        this.devices[DEV_SUBVIEW.ALL] = pDevices;
      });
  }


  addDeviceModal(){
    this.modalDm.show();
  }

  enroll(pItemObj: any, pForce = false): void {
    let dev: Device = null;

    if(pItemObj.enrolled && !pForce){
      this.outputSvc.confirm(OutputMessage.newConfirm({
        msg: "This device is already enrolled. Are you sure to re-enroll this device ? If the version of the operating system of the device changed since an old project, please enroll it as a new device.",
      }, (pEvent:any)=>{
        console.log("[ENROLL][CONFIRM] ",pEvent);
      }),{
        helpDocID: "dev.enroll.re"
      });
      return;
    }

    if (pItemObj._t == 'enrollnow'){
      dev = pItemObj.dev;
    }else{
      dev = pItemObj;
    }

    this.enrolling = true;
    this.dmService.enroll(dev).subscribe((pObs: any) => {
      console.log('enroll started : ', pObs);
      this.dmService.enrollStatus(dev).subscribe(( pObs2) => {
        console.log('status : ', pObs2);
      });
    });
  }

  filterApp(pItem: any, pFilter: any) {
    if(pFilter == null){
      this.refreshApp(pItem);
    }
    /*
    switch (pOpts.type) {
      case 'u':
        filter = {tag:['data']};
        break;
      case 'v':
        filter = {tag:['vendor','oem']};
        break;
      case 's':
        filter = {tag:['system']};
        break;
      case '*':
        this.refreshApp(pItem);
        break;
      default:
        this._printError('Applications cannot be filtered by this type.');
        return;
    }*/

    const itm = this._getItemByDevice( pItem.dev, 'app');
    if(itm != null){
      itm.filterChildren(pFilter)
    }
  }


  private _getItemByDevice( pDevice:Device, pType:string): ExpandableItemComponent<any> {
    let ret:ExpandableItemComponent<any> = null;

    this.expandableItems.map((itm:ExpandableItemComponent<any>)=>{
      if(itm.item.uid == pDevice.uid){
        itm.doExpand(null, itm.item, itm.itemRef);
        for(let i=0; i<itm.children.length; i++){
          if(itm.children[i].instance.itemType === pType){
              ret = itm.children[i].instance;
              break;
          }
        }
      }
    });

    return ret;
  }


  newProjectFromApp(subject: any) {
    this.progressTitle = 'Creating a new project ...';
    this.progress$.next({ value: 10, msg: 'Start to download app' });
    this.modalProgress.show();
  }

  installApp(pDevice: any, pSource = 'proj', pPath:string = null) {
    const opts:any = {};
    if(pSource == 'proj'){
      opts.src = 'proj';
    }else{
      opts.src = 'path';
      opts.path = pPath;
    }

    this.dmService.installApp( pDevice, opts).subscribe( (pObs) => {
      if (pObs.success){
        this.outputSvc.print(new OutputMessage({
          src: 'Device Manager',
          msg: 'Target application [' + pDevice.packageIdentifier + '] has been successfully downloaded from [' +
            pDevice.dev.id + '] into [' + pObs.data.tmp + '] temporary file'
        }));
      }else{
        this.outputSvc.print(new OutputMessage({
          src: 'Device Manager',
          msg: 'Downloading application [' + pDevice.packageIdentifier + '] from [' + pDevice.dev.id + '] device failed.'
        }));
      }
    });
  }


  uninstallProjectApp( subject:any){
    this.dmService.uninstallApp( subject, this.projectService.getSelectedProject().package ).subscribe( (pObs) => {
      if (pObs.success){
        this.outputSvc.print(new OutputMessage({
          src: 'Device Manager',
          msg: 'Target application [' + subject.packageIdentifier + '] has been successfully downloaded from [' +
            subject.dev.id + '] into [' + pObs.data.tmp + '] temporary file'
        }));
      }else{
        this.outputSvc.print(new OutputMessage({
          src: 'Device Manager',
          msg: 'Downloading application [' + subject.packageIdentifier + '] from [' + subject.dev.id + '] device failed.'
        }));
      }
    });

  }

  uninstallApp(subject: any) {
    this.dmService.uninstallApp( subject.dev, subject.packageIdentifier).subscribe( (pObs) => {
      if (pObs.success){
        this.outputSvc.print(new OutputMessage({
          src: 'Device Manager',
          msg: 'Target application [' + subject.packageIdentifier + '] has been successfully downloaded from [' +
            subject.dev.id + '] into [' + pObs.data.tmp + '] temporary file'
        }));
      }else{
        this.outputSvc.print(new OutputMessage({
          src: 'Device Manager',
          msg: 'Downloading application [' + subject.packageIdentifier + '] from [' + subject.dev.id + '] device failed.'
        }));
      }
    });
  }

  pullApp(subject: any) {
    this.progressTitle = 'Pulling application ...';
    this.progress$.next({ value: 20, msg: 'Start to pull app' });
    this.modalProgress.show();

    this.dmService.pullApp( subject.dev, subject.packageIdentifier).subscribe( (pObs) => {
      this.progress$.next({ value: 100 });
      this.modalProgress.close();
      if (pObs.success){
        this.outputSvc.print(new OutputMessage({
          src: 'Device Manager',
          msg: 'Target application [' + subject.packageIdentifier + '] has been successfully downloaded from [' +
            subject.dev.id + '] into [' + pObs.data.tmp + '] temporary file'
        }));
      }else{
        this.outputSvc.print(new OutputMessage({
          src: 'Device Manager',
          msg: 'Downloading application [' + subject.packageIdentifier + '] from [' + subject.dev.id + '] device failed.'
        }));
      }
    });
  }

  analyzeApp(subject: any) {
    this.projectService.onAnalysisConfig.next( {
      force_native: false,
      callback: (pConfig:any)=>{
        this.projectService
          .isAvailable('uid', subject.packageIdentifier)
          .subscribe( (pAvailable: boolean) => {
            if (pAvailable){
              try {
                this.projectService.newProject({
                  type: 'select',
                  dev: subject.dev.uid,
                  path: subject.packagePath,
                  name: subject.packageIdentifier,
                  cfg: pConfig
                }).subscribe( (pProject: DexcaliburProject) => {
                  this.outputSvc.print(new OutputMessage({ src: 'ProjectManager', msg: 'Creating a new project for app [' + subject.packageIdentifier + ']' }));
                });
              }catch (err){
                this.outputSvc.alert(new OutputMessage({ msg: err.message }));
              }
            }else{
              this.outputSvc.print(new OutputMessage({ src: 'ProjectManager', msg: 'Project name is not available. Please change it.' }));
            }
          });
      }
    });


  }

  setAsDefaultDev(pDevice: Device) {
    console.log(pDevice);
    this.projectService.setDefaultDevice( pDevice).subscribe((pRes: any) => {

      // nothing to do
    });
  }

  monitorPs(pDevice: any): void {
    // TODO
  }
  showFD(pDevice: any): void {
    // TODO

  }
  monitorFD(pDevice: any): void {
    // TODO

  }
  showMemoryMap(pDevice: any): void {
    // TODO

  }

  showFile(subject: any) {
    // TODO

  }

  deviceIdentify( pIndex:number, pItem:any ):string {

    return pItem.uid;
  }

  removeDevice( pDevice: Device): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    console.log(pDevice);
    this.outputSvc.confirm(OutputMessage.newConfirm({
      msg: `Are you sure to remove the device [${pDevice.model}:${pDevice.product}] ?
      This action cannot be undone (!)`
    }, ( vSuccess: boolean, vModal: ModalAlertComponent) => {
      console.log('on device remove confirm : ', vSuccess);
      if (vSuccess) {
        vModal.close('close'); // confirm
        self.dmService.removeDevice(pDevice).subscribe( (pSuccess) => {
          console.log('Remove dev : ' + pSuccess);
        });
      } else {
        vModal.close('close');
      }
    }));
  }

  openShell(pDev: Device, pPrivileged:boolean) {
    this.wsSvc.createDevShellSession(pDev, this.gIcons['DEVICE'], pPrivileged);
  }

  openInfo(pDev: Device) {
    this.controller.open( pDev, 'expl');
  }

  expand2th(pItem:any, pType:string, pSubject = false):void {
    this.expandableItems.map((itm:ExpandableItemComponent<any>)=>{
      if(itm.item.uid == (pSubject? pItem.subject.uid : pItem.uid)){
        itm.doExpand(null, itm.item, itm.itemRef);
        itm.children.map( (vItem:any) => {
          if(vItem.instance.item._t === pType){

            setTimeout( ()=>{
              vItem.instance.doExpand(
                null,
                vItem.instance.item,
                vItem.instance.itemRef
              );
            }, 50);
          }
        });
      }
    });
  }
  /**
   * To display running processes of the target device
   * @param subject
   */
  showProcess(pItem: any) {
    this.expand2th(pItem, 'ps');
  }
  /**
   *
   * To display file system of the target device
   * @param subject
   */
  showDevFs(pItem: any) {
    this.expand2th(pItem, 'fs', true);
  }

  usePrivilegedMode(pDev: Device, pRootMode: boolean):void {
    pDev.rootMode = pRootMode;
  }

  pullFile(pItem:any):void {
// todo
  }

  openFile(pItem:any):void {
// todo
  }

  openFile2( pItem:any): any {
    this.controller.open( { file:pItem, pool:null }, 'expl');
    return null;
  }


  refreshApp(pItem: any) {
    //console.log('refresh app',pItem);
    this.dmService.getApplications(pItem.dev, true).subscribe( (vApps:AppPackage[]) => {
      pItem.children = vApps;
      pItem.doExpand(null, pItem, pItem.ref);
    });
  }

  /**
   * To copy the value of a specific attribute from a node to the clipboard
   *
   * TODO : add more info (node, attr name)
   *
   * @param subject
   * @param n
   */
  copyAttr(subject: any, n: string = null) {
    if(n !== null)
      this.electronSvc.writeToClipboard(subject[n]);
    else
      this.electronSvc.writeToClipboard(subject);
  }

  analyze(pDevice: Device, pType = 'all') {
    this.dmService.doProfiling( pDevice, 'all', {type:pType}).subscribe((vProf)=>{
      this.controller.openFocus( pDevice, 'ss', pType);
    })
  }

  doDeviceAction(pItem: any, pAction: string) {
    return null;
  }
}
