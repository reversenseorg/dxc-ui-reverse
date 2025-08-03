import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef, HostListener,
  Input,
  OnInit,
  QueryList,
  ViewChild
} from '@angular/core';
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportView} from "../../../cmp/ViewportView";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {Subject} from "rxjs";
import {ViewerController} from "../ctrl/ViewerController";
import {SubnavbarComponent} from "../../../base/subnavbar/subnavbar.component";
import {ClipboardService} from "../../../core/services/clipboard.service";


// @ts-ignore
@Component({
  selector: 'app-viewport-editor',
  templateUrl: './viewport-editor.component.html',
  styleUrls: ['./viewport-editor.component.scss']
})
export class ViewportEditorComponent implements OnInit, AfterViewInit, IViewportContainer {


  @Input() controller: ViewerController;
  @Input() parent: ViewportComponent;
  @Input() data: any;
  @Input() height: any;

  @Input() editable: boolean = false;
  @Input() vEditable: boolean = false;
  @Input() patchable: boolean = false;

  @ViewChild('codeEditorViewer') codeEditor:any;
  @ViewChild('editorViewer',{ read:ElementRef, static:false}) editorEl:ElementRef;
  @ViewChild(SubnavbarComponent) subnav:SubnavbarComponent;

  gIcons :any = GLOBAL_ICONS;

  id: number = -1;
  uid: string = '';
  size:any = {
    height: 150
  };

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'File',
      icon: GLOBAL_ICONS['FILE'],
      color: 'dxc-text-clear100'
    })
  });


  editorHeight: number = 0;
  resize$: Subject<any> = new Subject<any>();
  activeWidth: number = 60;
  searchBar: boolean = false;

  constructor( private eSvc:ClipboardService) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  configure( pData:any):void {
    this.data = pData;
    this.view.tab.icon = GLOBAL_ICONS['FILE'];

    this.view.tab.label = (pData.n!=null ? pData.n : pData.name);
    this.view.tab.color = 'dxc-text-clear100';

    if(pData.alias != null){
      this.view.tab.label = '@'+pData.alias;
      this.view.tab.color = 'text-warning';
    }
  }

  ngAfterViewInit() {

    // init editor
    //console.log(this.subnav);
    this.editorHeight = this.size.height  - this.subnav.getHeight(); ;


    let editor:any = this.codeEditor.getEditor();


    editor.setOptions({
      showLineNumbers: true,
      tabSize: 2
    });

    editor.container.style.height = this.editorHeight+'px';
    editor.container.style.minHeight = this.editorHeight+'px';
    editor.container.style.maxHeight = this.editorHeight+'px';

    this.codeEditor.mode = 'javascript';
    this.codeEditor.theme = 'monokai';
    this.codeEditor.value = this.data.ctn;

    editor.resize();

    // init resize handler

    this.resize$.subscribe( (pSize:any)=>{

      this.editorHeight = pSize.height - this.subnav.getHeight();

      editor.container.style.height = this.editorHeight+'px';
      editor.container.style.minHeight = this.editorHeight+'px';
      editor.container.style.maxHeight = this.editorHeight+'px';

      editor.resize();
    });
  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
  }

  search() {

  }

  @HostListener('document:keydown.meta.c',['$event'])
  @HostListener('document:keydown.control.c',['$event'])
  onCopy(pEvent:any):void {
    pEvent.preventDefault();

    // basic copy : copy only selection
    this.eSvc.writeToClipboard( this.codeEditor.getEditor().getSelectedText());
  }
}
