import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from "@angular/core";
import {SettingsService} from "../settings/ctrl/settings.service";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {WebsocketChannel, WebsocketClient} from "../../base/WebsocketClient";
import {HelperController} from "../helper/ctrl/HelperController";
import {IController} from "../../base/controllers/IController.interface";
import {ExplorerItem} from "../../cmp/ExplorerItem";
import {TerminalItem} from "../../cmp/TerminalItem";
import {ViewportController} from "../../base/viewport/ViewportController";
import {Observable, Subject} from "rxjs";
import {ControllerService} from "../../controller.service";
import {ElectronService} from "../../core/services";
import {ModalBaseComponent} from "../../base/modal-base/modal-base.component";
import {OutputMessage} from "../../cmp/OutputMessage";
import {OutputService} from "../output/ctrl/output.service";
import {ProjectService, ProjectSetting} from "../project/ctrl/project.service";
import DexcaliburProject from "../../models/DexcaliburProject";
import {ModalProgressComponent, ModalProgressEvent} from "../../base/modal-progress/modal-progress.component";
import {ModalSearchComponent} from "../search/modal-search/modal-search.component";
import {TerminalComponent} from "../../base/terminal/terminal.component";
import {ExplorerComponent} from "../../base/explorer/explorer.component";
import {ModalPasswdAuthComponent} from "../auth/modal-login/modal-passwd-auth.component";
import {AuthService} from "../auth/ctrl/auth.service";
import {AuthenticationEvent, AuthenticationEventType} from "../auth/AuthenticationEvent";
import {DxcApiToken} from "../../base/DxcApiToken";
import {ModalGlobalSettingsComponent} from "../settings/modal-gsettings/modal-gsettings.component";
import {KeyboardNavigationService} from "../../base/keyboard/keyboard-navigation.service";
import {DeviceManagerService} from "../device/ctrl/device-manager.service";
import {STAGE_ICONS} from "./icons";
import {PasteLocation, PasteLocationType} from "../../core/services/electron/SelectionManager";
import {DxcApiService} from "../../base/DxcApiService";
import {WebsocketEvent, WebsocketEventType} from "../../base/websocket/WebsocketEvent";


// size restriction (percent)
const MIN_LEFTP_W = 200; // px
const MAX_LEFTP_W = 80;
const MIN_BODY_H = 200; // px
const MAX_BODY_H = 80;

enum DIRECTION {
  COL,
  ROW,
  ANY
}

interface ModalMap {
  [name: string]: ModalBaseComponent
}


@Component({
  selector: 'dxc-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['../../app.component.scss'],
  providers: [SettingsService]
})
export class StageComponent implements OnInit, AfterViewInit {

  LAYOUT:any = {
    bottom: {
      height: 20,
      width: 100
    },
    leftPanel: {
      height: 80,
      width:25
    },
    viewport: {
      height: 80,
      width: 75
    }
  };

  title = 'dxc-web';
  ctrlCounter = 0;

  gIcons:any = GLOBAL_ICONS;
  icons:any = STAGE_ICONS;

  ws: WebsocketClient;

  statusWC: WebsocketChannel = null;

  //wsHook: WebsocketClient = new WebsocketClient('ws://localhost:8001/', 'hook-protocol');

  helper: HelperController = null;
  controllers: IController[] = [];
  explorers: ExplorerItem[] = [];
  terminals: TerminalItem[] = [];
  viewport: ViewportController = new ViewportController();

  navHeight = 0;
  statebarHeight = 20;

  output$: Subject<any> = new Subject<any>();


  public topFocus: any = {
    explorer: false,
    viewport: false,
    terminal: false
  };

  public drag: any = {
    active: false,
    current: null,
    terminal: {
      type: DIRECTION.ROW,
      el: null,
      sources:{}
    },
    explorer: {
      type: DIRECTION.COL,
      el: null,
      sources:{}
    },
    // any thing any where
    ataw: {
      type: DIRECTION.ANY,
      el: null,
      sources:{}
    }
  };

