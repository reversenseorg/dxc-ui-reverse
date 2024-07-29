import {from, Observable, Subject} from "rxjs";
import {Device} from "../../../models/Device";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {AppMenuService} from "../../../base/appmenu/app-menu.service";
import {DxcApiService} from "../../../base/DxcApiService";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import AppPackage from "../../../models/AppPackage";
import DeviceProfile, {BuildProfile, SystemProfile} from "../../../models/DeviceProfile";
import {ElectronService} from "../../../core/services";
import ModelSyscall from "../../../models/ModelSyscall";
import {DEVICE_PANEL} from "../viewport-device/viewport-device.component";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";
import {IStringIndex} from "../../../base/IStringIndex";
import {DeviceBindedData, EnrollmentOpts} from "../common";
import {PrivilegedExecutionStrategy} from "../../../models/devices/PrivilegedExecutionStrategy";

export type DeviceUID = string;
export interface AppAcquisitionOpts {
  type:"all"|"single";
  uids?:string[];
}

interface DeviceManagerCache {
  devices: Device[],
  app: Record<DeviceUID, DeviceBindedData<AppPackage>[]>,
  profiles: Record<string,any>,
  syscalls: Record<DeviceUID,ModelSyscall[]>
}

export enum DeviceCacheFlavor {
  NO_CACHE,
  CACHE_FIRST
}


export enum FridaServerTransport {
  USB='U',
  NETWORK='H'
}

export interface FridaServerOptions extends IStringIndex<any> {
  server: string,
  transport:FridaServerTransport,
  privileged:boolean,
  port:number,
  timeout:number,
  before:string
}

const AUTH_ENFORCE = false;
@Injectable({
  providedIn: 'root'
})
export class DeviceManagerService extends DxcApiService {

  devices: Observable<Device[]>;

  devices$: Subject<Device[]> = new Subject<Device[]>();

  private _cache:DeviceManagerCache = {
    devices: [],
    app: {},
    syscalls: {},
    profiles: {}
  };

  onMenuClick:Subject<any> = new Subject<any>();
  onNewHookOfDeviceFS:Subject<any> = new Subject<any>();
  onDeviceListRefresh: Subject<Device[]> = new Subject<Device[]>();

