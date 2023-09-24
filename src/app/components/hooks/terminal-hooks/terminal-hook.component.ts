import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TerminalTab} from "../../../cmp/TerminalTab";
import {TerminalView} from "../../../cmp/TerminalView";
import {TerminalComponent} from "../../../base/terminal/terminal.component";
import {NavbarTabView} from "../../../cmp/NavbarTabView";
import {NavbarTab} from "../../../cmp/NavbarTab";
import {ITerminalContainer} from "../../../base/terminal/ITerminalContainer";
import {HookController} from "../ctrl/HookController";
import {HOOK_ICONS} from "../icons";
import {HookService} from "../ctrl/hook.service";
import {HookSession} from "../ctrl/HookSession";
import {ProjectService} from "../../project/ctrl/project.service";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {SubnavbarComponent} from "../../../base/subnavbar/subnavbar.component";
import {CODE_ICONS} from "../../code/icons";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {TagService} from "../../tag/ctrl/tag.service";


interface SelectedMessage {
  [sessionID:string] :number
}

// @ts-ignore
@Component({
  selector: 'app-terminal-hook',
  templateUrl: './terminal-hook.component.html',
  styleUrls: ['./terminal-hook.component.scss']
})
export class TerminalHookComponent implements OnInit, ITerminalContainer {

  id:number;

  @Input() parent: TerminalComponent;
  @Input() controller: HookController;

  tab:TerminalTab = new TerminalTab({
    offset: 0,
    label: 'Hook Logs',
    icon: GLOBAL_ICONS['HOOKS'],
    color: 'dxc-text-clear100'
  });

  NODE_TYPE:any = NodeInternalType;

  gIcons: any = GLOBAL_ICONS;
  cIcons: any = CODE_ICONS;
  icons: any = HOOK_ICONS;

  view:TerminalView = new TerminalView({
    nav: new NavbarTabView({
      label: 'Session',
      tab: new NavbarTab({
        offset: 0,
        label: 'Code',
        closable:true,
        icon: GLOBAL_ICONS['HOOKS'],
        iconColor: 'dxc-text-clear100',
        color: 'dxc-text-clear100'
      })
    })
  });

  //NODE_TYPE:any = NODE_TYPE;

  _selected:SelectedMessage = {};
  _current:HookSession = null;
  _current_selected:number = -1;
  _sessions:HookSession[] = [];
  activeTerm: any = null;

  @ViewChild('termHook', { static: true, read:ElementRef  }) termHelp: ElementRef;
  @ViewChild('termHookCtn', { static: true, read:ElementRef  }) termCtn: ElementRef;
  @ViewChild('termHookNav', { static: true, read:ElementRef  }) termNav: ElementRef;
  @ViewChild(SubnavbarComponent) navbar: SubnavbarComponent;

  size:any = {
    height: '150px'
  };

  tags:any = {};

  constructor(private prjSvc:ProjectService,
              private hookSvc:HookService,
              private tagSvc:TagService,
              private outputSvc:OutputService) {


    this.hookSvc.onNewSession.subscribe( (pSession:any)=>{
      this._sessions.push(pSession);

      if(this._current != null)
        this._current.active = false;

      this._current = pSession;
      this._current.active = true;

      this.parent.selectTab(this);
    });
  }

  ngOnInit(): void {
    this.prjSvc.onProjectReady.subscribe(()=>{
      this.refreshTags();
    })
  }


  refreshTags(){
    this.tagSvc.listTags().subscribe(() => {
      this.tags = {
        HOOK: this.tagSvc.getTagByName('runtime.msg.hook'),
        FS: this.tagSvc.getTagByName('runtime.msg.fs'),
        MEM: this.tagSvc.getTagByName('runtime.msg.mem'),
        TEE: this.tagSvc.getTagByName('runtime.msg.tee'),
        CERT: this.tagSvc.getTagByName('runtime.msg.cert'),
        NETWORK: this.tagSvc.getTagByName('runtime.msg.net'),
        NFC: this.tagSvc.getTagByName('runtime.msg.nfc'),
        BT: this.tagSvc.getTagByName('runtime.msg.bluetooth'),
      };
    })
  }

  selectTabByID( pID:string, pEvent:any){

  }

  isTabActive( pItem:any):boolean {
    return (this.activeTerm!=null && this.activeTerm.id != pItem.id)
  }

  close( pEvent:any, pView:TerminalView):void{

  }

  /**
   * Called automatically, when a tab panel is closed.
   * It happens before close.
   *
   * @param pItem
   */
  onClose(pItem:any): boolean {

      // send exit
      //this.activeSession.exit();

      console.log(pItem);

      // remove sessions
      let sess:any = [];
      this._sessions.map( x => {
        if(x.uid != pItem.uid) sess.push(x);
      })
      this._sessions = sess;

      // if there is another session, switch
      if(this._sessions.length>0){
        this.switchSession(this._sessions[0]);
      }else{
       // this.activeSession = null;
      }

      console.log('close tab > ',pItem);
      return true;
  }

  resize(pSize: any) {

    this.size = pSize;
    this.termCtn.nativeElement.style.height = (pSize.height - (this.navbar!=null ? this.navbar.getHeight() : 0)) + 'px';
    this.termCtn.nativeElement.style.width = pSize.width + 'px';
  }

  /**
   * To switch from an hook session to another into tab bar
   *
   * @param {HookSession} pSession
   */
  switchSession(pSession: HookSession) {
    this._current.active = false;
    pSession.active = true;
    this._current = pSession;
    console.log("[HOOK][TERMINAL] Switch to session : ",pSession);
    if(this._selected.hasOwnProperty(pSession.getUID())){
      this._current_selected = this._selected[pSession.getUID()];
    }else{
      this._current_selected = -1;
    }
  }

  newSession() {

    console.log(this.prjSvc.getSelectedProject());

    // TODO replace default Options by Hook settings
    let session:HookSession = this.hookSvc.startWebsocketHookSession(
      this.controller.app.ws,
      this.prjSvc.getSelectedProject(),
      {
       // type: "spawn-self"
      });

  }

  hookMsgFocus(index: number) {
    this._selected[this._current.getUID()] = index;
    this._current_selected = index;
  }

  open(d: any, pNodeType:number) {
    console.log("[HOOK MESSAGE] open ",d,pNodeType);
      switch(pNodeType){
        case NodeInternalType.METHOD:
          this.controller.app.getController('ctrl:code-main').open(d);
          break;
        case NodeInternalType.CLASS:
          this.controller.app.getController('ctrl:code-main').open(d);
          break;
        case NodeInternalType.FIELD:
          this.controller.app.getController('ctrl:code-main').open(d);
          break;
      }
  }



  save() {

  }
}
