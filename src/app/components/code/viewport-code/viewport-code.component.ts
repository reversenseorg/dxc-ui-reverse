import {
  AfterContentInit, AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Input,
  OnInit,
  QueryList, ViewChild
} from '@angular/core';
import {CodeItem} from "../explorer-code/CodeItem";
import {CodeController} from "../ctrl/CodeController";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {CodeControllerService} from "../ctrl/code-controller.service";
import {ViewportCodeClassComponent} from "./viewport-code-class.component";
import {IconModel} from "../../../base/icon/IconModel";
import {CODE_ICONS} from "../icons";
import {Subject} from "rxjs";


@Component({
  selector: 'app-viewport-code',
  templateUrl: './viewport-code.component.html',
  styleUrls: ['./viewport-code.component.scss']
})
export class ViewportCodeComponent implements OnInit, AfterViewInit, IViewportContainer {

  @Input() controller: CodeController;
  @Input() parent: ViewportComponent;
  @ContentChildren(ViewportCodeClassComponent) classCmp: QueryList<ViewportCodeClassComponent>;

  icons:any = CODE_ICONS;

  id: number = -1;
  uid: string = '';
  size:any = {
    height: '150px'
  };

  view: ViewportView = new ViewportView({
    tab: new ViewportTab({
      label: 'Code',
      icon: CODE_ICONS['DEFAULT'],
      color: 'dxc-text-clear100'
    })
  });

  resize$: Subject<any> = new Subject<any>();

  data: any;

  constructor() { }

  ngOnInit(): void {

    console.log('size vp > ', this.size);
  }

  configure( pData:any):void {
    this.data = pData;

    console.log('configure viewport>',pData);
    this.view.tab.icon = pData._icon;


    switch(pData._t){
      case 'm':
        if(this.view.tab.icon==null)
          this.view.tab.icon = this.icons['METH'];
        this.view.tab.label = pData.name;
        this.view.tab.tip = pData.__signature__;
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case 'p':
        this.view.tab.label = pData.name;
        this.view.tab.tip = pData.name;
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case 'c':
        this.view.tab.label = pData.simpleName;
        this.view.tab.tip = pData.name;
        this.view.tab.color = 'dxc-text-clear100';
        break;
      case 'f':
        this.view.tab.label = pData.__signature__;
        this.view.tab.color = 'text-warning';
        break;
    }

    if(pData.alias != null){
      this.view.tab.label = '@'+pData.alias;
      this.view.tab.color = 'text-warning';
    }

  }

  ngAfterViewInit() {


  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  resize( pSize:any):void{
    this.resize$.next(pSize);
    this.size = pSize;
  }
}
