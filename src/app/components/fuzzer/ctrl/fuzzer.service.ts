import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {DxcApiService} from "../../../base/DxcApiService";
import { MenuEvent} from "../../../base/appmenu/app-menu.service";
import {ProjectService} from "../../project/ctrl/project.service";
import {OutputService} from "../../output/ctrl/output.service";
import {TagService} from "../../tag/ctrl/tag.service";
import {Nullable} from "../../../base/Nullable";
import {INode} from "../../../models/INode";
import {ContextMenuEvent} from "../../../base/context-menu/context-menu.component";
import {IController} from "../../../base/controllers/IController.interface";
import FuzzSession from "../../../models/fuzz/FuzzSession";
import { MerlinSearchRequest } from "src/app/models/search/MerlinSearchRequest";

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
export class FuzzerService extends DxcApiService{

  tags:any = {};

  ctrl:Nullable<IController> = null;

  onMenuClick:Subject<CodeMenuEvent> = new Subject<CodeMenuEvent>();
  displayCtxMenu$:Subject<ContextMenuEvent> = new Subject<ContextMenuEvent>();

  show$ = new Subject<FuzzSession>();

  constructor( private projectSvc:ProjectService,
               private tagSvc:TagService,
               private outputSvc:OutputService,
               _http:HttpClient) {
    super({
      sess: {
          create: {method: 'POST', url: '/tools/fuzz/session', format: 'json', puid: true}
      }
    }, _http, outputSvc);

    this.projectSvc.onProjectReady.subscribe(()=>{
      this.refreshTags();
    });
  }


  refreshTags(){
    /*this.tagSvc.listTags().subscribe(() => {
      this.tags = {
        STATIC: this.tagSvc.getTagByName("discover.static"),
        INTERNAL: this.tagSvc.getTagByName("discover.internal"),
        DYNAMIC: this.tagSvc.getTagByName("discover.dynamic"),
        VENDOR: this.tagSvc.getTagByName("discover.vendor")
      };
    })*/
  }


    createSess(pNode: INode, pDir: string) {

      this.show$.next(new FuzzSession({
          _uid: "fuzz-"+Date.now()
      }));


/*
        this._processApiRequest<Nullable<FuzzSession>>(this.endpoints.sess.create, {
            node: {
                __: pNode.__,
                _uid: pNode.getUID()
            }
        }).subscribe((vSess)=>{
           // this.config$.next(vSess)
        })*/
    }
}
