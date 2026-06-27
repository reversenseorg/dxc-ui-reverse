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
    icon: GLOBAL_ICONS['JS'],
    color: 'dxc-text-clear100'
  });

  view:TerminalView = new TerminalView({
    navtab: new NavbarTabView({
      label: 'Terminal',
      tab: new NavbarTab({
        offset: 0,
        label: 'Code',
        icon: GLOBAL_ICONS['JS'],
        color: 'dxc-text-clear100',
        closable: true
      })
    })
  });

  views: TerminalView[] = [];
  //activeTerm: TerminalView = null;

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
    //return null;
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