  @ViewChild('middleCtn',{read:ElementRef}) middleCtn:ElementRef;
  @ViewChild('mainContainer',{read:ElementRef}) mainCtn:ElementRef;
  @ViewChild('explContainer',{read:ElementRef}) explCtn:ElementRef;
  @ViewChild('viewportContainer',{read:ElementRef}) vpCtn:ElementRef;
  @ViewChild('bottomCtn',{read:ElementRef}) bottomCtn:ElementRef;
  @ViewChild('statebar',{read:ElementRef}) statebarCmp:ElementRef;


  @ViewChild(TerminalComponent) terminalCmp:TerminalComponent;

  @ViewChild(ModalProgressComponent) progressModal:ModalProgressComponent;
  @ViewChild(ModalSearchComponent) searchModal:ModalSearchComponent;
  @ViewChild(ModalPasswdAuthComponent) pwdAuthModal:ModalPasswdAuthComponent;
  @ViewChild(ModalGlobalSettingsComponent) gsettingsModal:ModalGlobalSettingsComponent;


  progress$: Subject<ModalProgressEvent> = new Subject<ModalProgressEvent>();
  private _progress$: Subject<ModalProgressEvent> = new Subject<ModalProgressEvent>();

  windowResize$: Subject<any> = new Subject<any>(); /* BehaviorSubject<any> = null; */
  userResize$: Subject<any> = new Subject<any>();
  drag$: Subject<any> = new Subject<any>();
  drop$: Subject<any> = new Subject<any>();

  /**
   * Pipe where events related to WebsocketServer must be pushed.
   * (Ready, connection lost, ...)
   * @type {Subject<WebsocketEvent>}
   */
  wsServer$: Subject<WebsocketEvent> = new Subject<WebsocketEvent>();

  terminalSize$: Subject<any> = new Subject<any>();
  leftPanelSize$: Subject<any> = new Subject<any>();
  viewportSize$: Subject<any> = new Subject<any>();

  renderSource: Observable<any>;

  modals: ModalMap = {};
  renderedModals: string[] = [];

  projectReady = false;
  project:DexcaliburProject = null;

  conn:any;

  /**
   * Stack of focused elements
   * When an element is destroyed or hidden, it is pop over this stack.
   * By this way, the top of the stack is the latest element which caught the focus.
   *
   * @type {any[]}
   * @field
   * @private
   */
  private focusStack:any[] = [];

  private _currentLayout:any = {};

  /**
   * Set to TRUE to display menu bar into browser window
   *
   * It should be used when Dexcalibur run as SaaS applciation instead of desktop app
   *
   * @type {boolean}
   * @field
   * @since 1.0.0
   * @readonly
   */
  readonly webNav: boolean = false;
  progressTitle = "Progress";
  progressValue = 0;

  constructor(
    private elementRef: ElementRef,
    private ctrlService: ControllerService,
    private settingsService: SettingsService,
    private outputSvc:OutputService,
    private projectSvc:ProjectService,
    private devSvc:DeviceManagerService,
    private authSvc:AuthService,
    private kbSvc:KeyboardNavigationService,
    private eSvc: ElectronService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetector:ChangeDetectorRef) {


    // try to restore default conenction
   // this.authSvc.getConnectionStringFromURI();
    //const port = this.settingsService.getWsPort();



    this.settingsService.listNetworkSettings().subscribe((vSettings)=>{
      const connParam = DxcApiService.getAuthProfile();
      console.log(connParam);
      if(connParam!=null){
        // init websocket
        this.ws = new WebsocketClient(((connParam.ssl==true)?'wss':'ws')+'://'+connParam.ip+':'+vSettings.ws.value+'/','term-protocol');
        this.wsServer$.next(WebsocketEvent.newConnectionReady(this.ws));
      }
    })


    // init service
    document.documentElement.setAttribute('data-theme', 'dark');
    this.elementRef = elementRef;
    //this.initStatusChannel();
    this.ctrlService.addStage('main',this);

    this.outputSvc.onNewError$.subscribe( (pEvent)=>{
      this.alertCtr++;
      this.changeDetector.detectChanges();
      //this.
    });
  }


