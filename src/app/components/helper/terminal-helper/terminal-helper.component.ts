import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TerminalTab} from "../../../cmp/TerminalTab";
import {TerminalView} from "../../../cmp/TerminalView";
import {TerminalComponent} from "../../../base/terminal/terminal.component";
import {NavbarTabView} from "../../../cmp/NavbarTabView";
import {NavbarTab} from "../../../cmp/NavbarTab";
import {ITerminalContainer} from "../../../base/terminal/ITerminalContainer";
import {HelperController} from "../ctrl/HelperController";
import {HelpDoc, HelperService} from "../ctrl/HelperService";
import {IconModel} from "../../../base/icon/IconModel";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {Nullable} from "../../../base/Nullable";

export class HelperTab  {
  uid:Nullable<string> = null;
  icon:IconModel = GLOBAL_ICONS['HELPER'];
  label:string = 'Doc';
  active: boolean = false;
  exited:boolean = false;
  closable:boolean = true;
  iconColor:string = 'dxc-text-clear100';
  color:string = 'dxc-text-clear100';
  doc:Nullable<HelpDoc> = null;

  constructor(pLabel:string, pDoc:HelpDoc) {
    this.label = pLabel;
    this.uid = pDoc.id;
    this.doc = pDoc;
  }


}

interface HelperTabMap {
  [docID:string] : HelperTab
}

@Component({
  selector: 'app-terminal-helper',
  templateUrl: './terminal-helper.component.html',
  styleUrls: ['./terminal-helper.component.scss']
})
export class TerminalHelperComponent implements OnInit, ITerminalContainer {

  id:number;

  @Input() parent: TerminalComponent;
  @Input() controller: HelperController;

  tab:TerminalTab = new TerminalTab({
    offset: 0,
    label: 'Help',
    icon: GLOBAL_ICONS['HELPER'],
    color: 'dxc-text-clear100'
  });

  gIcons: any = GLOBAL_ICONS;

  view:TerminalView = new TerminalView({
    nav: new NavbarTabView({
      //label: 'Help',
      tab: new NavbarTab({
        offset: 0,
        label: 'Code',
        closable:true,
        icon: GLOBAL_ICONS['HELPER'],
        iconColor: 'dxc-text-clear100',
        color: 'dxc-text-clear100'
      })
    })
  });


  viewsMap: HelperTabMap = {}
  views: any = [];
  _current:Nullable<HelperTab> = null;


  @ViewChild('termHelp', { static: true, read:ElementRef  }) termHelp: ElementRef;
  @ViewChild('termHelperNav', { static: true, read:ElementRef  }) termHelperNav: ElementRef;
  @ViewChild('termHelperCtn', { static: true, read:ElementRef  }) termHelperCtn: ElementRef;

  size:any = {
    height: '150px'
  };

  constructor( private helpSvc:HelperService) {

  }

  ngOnInit(): void {

    this._createIndexTab();

    this.helpSvc.onShowDoc$.subscribe( (vDoc:HelpDoc)=>{

      console.log("[HELPER VIEWER] onShowDoc$ : ",vDoc);

      this.currentTab.active = false;

      if(this.viewsMap[vDoc.id]==null){
        this.viewsMap[vDoc.id] = new HelperTab(vDoc.title, vDoc)
        this.views.push(this.viewsMap[vDoc.id]);
      }

      this.currentTab = this.viewsMap[vDoc.id];
      this.parent.selectTab(this);
    });
  }

  private _createIndexTab(){
    this.viewsMap['index'] = new HelperTab('index', {
      id:'index',
      title: 'Index',
      doc: ''
    });
    this.viewsMap.index.icon = GLOBAL_ICONS['LIST'];
    this.viewsMap.index.closable = false;
    this.currentTab = this.viewsMap.index;
    this.views.push(this.viewsMap.index);
  }

  isTabActive( pItem:HelperTab):boolean {
      return (this.currentTab.uid != pItem.uid)
  }

  close( pEvent:any, pView:TerminalView):void{

  }

  showTab(pEvent:HelperTab) {
    if(this.currentTab !== null){
      this.currentTab.active = false;
    }

    this.currentTab = this.viewsMap[pEvent.uid];
  }

  set currentTab( pTab:HelperTab){
    if(this._current != null){
      this._current.active = false;
    }

    pTab.active = true;
    this._current = pTab;
  }

  get currentTab():HelperTab{
    return this._current;
  }

  onClose(): boolean {
    this.currentTab.active = false;
    if(this.views.length > 1){
      this.currentTab = this.views[0];
    }
    return false;
  }

  resize( pSize:any):void{
    this.size = pSize;
    let navH:number = parseFloat(this.termHelperNav.nativeElement.style.height);

    // TODO : makde navH dynamic
    if(isNaN(navH)) navH = 28;

    this.termHelp.nativeElement.style.maxHeight = (this.size.height)+'px';
    this.termHelp.nativeElement.style.height = (this.size.height)+'px';
    this.termHelperCtn.nativeElement.style.maxHeight = (this.size.height-navH)+'px';
    this.termHelperCtn.nativeElement.style.height = (this.size.height-navH)+'px';
  }
}
