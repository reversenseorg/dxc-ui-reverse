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
import ModelPackage from "../../../models/ModelPackage";
import {InfiniteScrollOpts} from "../../../cmp/InfiniteScrollOpts";
import {Nullable} from "../../../base/Nullable";
import ModelBasicBlock from "../../../models/ModelBasicBlock";
import {DexcaliburConnectionParams} from "../../../models/remote/DexcaliburConnectionParams";

export interface CodeMenuEvent extends MenuEvent {
  win?:any
}

export interface ContextMenuEvent {
  event: Event;
  type:string;
  obj:any;
}


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class CodeControllerService extends DxcApiService{
//?format=tree&fields=name,children<ModelClass>.name,children<ModelPackdage>.name

  private _icons:any = {};
  private _tags:any = [];

  tags:any = {};

  onMenuClick:Subject<CodeMenuEvent> = new Subject<CodeMenuEvent>();
  displayCtxMenu$:Subject<ContextMenuEvent> = new Subject<ContextMenuEvent>();

  constructor( private appmenuSvc:AppMenuService,
               private projectSvc:ProjectService,
               private tagSvc:TagService,
               private outputSvc:OutputService,
               private http:HttpClient) {
    super({
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
        edit: {method: 'PUT', url: '/code/method/:id', format: 'json', auth:false /* removed */, puid: true},
        info: {method: 'GET', url: '/code/method/:id', format: 'json', auth:false /* removed */, puid: true},
        xref: {method: 'GET', url: '/code/method/xref/:id', format: 'json', auth:false /* removed */, puid: true}
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
      vm: {
        simplify: {method: 'POST', url: '/code/method/simplify/:id', format: 'json', auth:false /* removed */, puid: true}
      }
    }, http, outputSvc);
    //let ser:SerializeFilter = new SerializeFilter();
    //ser.prepare('name,children<ModelClass>[name:simpleName=>sname],children<ModelPackage>[sname:name]');


    this.appmenuSvc.addMenu({
      id: 'code',
      label: 'Code',
      enabled: false,
      submenu: [{
        label: 'Search ...',
        accelerator: 'CommandOrControl+F',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({item: 'search', win: pBrowserWindow});
        }
      }, {
        type: 'separator'
      }, {
        label: 'Show control-flow graph',
      }, {
        label: 'Show cross-reference',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({item: 'curr-xrefs', win: pBrowserWindow});
        }
      }, {
        label: 'Show xref graph from ...',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({item: 'curr-xfrom', win: pBrowserWindow});
        }
      }, {
        label: 'Show xref graph to ...',
        click: (pMenuItem:any, pBrowserWindow:any ) => {
          this.onMenuClick.next({item: 'curr-xto', win: pBrowserWindow});
        }
      }, {
        type: 'separator'
      }, {
        label: 'Search',
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
      }, {
        label: 'Transforms',
        submenu: [{
          label: "Rename random symbols"
        }, {
          label: "Remove useless jumps"
        }, {
          label: "Simplify method by emulation"
        }, {
          label: "Remove nop and noise"
        }, {
          label: "Remove integrity checks"
        }, {
          label: "Remove root detection checks"
        }, {
          label: "Remove hook detection checks"
        }, {
          label: "Remove SSL Pining"
        }]
      }, {
        label: 'Export',
        submenu: [{
          label: "Rebuild APK"
        }]
      }]
    }, 2);

    /*this.appmenuSvc.addMenu({
        id:'emu',
        label: 'Emulator',
        enabled:false,
        submenu:[{
          label: 'Dexcalibur DVM (disabled)',
        },{
          label: 'QEMU (disabled)',
        }]
    }, 5);*/

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

  getIconOf(pType:string):IconModel {
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
      case CODE_SUBVIEW.ANDROID_API:
        endpoint = this.endpoints['package']['android_api'];
        break;
      case CODE_SUBVIEW.ANDROID_FWK:
        endpoint = this.endpoints['package']['android_int'];
        break;
      case CODE_SUBVIEW.VENDOR:
        endpoint = this.endpoints['package']['vendor'];
        break;
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

                  vSelf._icon = this.getIconOf(vSelf._t)

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
                return;
                break;
              default:
                vChild._icon = this.getIconOf(vChild._t);
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
          this.outputSvc.print( OutputMessage.newError(pObs.msg))
          return [];
        }
      })
    );
  }

  getClass( pQuery:string, pComplete:boolean = false):Observable<CodeItem> {

    if(pComplete){
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
    }else{
      return this._process(
        /*this.endpoints['finder']['search'],
        {
          ':query': encodeURIComponent(btoa(`get.class("${pQuery}")`))
        }*/

        this.endpoints['class']['info'],
        {
          'id': pQuery
        }
      ).pipe(map( pRes => {
        if(pRes.success===false){
          this.outputSvc.print(OutputMessage.newError({ msg:"Class not found", src:"Bytecode Analyzer" }));
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

  getModelMethod( pSignature:string):Observable<Nullable<ModelMethod>> {
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

  disassMethod( pRef:string):Observable<Nullable<string>> {
    return this._process(
      this.endpoints['method']['disass'],
      {
        'id': pRef
      }
    ).pipe(map( pRes => {
      if(!pRes.success){
        this.outputSvc.print(OutputMessage.newError({ msg:pRes.msg, src:"Bytecode Analyzer" }));
        return null;
      }else{
        let code = '';

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

        this.outputSvc.print(OutputMessage.newSuccess({ msg:"Method ["+pRef+"] has been successfully disassembled", src:"Bytecode Analyzer" }));

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


        return vRes.data;
       }
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
}