  /**
   * To focus specified argument
   *
   * When a focused element is closed, latest focused element takes the control
   *
   * @param pComponent
   */
  focus( pComponent:any):void {
    //if(this.)
  }

  resizeHorizontal(pPositionX: number): void {
    //
  }

  renderLayout(pEvent: any): void {

    // main nav bar
    if(this.webNav && this.navHeight>0) {
      document.getElementById('appHeaderCtn').style.height = pEvent.header + 'px';
    }

    const btm:HTMLElement = document.getElementById('appBottomCtn');
    const expl:HTMLElement = document.getElementById('appSuperExpl');
    const svp:HTMLElement = document.getElementById('appSuperViewport');
    const vp:HTMLElement = document.getElementById('appViewport');

    // middle ctn : explorer + viewport
    document.getElementById('appMiddleCtn').style.top = pEvent.header + 'px';

    svp.style.height = expl.style.height = pEvent.body+'px';
    expl.style.maxWidth = expl.style.width =pEvent.left_width+'px';
    svp.style.maxWidth = svp.style.width = (window.innerWidth-pEvent.left_width)+'px';
    vp.style.height = vp.style.maxHeight = pEvent.body+'px';

    // bottom ctn : terminal + footer
    btm.style.minHeight = btm.style.height = btm.style.height = pEvent.bottom + 'px';

  }

  /*initWebsocketClient():void {
    this.ws._close.subscribe( pEvent => {
      console.log("Re-open websocket client");
      this.ws.reconnect();
    })
  }*/
  /**
   * A counter for error messages
   */
  alertCtr = 0;


  initStatusChannel():void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self:StageComponent = this;

    this.statusWC = new class extends WebsocketChannel {

      onClose(pEvent: any): void {
        // stub
      }

      onError(pEvent: any): void {
        // stub
      }

      onMessage(pEvent: any): void {
        // stub
      }

      processMessage(pMsg: any):void {
        self.progress$.next(new ModalProgressEvent(pMsg.data.msg));
      }

      sendRaw(pData: any) {
        pData._a = DxcApiToken.getInstance().getToken();
        if(DxcApiToken.exists("puid")){
          pData._puid = DxcApiToken.getInstance("puid").getToken();
        }
        super.sendRaw(pData);
      }
    };

