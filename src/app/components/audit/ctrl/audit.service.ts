import {HttpClient} from "@angular/common/http";
import {from, Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {AppMenuService, MenuEvent} from "../../../base/appmenu/app-menu.service";
import {DxcApiService} from "../../../base/DxcApiService";
import {map} from "rxjs/operators";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {DashBoard} from "../../../models/audit/common/DashBoard";
import {TopologyService} from "../../topology/ctrl/topology.service";
import {NodeInternalType} from "../../../models/NodeInternalType";
import AssuranceModel from "../../../models/audit/common/AssuranceModel";
import AssuranceReport from "../../../models/audit/common/AssuranceReport";
import {Nullable} from "../../../base/Nullable";
import Control from "../../../models/audit/common/Control";
import {IStringIndex} from "../../../base/IStringIndex";
import ControlAssessment from "../../../models/audit/common/ControlAssessment";
import {SearchService} from "../../search/ctrl/search.service";
import {ContextMenuEvent} from "../../../base/context-menu/context-menu.component";
import {ProjectService} from "../../project/ctrl/project.service";
import {ScanOrder} from "../../../models/ScanOrder";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {OrganizationUnitUUID} from "../../../models/orgs/OrganizationUnit";

export enum CheckEventState {
  NEW= 'new',
  SUCCESS='success',
  FAIL='fail'
}

export interface CheckEvent {
  rule?: any;
  assessment?: ControlAssessment;
  model?: AssuranceModel;
  startTime:number;
  time?:number;
  state: CheckEventState;
}

export interface CheckResult {
  event: CheckEvent
  results: any[];
}

export interface EditorEvent {
  type:string;
  parent:any
}

@Injectable({
  providedIn: 'root'
})
export class AuditService extends DxcApiService{


  private _cache:Record<string, AssuranceModel> = {};

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

  onCheckAction$:Subject<CheckResult> = new Subject<CheckResult>();
  private refreshScans$: Subject<any> = new Subject<any>();
  openEditor$: Subject<EditorEvent> = new Subject<EditorEvent>();

  constructor( private appmenuSvc:AppMenuService,
               private topoSvc:TopologyService,
               private projectSvc:ProjectService,
               private _searchSvc:SearchService,
               private outputSvc:OutputService,
               protected override _http:HttpClient) {

      super({
        audit: {
          reports: { method: 'GET', url:'/audit/reports', format:'json', auth:false /* removed */, puid:true},
          reportDelete: { method: 'DELETE', url:'/audit/report/:model', format:'json', auth:false /* removed */, puid:true},
          reportByModel: { method: 'GET', url:'/audit/report/:model', format:'json', auth:false /* removed */, puid:true},
          model: { method: 'GET', url:'/audit/model/:model', format:'json', auth:false /* removed */, puid:true},
          models: { method: 'GET', url:'/audit/models', format:'json', auth:false, puid:false},
          dashboard: { method: 'GET', url:'/audit/dashboard/:model', format:'json', auth:false /* removed */, puid:true},
          scan: { method: 'POST', url:'/audit/scan/:model', format:'json', auth:false /* removed */, puid:true},
          scanInfo: { method: 'POST', url:'/audit/scanInfo', format:'json', auth:false /* removed */, puid:true},
          controls: { method: 'POST', url:'/audit/controls/:model', format:'json', auth:false /* removed */, puid:true},
        },
        scan: {
          start: { method: 'POST', url:'/audit/project/:uid/scan/start', format:'json', auth:false, puid:false},
          listProject: { method: 'POST', url:'/audit/project/:uid/scan/list', format:'json', auth:false, puid:false},
          list: { method: 'GET', url:'/audit/order/list', format:'json', auth:false, puid:false},
          scheduler_info: { method: 'GET', url:'/node/scheduler/info', format:'json', auth:false, puid:false},
          order: { method: 'POST', url:'/audit/order/scan', format:'json', auth:false, puid:true},
          orderFromScratch: { method: 'POST', url:'/audit/order/scan?_puid=:puid', format:'json', auth:false, puid:false},
        },
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

  getModel(pModelId:string, pRefresh = false):Observable<Nullable<AssuranceModel>> {
    if(this._cache[pModelId]!=null && !pRefresh){
      return from([this._cache[pModelId]]);
    }

    return this._process(
      this.endpoints['audit']['model'],
      { model: pModelId }
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        const model = AssuranceModel.fromJsonObject( pEl.data);
        this._cache[pModelId] = model;

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

  getReportOf(pModelId:string):Observable<Nullable<AssuranceModel>> {
    return this._process(
        this.endpoints['audit']['reportByModel'],
        { model: pModelId }
    ).pipe(map( (pEl:any) => {

      console.log("Audit service > getReportOf > ", pModelId, pEl);
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

  getModels(pOrgUnit:Nullable<OrganizationUnitUUID> = null):Observable<AssuranceModel[]> {
    return this._process(
      this.endpoints['audit']['models'], {
          oid: (pOrgUnit!=null ? pOrgUnit : localStorage.getItem('org.current')),
        }
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

  scan(pProjectUID:string, pModelId:string):Observable<Nullable<AssuranceReport>> {
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

  newScanOrder(pProjectUID:string, pModelId:string):Observable<Nullable<AssuranceReport>> {
    return this._process(
        this.endpoints['scan']['order'],
        {
          projectUID: pProjectUID,
          modelUID: [pModelId],
        }
    ).pipe(map( (pEl:any) => {

      if(pEl.success){


        const report:AssuranceReport = AssuranceReport.fromJsonObject(pEl.data);

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Audit",
          msg: `Scan order pushed`
        }));
        //this.onAuthentication.next(AuthenticationEvent.newLogoutSuccess());
        return report;
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Audit",
          msg: `Scan order failed`
        }));
        return null;
      }
    }));
  }


  //listOrdersOf(pProjectUID:string):Observable<ScanOrder>

  getControlsOf(pModelID:string, pRefresh = false):Observable<Control[]>{
    return this.getModel(pModelID, pRefresh).pipe(map((vModel:Nullable<AssuranceModel>)=>{
        if(vModel!=null){
          console.log("CONTROLS > ",vModel.controls);
          return vModel.controls;
        }else{
          return [];
        }
    }));
  }

  /**
   * To execute a rule and show results
   *
   * @param pAssess
   * @param pRule
   */
  runRule(pAssess: Nullable<ControlAssessment>, pRule: any):Observable<CheckResult> {
    const evt:any = {
      rule: pRule,
      assessment: pAssess,
      startTime: (new Date()).getTime()
    };

    this.onCheckAction$.next({
      event: {
        state:CheckEventState.NEW,
        ...evt
      },
      results: []
    });

    return this._searchSvc.executeRaw(pRule.request.__stringified.substring(1)).pipe(map((pRes:any)=>{
      let checkEvt:CheckResult;
      if(pRes.success){
        checkEvt = {
          event:{
            state:CheckEventState.SUCCESS,
            time: (new Date()).getTime(),
            ...evt
          },
          results: pRes.data
        };
      }else{
        checkEvt = {
          event:{
            state:CheckEventState.FAIL,
            time: (new Date()).getTime(),
            ...evt
          },
          results: []
        };
      }

      this.onCheckAction$.next(checkEvt);

      return checkEvt;
    }));
  }


  /**
   * To get all orders related to a project
   * @param {string} pProject Project UID
   * @return {Observable<ScanOrder[]>} An observable list of ScanOrder
   * @method
   */
  listOrders(pProject:DexcaliburProject, pModel:Nullable<AssuranceModel> = null):Observable<any[]> {


    return this._process(
        this.endpoints.scan.list, {
          projectUID: pProject.uid
        }
    ).pipe(map( (pEl:any) => {

      if(pEl.success){

        this.outputSvc.print(OutputMessage.newSuccess({
          src: "Audit",
          msg: `Scan orders cannot have been retrieved for the project`
        }));

        const orders:IStringIndex<ScanOrder> = {};
        pEl.data.map((x: any) =>{

          const scan = new ScanOrder(x);

          if(scan.$project===pProject.uid){
            orders[scan.uuid as string] = scan;

            if(scan.settings.modelUID!=null){
              scan.$model = pModel!;

              /*scan.$model = this.getModel(scan.settings.modelUID);
              if(scan.$model==null){
                this.getModel(scan.settings.modelUID).subscribe((vModel)=>{
                  if(vModel!=null){
                    scan.$model = vModel;
                    this.refreshScans$.next(Object.values(orders) );
                  }
                })
              }*/
            }


            scan.$project = pProject;
            this.refreshScans$.next(Object.values(orders) );


        }else{
          /*
           if(scan.settings.projectUID!=null){
             this.projectSvc.getProjectInfo(pProjectUID).subscribe((vProject:any)=>{
               console.log(vProject);
               scan.$project = pProjectUID;
               this.refreshScans$.next(Object.values(orders) );
             });
           }*/
        }

      });

        return Object.values(orders);
      }else{
        this.outputSvc.print(OutputMessage.newError({
          src: "Audit",
          msg: `Scan orders cannot be listed for the project`
        }));
        return [];
      }
    }));
  }


  openRuleEditor(pAssessment:any) {
    this.openEditor$.next({
      type:'rule',
      parent: pAssessment
    });
  }

  openAssessEditor(pControl:any) {
    this.openEditor$.next({
      type:'assess',
      parent: pControl
    });
  }
}
