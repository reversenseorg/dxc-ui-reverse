import {
  AfterContentInit, AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output, QueryList,
  ViewChild, ViewChildren
} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Message} from "../../../cmp/Error";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {ServerSettings, Setting, SettingsService, WebServerSettings} from "../ctrl/settings.service";
import {Device} from "../../../models/Device";
import {DeviceManagerService} from "../../device/ctrl/device-manager.service";
import {PlatformService} from "../../platform/ctrl/platform.service";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {StageComponent} from "../../stage/stage.component";
import {SearchController} from "../../search/ctrl/SearchController";
import {
  ContextMenuComponent,
  ContextMenuList,
  ContextMenuState
} from "../../../base/context-menu/context-menu.component";
import Platform from "../../../models/Platform";
import {ExternalTool} from "../../../models/ExternalTool";
import {UserAccount} from "../../../models/user/UserAccount";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {AuthService} from "../../auth/ctrl/auth.service";
import {AuthenticationEvent, AuthenticationEventType} from "../../auth/AuthenticationEvent";
import {ElectronService} from "../../../core/services";
import {UIException} from "../../../base/error/UIException";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";

interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}


@Component({
  selector: 'dxc-modal-global-settings',
  templateUrl: './modal-gsettings.component.html',
  styleUrls: ['../../../modal.scss', '../../../forms.scss', '../../../grid.scss'],
})
export class ModalGlobalSettingsComponent extends AbstractKeyboardNavigable implements OnInit, AfterViewInit {


  @Input() mainController: StageComponent;
  @Input() controller: any;

  @Input() closable = true;
  @Input() progress$: Observable<any> ;
  @Input() progressSrc:any = null;
  @Input() progress = 20;

  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:Nullable<string> = null;

  @Input() message:Nullable<Message> = null;

  @ViewChild('appFile',{read:ElementRef, static:true}) appFileEl:ElementRef;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;


  /**
   * The list of contextual menu declared
   *
   * @type {QueryList<ContextMenuComponent>}
   * @field
   */
  @ViewChildren(ContextMenuComponent) ctxMenuChildren: QueryList<ContextMenuComponent>;


  ctxMenu: ContextMenuList = {};
  ctxMenuState:ContextMenuState = { subject: null };


  gIcons:any = GLOBAL_ICONS;

  item: any = null;

  // model
  tools: ExternalTool[] = [];
  ext:string;
  net: WebServerSettings = {
    http: { name:"http", value:8080 },
    ws: { name:"ws", value:8081 }
  }


  authType = "none";

  targetFile:Nullable<string> = null;
  targetUrl:Nullable<string> = null;
  /*
  proxyIp:Nullable<string> = null;
  proxyPort:Nullable<string> = null;
  httpHeaders:Nullable<string> = null;*/
  pltList: any;
  platform: any;

  srv:any = {
    workspace:{ name:"workspace", value:"" },
    registry: { name:"registry", value:"" },
    registryAPI: { name:"registryAPI", value:"" },
    auth: { name:"hauthttp", value:"" },
    heapSize: { name:"heapSize", value:4196 },
  };

  display:any = {
    dev: false,
    pltf: false
  };
  dev:any  = null;
  active = "etools";
  account: Nullable<UserAccount> = null;
  selected: any;

  mismatch = false;
  pwdChanged = false;
  newUserPwd:string ;
  oldUserPwd:string ;

  @ViewChild('newPwd1',{read:ElementRef, static:true}) newPwd1El:ElementRef;
  @ViewChild('newPwd2',{read:ElementRef, static:true}) newPwd2El:ElementRef;

  constructor( private changeDetectorRef: ChangeDetectorRef,
               private electronSvc:ElectronService,
               private devSvc:DeviceManagerService,
               private platformSvc:PlatformService,
               private outputSvc:OutputService,
               public kbSvc:KeyboardNavigationService,
               private settSvc:SettingsService,
               private authSvc:AuthService) {
      super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);

    this.displayPlatformList();
    this.displayExternalToolsList();
    this.displayNetworkSettings();
    this.refreshServerSettings();


    this.authSvc.onAuthentication.subscribe( (pEvent:AuthenticationEvent)=>{
      if(pEvent.type == AuthenticationEventType.AUTH_SUCCESS){
        console.log(pEvent.user);
        this.account = pEvent.user;
      }
    });

