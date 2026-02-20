import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TerminalTab} from "../../../cmp/TerminalTab";
import {TerminalView} from "../../../cmp/TerminalView";
import {TerminalComponent} from "../../../base/terminal/terminal.component";
import {NavbarTabView} from "../../../cmp/NavbarTabView";
import {NavbarTab} from "../../../cmp/NavbarTab";
import {ITerminalContainer} from "../../../base/terminal/ITerminalContainer";
import {SearchController} from "../ctrl/SearchController";

@Component({
  selector: 'dxc-terminal-search',
  templateUrl: './terminal-search.component.html',
  styleUrls: ['./terminal-search.component.scss']
})
export class TerminalSearchComponent implements OnInit, ITerminalContainer {

  id:number;

  @Input() parent: TerminalComponent;
  @Input() controller: SearchController;

  tab:TerminalTab = new TerminalTab({
    offset: 0,
    label: 'Find',
    icon: GLOBAL_ICONS['FIND'],
    color: 'dxc-text-clear100'
  });

  gIcons: any = GLOBAL_ICONS;

  view:TerminalView = new TerminalView({
    navtab: new NavbarTabView({
      tab: new NavbarTab()
    })
  });

  views: any = [];

  activeTerm: any = null;

  @ViewChild('termSearch', { static: true, read:ElementRef  }) termEl: ElementRef;
  @ViewChild('termSearchNav', { static: true, read:ElementRef  }) termNav: ElementRef;
  @ViewChild('termSearchCtn', { static: true, read:ElementRef  }) termCtn: ElementRef;

  size:any = {
    height: '150px'
  };

  constructor() { }

  ngOnInit(): void {
  }

  selectTabByID( pID:string, pEvent:any){

  }

  isTabActive( pItem:any):boolean {
    return (this.activeTerm!=null && this.activeTerm.id != pItem.id)
  }

  close( pEvent:any, pView:TerminalView):void{

  }

  onClose(): boolean {
    return false;
  }

  resize( pSize:any):void{
    this.size = pSize;
    let navH:number = parseFloat(this.termNav.nativeElement.style.height);

    // TODO : makde navH dynamic
    if(isNaN(navH)) navH = 28;

    this.termEl.nativeElement.style.maxHeight = (this.size.height)+'px';
    this.termEl.nativeElement.style.height = (this.size.height)+'px';
      if(this.termCtn!=null){
          this.termCtn.nativeElement.style.maxHeight = (this.size.height-navH)+'px';
          this.termCtn.nativeElement.style.height = (this.size.height-navH)+'px';
      }else{
          console.log("[SEARCH][TERMINAL] resize : termCtn is null");
      }

  }

    onCloseTab(pEvent:any):void{
      console.log("onCloseTab ",pEvent,this);
    }
}
