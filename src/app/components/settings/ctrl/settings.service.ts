import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {DxcApiService} from "../../../base/DxcApiService";
import {Observable, Subject} from "rxjs";
import {ExternalTool} from "../../../models/ExternalTool";
import {map} from "rxjs/operators";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {Nullable} from "../../../base/Nullable";
import {AppMenuService} from "../../../base/appmenu/app-menu.service";


export interface Setting {
  name:string;
  value:any;
  saved?:boolean;
}

export interface WebServerSettings {
  http: Setting;
  ws: Setting;
}

export interface ServerSettings {
  workspace?: Setting;
  registry?: Setting;
  registryAPI?: Setting;
  auth?: Setting;
  heapSize?: Setting;
}


/**
 *
 * Service
 *
 * @extends {DxcApiService}
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService extends DxcApiService {

  onSettingUpdate:Subject<any> = new Subject<any>();

  constructor( private appmenuSvc:AppMenuService, private outputSvc:OutputService, protected override _http:HttpClient) {
    super(
      {
        global: {
          list: { method:'GET', url:'/settings/global', format: 'json' },
          editSingle: { method:'PUT', url:'/settings/global', format: 'json' },
          new: { method:'POST', url:'/settings/global', format: 'json' },
        }
      },_http,outputSvc
    );
  }

  listNetworkSettings():Observable<Nullable<WebServerSettings>> {
    return this._process( this.endpoints['global']['list'], {type:'web'})
      .pipe(map( pRes => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Settings"}));
          return null;
        }else{
          return {
            http: {name:'http', value:pRes.data.http},
            ws: {name:'ws', value: pRes.data.ws}
          };
        }
      }));
  }

  private _listSettings(pType:string):Observable<any> {

    return this._process( this.endpoints['global']['list'], {type:pType})
      .pipe(map( pRes => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Settings"}));
        }else{
          const o:any = {};
          for(const k in pRes.data){
            o[k] = {name:k, value:pRes.data[k]};
          }
          console.log(o);
          return o;
        }
      }));
  }

  private _updateSetting(pType:string, pName:string, pValue:number):Observable<boolean> {
    return this._process( this.endpoints['global']['editSingle'], {
      type: pType,
      name: pName,
      value: pValue
    }).pipe(map( pRes => {
      if(!pRes.success){
        this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Settings"}));
      }else{
        this.onSettingUpdate.next({ type:pType, name:pName, value:pValue, event:'change' });
        return pRes.data;
      }
    }));
  }


  updateNetworkSettings(pName:string, pValue:number):Observable<boolean> {
    return this._updateSetting('web', pName, pValue);
  }

  listExternalTools():Observable<ExternalTool[]> {
    return this._process( this.endpoints['global']['list'], {type:'ext'})
      .pipe(map( pRes => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Settings"}));
          return [];
        }else{
          const d:ExternalTool[] = [];
          for(const k in pRes.data){
            d.push(new ExternalTool(k, pRes.data[k]));
          }
          return d;
        }
      }));
  }


  updateExternalTool( pTool:ExternalTool):Observable<boolean> {
    return this._process( this.endpoints['global']['editSingle'], {
        type:'ext',
        name: pTool.getUID(),
        value: pTool.getPath()
      })
      .pipe(map( pRes => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Settings"}));
          return false;
        }else{
          return true;
        }
      }));
  }

  /**
   * To create dynamically a new setting in to a setting category
   *
   * @param {string} pType Setting type : ext, srv, web, conn
   * @param {string} pName Name of the setting
   * @param {any} pValue Value of the setting
   * @return {Observable<boolean>} Return TRUE if success, else FALSE
   * @method
   */
  addSetting( pType:string, pName:string, pValue:any):Observable<boolean> {
    return this._process( this.endpoints['global']['new'], {
      type:pType,
      name: pName,
      value: pValue
    })
      .pipe(map( pRes => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Settings"}));
          return false;
        }else{
          this.onSettingUpdate.next({ type:pType, name:pName, value:pValue, event:'new' });
          return true;
        }
      }));
  }

  listServerSettings():Observable<ServerSettings> {
    return this._listSettings('srv') as Observable<ServerSettings>;
  }

  updateServerSettings(pName:string, pValue:number):Observable<boolean> {
    return this._updateSetting('srv', pName, pValue);
  }
}
