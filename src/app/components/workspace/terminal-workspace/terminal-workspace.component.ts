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

import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TerminalTab} from "../../../cmp/TerminalTab";
import {TerminalView} from "../../../cmp/TerminalView";
import {TerminalComponent} from "../../../base/terminal/terminal.component";
import {WorkspaceController} from "../ctrl/WorkspaceController";
import {NavbarTabView} from "../../../cmp/NavbarTabView";
import {NavbarTab} from "../../../cmp/NavbarTab";
import {ITerminalContainer} from "../../../base/terminal/ITerminalContainer";
import {NgTerminal} from "ng-terminal";
import {Subject} from "rxjs";
import {TerminalInfo, TerminalSession, TerminalSessionType} from "../ctrl/TerminalSession";
import {SubnavbarComponent} from "../../../base/subnavbar/subnavbar.component";
import {ClipboardService} from "../../../core/services/clipboard.service";
import {WorkspaceService} from "../ctrl/workspace.service";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {WebsocketEvent, WebsocketEventType} from "../../../base/websocket/WebsocketEvent";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";

@Component({
  selector: 'app-terminal-workspace',
  templateUrl: './terminal-workspace.component.html',
  styleUrls: ['./terminal-workspace.component.scss']
})
export class TerminalWorkspaceComponent extends AbstractKeyboardNavigable implements  OnInit, OnChanges, AfterViewInit, ITerminalContainer {

  id:number;

  @Input() parent: TerminalComponent;
  @Input() controller: WorkspaceController;
  @ViewChild('terminal', { static: true }) terminal: NgTerminal;
  @ViewChild('termWs', { static: true, read:ElementRef }) termWs: ElementRef;
  @ViewChild('termWsCtn', { static: true, read:ElementRef  }) termWsCtn: ElementRef;
  @ViewChild('termWsNav', { static: false, read:ElementRef  }) termWsNav: ElementRef;

  @ViewChild(SubnavbarComponent) navbar: SubnavbarComponent;

  writeSubject: Subject<any> = new Subject<any>();
  visibilityTerm:string = 'hidden';
  ctr:number = 0;

  termOption: any = {
    fixedGrid: {
      cols: 100,
      rows: 15
    },
    activateDraggableOnEdge: {
      minHeight: 100,
      minWidth: 100
    }
  };

  size:any = {
    height: '150px'
  };

  tab:TerminalTab = new TerminalTab({
    offset: 5,
    label: 'Terminal',
    icon: GLOBAL_ICONS['TERMINAL'],
    color: 'dxc-text-clear100'
  });

  gIcons: any = GLOBAL_ICONS;

  view:TerminalView = new TerminalView({
    navtab: new NavbarTabView({
      label: 'Terminal',
      tab: new NavbarTab({
        offset: 0,
        label: 'Code',
        closable:true,
        icon: GLOBAL_ICONS['CODE'],
        iconColor: 'dxc-text-clear100',
        color: 'dxc-text-clear100'
      })
    })
  });

  _sessions:TerminalSession[] = [];
  _buffer: string[] = [];
  ctnSize:number = 0;
  ready:boolean = false;
  views: any = [];

  activeTerm: any = null;
  @Input() activeSession: Nullable<TerminalSession> = null;

  constructor(private wsSvc:WorkspaceService, private eSvc:ClipboardService) {
    super();
  }

