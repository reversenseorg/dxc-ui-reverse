import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ExplorerTab} from "../../../cmp/ExplorerTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TerminalTab} from "../../../cmp/TerminalTab";
import {TerminalView} from "../../../cmp/TerminalView";
import {TerminalComponent} from "../../../base/terminal/terminal.component";
import {WorkspaceController} from "../../workspace/ctrl/WorkspaceController";
import {NavbarTabView} from "../../../cmp/NavbarTabView";
import {NavbarTab} from "../../../cmp/NavbarTab";
import {ITerminalContainer} from "../../../base/terminal/ITerminalContainer";
import {NgTerminal} from "ng-terminal";
import {Subject} from "rxjs";
import {TerminalSession} from "../../workspace/ctrl/TerminalSession";
import { FunctionsUsingCSI } from 'ng-terminal';
import {OutputMessage} from "../../../cmp/OutputMessage";
import {OutputService} from "../ctrl/output.service";
import {Nullable} from "../../../base/Nullable";

// @ts-ignore
@Component({
  selector: 'app-terminal-output',
  templateUrl: './terminal-output.component.html',
  styleUrls: ['./terminal-output.component.scss']
})
export class TerminalOutputComponent implements  OnInit, OnChanges, AfterViewInit, ITerminalContainer {

  id:number;

  @Input() parent: TerminalComponent;
  @Input() controller: WorkspaceController;

  @ViewChild('console', { static: true,read:ElementRef }) consoleEl: ElementRef;
  @ViewChild('output', { static: true, read:ElementRef }) outputEl: ElementRef;

  ctr:number = 0;

  size:any = {
    height: '150px'
  };

  tab:TerminalTab = new TerminalTab({
    offset: 0,
    label: 'Output',
    icon: GLOBAL_ICONS['BELL'],
    color: 'dxc-text-clear100'
  });

  gIcons: any = GLOBAL_ICONS;

  view:TerminalView = new TerminalView({
    /*nav: new NavbarTabView({
      label: 'Terminal',
      tab: new NavbarTab({
        offset: 0,
        label: 'Code',
        closable:true,
        icon: GLOBAL_ICONS['CODE'],
        iconColor: 'dxc-text-clear100',
        color: 'dxc-text-clear100'
      })
    })*/
  });

  ready:boolean = false;
  views: any = [];

  selected: any = {};

  msg: OutputMessage[] = [];

  constructor( private outputService:OutputService) {

  }

  ngOnInit(){
    this.outputService.msg$.subscribe( (pObs:OutputMessage)=>{
      this.msg.push(pObs);
      this.outputEl.nativeElement.scrollTop = 1000+(this.msg.length*20);
    })
  }


  _sent:boolean = false;
  ngAfterViewInit(){

  }

  ngOnChanges(changes: SimpleChanges) {

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
    return true;
  }


  /**
   * To reset terminal content
   *
   * @param pInit
   */
  resetTerm(pInit:boolean=false, pSess:Nullable<TerminalSession>=null){

  }

  /**
   *
   * @param pSession
   */
  switchSession( pSession:TerminalSession):void{

  }

  /**
   * To create locally and remotely a new term session
   * @param pType
   */
  newSession(pType:string = 'sh'):void {

  }

  resize( pSize:any):void{
    this.size = pSize;
    this.outputEl.nativeElement.style.height = pSize.height + 'px';
    this.outputEl.nativeElement.style.width = pSize.width + 'px';
  }

  outputMsgFocus(pMsg:OutputMessage, pOffset:number) {
    if(this.selected != null){
      this.selected._s = false;
    }
    this.selected = pMsg;
    this.selected._s = true;
  }
}
