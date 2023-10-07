import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {merge, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {DxcApiService} from "../../../base/DxcApiService";
import {AppMenuService, MenuEvent} from "../../../core/components/appmenu/appmenu.service";
import AndroidActivity from "../../../models/android/AndroidActivity";
import AndroidProvider from "../../../models/android/AndroidProvider";
import AndroidService from "../../../models/android/AndroidService";
import AndroidReceiver from "../../../models/android/AndroidReceiver";
import {AndroidManifest} from "../../../models/android/AndroidManifest";
import {AndroidPermission} from "../../../models/android/Permissions";
import ModelFile from "../../../models/ModelFile";
import {SearchService} from "../../search/ctrl/search.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {OutputService} from "../../output/ctrl/output.service";
import {NodeInternalType} from "../../../models/NodeInternalType";
import AndroidComponent from "../../../models/android/AndroidComponent";
import {UIException} from "../../../base/error/UIException";
import {IStringIndex} from "../../../base/IStringIndex";
import {IntentFilter} from "../../../models/android/IntentFilter";
import {Nullable} from "../../../base/Nullable";
import {IntentDataCriteria} from "../../../models/android/Intent";


export interface TopologyMenuEvent {
  scope?:string;
  type?:string;
  item:NodeInternalType;

  product?:string;
}


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class TopologyService extends DxcApiService {

  //activeProject:DexcaliburProject[] = [];

  onMenuClick$:Subject<TopologyMenuEvent> = new Subject<TopologyMenuEvent>();
  onOpenPackageFile$:Subject<any> = new Subject<any>();

  //onSearchReady:Subject<DexcaliburProject> = new Subject<DexcaliburProject>();
  //onProjectOpening:Subject<DexcaliburProject> = new Subject<DexcaliburProject>();

  activities:AndroidActivity[] = [];
  providers:AndroidProvider[] = [];
  receivers:AndroidReceiver[] = [];
  services:AndroidService[] = [];
  perms:AndroidPermission[] = [];

  constructor( private appmenuSvc:AppMenuService,
               private searchSvc:SearchService,
               private outputSvc:OutputService,
               protected override _http:HttpClient) {
    super(
      {
        app: {
          act: { method:'GET', url:'/android/activities', format: 'json', auth:false /* removed */, puid:true },
          serv: { method:'GET', url:'/android/services', format: 'json', auth:false /* removed */, puid:true },
          prov: { method:'GET', url:'/android/providers', format: 'json', auth:false /* removed */, puid:true },
          recv: { method:'GET', url:'/android/receivers', format: 'json', auth:false /* removed */, puid:true },
          perm: { method:'GET', url:'/android/permissions', format: 'json', auth:false /* removed */, puid:true },
          manifest: { method:'GET', url:'/android/manifest', format: 'json', auth:false /* removed */, puid:true },
        },
        anal: {
          cmp: { method:'POST', url:'/android/component/scan', format: 'json', auth:false /* removed */, puid:true },
        },
        dyn: {
          dex: { method:'GET', url:'/inspector/DynamicLoader/show/refresh_dyndex', format: 'json', auth:false /* removed */, puid:true},
        },
        file: {
          dex: { method:'GET', url:'/android/permissions', format: 'json', auth:false /* removed */, puid:true},
          libs: { method:'GET', url:'/android/permissions', format: 'json', auth:false /* removed */, puid:true},
          keystore: { method:'GET', url:'/android/permissions', format: 'json', auth:false /* removed */, puid:true}
        }
      },_http,outputSvc
    );


    this.appmenuSvc.addMenu({
      id:'instr',
      label: 'Application',
      enabled:false,
      submenu:[{
        label: 'Dashboard',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick$.next({ item:NodeInternalType.DASHBOARD });
        }
      },{
        type: 'separator',
      },{
        label: 'Activities',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick$.next({ item:NodeInternalType.ANDROID_ACTIVITY });
        }
      },{
        label: 'Providers',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick$.next({ item:NodeInternalType.ANDROID_PROVIDER });
        }
      },{
        label: 'Services',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick$.next({ item:NodeInternalType.ANDROID_SERVICE });
        }
      },{
        label: 'Receivers',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick$.next({ item:NodeInternalType.ANDROID_RECEIVER });
        }
      }, {
        type: 'separator'
      },{
        label: 'Show Android manifest',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onOpenPackageFile$.next({ item:NodeInternalType.FILE, file:"AndroidManifest.xml", scope:'PKG', type:'manifest' });
        }
      },{
        label: 'Show AIDL file',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick$.next({ item:NodeInternalType.FILE, scope:'DEVICE', type:'aidl' });
        }
      },{
        type: 'separator'
      },{
        label: 'Dex files and buffers',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick$.next({ item:NodeInternalType.FILE, scope:'PKG', type:'dex' });
        }
      },{
        label: 'Libraries',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick$.next({ item:NodeInternalType.FILE, scope:'PKG', type:'libs' });
        }
      },{
        label: 'Key Stores',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick$.next({ item:NodeInternalType.FILE, scope:'PKG', type:'ks' });
        }
      }, {
        type: 'separator'
      },{
        label: 'File Descriptor',
      },{
        label: 'Class loaders',
      }, {
        type: 'separator'
      },{
        label: 'Action',
        submenu: [
          {
            label: 'Spawn main activity',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
            }
          },{
            label: 'Send intent',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
            }
          },{
            label: 'Install',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
            }
          },{
            label: 'Dumpsys',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
            }
          }
        ]
      },{
        type: 'separator'
      },{
        label: 'Scan',
        submenu: [
          {
            label: 'Privacy Impact',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
              //this.onMenuClick$.next({ item:NodeInternalType.DASHBOARD, product:"PRI_CLD_SSCAN" });
              this.onMenuClick$.next({ item:NodeInternalType.DASHBOARD, product:"privacy.generic" });
            }
          }
        ]
      }/*,{
        type: 'separator'
      },{
        label: 'Patch',
        submenu: [
          {
            label: 'Show versions',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
            }
          },{
            label: 'Show patches',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
            }
          },{
            label: 'Install patched app',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
            }
          },{
            label: 'Save current as ...',
            click: (pMenuItem:any, pBrowserWindow:any ) => {
            }
          }
        ]
      }*/]
    }, 9);

  }


  getActivities():Observable<AndroidActivity[]> {
    return this._process(
      this.endpoints['app']['act']
    ).pipe(map((pObs)=>{
      if(pObs.success){
        return pObs.data;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Topology",
          msg: pObs.msg
        }));
      }
    }));
  }


  getProviders():Observable<AndroidProvider[]> {
    return this._process(
      this.endpoints['app']['prov']
    ).pipe(map((pObs)=>{
      if(pObs.success){
        return pObs.data;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Topology",
          msg: pObs.msg
        }));
      }
    }));
  }


  getServices():Observable<AndroidService[]> {
    return this._process(
      this.endpoints['app']['serv']
    ).pipe(map((pObs)=>{
      if(pObs.success){
        return pObs.data;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Topology",
          msg: pObs.msg
        }));
      }
    }));
  }


  getReceivers():Observable<AndroidReceiver[]> {
    return this._process(
      this.endpoints['app']['recv']
    ).pipe(map((pObs)=>{
      if(pObs.success){
        return pObs.data;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Topology",
          msg: pObs.msg
        }));
      }
    }));
  }

  scanComponent( pComponent:AndroidComponent):Observable<AndroidComponent> {
    return this._process(
      this.endpoints['anal']['cmp'],{
        type: pComponent.__,
        uid: pComponent.name
      }
    ).pipe(map((pObs)=>{
      console.log(pObs);
      if(pObs.success){
        return pObs.data;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Topology",
          msg: pObs.msg
        }));
      }
    }));
  }


  getManifest():Observable<AndroidManifest> {
    return this._process(
      this.endpoints['app']['manifest']
    ).pipe(map((pObs)=>{
      if(pObs.success){
        return pObs.data;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Topology",
          msg: pObs.msg
        }));
      }
    }));
  }


  getPermissions():Observable<AndroidPermission[]> {
    return this._process(
      this.endpoints['app']['perm']
    ).pipe(map((pObs)=>{
      if(pObs.success){
        return pObs.data;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Topology",
          msg: pObs.msg
        }));
      }
    }));
  }

  /**
   *
   * @param {string} pType
   * @return {Observable<ModelFile[]>}
   */
  getFiles(pType:string):Observable<ModelFile[]> {

    let obs:Observable<any>;
    switch(pType){
      case 'dex':
        // merge event stream (dex from apk and dex discovered dynamically)
        return merge(
          this.searchSvc.executeRaw('file("name:\.dex$")').pipe( map( (pData)=>{
            let f:ModelFile[] = [];
            pData.data.map((vFile:any) => { f.push(new ModelFile(vFile)); });
            return f;
          })),
          this._process(
            this.endpoints['dyn']['dex'],
            { action:'refresh_dex' }
            ).pipe(map( vFile => {
              console.log("Dyn Dex : ",vFile);

              if(vFile.error==null) return vFile.data.refs;
            }))
        );
        break;
      case 'ks':
        obs = this.searchSvc.executeRaw('file("type:KS")');
        break;
      case 'libs':
        obs = this.searchSvc.executeRaw('file("type:ELF")');
        break;
      default:
        throw new Error("TODO EXC");
    }

    return obs.pipe( map( (pData:any)=>{

      if(pData.success){
        let f:ModelFile[] = [];
        pData.data.map((vFile:any) => {f.push(new ModelFile(vFile)); });
        return f;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Topology",
          msg: pData.msg
        }));
        return [];
      }

    }));
  }

  sendIntent():void {

  }

  protected _modals:IStringIndex<any> = {};
  registerModal( pName:string, pModal:any):void{
    this._modals[pName] = pModal;
  }

  prepareIntent(pComponent: AndroidComponent, pIntentFilter: IntentFilter, pCriteria: Nullable<IntentDataCriteria>):void {
    this._modals['prepareIntent'].comp = pComponent;
    this._modals['prepareIntent'].filter = pIntentFilter;
    this._modals['prepareIntent'].criteria = pCriteria;
    this._modals['prepareIntent'].show();
  }
}

