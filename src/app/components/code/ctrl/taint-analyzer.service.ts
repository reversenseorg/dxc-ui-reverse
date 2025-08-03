import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {CODE_SUBVIEW} from "../explorer-code/explorer-code.const";
import {CodeItem} from "../explorer-code/CodeItem";
import {Message, MessageType} from "../../../cmp/Error";
import {DxcApiService, EndpointInfo} from "../../../base/DxcApiService";
import {AppMenuService, MenuEvent} from "../../../base/appmenu/app-menu.service";
import ModelMethod from "../../../models/ModelMethod";
import {ProjectService} from "../../project/ctrl/project.service";
import {IconModel} from "../../../base/icon/IconModel";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import ModelClass from "../../../models/ModelClass";
import ModelField from "../../../models/ModelField";
import {NodeInternalType} from "../../../models/NodeInternalType";
import ModelFile from "../../../models/ModelFile";
import {TagService} from "../../tag/ctrl/tag.service";
import {InfiniteScrollOpts} from "../../../cmp/InfiniteScrollOpts";
import {Nullable} from "../../../base/Nullable";
import {DexcaliburConnectionParams} from "../../../models/remote/DexcaliburConnectionParams";
import {AuthenticationEvent, AuthenticationEventType} from "../../auth/AuthenticationEvent";
import {AuthService} from "../../auth/ctrl/auth.service";
import {ClipboardService} from "../../../core/services/clipboard.service";
import {MenuItem} from "../../../base/menu/MenuItem";
import {INode} from "../../../models/INode";
import {ModelFunction} from "../../../models/ModelFunction";
import ModelPackage from "../../../models/ModelPackage";
import {ContextMenuEvent} from "../../../base/context-menu/context-menu.component";
import {CodeController} from "./CodeController";
import {CODE_ICONS} from "../icons";
import {Tag} from "../../../models/tags/Tag";
import {TaintCase} from "../../../models/analyzer/TaintCase";

export interface CodeMenuEvent extends MenuEvent {
  win?:any
}


export interface DisplayNodeEvent {
  node: INode;
  type?:string;
}

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class TaintAnalyzerService extends DxcApiService{
//?format=tree&fields=name,children<ModelClass>.name,children<ModelPackdage>.name

  private _icons:any = {};
  private _tags:any = [];

  tags:any = {};

  onMenuClick:Subject<CodeMenuEvent> = new Subject<CodeMenuEvent>();
  displayCtxMenu$:Subject<ContextMenuEvent> = new Subject<ContextMenuEvent>();
  displayNode$:Subject<DisplayNodeEvent> = new Subject<DisplayNodeEvent>();

  /**
   * A field to hold the state of menu items linked to the type of node activaly focused by
   * the user
   *
   * @private
   */
  private menuItemsEnabled: Nullable<MenuItem>[] = [];
  renamed$:Subject<INode> = new Subject<INode>();

  constructor( private appmenuSvc:AppMenuService,
               private authSvc:AuthService,
               private eSvc:ClipboardService,
               private projectSvc:ProjectService,
               private tagSvc:TagService,
               private outputSvc:OutputService,
               private http:HttpClient) {
    super({
      ta: {
        show: {method: 'GET', url: '/code/taint/:id', format: 'json', auth:false /* removed */, puid: true},
        list: {method: 'GET', url: '/code/taint/all', format: 'json', auth:false /* removed */, puid: true},
        mgt_step: {method: 'PUT', url: '/code/taint/:id/:type/:ope', format: 'json', auth:false /* removed */, puid: true},
      }
    }, http, outputSvc);
    //let ser:SerializeFilter = new SerializeFilter();
    //ser.prepare('name,children<ModelClass>[name:simpleName=>sname],children<ModelPackage>[sname:name]');


    this.authSvc.onAuthentication.subscribe( (pEvent:AuthenticationEvent)=>{
      switch (pEvent.type) {
        case AuthenticationEventType.REFRESH:

          break;
      }
    })
  }


  listCases( pQuery:string, pComplete:boolean = false):Observable<TaintCase[]> {

      return this._process(
        this.endpoints['ta']['list'],
        {}
      ).pipe(map((pRes:any)=>{
        if(pRes.err){
          this.outputSvc.print(OutputMessage.newError({ msg:"Class not found", src:"Bytecode Analyzer"  }));
          return [];
        }

        let res:TaintCase[] = [];
        pRes.data.map((x:any) => {
          res.push(x);
        });

        return res;
      }));
  }

}
