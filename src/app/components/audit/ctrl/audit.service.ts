import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {AppMenuService, MenuEvent} from "../../../base/appmenu/app-menu.service";
import {DxcApiService} from "../../../base/DxcApiService";
import {map} from "rxjs/operators";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {PrivacyReport} from "../../../models/audit/privacy/PrivacyReport";
import {DashBoard} from "../../../models/audit/common/DashBoard";
import {TopologyService} from "../../topology/ctrl/topology.service";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {CodeMenuEvent, ContextMenuEvent} from "../../code/ctrl/code-controller.service";
import AssuranceModel from "../../../models/audit/common/AssuranceModel";
import AssuranceReport from "../../../models/audit/common/AssuranceReport";
import {Nullable} from "../../../base/Nullable";


@Injectable({
  providedIn: 'root'
})
export class AuditService extends DxcApiService{

  /**
   * Event stream.
   *
   * Event are emitted when a menu entry is clicked into application menu
   *
   * @type {Subject<any>}
   * @field
   */
  onMenuClick:Subject<MenuEvent> = new Subject<MenuEvent>();

  onScanDone$:Subject<AssuranceReport> = new Subject<AssuranceReport>();

  displayCtxMenu$:Subject<ContextMenuEvent> = new Subject<ContextMenuEvent>();

  constructor( private appmenuSvc:AppMenuService, private topoSvc:TopologyService, private outputSvc:OutputService, protected override _http:HttpClient) {

      super({
        audit: {
          reports: { method: 'GET', url:'/audit/reports', format:'json', auth:false /* removed */, puid:true},
          reportDelete: { method: 'DELETE', url:'/audit/report/:model', format:'json', auth:false /* removed */, puid:true},
          reportByModel: { method: 'GET', url:'/audit/report/:model', format:'json', auth:false /* removed */, puid:true},
          model: { method: 'GET', url:'/audit/model/:model', format:'json', auth:false /* removed */, puid:true},
          models: { method: 'GET', url:'/audit/models', format:'json', auth:false, puid:false},
          dashboard: { method: 'GET', url:'/audit/dashboard/:model', format:'json', auth:false /* removed */, puid:true},
          scan: { method: 'POST', url:'/audit/scan/:model', format:'json', auth:false /* removed */, puid:true},
          scanInfo: { method: 'POST', url:'/audit/scanInfo', format:'json', auth:false /* removed */, puid:true}
        }
      }, _http, outputSvc);

    /*
    this.appmenuSvc.getMenu( 'plug').addItem({
        label: 'Privacy assessment',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          //this.onMenuClick.next({ item:'login', win:pBrowserWindow });
        }
      });
    */
    this.topoSvc.onMenuClick$.subscribe((vEvent)=>{
      if(vEvent.item==NodeInternalType.DASHBOARD && vEvent.product!=null){

      }
    });
  }

  getDashboards(pModelId:string):Observable<DashBoard[]> {
    return this._process(
      this.endpoints['audit']['dashboard'],
      { model: pModelId }
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        const dbs:DashBoard[] = [];

        pEl.data.dashboards.map((x:any) => {
          dbs.push(new DashBoard(x));
        });

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Audit",
          msg: `Scan dashboard have been retrieved`
        }));

        return dbs;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Audit",
          msg: `Scan dashboard cannot be retrieved`
        }));
        return [];
      }
    }));
  }

  getReports():Observable<AssuranceReport[]> {
    return this._process(
      this.endpoints['audit']['reports']
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        const reports:AssuranceReport[] = [];

        pEl.data.map((vRaw:any)=>{
            reports.push(AssuranceReport.fromJsonObject(vRaw));
        });

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Audit",
          msg: `Scan reports have been retrieved`
        }));
        //this.onAuthentication.next(AuthenticationEvent.newLogoutSuccess());
        return reports;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Audit",
          msg: `Scan reports cannot be listed`
        }));
        return [];
      }
    }));
  }

  getModel(pModelId:string):Observable<Nullable<AssuranceModel>> {
    return this._process(
      this.endpoints['audit']['model'],
      { model: pModelId }
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        const model = new AssuranceModel(pEl.data);

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Audit",
          msg: `Assurance model has been retrieved`
        }));

        return model;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Audit",
          msg: `Assurance model cannot be retrieved`
        }));

        return null;
      }
    }));
  }

  getModels():Observable<AssuranceModel[]> {
    return this._process(
      this.endpoints['audit']['models']
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        const models:AssuranceModel[] = [];
        pEl.data.map((x:any) => {
          const a = AssuranceModel.fromJsonObject( x);
          models.push( a);
        });

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Audit",
          msg: `Assurance model has been retrieved`
        }));

        return models;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Audit",
          msg: `Assurance model cannot be retrieved`
        }));
        return [];
      }
    }));
  }

  scan(pModelId:string):Observable<Nullable<AssuranceReport>> {
    return this._process(
      this.endpoints['audit']['scan'],
      { model: pModelId }
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        const report:AssuranceReport = AssuranceReport.fromJsonObject(pEl.data);

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Audit",
          msg: `Scan reports have been retrieved`
        }));
        //this.onAuthentication.next(AuthenticationEvent.newLogoutSuccess());
        return report;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Audit",
          msg: `Audit scan failed`
        }));
        return null;
      }
    }));
  }

}