    this.settSvc.onSettingUpdate.subscribe( (pEvent:any)=>{
      switch (pEvent.type) {
        case 'ext':
          this.displayExternalToolsList();
          break;
      }
    })
  }


  ngAfterViewInit() {


    // init contextual menus
    this.ctxMenu = {};
    this.ctxMenuChildren.toArray().map((vMenu:ContextMenuComponent) => {
      this.ctxMenu[vMenu.name as string] = vMenu;
      this.controller.registerCtxMenu(vMenu.name, this);
    });

  }


  refreshServerSettings(): void {
    this.settSvc.listServerSettings().subscribe( (pSettings:ServerSettings) => {
      console.log(pSettings);
      this.srv = pSettings;
      if(!this.srv.hasOwnProperty('heapSize') ||this.srv.heapSize==null){
        this.srv.heapSize = { name:"heapSize", value:4096};
      }
    });
  }


  displayExternalToolsList(): void {
    this.settSvc.listExternalTools().subscribe( (pTools:ExternalTool[]) => {
        this.tools = pTools;
    });
  }

  displayNetworkSettings(): void {
    this.settSvc.listNetworkSettings().subscribe( (pSettings:Nullable<WebServerSettings>) => {
      if(pSettings==null) return;

      console.log(pSettings);
      this.net = pSettings;
    });
  }

  displayPlatformList(): void {
    this.platformSvc.list().subscribe(
      (pPltf) => {
        console.log(pPltf);
        this.pltList = pPltf;
        this.display.pltf = true;
      }
    );
  }

  checkUserPasswd():boolean {
    const v1 = this.newPwd1El.nativeElement.value;
    if((v1.length > 0) && (v1 != this.newPwd2El.nativeElement.value)){
      this.mismatch = true;
      return false;
    }else{
      this.mismatch = false;
      return true;
    }
  }

  changePasswd():void {
    if(this.checkUserPasswd()){
      this.authSvc.changePassword(
        this.oldUserPwd,
        this.newUserPwd
      ).subscribe( (pSuccess)=>{
        this.pwdChanged = true;
        this.oldUserPwd = '';
        this.newUserPwd = '';
      })
    }

  }

  onExpand( pItem:any):void {
    // todo
  }

  onCollapse( pItem:any):void {
    // todo
  }

  onItemFocus( pEvent:any):void{
    // todo
  }



  showTab(pTab: string){
    this.active = pTab;
  }

  show(pTab: string = ""){
    this.modal.show();
  }

  close(){
    this.modal.hide('close');
  }

  restart(){
    this.modal.hide('close');
  }
/*
  updateAppFile($event: any) {
    this.targetFile = $event.path[0].files[0].path;
//    this.displayDeviceList();
  }

  newProject() {
    try{

    }catch(err){
      this.outputSvc.alert(new OutputMessage({ msg:err.message }))
    }
  }
*/
  itemHasChildren() :boolean {
    return false;
  }

  exttoolsIdentify( pIndex:number, pItem:any):string {
    return pItem.name;
  }

  save() {
    this.close();
  }

  displayCtxMenu(pEvent:any, pType:string, pObject:any):void{
    pEvent.preventDefault();

    this.ctxMenuState = {
      menu: this.ctxMenu[pType],
      subject: pObject
    };
    this.ctxMenu[pType].show(pEvent, pObject);
  }

  hideCtxMenu():void{

    if(this.ctxMenuState==null){
      throw UIException.CTX_MENU_NOT_READY("modal-gsettings","hideCtxMenu");
    }

    if(this.ctxMenuState.menu!=null){
      this.ctxMenuState.menu.hide(this.ctxMenuState.subject);
    }

  }

  onEdit(ext: string, itemObj: any, path: string) {
    // todo
  }

  /**
   *
   * @param pPlt
   */
  dlPlatform(pPlt: Platform):void {
    pPlt._installing = true;
    this.platformSvc.install( pPlt.getUID() ).subscribe( pResult => {
        if(pResult){
          pPlt.installed = true;
          // trigger update
        }else{
          pPlt.installed = false;
        }

      pPlt._installing = false;
    })
  }

  platformIdentify( pIndex:number, pItem:any):string {
    return pItem.getUID();
  }

  saveExtPath($event: any, ext: ExternalTool) {
    this.doSave('ext', ext);
  }

  extEdit(ext: ExternalTool) {
    ext._editing = true;
  }

  /**
   * To past clipboard content into input as text
   *
   * @method
   * @since 1.0.0
   */
  onPaste(pType:string, pObj:any):void {
    switch (pType) {
      case 'ext':
        pObj.path = this.electronSvc.readFromClipboard({ format:'txt' });
        break;
    }
  }

  quitEditMode($event: any, ext: ExternalTool) {
    if($event!=null){
      $event.stopPropagation();
    }

    ext._editing = false;
  }

  onKeyPress(pEvent: any):void {
    console.log("on key press from gsettings : ",pEvent);
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }

  doSave(pType: string, pSetting: any) {
    switch(pType){
      case 'ext':
        this.settSvc.updateExternalTool(pSetting).subscribe( (pSuccess:boolean) => {
          if(pSuccess){
            pSetting._edited = true;
            this.quitEditMode(null,pSetting);

            this.settSvc.listExternalTools().subscribe( (vTools:ExternalTool[]) => {
              for(let i=0; i<vTools.length; i++){
                if(vTools[i].getUID()==pSetting.getUID()){
                  pSetting.path = vTools[i].getPath();
                }
              }
            });
          }
        });
        break;
      case 'srv':
        this.settSvc.updateServerSettings(pSetting.name, pSetting.value).subscribe( (pSuccess:boolean) => {
          if(pSuccess){
            pSetting._edited = true;
            this.quitEditMode(null,pSetting);
          }else{
            this.settSvc.listServerSettings().subscribe( (vSettings:ServerSettings) => {
              for(const i in vSettings){
                if((vSettings as IStringIndex<any>)[i].name==pSetting.name){
                  this.srv[i].value=(vSettings as IStringIndex<any>)[i].name;
                }
              }
            });
          }
        });
        break;
      case 'net':
        break;
    }
  }

  /**
   * To add dynamically a new setting to a specified category,
   * it open a model and ask info to user
   *
   * Helpful to configure plugins dynamically
   *
   * @param {string} pCategory The category name
   * @method
   */
  openNewSetting(pCategory: string) {
    //this.settSvc.addSetting()
    this.mainController.showModal('new-setting', { category:pCategory })
  }

  /**
   * To export settings from the selected category
   * @param ext
   */
  export(ext: string) {
    // todo
  }

  remove(ext: string, ext2: ExternalTool) {
    // todo
  }
}
