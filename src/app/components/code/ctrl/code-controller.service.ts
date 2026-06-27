/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {from, Observable, Subject} from 'rxjs';
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
import {CODE_ICONS} from "../icons";
import {Tag} from "../../../models/tags/Tag";
import {DexcaliburProjectUUID} from "../../../models/DexcaliburProject";
import {MerlinSearchRequest, OperationType} from "../../../models/search/MerlinSearchRequest";
import {DxApiResponse, INodeRef} from "../../../base/common/common";
import {IController} from "../../../base/controllers/IController.interface";
import {DxcApiToken} from "../../../base/DxcApiToken";
import ModelStringValue from "../../../models/ModelStringValue";
import ModelResource from "../../../models/ModelResource";
import ModelCall from "../../../models/ModelCall";
import ModelBasicBlock from "../../../models/ModelBasicBlock";
import ModelInstruction from "../../../models/ModelInstruction";

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
export class CodeControllerService extends DxcApiService{
//?format=tree&fields=name,children<ModelClass>.name,children<ModelPackdage>.name

  private _icons:any = {};
  private _tags:any = [];

  private _cache:Record<DexcaliburProjectUUID, Record<number, any>> = {};

  tags:any = {};

  ctrl:Nullable<IController> = null;

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
      libs: {
        list:  { method: 'GET', url: '/code/libraries', format: 'json', auth:false /* removed */, puid: true }
      },
      package: {
        app: {
          method: 'GET',
          url: '/code/package?format=tree&filter2=tags:ds&fields=name,children<ModelClass>.simpleName,children<ModelPackage>.sname',
          format: 'json',
          auth:false /* removed */,
          puid: true
        },
        app_dyn: {
          method: 'GET',
          url: '/code/package?format=tree&filter2=tags:dd&fields=name,children<ModelClass>.simpleName,children<ModelPackage>.sname',
          format: 'json',
          auth:false /* removed */,
          puid: true
        },
        android_api: {
          method: 'GET',
          url: '/code/package?format=tree&filter2=tags:di&fields=name,children<ModelClass>.name,children<ModelPackage>.name',
          format: 'json',
          auth:false /* removed */,
          puid: true
        },
        android_int: {
          method: 'GET',
          url: '/code/package?format=tree&filter2=tags:di&fields=name,children<ModelClass>.name,children<ModelPackage>.name',
          format: 'json',
          auth:false /* removed */,
          puid: true
        },
        vendor: {
          method: 'GET',
          url: '/code/package?format=tree&filter2=tags:dv&fields=name,children<ModelClass>.name,children<ModelPackage>.name',
          format: 'json',
          auth:false /* removed */,
          puid: true
        },
        all: {
          method: 'GET',
          url: '/code/package?format=tree&filter2=tags:ds&fields=name,children<ModelClass>.simpleName,children<ModelPackage>.sname',
          format: 'json',
          auth:false /* removed */,
          puid: true
        },
        edit: {method: 'PUT', url: '/code/package/:id', format: 'json', auth:false /* removed */, puid: true},
      },
      method: {
        disass: {method: 'GET', url: '/code/method/disass/:id', format: 'json', auth:false /* removed */, puid: true},
        body: {method: 'GET', url: '/code/method/body/:id', format: 'json', auth:false /* removed */, puid: true},
        edit: {method: 'PUT', url: '/code/method/:id', format: 'json', auth:false /* removed */, puid: true},
        info: {method: 'GET', url: '/code/method/:id', format: 'json', auth:false /* removed */, puid: true},
        xref: {method: 'GET', url: '/code/method/xref/:id', format: 'json', auth:false /* removed */, puid: true},
        xrefs: {method: 'GET', url: '/code/xref/:node/:id', format: 'json', auth:false /* removed */, puid: true}
      },
      class: {
        edit: {method: 'PUT', url: '/code/class/:id', format: 'json', auth:false /* removed */, puid: true},
        info: {method: 'GET', url: '/code/class/:id', format: 'json', auth:false /* removed */, puid: true}
      },
      field: {
        edit: {method: 'PUT', url: '/code/field/:id', format: 'json', auth:false /* removed */, puid: true},
        info: {method: 'GET', url: '/code/field/:id', format: 'json', auth:false /* removed */, puid: true}
      },
      file: {
        edit: {method: 'PUT', url: '/file/field/:id', format: 'json', auth:false /* removed */, puid: true},
      },
      func: {
        edit: {method: 'PUT', url: '/native/func/:id', format: 'json', auth:false /* removed */, puid: true},
      },
      finder: {
        search: {method: 'GET', url: '/code/finder', format: 'json', auth:false /* removed */, puid: true},
        androidXref: {method: 'GET', url: '/code/android/xref/:type/:id', format: 'json', auth:false /* removed */, puid: true},
      },
      direct: {
        // puid MUST be FALSE
        disass: { method:'POST', url:'/code/direct/:puid/:nodetype/disass', format:'json', auth:false, puid:false },
        search: { method:'POST', url:'/code/direct/:puid/:nodetype/search', format:'json', auth:false, puid:false },
      }, // { puid:pProjectUID, nodetype:pRef.__, nodeuid:pRef._uid }
      merlin: {
        search: {method: 'POST', url: '/code/merlin/search', format: 'json', auth:false /* removed */, puid: true},
        nodeInfo: {method: 'GET', url: '/code/nodeinfo/:type', format: 'json', auth:false /* removed */, puid: true}
      },
      vm: {
        simplify: {method: 'POST', url: '/code/method/simplify/:id', format: 'json', auth:false /* removed */, puid: true}
      },
      analysis: {
          sca: {method: 'POST', url: '/code/analysis/sca', format: 'json', auth:false /* removed */, puid: true}
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


    this.appmenuSvc.addMenu({
      id: 'code',
      label: 'Code',
      enabled: false,
      submenu: [{
        label: 'Search ...',
        accelerator: 'CommandOrControl+F',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({item: 'search'});
        }
      },{
          label: "Merlin search",
          click: (pMenuItem:any, pBrowserWindow:any ) => {
              this.onMenuClick.next({item: 'search-mql', win: pBrowserWindow});
          }
      }, {
        type: 'separator'
      }, {
        label: 'Show control-flow graph',
        enabled: false,
      }, {
        id: 'show-xrefs',
        label: 'Show cross-reference',
        enabled: false,
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({item: 'curr-xrefs', win: pBrowserWindow});
        }
      }, {
        id: 'show-xgraph-from',
        label: 'Show xref graph from ...',
        enabled: false,
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({item: 'curr-xfrom', win: pBrowserWindow});
        }
      }, {
        id: 'show-xgraph-to',
        label: 'Show xref graph to ...',
        enabled: false,
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({item: 'curr-xto', win: pBrowserWindow});
        }
      },/* {
        type: 'separator'
      },{
        label: 'Contextual search',
        submenu: [{
          label: "System calls",
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({item: 'curr-sysc', win: pBrowserWindow});
          }
        }, {
          label: "Data",
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({item: 'curr-data', win: pBrowserWindow});
          }
        }, {
          label: "Runtime data",
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({item: 'run-data', win: pBrowserWindow});
          }
        }, {
          label: "Getters / Setters",
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({item: 'curr-xetters', win: pBrowserWindow});
          }
        }, {
          label: "Callers",
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            this.onMenuClick.next({item: 'curr-callers', win: pBrowserWindow});
          }
        }, {
          label: "by constraints"
        }]
      }, /*{
        label: 'Transforms',
        submenu: [{
          label: "Rename random symbols",
          click: (pMenuItem:any, pBrowserWindow:any ) => {
            //this.onMenuClick.next({item: 'curr-callers', win: pBrowserWindow});
          }
        }, {
          label: "Remove useless jumps"
        }, {
          label: "Simplify method by emulation",
          enabled: false,

        }, {
          label: "Remove nop and noise"
        }, {
          label: "Remove integrity checks",
          enabled: false
        }, {
          label: "Remove root detection checks",
          enabled: false
        }, {
          label: "Remove hook detection checks",
          enabled: false
        }, {
          label: "Remove SSL Pining",
          enabled: false
        }]
      }/*, {
        label: 'Export',
        submenu: [{
          label: "Rebuild APK"
        }]
      }*/]
    }, 2);


    this.eSvc.getSelectionManager().onSelect$.subscribe((pNode:any)=>{

      if(pNode==null) return;

      if(pNode.hasOwnProperty("__")){
        switch (pNode.__){
          case NodeInternalType.FUNC:
          case NodeInternalType.METHOD:
          case NodeInternalType.CLASS:
          case NodeInternalType.FIELD:
            this._disableMenuItems();
            this._enableMenuItems(pNode.__);
            break;
          default:
            this._disableMenuItems();
            break;
        }
      }

    })

    this.projectSvc.onProjectReady.subscribe(()=>{
      this.refreshTags();
    });

  }


  refreshTags(){
    this.tagSvc.listTags().subscribe(() => {
      this.tags = {
        STATIC: this.tagSvc.getTagByName("discover.static"),
        INTERNAL: this.tagSvc.getTagByName("discover.internal"),
        DYNAMIC: this.tagSvc.getTagByName("discover.dynamic"),
        VENDOR: this.tagSvc.getTagByName("discover.vendor")
      };
    })
  }



  addTime( pData:any, pType:string='GET', pSep:string = '&'){
      if(pType === 'GET'){
        return pData+pSep+'_t='+Date.now();
      }else{
        pData['_t'] = Date.now();
        return pData;
      }
  }


  mapIcons( pType:string, pIcon:IconModel ):void {
    this._icons[pType] = pIcon;
  }

  _asbtractTag:Nullable<Tag> = null;

  /**
   * Search if at least one method is abstract
   *
   * @param pClass
   */
  isClassAbstract( pClass:any):boolean {
    if(this._asbtractTag==null){
      this._asbtractTag = this.tagSvc.getTagByName("obj.access.abstract");
    }

    let ppt = 'children';

    if(pClass[ppt] == null) {
      ppt = 'methods';
      if (pClass[ppt] == null) {
        return false;
      }
    }

    for(let i=0; i<pClass[ppt].length; i++){
      if(this._asbtractTag.match(pClass[ppt][i])){
        return true;
      }
    }

    return false;
  }

  getIconOf(pType:string, pItem:any = null):IconModel {
    if(pItem!=null){
      switch (pItem.__){
        case NodeInternalType.CLASS:
          if(this.isClassAbstract(pItem)) {
            return CODE_ICONS.ABSTRACT_CLASS;
          }
          break;
        case NodeInternalType.METHOD:
          if(pItem.modifiers.abstract===true) {
            return CODE_ICONS.ABSTRACT_METH;
          }
          break;
      }
    }

    // by default
    return this._icons[pType];
  }

  /**
   *
   * @param pName {string} pattern
   *
   */
  listPackages( pName:Nullable<CODE_SUBVIEW> = null, pFilter:Nullable<string> = null, pOptions:InfiniteScrollOpts={}): Observable<CodeItem[]> {
    let endpoint:EndpointInfo;
    let options:any = {};

    switch(pName){
      case CODE_SUBVIEW.APP:
        endpoint = this.endpoints['package']['app'];
        break;
      case CODE_SUBVIEW.APP_LIBS:
        endpoint = this.endpoints['package']['app_libs'];
        break;
      case CODE_SUBVIEW.ANDROID_API:
        endpoint = this.endpoints['package']['android_api'];
        break;
      case CODE_SUBVIEW.ANDROID_FWK:
        //endpoint = this.endpoints['package']['android_int'];
        return from([]);
      case CODE_SUBVIEW.VENDOR:
        //endpoint = this.endpoints['package']['vendor'];
        return from([]);
      case CODE_SUBVIEW.ALL:
      default:
        endpoint = this.endpoints['package']['all'];
        break;
    }

    if(pFilter != null){
      options.query = encodeURIComponent(pFilter);
    }

    return this._process(endpoint, options).pipe(
      map( (pObs:any)=>{


        if(pObs.success){

          let notReady = 0;
          let data:any[] = [];
          pObs.data.map( (vChild:any) => {


            switch(vChild.__){
              case NodeInternalType.PACKAGE:
                if( this.tags.INTERNAL.match(vChild)){
                  if(this.tags.STATIC.match(vChild)){
                    vChild._icon = this.getIconOf('p-mx');
                  }else{
                    vChild._icon = this.getIconOf('p-di');
                  }
                }else{
                  vChild._icon = this.getIconOf(vChild._t);
                }

                vChild.children.map( (vSelf:any) => {

                  vSelf._icon = this.getIconOf(vSelf._t, vSelf);

                  if(vSelf._t=='p' && this.tags.INTERNAL.match(vSelf)){
                    if(this.tags.STATIC.match(vSelf)){
                      vSelf._icon = this.getIconOf('p-mx');
                    }else{
                      vSelf._icon = this.getIconOf('p-di');
                    }
                  }

                  //expandable
                  vSelf._e = true;
                });


                if(vChild.name.length==0){
                  data = data.concat(vChild.children);
                }else{
                  data.push(vChild);
                }
                break;
              case NodeInternalType.FILE:
                vChild._icon = this.getIconOf('e');
                vChild.$r = true;
                if(!vChild.__p.hasOwnProperty('f_list')){
                  notReady++;
                  vChild.$r = false;
                }else{
                  vChild.children = Object.values(vChild.__p.f_list);
                  vChild.children.map((vSelf:any) => {
                    vSelf._icon = this.getIconOf('m');
                    vSelf.__ = NodeInternalType.FUNC;
                    vSelf._e = true;
                  });
                }
                data.push(vChild);
                break;
              default:
                vChild._icon = this.getIconOf(vChild._t, vChild);
                break;
            }


            /*
                      for(let i=0; i<vChild.tags.length; i++){

                          if(this._tags[pName].indexOf(vChild.tags[i])>-1){
                            vChild._icon = this.getIconOf(vChild._t,vChild.tags[i]);
                          }
                      }*/




          });

          if(notReady>0){
            this.outputSvc.print(OutputMessage.newWarning({
              src:'Native Analyzer',
              msg:'It seems some native executables ('+notReady+') are not yet analyzed. Please refresh later.'
            }));
          }
          console.log(data);
          return data;
        }else{
          this.outputSvc.print( OutputMessage.newError({ msg: pObs.msg }))
          return [];
        }
      })
    );
  }


  getClass( pQuery:string, pDirect = false):Observable<any> {

      if(pDirect){
        const p = DxcApiToken.getInstance("puid");
        return this.retrieveNode<ModelClass>(
            (p!=null ? p.getToken() : ""),
            {
              __: NodeInternalType.CLASS,
              _uid: pQuery
            }
        );
      }else{
        return this._process(
            this.endpoints['class']['info'],
            {
              'id': pQuery
            }
        ).pipe(map((pRes:any)=>{
          if(pRes.err){
            this.outputSvc.print(OutputMessage.newError({ msg:"Class not found", src:"Bytecode Analyzer"  }));
            return null;
          }else{
            return pRes;
          }

        }));
      }

  }

  getConnectionStringFromURI():DexcaliburConnectionParams|null {
    const url = new URL(location.href);
    if(url.searchParams.has("__") && url.searchParams.has("__")){
      const m = OutputMessage.newError({
        src: "Authentication",
        msg: `Connection params not found. See docs.`
      });
      this.outputSvc.print(m);
      return null;
    }

    return DexcaliburConnectionParams.fromPoorObject(
        JSON.parse(
            atob(
                url.searchParams.get("auth") as string
            )
        )
    );
  }

  getCompleteClass( pQuery:string):Observable<Nullable<ModelClass>> {

      return this._process(
        this.endpoints['class']['info'],
        {
          'id': pQuery
        }
      ).pipe(map((pRes:any)=>{
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({ msg:pRes.err, src:"Bytecode Analyzer"  }));
          return null;
        }else{
          // add localstorage cache
          const c:ModelClass = new ModelClass(pRes.data);

          for(const i in c.methods) c.methods[i] = new ModelMethod(c.methods[i]);
          for(const i in c.fields) c.fields[i] = new ModelField(c.fields[i]);
          return c;
        }
      }));
  }

  getMethod( pQuery:string, pComplete = false):Observable<CodeItem> {
    if(pComplete){
      return this._process(
        this.endpoints['method']['info'],
        {
          'id': pQuery,
          'probing': true
        }
      ).pipe(map((pRes:any)=>{
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({ msg:"Method not found", src:"Bytecode Analyzer"  }))
        }else{
          return pRes.data;
        }

      }));
    }else{
      return this._process(
        this.endpoints['finder']['search'],
        {
          'search': encodeURIComponent(btoa(`get.method("${pQuery}")`))
        }
      );
    }
  }

  /**
   *
   * @param pMethod
   * @param pType
   */
  getMethodXref( pMethod:ModelMethod|string, pType:string):Observable<CodeItem> {

    return this._process(
      this.endpoints['method']['xref'],
      {
        'id': ((typeof pMethod==='string') ? pMethod : pMethod.__signature__  ),
        'type': pType
      }
    ).pipe(map((pRes:any)=>{
      if(pRes.data == null){
        this.outputSvc.print(OutputMessage.newError({ msg:"Class not found", src:"Bytecode Analyzer" }));
        return [];
      }else{
        return pRes.data;
      }
    }));
  }


    /**
     *
     * @param pMethod
     * @param pType
     */
    getXref( pType:number, pNodeUid:string, pDirection:string):Observable<ModelCall[]> {

        return this._process(
            this.endpoints['method']['xrefs'],
            {
                'id': pNodeUid,
                'node': pType,
                'dir': pDirection
            }
        ).pipe(map((pRes:any)=>{
            if(pRes.data == null){
                this.outputSvc.print(OutputMessage.newError({ msg:"Class not found", src:"Bytecode Analyzer" }));
                return [];
            }else{
                return pRes.data.map((pCall:any)=>new ModelCall(pCall));
            }
        }));
    }



    getModelMethod( pSignature:string, pPullClass = false):Observable<Nullable<ModelMethod>> {
    return this.getMethod(pSignature).pipe( map((pObs:any) => {
        if(pObs.data != undefined && Object.keys(pObs.data).length>0){
          return new ModelMethod(pObs.data);
        }else{
          console.log("Error : invalid method data for "+pSignature);
          return null;
        }
    }));
  }

  getField( pQuery:string):Observable<CodeItem> {
    return this._process(
      this.endpoints['finder']['search'],
      {
        ':query': encodeURIComponent(btoa(`get.field("${pQuery}")`))
      }
    );
  }

  getCompleteField( pQuery:string):Observable<Nullable<ModelField>> {

    return this._process(
      this.endpoints['field']['info'],
      {
        'id': pQuery
      }
    ).pipe(map((pRes:any)=>{
      if(!pRes.success){
        this.outputSvc.print(OutputMessage.newError({ msg:pRes.err, src:"Bytecode Analyzer"  }));
        return null;
      }else{
        // add localstorage cache
        return new ModelField(pRes.data);
      }
    }));
  }

  getPackage( pQuery:string):Observable<CodeItem> {
    return this._process(
      this.endpoints['finder']['search'],
      {
        ':query': encodeURIComponent(btoa(`get.package("${pQuery}")`))
      }
    );
  }

  instr(pRef:INodeRef, pProject:Nullable<DexcaliburProjectUUID> = null):Observable<ModelBasicBlock[]> {
      let opts:any =   { id:pRef._uid };
      if(pProject!=null) opts.puid = pProject;

      return this._process(this.endpoints.method.body,opts).pipe(map( pRes => {
          if(!pRes.success){
              this.outputSvc.print(OutputMessage.newError({ msg:pRes.msg, src:"Bytecode Analyzer" }));
              return null;
          }else{
              this.outputSvc.print(OutputMessage.newSuccess({ msg:"BB from Method ["+pRef._uid+"] has been successfully read", src:"Bytecode Analyzer" }));
              return pRes.data.map((vBb:any) => {

                  const bb = new ModelBasicBlock(vBb);
                  vBb.stack.map( (i:any) => {
                    bb.stack.push(new ModelInstruction(i));
                  });

                  return bb;
              });
          }

      }));
  }

  disassMethod( pRef:INodeRef, pDirect = false,
                pProject:Nullable<DexcaliburProjectUUID> = null):Observable<Nullable<{ format:string, smali:string, disass:any }>> {

    let ep:EndpointInfo, opt:any;
    if(!pDirect){
      ep = this.endpoints['method']['disass'];
      opt = { id: pRef._uid };
    }else{
      ep = this.endpoints['direct']['disass'];
      opt =  { puid:(pProject), nodetype:pRef.__, nodeuid:pRef._uid };
    }

    console.log(ep,opt);
    return this._process(ep,opt).pipe(map( pRes => {
      if(!pRes.success){
        this.outputSvc.print(OutputMessage.newError({ msg:pRes.msg, src:"Bytecode Analyzer" }));
        return null;
      }else{
        let code = '';

        pRes.data.format = "smali";
        pRes.data.smali = "";

        pRes.data.disass.map((pBB:any) => {
          pBB.instr.map((pInstr:any) => {
            code += pInstr.value + `
`;
          })
          code += `
`;
        })
        pRes.data.smali = code;

        this.outputSvc.print(OutputMessage.newSuccess({ msg:"Method ["+pRef._uid+"] has been successfully disassembled", src:"Bytecode Analyzer" }));

        return pRes.data;
      }

    }));
  }



  /**
   * To rename (remotely) an element by setting its alias.
   *
   * It detects conflict and propagates alias
   *
   * @param pType
   * @param pRef
   * @param pAlias
   * @returns {Observable<Message>}
   * @since 1.0.0
   */
  rename( pType:string, pRef:string, pAlias:string): Observable<Message>{

    return this._process(
      this.endpoints[pType]['edit'],
      {
        alias: pAlias,
        'id': pRef
      }
    ).pipe(
      map((pEl:any)=>{

        return new Message({
          type: (pEl.success? MessageType.SUCCESS : MessageType.WARNING),
          msg: (pEl.msg != null)? pEl.msg.msg : null
        });
      })
    );
  }

  displayContextMenu(pEvent:any, pType:string, pObject:any):void {
    this.displayCtxMenu$.next({event: pEvent, type: pType, obj: pObject});
  }

  ddvm_execMethod(pMethod:ModelMethod|string, pDdvmOpts:any): Observable<any> {

    if((pMethod instanceof  ModelMethod) || (typeof  pMethod === 'object')){
      pDdvmOpts['id'] = pMethod.__signature__;
    }else{
      pDdvmOpts['id'] = pMethod;
    }

    return this._process(
      this.endpoints['vm']['simplify'],
      pDdvmOpts
    ).pipe(map((vRes:any) => {
      if(!vRes.success){
        this.outputSvc.print(OutputMessage.newError({ msg:vRes.msg, src:"Bytecode Analyzer" }));
      }else{
        this.outputSvc.print(OutputMessage.newSuccess({ msg:"Method ["+vRes+"] has been successfully emulated and simplified", src:"Bytecode Analyzer" }));


       }
       return vRes;
    }))
  }


  /**
   * To print the path of the specified file into the computer
   *
   * @param {ModelFile} pItem Target file
   */
  printFilePath(pItem:ModelFile):void {
    this.outputSvc.print( OutputMessage.newSuccess({
      msg:"Path of ["+pItem.name+"] : "+pItem.path, src:"File Analyzer"
    }));
  }

  xrefAndroidApi(pNode: ModelMethod | ModelClass) {
    return this._process(
      this.endpoints['finder']['androidXref'],
      {
        'type': pNode.__,
        'id': pNode.getUID()
      }
    ).pipe(
      map((vRes:any)=>{
        if(!vRes.success){
          this.outputSvc.print(OutputMessage.newError({ msg:vRes.msg, src:"Bytecode Analyzer" }));
        }else {
          this.outputSvc.print(OutputMessage.newSuccess({
            msg: "Method [" + vRes + "] has been successfully emulated and simplified",
            src: "Bytecode Analyzer"
          }));
          return vRes.data;
        }
      })
    );
  }


  /**
   * To enable menu item (disabled by default) when the user focus specific elements
   * (such as method, field, function, etc...)
   *
   * @param {NodeInternalType} pNodeType The type of the node actively focused by the user
   * @method
   * @private
   */
  private _enableMenuItems(pNodeType:NodeInternalType):void {
    const menuItems:Nullable<MenuItem>[] = [];
    switch (pNodeType){
      case NodeInternalType.CLASS:
        menuItems.push(this.appmenuSvc.getMenuItemById('show-xrefs'));
        break;
      case NodeInternalType.METHOD:
        menuItems.push(this.appmenuSvc.getMenuItemById('show-xrefs'));
        menuItems.push(this.appmenuSvc.getMenuItemById('show-xgraph-to'));
        menuItems.push(this.appmenuSvc.getMenuItemById('show-xgraph-from'));
        break;
      case NodeInternalType.FIELD:
        menuItems.push(this.appmenuSvc.getMenuItemById('show-xgraph-to'));
        menuItems.push(this.appmenuSvc.getMenuItemById('show-xgraph-from'));
        break;
    }

    menuItems.map((x)=> {
      if(x!=null){
        x.enabled = true;
      }
    });

    this.menuItemsEnabled = menuItems;
    this.appmenuSvc.update();
  }

  /**
   * To disable menu item enabled previously when the user focused specific elements
   * (such as method, field, function, etc...)
   *
   *
   * @method
   * @private
   */
  private _disableMenuItems():void {
    this.menuItemsEnabled.map((x)=> {
      if(x!=null) x.enabled = false;
    });
  }


  /**
   * To get string representation of a Node  using a specified format
   *
   * @param {any} pItem
   * @param {string} pFormat
   */
  getFormatedSymbol(pItem:any, pFormat:string):string {
    return "";
  }

  /**
   * To get unformated Human-readable UID from node
   *
   * @return {string}
   * @method
   */
  getBaseSymbol(pItem:any):string {
    let sym:Nullable<string> = "";

    switch (pItem.__){
      case NodeInternalType.METHOD:
        sym = (pItem as ModelMethod).__signature__;
        break;
      case NodeInternalType.CLASS:
        sym = (pItem as ModelClass).name;
        break;
      case NodeInternalType.FIELD:
        sym = (pItem as ModelField).__signature__;
        break;
      case NodeInternalType.FUNC:
        sym = (pItem as ModelFunction).name;
        break;
      case NodeInternalType.PACKAGE:
        sym = (pItem as ModelPackage).name;
        break;
    }

    if(sym==null) sym="";

    return sym;
  }

  /**
   *
   * @param pProjUID
   */
  listNativeLibraries():Observable<ModelFile[]> {
    return this._process(this.endpoints.libs.list).pipe(
        map( (pObs:any)=>{
          if(pObs.success){

            let notReady = 0;
            let data:any[] = [];

            pObs.data.map((vFile:any)=>{
              data.push(new ModelFile(vFile));
            });

            if(notReady>0){
              this.outputSvc.print(OutputMessage.newWarning({
                src:'Native Analyzer',
                msg:'It seems some native executables ('+notReady+') are not yet analyzed. Please refresh later.'
              }));
            }

            console.log(data);
            return data;
          }else{
            this.outputSvc.print( OutputMessage.newError({ msg: pObs.msg }))
            return [];
          }
        })
    );
  }

  merlinSearch(pRequest:MerlinSearchRequest):Observable<any[]> {
    return this._process(this.endpoints.merlin.search, { request:pRequest.toJsonObject() }).pipe(
        map( (pObs:any)=>{
          if(pObs.success){

            console.log(pObs);

            return pObs.data;
          }else{
            this.outputSvc.print( OutputMessage.newError({ msg: pObs.msg }))
            return [];
          }
        })
    );
  }

    getNodeProperties(pNode:number):Observable<any[]> {
        return this._process(this.endpoints.merlin.nodeInfo, { type: pNode }).pipe(
            map( (pObs:any)=>{
                if(pObs.success){
                    return pObs.data;
                }else{
                    this.outputSvc.print( OutputMessage.newError({ msg: pObs.msg }))
                    return [];
                }
            })
        );
    }

    getFromCache(pProjectUID: DexcaliburProjectUUID, pRef:INodeRef):any {
        if(this._cache[pProjectUID]==null) return null;
        if(this._cache[pProjectUID][pRef.__]==null) return null;

        return this._cache[pProjectUID][pRef.__][pRef._uid];
    }

  retrieveNode<T>(pProjectUID: DexcaliburProjectUUID, pRef:INodeRef, pCache = false):Observable<DxApiResponse<Nullable<T>>> {
    return this._process(
        this.endpoints.direct.search,
        { puid:pProjectUID, nodetype:pRef.__, nodeuid:pRef._uid }
    ).pipe(
        map(vRes => {

          if(!vRes.success){
            return  { success: false, msg: (vRes.msg!=null? vRes.msg:""), data: null };
          }

          const node =  (vRes.data!=null ? this.createNodeFromRef<T>( pRef, vRes.data) : vRes.data)

          if(pCache){
              if(this._cache[pProjectUID]==null) this._cache[pProjectUID] = {};
              if(this._cache[pProjectUID][pRef.__]==null) this._cache[pProjectUID][pRef.__] = {};
              this._cache[pProjectUID][pRef.__][pRef._uid] = node;
          }

          return  {
            success: vRes.success,
            msg: (vRes.msg!=null? vRes.msg:""),
            data: node
          };
        })
    )
  }

  setController(pCtrl: IController) {
    this.ctrl = pCtrl;
  }

  getController<T>():Nullable<T> {
    return this.ctrl as T;
  }

  /**
   *
   * @param pRef
   * @param pRaw
   */
  createNodeFromRef<T>(pRef:INodeRef, pRaw:any):Nullable<T> {

    let node:any = null;
    let type = (typeof pRef.__==="string"? parseInt(pRef.__,10):pRef.__);

    switch(type){
      case NodeInternalType.METHOD:
        node = new ModelMethod(pRaw);
        break;
      case NodeInternalType.CLASS:
        node = new ModelClass(pRaw);
        break;
      case NodeInternalType.FIELD:
        node = new ModelField(pRaw);
        break;
      case NodeInternalType.FUNC:
        node = new ModelFunction(pRaw);
        break;
      case NodeInternalType.STRING:
        node = new ModelStringValue(pRaw);
        break;
      case NodeInternalType.PACKAGE:
        node = new ModelPackage(pRaw);
        break;
      case NodeInternalType.FILE:
        node = new ModelFile(pRaw);
        break;
    case NodeInternalType.RESOURCE:
        node = new ModelResource(pRaw);
        break;
    }



    return node;
  }

    analyzeComposition():Observable<DxApiResponse<any>> {
        return this._process(
            this.endpoints.analysis.sca,
            { }
        ).pipe(
            map(vRes => {

                console.log("SCA Analysis : ",vRes);

                if(!vRes.success){
                    return  { success: false, msg: (vRes.msg!=null? vRes.msg:""), data: null };
                }

                return  {
                    success: vRes.success,
                    msg: (vRes.msg!=null? vRes.msg:""),
                    data: null
                };
            })
        )
    }

    getChildClass(pClass: ModelClass):Observable<ModelClass[]> {
        return this.merlinSearch(new MerlinSearchRequest(
            NodeInternalType.CLASS,
            [{
                type:OperationType.SEARCH,
                args: {
                    pattern: [{
                        field: "extends.name",
                        pattern: pClass.getUID(),
                        regexp: false
                    }]
                }
            }]
        )).pipe(map((vRes:any)=>{
            console.log("Execute MERLIN Request (as code search : child class) ",vRes);

            if(vRes.length>0){
                return vRes.map((vCls:any)=>new ModelClass(vCls));
            }else{
                return [];
            }
        }))
    }
}