  constructor( private appmenuSvc:AppMenuService,
               private electronSvc:ElectronService,
               private outputSvc:OutputService,
               _http:HttpClient) {
    super(
      {
        device: {
          list: { method: 'GET', url:'/device', format:'json', auth:AUTH_ENFORCE },
          clearAll: { method: 'POST', url:'/device/clear', format:'json', auth:AUTH_ENFORCE},
          clearDev: { method: 'POST', url:'/device/clear/:uid', format:'json', auth:AUTH_ENFORCE},
          connect: { method: 'POST', url:'/device/connect', format:'json', auth:AUTH_ENFORCE},
          bridgeKill: { method: 'POST', url:'/device/bridge/:name/kill', format:'json', auth:AUTH_ENFORCE},
          enroll: { method: 'POST', url:'/device/enroll', format:'json', auth:AUTH_ENFORCE},
          enrollStatus: { method: 'GET', url:'/device/enroll/status', format:'json', auth:AUTH_ENFORCE},
          getPS: { method: 'GET', url:'/device/processes', format:'json', auth:AUTH_ENFORCE},
          setDefault: { method: 'POST', url:'/device/setDefault', format:'json', auth:AUTH_ENFORCE},
          addBridge: { method: 'PUT', url:'/device/:uid/bridge', format:'json', auth:AUTH_ENFORCE},
          listFile: { method: 'GET', url:'/device/fs/list', format:'json', auth:AUTH_ENFORCE},
          readFile: { method: 'GET', url:'/device/fs/content', format:'json', auth:AUTH_ENFORCE},
          pullFile: { method: 'GET', url:'/device/fs/pull', format:'json', auth:AUTH_ENFORCE},
          getApp: { method: 'GET', url:'/device/applications/:uid', format:'json', auth:AUTH_ENFORCE},
          getSyscalls: { method: 'GET', url:'/device/syscalls', format:'json', auth:AUTH_ENFORCE},
          pullApp: { method: 'POST', url:'/device/application/pull', format:'json', auth:AUTH_ENFORCE},
          acquire: { method: 'POST', url:'/device/acquire', format:'json', auth:AUTH_ENFORCE},
          installApp: { method: 'POST', url:'/device/application/install/app', format:'json', auth:AUTH_ENFORCE},
          installProject: { method: 'POST', url:'/device/application/install/project', format:'json', auth:AUTH_ENFORCE, puid:true},
          uninstallApp: { method: 'POST', url:'/device/application/uninstall', format:'json'},
          profileAll: { method: 'GET', url:'/device/profile/all', format:'json', auth:AUTH_ENFORCE},
          profile: { method: 'GET', url:'/device/profile/:type', format:'json', auth:AUTH_ENFORCE},
          doProfiling: { method: 'POST', url:'/device/profile/:type', format:'json', auth:AUTH_ENFORCE},
          admin: { method: 'POST', url:'/device/admin/:action', format:'json', auth:AUTH_ENFORCE},
          eop_change: { method: 'POST', url:'/device/eop/change', format:'json', auth:AUTH_ENFORCE}
        },
        frida: {
          save: { method: 'POST', url:'/device/frida/settings', format:'json', auth:AUTH_ENFORCE}
        }
      },_http, outputSvc
    );

    this.appmenuSvc.addMenu({
      id:'dev',
      label: 'Device',
      enabled:true,
      submenu:[{
        label: 'List devices ...',
        accelerator: 'CommandOrControl+Shift+D',
        click: ()=>{
          this.onMenuClick.next({ item:'list-dev' });
        }
      },{
        type: 'separator'
      },/*{
        id: 'devlist',
        label: 'Target device',
        submenu: [
          {
            label: 'No device enrolled',
            enabled: false
          },{
            type: 'separator'
          },{
            label: 'Enroll a new device'
          }
        ]
      },*/{
        label: 'Show screen mirror',
        enabled: false
      },{
        label: 'Record touch events',
        enabled: false
      },{type:'separator'},{
        label: 'Search Permissions',
        click: ()=>{
          const dev=this.electronSvc.getSelectionManager().getNewest().el;
          this.doProfiling(dev,'perm').subscribe((vProfile)=>{
            this.onMenuClick.next({ item:'show-dev', dev:dev, tab:DEVICE_PANEL.PERM });
          });
        }
      },{
        label: 'Search CA Certificates',
        click: ()=>{
          const dev=this.electronSvc.getSelectionManager().getNewest().el;
          this.doProfiling(dev,'trust').subscribe((vProfile)=>{
            this.onMenuClick.next({ item:'show-dev', dev:dev, tab:DEVICE_PANEL.CERT });
          });
        }
      },{
        label: 'Supported System calls',
        click: ()=>{
          const dev=this.electronSvc.getSelectionManager().getNewest().el;
          this.doProfiling(dev,'sc').subscribe((vProfile)=>{
            this.onMenuClick.next({ item:'show-dev', dev:dev, tab:DEVICE_PANEL.SYSCALL });
          });
        }
      },{
        label: 'List Mounted FileSystems',
        click: ()=>{
          const dev=this.electronSvc.getSelectionManager().getNewest().el;
          this.doProfiling(dev,'mounts').subscribe((vProfile)=>{
            this.onMenuClick.next({ item:'show-dev', dev:dev, tab:DEVICE_PANEL.MOUNTS });
          });
        }
      },{
        label: 'Search USB / ADB keys',
        click: ()=>{
          const dev=this.electronSvc.getSelectionManager().getNewest().el;
          this.doProfiling(dev,'usb').subscribe((vProfile)=>{
            this.onMenuClick.next({ item:'show-dev', dev:dev, tab:DEVICE_PANEL.USB });
          });
        }
      },{
        label: 'Profile the device',
        click: ()=>{
          const dev=this.electronSvc.getSelectionManager().getNewest().el;
          this.doProfiling(dev,'all').subscribe(()=>{
            this.onMenuClick.next({ item:'show-dev', dev:dev, tab:DEVICE_PANEL.SYSTEM });
          });
        }
      },{
        type: 'separator'
      },{
        label: 'Restart bridge server (adb, ..)',
        click: ()=>{
          this.restartBridge();
        }
      }]
    }, 6);

  }

  /*
  updateDevListMenu( pDevs:Device[]):void {

    let o:any = [];
    const itm:any=[] = this.appmenuSvc.getSubMenu('dev').submenu.getMenuItemById('devlist').submenu.items;

    pDevs.map( (vDev:Device) => {
      o.push({
        label: vDev.model+' ('+vDev.id+')'
      });
    });
    o.push(itm[itm.length-2])
    o.push(itm[itm.length])
    this.appmenuSvc.getSubMenu('dev').submenu.getMenuItemById('devlist').submenu.

  }*/

