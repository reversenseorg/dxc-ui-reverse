import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TerminalComponent} from "../../../base/terminal/terminal.component";
import {WorkspaceController} from "../ctrl/WorkspaceController";
import {TerminalTab} from "../../../cmp/TerminalTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TerminalView} from "../../../cmp/TerminalView";
import {NavbarTabView} from "../../../cmp/NavbarTabView";
import {NavbarTab} from "../../../cmp/NavbarTab";
import {ITerminalContainer} from "../../../base/terminal/ITerminalContainer";
import {NodeInternalType} from "../../../models/NodeInternalType";
import * as ace from "ace-builds";
import {Subject} from "rxjs";

@Component({
  selector: 'app-terminal-exec',
  templateUrl: './terminal-exec.component.html',
  styleUrls: ['./terminal-exec.component.scss']
})
export class TerminalExecComponent implements OnInit, AfterViewInit, ITerminalContainer {

  id:number;

  @Input() parent: TerminalComponent;
  @Input() controller: WorkspaceController;
  @Input() height: number;

  tab:TerminalTab = new TerminalTab({
    offset: 0,
    label: 'JavaScript',
    icon: GLOBAL_ICONS.JS,
    color: 'dxc-text-clear100'
  });

  view:TerminalView = new TerminalView({
    nav: new NavbarTabView({
      label: 'Terminal',
      tab: new NavbarTab({
        offset: 0,
        label: 'Code',
        icon: GLOBAL_ICONS.JS,
        color: 'dxc-text-clear100',
        closable: true
      })
    })
  });

  views: TerminalView[] = [];
  activeTerm: TerminalView = null;

  gIcons: any = GLOBAL_ICONS;

  @ViewChild('termJs', { static: true, read:ElementRef  }) termJs: ElementRef;
  size:any = {
    height: '150px'
  };

  @ViewChild('jsEditor') codeEditor:any;
  editor:any;
  //@ViewChild('editor',{ read:ElementRef, static:false}) editorEl:ElementRef;
  editorHeight = 0;
  resize$: Subject<any> = new Subject<any>();

  constructor() {
    //
  }

  ngOnInit(): void {
    return null;
  }


  ngAfterViewInit() {

    // init editor
    this.editorHeight = this.size.height-15;

    ace.config.set('basePath','assets/ace');
    this.editor = this.codeEditor.getEditor();
    this.editor.setOptions({
      showLineNumbers: true,
      tabSize: 2
    });

    this.editor.container.style.height = this.editorHeight+'px';
    this.editor.container.style.minHeight = this.editorHeight+'px';
    this.editor.container.style.maxHeight = this.editorHeight+'px';

    this.codeEditor.mode = 'javascript';
    this.editor.resize();
  }

  resize( pSize:any):void{
    this.size = pSize;

    //console.log("js term >",this.size.height);
    this.termJs.nativeElement.style.maxHeight = (this.size.height)+'px';
    this.termJs.nativeElement.style.height = (this.size.height)+'px';


    this.editorHeight = pSize.height ; //- this.metadataEl.nativeElement.offsetHeight;

    if(this.editor!=null){
      this.editor.container.style.height = this.editorHeight+'px';
      this.editor.container.style.minHeight = this.editorHeight+'px';
      this.editor.container.style.maxHeight = this.editorHeight+'px';

      this.editor.resize();
    }
  }

  run() {
   return null;

  }
}