  ngOnInit() {
    this.wsSvc.onCreateSession.subscribe( (pObs:TerminalInfo)=>{
      switch (pObs.type) {
        case TerminalSessionType.DEV:
          this.newSession('sh', pObs);
          break;
        case TerminalSessionType.SH:
          this.newSession('sh', pObs);
          break;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.hasOwnProperty('activeSession') && this.ready){
      if(this.activeSession==null) return;

      this.activeSession.stdout.subscribe( (pData:any)=>{
        this.writeSubject.next(pData);
      });

      this.activeSession.stdout.subscribe( (pData:any)=>{
        this.writeSubject.next(pData);
      });
    }
  }

  _sent:boolean = false;
  ngAfterViewInit(){

    if(this.terminal==null){
      throw new Error("terminal-workspace: Terminal is not ready");
    }
    if(this.terminal.underlying==null){
      throw new Error("terminal-workspace: Terminal underlying is not ready");
    }


    this.terminal.keyEventInput.subscribe(e => {

      if(this.activeSession == null || this.activeSession.exited){
        return;
      }

      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
      let enterTxt:string = '';

      console.log(ev);
      if (ev.key === 'Enter') {

        if(this._buffer.length > 0){
          this.activeSession.writeIn(this._buffer.join(''));
          this._sent = true;
        }else{
          // TODO : bind prompt to the OS
          enterTxt = '\r\n';
          if(this._sent || this._buffer.length ==0){
            enterTxt += this.activeSession.getPrompt();
            this._sent = false;
          }
          this.terminal.write(enterTxt);
          this.activeSession.writeOut(enterTxt);
        }
        this._buffer = [];
        return ;

      } else if (ev.key === 'Backspace') {

        // Do not delete the prompt
        // this.terminal.underlying.buffer.active.cursorX > 2
        if(this._buffer.length>0){
          this.terminal.write('\b \b');
          this._buffer.pop();
        }

      } else  if(ev.key == "ArrowUp"){
        // move to older command
        this.terminal.write('\b \b'.repeat(this._buffer.length));
        const s = this.activeSession.readHistory(true);
        this.terminal.write(s);
        this._buffer = s.split('');

      } else if(ev.key == "ArrowDown"){
        // move to most recent command
        this.terminal.write('\b \b'.repeat(this._buffer.length));
        const s = this.activeSession.readHistory(false);
        this.terminal.write(s);
        this._buffer = s.split('');

      } else if (ev.key == "\u0003"){

        console.log("Control+C detected");
        this.terminal.write('^C');
        this.activeSession.writeOut('^C');
        this.activeSession.exit();
        this._sent = true;
        this._buffer = [];

      } else if (printable) {
        this.terminal.write(e.key);
        this._buffer.push(e.key);
      }
    });

    this.terminal.underlying.attachCustomKeyEventHandler((pEvent:KeyboardEvent)=>{
      if(pEvent.metaKey||pEvent.ctrlKey){
        // copy
        if((pEvent.code == 'KeyC') && (this.terminal.underlying as any).hasSelection()){
          // prevent terminal exit, copy selection
          this.eSvc.writeToClipboard((this.terminal.underlying as any).getSelection());
          return false;
        }

        // paste
        if(pEvent.code == 'KeyV'){
          const d = this.eSvc.readFromClipboard();
          (this.terminal.underlying as any).write( d==null?'':d);
          return false;
        }
      }
      return true;
    });

    //(this.terminal.underlying as any).setOption("fontSize", 12);
    (this.terminal.underlying as any).options.fontSize= 12;

    this.ready = true;

    // initSessions() only if websocket communication is established
    this.parent.parent.wsServer$.subscribe((vEvt:WebsocketEvent)=>{
      if(vEvt.type===WebsocketEventType.CONN_READY){
        this.controller.initSessions();
      }
    })

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
    if(this.activeSession!=null) {
      this.activeSession.exit();
    }

    // reset term
    this.resetTerm();

    // remove sessions
    let sess:any = [];
    this._sessions.map((x:any) => {     if(x.uid != pItem.uid) sess.push(x);
    })
    this._sessions = sess;

    // if there is another session, switch
    if(this._sessions.length>0){
      this.switchSession(this._sessions[0]);
    }else{
      this.activeSession = null;
    }

    console.log('close tab > ',pItem);
    return false;
  }


  /**
   * To reset terminal content
   *
   * @param pInit
   */
  resetTerm(pInit:boolean=false, pSess:Nullable<TerminalSession>=null){
    (this.terminal as any).term.reset();
    //this.writeSubject.next('$ ');
    if(pInit && pSess!=null) {
      pSess.writeOut(pSess.getPrompt())
      //this.terminal.write(pSess.getPrompt());
    }
  }

  /**
   *
   * @param pSession
   */
  switchSession( pSession:TerminalSession):void{
    this._buffer = [];
    if(this.activeSession!=null){
      this.activeSession.active = false;
    }
    this.activeSession = pSession;
    this.activeSession.active = true;
    this.resetTerm();
    this.terminal.write(this.activeSession.getBuffer());
  }


  /**
   * To create locally and remotely a new term session
   * @param pType
   */
  newSession(pType:string = 'sh', pInfo:Nullable<TerminalInfo> = null):void {
    this.ctr++;

    console.log(pType, pInfo);
    if(this.visibilityTerm=='hidden'){
      this.visibilityTerm = 'visible';
    }

    let info:TerminalInfo;

    if(pInfo!=null){
      info = pInfo;
    }else{
      info = {label: "", type: TerminalSessionType.SH, uid: "", icon:null };
    }

    info.type = (pInfo!=null && pInfo.type != null ? pInfo.type : TerminalSessionType.SH);
    info.uid = (pInfo!=null && pInfo.uid != null ? pInfo.uid+'_'+this.ctr : 't'+this.ctr) ;
    info.icon = (pInfo!=null && pInfo.icon!=null ? pInfo.icon : this.gIcons['CODE']);
    info.label = (pInfo!=null && pInfo.label!=null ? pInfo.label : 'Terminal '+this.ctr);

    const sess = this.controller.newTermSession(info);
    /*
    if(pInfo!==null){
      sess = this.controller.newTermSession({pInfo.label, (pInfo.icon!=null ? pInfo.icon : this.gIcons['CODE']), pInfo.uid+'_'+this.ctr);
    }else{
      sess = this.controller.newTermSession('Terminal '+this.ctr, this.gIcons['CODE'], 't'+this.ctr);
    }*/

    this._sessions.push(sess);
    this.resetTerm(true, sess);
    sess.stdout.subscribe( (pObs:any)=>{
      this.writeSubject.next('\r\n'+pObs);
    });
    sess.stderr.subscribe( (pObs:any)=>{
      this.writeSubject.next('\r\n'+pObs);
    });

    // change tab
    this.switchSession(sess);

    if(this.controller.app==null){
      throw  UIException.APP_NOT_INITIALIZED();
    }

    this.controller.app.terminalCmp.selectTabByLabel('Terminal');
  }

  resize( pSize:any):void{
    this.size = pSize;
    let navH:any = 20;

    /*if(this.navbar != null){
      navH = this.navbar.computedHeight; // termWsNav.nativeElement.offsetTop;
    }*/

    //if(navH==0 || navH==undefined) navH = 20;

    this.ctnSize = this.size.height-navH;


    //console.log("ws term >",this.size.height,this.ctnSize);
    this.termWs.nativeElement.style.maxHeight = this.size.height+'px';
    this.termWs.nativeElement.style.height = this.size.height+'px';

    this.termWsCtn.nativeElement.style.maxHeight = (this.ctnSize)+'px';
    this.termWsCtn.nativeElement.style.height = (this.ctnSize)+'px';
  }


  onKeyPress(pEvent: any) {
  }
}