  readFile( pDevice:Device, pPath:string, pStt:string):Observable<any>{
    return this._process(
      this.endpoints['device']['readFile'], {
        uid: pDevice.uid,
        path: pPath,
        type: pStt
      }
    ).pipe(
      map((pEl:any)=>{
        if(pEl.success){
          this.outputSvc.print(new OutputMessage({
            src: "Device Manager",
            msg: `File "${pPath}" read successfully`
          }));

          // console.log(this.appmenuSvc.getSubMenu('dev').submenu.getMenuItemById('devlist').submenu.items);
          //  this.updateDevListMenu(this._cache.devices);
          return pEl.data;
        }else{
          this.outputSvc.print(OutputMessage.newError({
            src: "Device Manager",
            msg: "File cannot be read. See help :"+pEl.msg
          }));
        }
      })
    );
  }

  /**
   * To restart the server/daemon running host-side and used to communicate with specified device
   * @param {Device} pDevice
   */
  restartBridge( pDevice:Nullable<Device> = null):void {

    let dev:Device;

    if(pDevice==null){

      const sel = this.electronSvc.getSelectionManager().getNewest();
      console.log(sel);

      if(sel.el.hasOwnProperty('_t') && (sel.el._t=='dev')){
        dev = sel.el as Device;
      }else{
        throw UIException.DEVICE_IS_NOT_SELECTED("device-manager","restartBridge");

        this.outputSvc.print( OutputMessage.newError({
          src: "Device Manager",
          msg: "Operation [device-manager:restartBridge] cannot be performed. A device must be specified or selected by a click"
        }));
        return;
      }
    }else{
      dev = pDevice;
    }

    this._process(
        this.endpoints['device']['restartBridge'],{
          uid:dev.uid
        }
    ).pipe(
        map((pEl:any)=>{
          console.log(pEl);
          if(pEl.success){
            this.outputSvc.print(new OutputMessage({
              src: "Device Manager",
              msg: `The server/daemon bridge of the device ${dev.uid} has been restarted.`
            }));
            return pEl.data;
          }else{
            this.outputSvc.print( OutputMessage.newError({
              src: "Device Manager",
              msg: pEl.msg
            }));
            return null;
          }
        })
    );
  }

  listDevices(pCacheFlavor:DeviceCacheFlavor = DeviceCacheFlavor.NO_CACHE):Observable<Device[]>{
    if((pCacheFlavor == DeviceCacheFlavor.CACHE_FIRST) && (this._cache.devices.length > 0)){
      return from([this._cache.devices]);
    }

    return this._process(
      this.endpoints['device']['list']
    ).pipe(
      map((pEl:any)=>{
        if(pEl.success){

          this._cache.devices = [];
          pEl.data.devices.map( (rawDev:any) => {
            this._cache.devices.push(new Device(rawDev));
          });

          this.outputSvc.print(new OutputMessage({
            src: "Device Manager",
            msg: `There are ${pEl.data.devices.length} devices configured`
          }));

          this.devices$.next(this._cache.devices);

          // console.log(this.appmenuSvc.getSubMenu('dev').submenu.getMenuItemById('devlist').submenu.items);
         //  this.updateDevListMenu(this._cache.devices);
          return this._cache.devices;
        }else{

          this.outputSvc.print(OutputMessage.newError({
            src: "Device Manager",
            msg: pEl.msg+". See help"
          }));
          return [];
        }
      })
    );
  }


  listDevicesFromCache():Device[]{
    return this._cache.devices;
  }


  getProfile( pDevice:Device, pForce=false):Observable<DeviceProfile> {

    if(pDevice.uid==null){
      throw UIException.DEVICE_IS_NOT_SELECTED("device-manager","getProfile");
    }

    if(this._cache.profiles.hasOwnProperty(pDevice.uid) && !pForce){
        return from([ this._cache.profiles[pDevice.uid] ]);
    }

    //
    return this._process(
      this.endpoints['device']['profileAll'],{
        uid:pDevice.uid,
      }
    ).pipe(
      map((pEl:any)=>{
        console.log(pEl);
        if(pEl.success){
          this.outputSvc.print(new OutputMessage({
            src: "Device Manager",
            msg: `Data from device profiling have been retrieved for device ${pDevice.uid}`
          }));
          return this._cache.profiles[pDevice.uid as string] = pEl.data; //DeviceProfile.fromJsonObject(pEl.data);
        }else{
          this.outputSvc.print( OutputMessage.newError({
            src: "Device Manager",
            msg: pEl.msg
          }));
        }
      })
    );
  }