    this.wsServer$.subscribe((eEvt)=>{
      if(eEvt.type===WebsocketEventType.CONN_READY){
        eEvt.getClient().registerChannel(this.statusWC);
      }
    });
    //this.ws.registerChannel(this.statusWC);
  }

  getStatusChannel():WebsocketChannel {
    return this.statusWC;
  }




  /**
   * To push a message to print on the output
   *
   * @param {OutputMessage} pMsg
   * @method
   * @since 1.0.0
   */
  print( pMsg:OutputMessage):void{
    this.outputSvc.print( pMsg);
  }

  ngOnInit() {

    const leftPanel = document.getElementById('appSuperExpl');
    const middlePanel = document.getElementById('appSuperViewport');
    const middleCtn = document.getElementById('appMiddleCtn');


    this.windowResize$.subscribe((pEvent) => {
      //console.log("Stage > Rendering > ", pEvent);
      this.renderLayout(pEvent);
    });

    //this.authSvc

    this.userResize$.subscribe((pEvent) => {
      // console.log("Resizing global layout", pEvent);

      if (pEvent.type == 'h') {
        middleCtn.style.height = pEvent.size.top + 'px'; //pEvent.clientY+'px';
        middleCtn.style.maxHeight = pEvent.size.top + 'px'; //pEvent.clientY+'px'
        middleCtn.style.minHeight = pEvent.size.top + 'px'; //pEvent.clientY+'px'
      } else {
        leftPanel.style.width = pEvent.size.left + 'px'; //pEvent.clientX+'px';
        middlePanel.style.width = pEvent.size.right + 'px'; // window.innerWidth-pEvent.clientX+'px';// offsetLeft;
      }
    });

    this.loadControllers();

    //this.pwdAuthModal.show();F


    // redirect 'this.projectSvc.onProjectOpening' to 'this.progress$'
    this.projectSvc.onProjectOpening.subscribe( (pData:any)=>{


      this.statusWC.send({ action:"project", svc:"stat", data: { op:'project', opts:pData.project } });
      this.statusWC.onMessage = ((pMessage)=>{
        console.log("PROJECT WebsocketChannel ",pMessage);
        //
        this._progress$.next(new ModalProgressEvent({ progress:2, msg:'Message receipt ...'}));
      })
      this._progress$.next(new ModalProgressEvent({ progress:1, msg:'Starting ...'}));
    });

    this._progress$.subscribe( (pEvent:ModalProgressEvent)=>{

      if(!this.progressModal.isVisible()){
        this.progressTitle = "Opening project...";
        this.progressModal.progress = pEvent.progress;
        this.progressModal.show();
      }

      this.progress$.next(pEvent);
    });


    this.authSvc.onAuthentication.subscribe( (pEvent:AuthenticationEvent)=>{
      if(pEvent.type == AuthenticationEventType.AUTH_SUCCESS){
        console.log(pEvent);
        this.conn = {
          name: pEvent.token.getName(),
          user: pEvent.user
        };
        this.initStatusChannel();
      }
    });

    /*
    this.projectSvc.onProjectOpening.subscribe( (pEvent:ModalProgressEvent)=>{
      console.log(pEvent);
      if(!this.progressModal.isVisible()){
        this.progressTitle = "Opening project...";
        this.progressModal.progress = 30;
        this.progressModal.show();
      }
    });*/

    this.projectSvc.onProjectReady.subscribe( (pEvent: any) => {
      this.projectReady = true;
      this.project = this.projectSvc.getSelectedProject();
      if(this.progressModal.isVisible()){
        this.progressModal.close();
      }
      this.devSvc.listDevices();

      // close splash screen
      // this.getController('ctrl:splash').showSplashScreen();

      this.getController('ctrl:project').showDashboard();

    });

    this.projectSvc.onProjectHaltOpening.subscribe( (pEvent: any) => {
      if(this.progressModal.isVisible()){
        this.progressModal.close();
      }
    });

    this.projectSvc.onMenuClick.subscribe( (pEvent: any) => {
      switch(pEvent.item){
        case "gsettings":
          this.showModal("gsettings");
          break;
      }
    });



    this.projectSvc.onProjectSettingsChange.subscribe( (pSetting: ProjectSetting[]) => {
      this.project = this.projectSvc.getSelectedProject();
      console.log(this.project);
    });
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#333';

    this.onWindowResize();

    /*
    this.projectSvc.getActiveProject().subscribe((vProjects:DexcaliburProject[])=>{

      if(vProjects.length > 0){
        console.log(vProjects);
      }
      if(!this.projectSvc.isProjectIsOpen()){
        this.controller.app.getController('ctrl:splash').showSplashScreen();
      }else{
        this.controller.app.getController('ctrl:project').showDashboard();
      }

    })*/

    if(!this.projectSvc.isProjectIsOpen()){
      this.getController('ctrl:splash').showSplashScreen();
    }else{
      this.getController('ctrl:project').showDashboard();
    }


    /**
     * TODO : detect if server is online at startup
     *
     * this.settingsService.isConnected().subscribe( (pObs:any)=>{
      console.log('isConnectected>',pObs);
    })**/




    DxcApiToken.importLocalStorage();
    if(DxcApiToken.exists("local")==false){
      this.showModal('passwd_auth');
    }else{
      this.authSvc.refresh();
    }
  }

  setTerminalFocus(pLabel:string){
    this.terminalCmp.selectTabByLabel(pLabel);
  }
  setFocus(pName: string): void {
    for (const i in this.topFocus) this.topFocus[i] = false;
    this.topFocus[pName] = true;
  }

  clearLayoutDrag(): void {
    this.drag.active = false;
    this.drag.current = null;
  }

  startDrag(pName: string, pObject: any): void {
/*
    if(pName!='ataw')
      console.log("[STAGE] Start resize by dragging ..");
    else
      console.log("[STAGE] Move by drag & drop");
*/
    this.drag[pName].dragging = true;
    this.drag[pName].el = pObject;

    if(!pObject.hasOwnProperty('delta'))
      this.drag[pName].el.delta = 0;

    this.drag.active = true;
    this.drag.current = this.drag[pName];

    return this.drag.current.sources;
  }


  /**
   * To transform mouse events to custom resize event
   *
   * @param {any} pEvent Generic mouse event
   * @param {Observable<any>} pObserver Output observable
   */
  onPanelResize(pEvent: any, pCollapsing = false): void {

    let navH = 0;
    if(this.webNav) navH = this.navHeight + 5;

    switch(this.drag.current.type){
      case DIRECTION.COL:

        // restrict max left-panel width to be 80%
        if(!pCollapsing){
          if(pEvent.x > ((window.innerWidth*MAX_LEFTP_W)/100)){
            console.error('Resize out of max bound. Expected <=  '+((window.innerWidth*MAX_LEFTP_W)/100)+', but '+pEvent.x+' encountered');
            break;
          }
          if(pEvent.x < MIN_LEFTP_W){
            console.error('Resize out of max bound. Expected <=  '+((window.innerWidth*MAX_LEFTP_W)/100)+', but '+pEvent.x+' encountered');
            break;
          }
        }


        this._currentLayout.left_width = pEvent.x;


        //console.log('PanelResize:COL =>');
        this.windowResize$.next(this._currentLayout);
        this.leftPanelSize$.next({
          height: this._currentLayout.body_height,
          width: pEvent.x
        });
        this.viewportSize$.next({
          height: this._currentLayout.body_height,
          width: window.innerWidth - pEvent.x
        });

        break;
      case DIRECTION.ROW:

        // restriction

        if(!pCollapsing) {
          if (pEvent.y > ((window.innerHeight * MAX_BODY_H) / 100)) {
            console.error('Resize out of max bound. Expected <=  ' + ((window.innerHeight * MAX_BODY_H) / 100) + ', but ' + pEvent.y + ' encountered');
            break;
          }
          if (pEvent.y < MIN_BODY_H) {
            console.error('Resize out of min bound. Expected >=  ' + ((window.innerHeight * MAX_BODY_H) / 100) + ', but ' + pEvent.y + ' encountered');
            break;
          }
        }
        this._currentLayout.body_height = pEvent.y - this.drag.current.el.delta - navH;
        this._currentLayout.bottom_height = window.innerHeight - pEvent.y + this.drag.current.el.delta;


        //console.log('PanelResize:ROW =>');
        this.windowResize$.next(this._currentLayout);
        this.terminalSize$.next({
          height: this._currentLayout.bottom_height-this.statebarHeight,
          width: this._currentLayout.win_width,
          bottom: this.statebarHeight
        });
        this.leftPanelSize$.next({
          height: this._currentLayout.body_height,
          width: this._currentLayout.left_width
        });
        this.viewportSize$.next({
          height: this._currentLayout.body_height,
          width: (this._currentLayout.win_width-this._currentLayout.left_width)
        });

        break;
      case DIRECTION.ANY:
        if(this.drag.active) {
          this.drag$.next({
            left: pEvent.x,
            top: pEvent.y,
          })
        }else{
          this.drop$.next({
            left: pEvent.x,
            top: pEvent.y,
          })
        }
        /*this.userResize$.next({
          type: 'w', size: {
            left: pEvent.clientX,
            right: window.innerWidth - pEvent.x,
            top: pEvent.clientY - navH,
            bottom: window.innerHeight - pEvent.y
          }
        });*/

        break;
    }

    if (pEvent.type == "mouseup") {
      this.clearLayoutDrag();
    }
  }

  @HostListener('document:selectionchange',['$event'])
  onSelection(pEvent:any):void {
    this.eSvc.getSelectionManager().select(document.getSelection());
  }

  @HostListener('document:contextmenu',['$event'])
  onContextMenu(pEvent:any):void{
    pEvent.preventDefault();
  }


  @HostListener('document:keydown.meta.c',['$event'])
  @HostListener('document:keydown.control.c',['$event'])
  onCopy(pEvent:any):void {

    const sel = this.eSvc.getSelectionManager().getSelection();

    console.log("[COPY] ",sel);
    if(sel.length == 1){
      const last = this.eSvc.getSelectionManager().getNewest();
      this.eSvc.pinToClipboard( last)
    }else if(sel.length > 1){
      // multiple copy
    }
  }

  /**
   *
   * Event listener for paste, by default it is mapped to global CmdOrCtrl+V
   *
   * @param pEvent
   * @method
   */
  @HostListener('document:keydown.meta.v',['$event'])
  @HostListener('document:keydown.control.v',['$event'])
  onPaste(pEvent:any):void {


    // on paste is trigged, treatment must be delegated to focused component
    // not sure selection match all cases

    const sel = this.eSvc.getSelectionManager().getSelection();

    console.log('[PASTE] what=',this.eSvc.clipboard,' in=',this.eSvc.getSelectionManager().getSelection());

    const pasteLoc:PasteLocation = this.eSvc.getSelectionManager().getPasteLocationFromFocus();
    const cp = this.eSvc.readFromClipboard();

    switch(pasteLoc.type) {
      case PasteLocationType.TEXTAREA:
      case PasteLocationType.INPUT:
        const end = pasteLoc.el.value.substring(pasteLoc.end);
        pasteLoc.el.value = pasteLoc.el.value.substring(0,pasteLoc.start)+cp+end;
        pasteLoc.el.selectionStart = pasteLoc.el.selectionEnd = pasteLoc.start + cp.length;
        break;
      case PasteLocationType.EDITOR:
        pasteLoc.el.env.editor.execCommand("paste", cp);
        break;
    }

/*
    if(sel.length == 1){
      const last = this.eSvc.getSelectionManager().getNewest();

      console.log('[PASTE]  in newest=',this.eSvc.getSelectionManager().getNewest());

      if(this.eSvc.getSelectionManager().isTextLocation()){
        // pasting text must be compatible with text from external process, so the last entry
        // of the clipboard has the highest priority
        // if waiting for text, paste the newest entry from the clipboard
        this.eSvc.getSelectionManager().paste(this.eSvc.readFromClipboard());

      }else{
        // else if waiting for node

      }


    }else if(sel.length > 1){
      // multiple paste
    }*/
  }


  /**
   * Event listener for Escape key press
   *
   * Only modal opened by showModal() can be closed by escape pressing
   */
  @HostListener('document:keydown.escape',['$event'])
  onEscape(pEvent:any){
    this.kbSvc.dispatch(pEvent, null);

    // if a modal is displayed, close the top level modal
    /*
    if(this.renderedModals.length>0){
      this.hideModal(this.renderedModals[this.renderedModals.length-1], 'escape');
    }*/
  }

  @HostListener('document:keydown.shift.ArrowUp',['$event'])
  onSelectUp(pEvent:any){
    console.log("[SELECTION APPEND UP] ", pEvent);
    //this.eSvc.getSelectionManager().appendNode()
    // prevent if
    //this.kbSvc.dispatch(pEvent, null);
  }

  @HostListener('document:keydown.shift.ArrowDown',['$event'])
  onSelectDown(pEvent:any){
    console.log("[SELECTION APPEND DOWN] ", pEvent);
    // prevent if
    //this.kbSvc.dispatch(pEvent, null);
  }



  @HostListener('document:keydown.ArrowUp',['$event'])
  onArrowUp(pEvent:any){
    // prevent if
    this.kbSvc.dispatch(pEvent, null);
  }

  @HostListener('document:keydown.ArrowDown',['$event'])
  onArrowDown(pEvent:any){
    this.kbSvc.dispatch(pEvent, null);
  }

  @HostListener('document:keydown.ArrowLeft',['$event'])
  onArrowLeft(pEvent:any){
    this.kbSvc.dispatch(pEvent, null);
  }

  @HostListener('document:keydown.ArrowRight',['$event'])
  onArrowRight(pEvent:any){
    this.kbSvc.dispatch(pEvent, null);
  }

  @HostListener('document:keydown.enter',['$event'])
  onEnter(pEvent:any){
    this.kbSvc.dispatch(pEvent, null);
  }

  @HostListener('document:mousemove',['$event'])
  onMouseMove(pEvent:any):void{
    if (this.drag.active) {

      this.onPanelResize({
        x:pEvent.clientX,
        y:pEvent.clientY
      });
    }
  }


  @HostListener('document:mouseup',['$event'])
  onMouseUp(pEvent:any, pCollapsing=false):void{
    if (this.drag.active) {
      //this.onDrop(pEvent, this.dropSrc);
      this.drag.active = false;
      this.onPanelResize({
        x:pEvent.clientX,
        y:pEvent.clientY
      },pCollapsing);
    }
  }


  @HostListener('window:resize')
  onWindowResize(){

    const newLayout = this.computeLayoutDim();

    this.terminalSize$.next({
      height: newLayout.bottom_height-this.statebarHeight,
      width: newLayout.win_width,
      bottom: this.statebarHeight
    });
    this.leftPanelSize$.next({
      height: newLayout.body_height,
      width: newLayout.left_width
    });
    this.viewportSize$.next({
      height: newLayout.body_height,
      width: (newLayout.win_width-newLayout.left_width)
    });
    this.windowResize$.next(newLayout);
  }


  computeLayoutDim():any {

    const leftPanel = document.getElementById('appSuperExpl');
    const navEl = document.getElementById('appHeaderCtn');

    let borderWidth = 5;
    const vh:number = window.innerHeight; // - this.statebarHeight;

    if(this.webNav) {
      this.navHeight = navEl != null ? parseFloat(window.getComputedStyle(navEl).lineHeight) : -5;
      borderWidth = 5;
    }else {
      this.navHeight = 0;
      borderWidth = 0
    }

    //console.log("[LEFt WIDTH] : ",parseFloat(window.getComputedStyle(leftPanel).width));
    this._currentLayout = {
      win_height: window.innerHeight,
      win_width: window.innerWidth,
      header_height: this.navHeight + borderWidth, /* 5 is the border width */
      body_height: (vh - borderWidth - this.navHeight ) * 75 / 100,
      bottom_height: ((vh - borderWidth - this.navHeight) * 25 / 100), // 25%
      left_width: parseFloat(window.getComputedStyle(leftPanel).width)
    };

    return this._currentLayout;
  }


  collapseArea( pElement:any):void{
    if(pElement instanceof  TerminalComponent){
      this.startDrag('terminal', {
        delta: 30
      });
      this.onMouseUp({
        clientX:0,
        clientY:(window.innerHeight-this.statebarHeight)
      }, true);
    }
    else if(pElement instanceof  ExplorerComponent){
      this.startDrag('explorer', { delta: 0 });
      this.onMouseUp({ clientX:0, clientY:0}, true);
    }
  }

  expandArea( pElement:any, pOriginalSize = false):void{

    if(pElement instanceof  TerminalComponent){
      this.startDrag('terminal', {
        delta: 30
      });

      this.onMouseUp({
        clientX:0,
        clientY:(window.innerHeight-this.statebarHeight-pElement.getOriginalHeight())
      }, true);
    }
    else if(pElement instanceof  ExplorerComponent){
      this.startDrag('explorer', { delta: 0 });
      this.onMouseUp({ clientX:0, clientY:0}, true);
    }
  }

  /**
   * To get all controllers and to initialize all componants
   *
   * Steps :
   * 1) all controllers are obtained from ControllerService,
   *
   * and for each :
   * 2) explorer layout is populated with sub-explorer components
   * 3) terminal layout is populated with sub-terminal components
   * 4) 'componentFactoryResolevr' is injected into each controllers
   * 5) modal are registered and injected into app component
   * 6) if controller can open window into viewport, main viewport subscribes to custom 'openView' event
   */
  loadControllers(): void {
    this.controllers = this.ctrlService.getControllers();
    this.helper = this.ctrlService.getHelper();

    this.controllers.map((pEl)=>{

      pEl.id = 'c'+(this.ctrlCounter++);
      pEl.app = this;

      // populate explorer panel
      if(pEl.explorerCmp != null){
        this.explorers.push(new ExplorerItem(pEl.explorerCmp, pEl));
      }

      // populate terminal panel
      if(pEl.terminalCmp != null){
        for(const k in pEl.terminalCmp) {
          this.terminals.push(new TerminalItem(pEl.terminalCmp[k], pEl));
        }
      }

      // viewport : inject factory
      pEl.componentFactoryResolver = this.componentFactoryResolver;

      // viewport : subscribe to controller event
      if(pEl.open != null){
        pEl.openView.subscribe( (pObs:any)=>{
          this.viewport.createView(pObs);
        });
        pEl.focusView.subscribe( (pObs:any)=>{
          this.viewport.selectView(pObs);
        });
      }

    });
  }

  registerModal(pName:string, pModal:ModalBaseComponent):void {
    this.modals[pName] = pModal;
  }

  getModal( pName:string): ModalBaseComponent {
    return this.modals[pName];
  }

  isModalRendered( pName:string): boolean {
    return (this.renderedModals.indexOf(pName)>-1);
  }

  hideModal( pName:string, pType = 'close'): void {
    console.log("[stage] hide modal ",pName,pType);
    if(this.modals[pName].hide(pType)){
      this.renderedModals = this.renderedModals.filter( vName => (vName != pName) );
    }else{
      console.log("[stage] hide modal blocked for ",pName,pType);
    }
  }

  showModal( pName:string, pOptions:any=null): void {
    console.log("show modals> ",this.modals[pName], pOptions);

    if(this.modals[pName]==null) return;

    this.renderedModals.push(pName);
    this.modals[pName].show(pOptions);
  }


  getController( pPattern:string):any{
    if(pPattern.indexOf('ctrl:')==0){
      const name = pPattern.substr(5);
      let ctrl = null;
      this.controllers.map( vCtrl => {
        if(vCtrl.name == name){
          ctrl = vCtrl;
        }
      });
      return ctrl;
    }else{
      return null;
    }
  }

  doSearch(pRequest:string, pResultType:string=null):void {
    this.searchModal.spawn(pRequest, pResultType);
  }

  onModalProgressCancel(pObject:any) {
    console.log(pObject);
  }

  showDevice(device: any) {
    this.getController('ctrl:device').open(device);
  }

  focusView( pUID:string){
    this.viewport.vp.selectTabByUID2(pUID);
  }
}

