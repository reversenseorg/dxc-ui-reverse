import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {AppMenuService, MenuEvent} from "../../../core/components/appmenu/appmenu.service";
import {DxcApiService} from "../../../base/DxcApiService";
import {map} from "rxjs/operators";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {PrivacyReport} from "../../../models/audit/privacy/PrivacyReport";
import {DashBoard} from "../../../models/audit/common/DashBoard";
import {TopologyService} from "../../topology/ctrl/topology.service";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {CodeMenuEvent, ContextMenuEvent} from "../../code/ctrl/code-controller.service";
import { PrivacyModel } from "../../../models/audit/privacy/PrivacyModel";
import {Nullable} from "../../../base/Nullable";


@Injectable({
  providedIn: 'root'
})
export class PrivacyService extends DxcApiService{

  /**
   * Event stream.
   *
   * Event are emitted when a menu entry is clicked into application menu
   *
   * @type {Subject<any>}
   * @field
   */
  onMenuClick:Subject<MenuEvent> = new Subject<MenuEvent>();

  onScanDone$:Subject<PrivacyReport> = new Subject<PrivacyReport>();

  displayCtxMenu$:Subject<ContextMenuEvent> = new Subject<ContextMenuEvent>();

  constructor( private appmenuSvc:AppMenuService,
               private topoSvc:TopologyService,
               private outputSvc:OutputService,
               protected override _http:HttpClient) {

      super({
        assess: {
          reports: { method: 'GET', url:'/privacy/reports', format:'json', auth:true, puid:true},
          model: { method: 'GET', url:'/privacy/model', format:'json', auth:true, puid:true},
          dashboard: { method: 'GET', url:'/privacy/dashboard', format:'json', auth:true, puid:true},
          scan: { method: 'POST', url:'/privacy/scan', format:'json', auth:true, puid:true},
          scanModel: { method: 'POST', url:'/privacy/scanModel', format:'json', auth:true, puid:true},
          scan2: { method: 'POST', url:'/audit/scan/:model', format:'json', auth:true, puid:true}
        }
      }, _http, outputSvc);

    /*
    this.appmenuSvc.getMenu( 'plug').addItem({
        label: 'Privacy assessment',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          //this.onMenuClick.next({ item:'login', win:pBrowserWindow });
        }
      });*/

    this.topoSvc.onMenuClick$.subscribe((vEvent)=>{
      if(vEvent.item==NodeInternalType.DASHBOARD && vEvent.product!=null){
        this.scan2(vEvent.product).subscribe((vReport)=>{
          //this.onScanDone$.next(vReport);
        })
      }
    })
  }

  getDashboards():Observable<DashBoard[]> {
    return this._process(
      this.endpoints['assess']['dashboard']
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        const dbs:DashBoard[] = [];

        pEl.data.dashboards.map((x:any) => {
          dbs.push(new DashBoard(x));
        });

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Assessment",
          msg: `Privacy scan dashboard have been retrieved`
        }));

        return dbs;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Assessment",
          msg: `Privacy scan dashboard cannot be retrieved`
        }));
        return [];
      }
    }));
  }

  getReports():Observable<PrivacyReport[]> {
    return this._process(
      this.endpoints['assess']['reports']
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        const reports:PrivacyReport[] = [];

        pEl.data.map((vRaw:any)=>{
          reports.push(PrivacyReport.fromJsonObject(vRaw));
        });

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Assessment",
          msg: `Privacy scan reports have been retrieved`
        }));
        //this.onAuthentication.next(AuthenticationEvent.newLogoutSuccess());
        return reports;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Assessment",
          msg: `Privacy scan reports cannot be listed`
        }));
        return [];
      }
    }));
  }

  getModel():Observable<Nullable<PrivacyModel>> {
    return this._process(
      this.endpoints['assess']['model']
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        const model = new PrivacyModel(pEl.data);

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Privacy",
          msg: `Privacy assurance model has been retrieved`
        }));

        return model;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Privacy",
          msg: `Privacy assurance cannot be retrieved`
        }));
        return null;
      }
    }));
  }

  scan():Observable<Nullable<PrivacyReport>> {
    return this._process(
      this.endpoints['assess']['scan']
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        console.log(pEl.data);
        const report:PrivacyReport = PrivacyReport.fromJsonObject(pEl.data);

        console.log(report);

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Assessment",
          msg: `Privacy scan reports have been retrieved`
        }));
        //this.onAuthentication.next(AuthenticationEvent.newLogoutSuccess());
        return report;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Assessment",
          msg: `Privacy scan reports cannot be listed`
        }));
        return null;
      }
    }));
  }

  scan2(pModel:string):Observable<Nullable<PrivacyReport>> {
    return this._process(
      this.endpoints['assess']['scan2'],
      { model:pModel }
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        console.log(pEl.data);
        const report:PrivacyReport = PrivacyReport.fromJsonObject(pEl.data);

        console.log(report);

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Assessment",
          msg: `Privacy scan reports have been retrieved`
        }));
        //this.onAuthentication.next(AuthenticationEvent.newLogoutSuccess());
        return report;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Assessment",
          msg: `Privacy scan reports cannot be listed`
        }));
        return null;
      }
    }));
  }

  scanModel():Observable<Nullable<PrivacyReport>> {
    return this._process(
      this.endpoints['assess']['scanModel']
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        console.log(pEl.data);
        const report:PrivacyReport = PrivacyReport.fromJsonObject(pEl.data);

        console.log(report);

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Assessment",
          msg: `Privacy scan reports have been retrieved`
        }));
        //this.onAuthentication.next(AuthenticationEvent.newLogoutSuccess());
        return report;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Assessment",
          msg: `Privacy scan reports cannot be listed`
        }));
        return null;
      }
    }));
  }
}