  doProfiling( pDevice:Device, pType:string, pOptions:any = {}):Observable<Nullable<DeviceProfile>> {
    const uid = pDevice.uid;
    const opts = pOptions;


    if(pDevice.uid==null){
      throw UIException.DEVICE_IS_NOT_SELECTED("device-manager","doProfiling");
    }

    return this._process(
      this.endpoints['device']['doProfiling'],{
        uid:uid,
        type: pType,
        opts:opts
      }
    ).pipe(
      map((pEl:any)=>{
        console.log(pEl);
        if(pEl.success){
          this.outputSvc.print(new OutputMessage({
            src: "Device Manager",
            msg: `Profiling of device "${pDevice.uid}" is done. `
          }));

          if(pDevice.profile==null){
            pDevice.profile = new DeviceProfile();
            // pDevice.profile = DeviceProfile.fromJsonObject(pEl.data);
          }

          switch (pType){
            case 'network':
            case 'build':
            case 'system':
            case 'mounts':
            case 'usb':
              pDevice.profile.profiles[pType] = pEl.data.profiles[pType]; //SystemProfile.fromJsonObject(pEl.data);
              break;
            case 'trust':
              pDevice.profile.profiles[pType] = pEl.data; //SystemProfile.fromJsonObject(pEl.data);
              break;
            case 'all':
            default:
              pDevice.profile = DeviceProfile.fromJsonObject(pEl.data);
              break;
          }
          return this._cache.profiles[uid as string] = pDevice.profile; //DeviceProfile.fromJsonObject(pEl.data);
        }else{
          this.outputSvc.print( OutputMessage.newError({
            src: "Device Manager",
            msg: pEl.msg
          }));
          return null;
        }
      })
    );
  }

  /**
   * type:(pItem.dev.rootMode? 'privileged':'user')
   * @param pDevice
   * @param pStrategy
   */
  getProcesses( pDevice:Device, pStrategy:string):Observable<any[]>{
    return this._process(
      this.endpoints['device']['getPS'],{
        uid:pDevice.uid,
        type:pStrategy
      }
    ).pipe(
      map((pEl:any)=>{
        console.log(pEl);
        if(pEl.success){
          this.outputSvc.print(new OutputMessage({
            src: "Device Manager",
            msg: `There are ${pEl.data.length} processess running  on the device ${pDevice.uid}`
          }));
          return pEl.data;
        }else{
          this.outputSvc.print( OutputMessage.newError({
            src: "Device Manager",
            msg: pEl.msg
          }));
          return [];
        }
      })
    );
  }


  /**
   * To get the list of packages installed on the specified device
   *
   * @param {Device} pDevice Target device
   * @param {boolean} pRefresh Default FALSE. Turn to TRUE to force refresh, else it pull apps from local cache
   * @returns {Observable<DeviceBindedData<AppPackage>[]>}
   * @method
   */
  getApplications( pDevice:Device, pRefresh = false):Observable<DeviceBindedData<AppPackage>[]>{


    if(pDevice.uid==null){
      throw UIException.DEVICE_IS_NOT_SELECTED("device-manager","getApplications");
    }

    let appCache:DeviceBindedData<AppPackage>[] = this._cache.app[pDevice.uid];

    if(appCache != null && appCache.length>0 && !pRefresh){
      return from([ appCache ]);
    }

    return this._process(
      this.endpoints['device']['getApp'],
      { uid:pDevice.uid }
    ).pipe(
      map((pEl:any)=>{
        if(pEl.success){
          appCache = []
          pEl.data.map((x:any) => {
            const app = new AppPackage(x);
            (app as DeviceBindedData<any>).dev = pDevice;
            appCache.push(app as DeviceBindedData<AppPackage>);
          });


          this._cache.app[pDevice.uid as string] = appCache;

          this.outputSvc.print(new OutputMessage({
            src: "Device Manager",
            msg: `There are ${pEl.data.length} applications installed on device ${pDevice.uid}`
          }));

          return this._cache.app[pDevice.uid as string];
        }else{
          this.outputSvc.print( OutputMessage.newError({
            src: "Device Manager",
            msg: pEl.msg
          }));
          return [];
        }
      })
    );
  }

  getSystemCalls( pDevice:Device, pRefresh = false):Observable<ModelSyscall[]>{


    if(pDevice.uid==null){
      throw UIException.DEVICE_IS_NOT_SELECTED("device-manager","getSystemCalls");
    }

    let scCache:ModelSyscall[] = this._cache.syscalls[pDevice.uid];

    if(scCache != null && scCache.length>0 && !pRefresh){
      return from([ scCache ]);
    }

    return this._process(
      this.endpoints['device']['getSyscalls'],
      { uid:pDevice.uid }
    ).pipe(
      map((pEl:any)=>{
        if(pEl.success){
          scCache = []
          pEl.data.map((x:any) => {           scCache.push( new ModelSyscall(x))
          });

          this._cache.syscalls[pDevice.uid as string] = scCache;

          this.outputSvc.print(new OutputMessage({
            src: "Device Manager",
            msg: `There are ${pEl.data.length} system calls available on the device ${pDevice.uid}`
          }));

          return this._cache.syscalls[pDevice.uid as string];
        }else{
          this.outputSvc.print( OutputMessage.newError({
            src: "Device Manager",
            msg: pEl.msg
          }));
          return [];
        }
      })
    );
  }


  /**
   *
   * Options are :
   *  - profiling
   *  - frida
   *    - hostPath
   *    - devicePath
   *    - downloadUrl (remoteURL)
   *    - randomName : true/false
   * @param pDevice
   */
  enroll( pDevice:Device, pOptions:EnrollmentOpts = {profiling:{rooted:true}}):Observable<any> {



    return this._process(
      this.endpoints['device']['enroll'],
      {
        uid:pDevice.uid,
        opts: {
          profiling:{
            unprivileged: (pOptions.profiling? (!pOptions.profiling.rooted):true)
          },
          frida:{
            devicePath: '/data/local/tmp/frida-server'
            /*
            hostPath: '',
            devicePath: '',
            downloadURL: ''
            randomName: ''
             */
          },
          ...pOptions
        }
      }
    ).pipe(
      map((pEl:any)=>{

        if(!pEl.success){
          this.outputSvc.alert(
            OutputMessage.newError({msg:pEl.msg, src:"Device Manager"}),
            {
              title: "Enrollment error"
            }
          );
        }else{


          return pEl;
        }
      })
    );
  }

  enrollStatus( pDevice:Device):Observable<any> {

    return this._process(
      this.endpoints['device']['enrollStatus'],
      { uid:pDevice.uid }
    ).pipe(
      map((pEl:any)=>{
        /*this.outputSvc.print(new OutputMessage({
          src: "Device Manager",
          msg: `Enrollment status : ${pDevice.uid} `
        }));*/
        console.log(pEl);
        return pEl;
      })
    );
  }

  /*isDeviceOnline( pDevice:Device): Observable<boolean> {
    return null;
  }*/

  pullApp( pDevice:Device, pApp:any, pPath:any = null): Observable<any>  {
    return this._process(
      this.endpoints['device']['pullApp'],
      (pPath!=null ? { uid:pDevice.uid, package:pApp, path:pPath } : { uid:pDevice.uid, package:pApp })
    ).pipe(
      map((pEl:any)=>{
        if(pEl.success){

        }
        console.log(pEl);
        return pEl;
      })
    );
  }

  removeDevice( pDevice: Device): Observable<boolean> {

    if(pDevice.uid==null){
      throw UIException.DEVICE_IS_NOT_SELECTED("device-manager","removeDevice");
    }

    return this.removeDeviceByUID( pDevice.uid);
  }

  /**
   * To remove a device by its UID
   *
   * Trigger "refresh" event
   *
   * @param pDeviceUid
   */
  removeDeviceByUID( pDeviceUid: string): Observable<boolean> {
    console.log("Remove : "+pDeviceUid);
    return this._process(
      this.endpoints['device']['clearDev'],
      { uid: pDeviceUid }
    ).pipe(map( (pRes: any) => {
      if(!pRes.success){
        this.outputSvc.alert( OutputMessage.newError({ msg: pRes.msg }));
        return false;
      }else{
        this.outputSvc.print( OutputMessage.newSuccess({ msg: 'The device ['+pDeviceUid+'] has been removed' }));
        this.listDevices(DeviceCacheFlavor.NO_CACHE).subscribe(()=>{});
        return true;
      }
    }));
  }

  /**
   * To save frida settings for the specified device
   *
   * @param {Device} pDevice
   * @param {any} pSettings
   * @method
   * @since 1.0.0
   */
  saveSettings( pDevice:Device, pSettings:FridaServerOptions){
    const opts = { uid: pDevice.uid, opts:{} };

    for(const i in pSettings) (opts.opts as IStringIndex<any>)[i] = pSettings[i];

    return this._process(
      this.endpoints['frida']['save'], opts
    ).pipe(map( (pRes: any) => {
      if(!pRes.success){
        this.outputSvc.alert( OutputMessage.newError({ msg: pRes.msg }));
        return false;
      }else{
        this.outputSvc.print( OutputMessage.newSuccess({ msg: 'Options of Frida Server for device ['+opts.uid+'] have been saved' }));
        return true;
      }
    }));
  }


  installApp( pDevice:Device, pOptions:any):Observable<any>{
    const opts = { uid: pDevice.uid, opts:pOptions };
    const endpoint = pOptions.src=='proj' ? this.endpoints['device']['installProject'] : this.endpoints['device']['installApp'];

    return this._process(
      endpoint, opts
    ).pipe(map( (pRes: any) => {
      if(!pRes.success){
        this.outputSvc.alert( OutputMessage.newError({ msg: pRes.msg }));
        return pRes;
      }else{
        this.outputSvc.print( OutputMessage.newSuccess({ msg: 'The application ['+opts.opts.pkg+'] has been installed on device ['+opts.uid+'] ' }));
        return pRes;
      }
    }));
  }

  uninstallApp( pDevice:Device, pOptions:any){
    const opts = { uid: pDevice.uid, opts:pOptions };

    return this._process(
      this.endpoints['device']['uninstallApp'], opts
    ).pipe(map( (pRes: any) => {
      if(!pRes.success){
        this.outputSvc.alert( OutputMessage.newError({ msg: pRes.msg }));
        return pRes;
      }else{
        this.outputSvc.print( OutputMessage.newSuccess({ msg: 'The application ['+opts.opts.pkg+'] has been uninstalled on device ['+opts.uid+'] ' }));
        return pRes;
      }
    }));
  }


  remount( pDevice:Device, pItem:any, pOptions:any){
    const opts = { action:"remount", uid: pDevice.uid, opts:pOptions };

    console.log("remount : ",pDevice, pItem, pOptions);


    return this._process(
      this.endpoints['device']['admin'], opts
    ).pipe(map( (pRes: any) => {
      if(!pRes.success){
        this.outputSvc.alert( OutputMessage.newError({ msg: pRes.msg }));
        return pRes;
      }else{
        //his.outputSvc.print( OutputMessage.newSuccess({ msg: 'The application ['+opts.opts.pkg+'] has been uninstalled on device ['+opts.uid+'] ' }));
        return pRes;
      }
    }));
  }

  /**
   * To acquire one or more app from a device
   *
   * @param pDevice
   * @param {App}
   */
  acquireApp(pDevice: Device, pOptions:AppAcquisitionOpts = {type:"all"}) {
    return this._process(
        this.endpoints['device']['acquire'], {
          device: pDevice.uid,
          opts: pOptions
        }
    ).pipe(map( (pRes: any) => {
      if(!pRes.success){
        this.outputSvc.alert( OutputMessage.newError({ msg: pRes.msg }));
        return pRes;
      }else{
        //his.outputSvc.print( OutputMessage.newSuccess({ msg: 'The application ['+opts.opts.pkg+'] has been uninstalled on device ['+opts.uid+'] ' }));
        return pRes;
      }
    }));
  }


  /**
   * To save ean EoP strategy
   *
   * @param {Device} pDevice
   * @param {PrivilegedExecutionStrategy} pStrategy
   * @method
   */
  saveStrategy(pDeviceID:string, pBridgeName:string, pStrategy: PrivilegedExecutionStrategy):Observable<boolean> {

    return this._process(
        this.endpoints['device']['eop_change'], {
          uid: pDeviceID,
          bridge: pBridgeName,
          strategy: pStrategy
        }
    ).pipe(map( (pRes: any) => {
      if(!pRes.success){
        this.outputSvc.alert( OutputMessage.newError({ msg: pRes.msg }));
        return false;
      }else{
        //his.outputSvc.print( OutputMessage.newSuccess({ msg: 'The application ['+opts.opts.pkg+'] has been uninstalled on device ['+opts.uid+'] ' }));
        return true;
      }
    }));
  }
}
